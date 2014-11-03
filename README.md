# Peel [![travis](https://img.shields.io/travis/chapel/hapi-peel.svg)](https://travis-ci.org/chapel/hapi-peel) [![npm](https://img.shields.io/npm/v/hapi-peel.svg)](https://npmjs.org/package/hapi-peel)

Peel is a simple library to help with testing and development of modular plugin based
[Hapi](http://hapijs.org) servers. It simply checks if your module is being required (by
checking `module.parent`). If your module is not being required, it will create a Hapi
server, register your plugin module, and pass back the server object for you to start the
server with.

Peel fully expects you follow the Hapi [plugin interface](http://hapijs.com/api#plugin-interface)
conventions. This allows you to use your plugin module as a true plugin or directly with Peel.

## Install
```sh
npm install hapi-peel
```

## API
The only special behavior that exists if if you choose not to pass in a callback to `Peel.create`,
which will auto start the Hapi server. Otherwise you have full control over when the server starts.

```js
var Peel = require('hapi-peel');

// Hapi plugin config
// exports.register = function () {}

Peel.create(module, {
  port: 8080
});
```

### Peel.create(module, config, [callback])
Creates Hapi server if not required, otherwise calls back with no server.

`module` is required, as well as `config`.

`config` approximates Hapi's [server arguments](http://hapijs.com/api#new-serverhost-port-options) `host`, `port`, `options`:
 * host - optional
 * port - optional
 * config - optional

### License
MIT

