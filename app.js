const headerApp = Vue.createApp({
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">
          <img src="assets/logo.jpg" alt="Logo" width="30" height="30">
          Your Website
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('index.html') }" :aria-current="isActive('index.html') ? 'page' : null" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('products.html') }" :aria-current="isActive('products.html') ? 'page' : null" href="products.html">Products</a></li>
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('about.html') }" :aria-current="isActive('about.html') ? 'page' : null" href="about.html">About</a></li>
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('contact.html') }" :aria-current="isActive('contact.html') ? 'page' : null" href="contact.html">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  methods: {
    isActive(page) {
      return window.location.pathname.endsWith(page);
    }
  }
})
headerApp.mount('#header-template');

const footerApp = Vue.createApp({
  template: `
    <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
        <p>Contact: <a href="mailto:info@yourcompany.com">info@yourcompany.com</a></p>
        <div class="social-links">
          <a href="#">Facebook</a> |
          <a href="#">Twitter</a> |
          <a href="#">Instagram</a>
        </div>
      </div>
    </footer>
  `
});

footerApp.mount('#footer-template');

const tripsApp = Vue.createApp({
  data() {
    return {
      trips: [],
      maxPrice:0,
      selectedMaxPrice: 0,
      selectedStates: [],     // For storing selected states
      sortOption: 'price-asc' // default
    }
  },
  mounted() {
    fetch('/.netlify/functions/fetchProducts')
      .then(response => response.json())
      .then(data => {
        const assets = this.loadAssets(data.includes.Asset);
        this.trips = data.items.map(item => ({
          ...item.fields, 
          ...assets[item.fields.media.sys.id]
        }));

        // Initialize maxPrice value
        this.maxPrice = Math.max(...this.trips.map(trip => trip.price));
        this.selectedMaxPrice = this.maxPrice;
      })
      .catch(console.error);
  },
  methods: {
    loadAssets(assets) {
      const map = {};
      assets.forEach(asset => {
        map[asset.sys.id] = {'imageUrl': 'https:' + asset.fields.file.url,
                             'imageAlt': asset.fields.description};
      });
      return map;
    }
  },
  computed: {
    filteredTrips() {
      return this.trips.filter(trip => {
        const isPriceValid = trip.price <= this.selectedMaxPrice;
        const isStateValid = this.selectedStates.length === 0 || this.selectedStates.includes(trip.state);
        return isPriceValid && isStateValid;
      });
    },
    availableStates() {
      const states = new Set();
      this.trips.forEach(trip => {
        if (trip.price <= this.selectedMaxPrice) {
          states.add(trip.state);
        }
      });
      return [...states].sort();
    },
    sortedTrips() {
      const sorted = [...this.filteredTrips];
      switch (this.sortOption) {
        case 'price-asc':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'state-asc':
          sorted.sort((a, b) => a.state.localeCompare(b.state));
          break;
        case 'state-desc':
          sorted.sort((a, b) => b.state.localeCompare(a.state));
          break;
      }
      return sorted;
    },
  }
});

tripsApp.mount('#trips-component');
