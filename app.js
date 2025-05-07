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
      trips: []
    }
  },
  mounted() {
    const spaceId = '4zlmctjtgta7'; // Replace with your space ID
    const accessToken = 'bNzg8Yx6ojLAJHS4eDSgaC7O6728DgkKVWF5AlYgXHk'; // Replace with your access token
    const contentType = 'product';
    const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=${contentType}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const assets = this.loadAssets(data.includes.Asset);
        this.trips = data.items.map(item => ({
          ...item.fields, 
          ...assets[item.fields.media.sys.id]
        }));
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
  }
});

/*
const tripsApp = Vue.createApp({
  data() {
    return {
      trips: []
    }
  },
  mounted() {
    const spaceId = '4zlmctjtgta7'; // Replace with your space ID
    const accessToken = 'bNzg8Yx6ojLAJHS4eDSgaC7O6728DgkKVWF5AlYgXHk'; // Replace with your access token
    const contentType = 'product';
    const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=${contentType}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.trips = data.items.map(item => item.fields);
      })
      .catch(console.error);
  }
});*/

tripsApp.mount('#trips-component');
