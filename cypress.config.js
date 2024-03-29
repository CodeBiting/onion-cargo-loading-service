const { defineConfig } = require('cypress');

module.exports = defineConfig({
  experimentalModifyObstructiveThirdPartyCode: false,
  e2e: {
    baseUrl: 'http://localhost:8080',
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents (on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    }
  }
});
