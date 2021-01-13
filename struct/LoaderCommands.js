const { resolve } = require('path')
const { readdirSync, statSync } = require('fs')

class Loader {
  constructor(client) {
    this.client = client;
  }

  Load(path) {
    if (!path) return;

    readdirSync(path).forEach(async (file) => {
      try {
        const completePath = resolve(path, file);

        if (file.endsWith('.js')) {
          const Loading = require(completePath);

          const loaded = Loading

          loaded.client = this.client;
          loaded.path = completePath

          loaded.register(this.client);

        } else if (statSync(completePath).isDirectory) {
          this.Load(completePath);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
}

module.exports = Loader;
