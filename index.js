'use strict';

var Hoek = require('hoek');

function createServer(plugin, config, preRegisterCallback, callback) {
  var Hapi = require('hapi');

  var server = new Hapi.Server(config.options);

  server.connection({
    host: config.host,
    port: config.port
  });

  var afterPreRegister = function (err) {
    if (err) {
      return callback(err);
    }

    server.register(plugin, function (err) {
      if (err) {
        return callback(err);
      }

      callback(null, server);
    });
  };

  if (preRegisterCallback) {
    preRegisterCallback(server, afterPreRegister);
  } else {
    afterPreRegister();
  }
}

exports.create = function create(pluginModule, config, callback) {

  Hoek.assert(pluginModule.exports, 'Must provide the plugin module object');
  Hoek.assert(typeof config === 'object', 'Must provide a server config object');

  var prePluginCallback;
  var postPluginCallback;

  if (typeof callback === 'object' && callback !== null) {
    prePluginCallback = Hoek.reach(callback, 'pre');
    postPluginCallback = Hoek.reach(callback, 'post');
  } else {
    postPluginCallback = callback;
  }

  var doneCalled = false;
  function done(err, server) {
    if (doneCalled) {
      return;
    }
    doneCalled = true;

    if (postPluginCallback) {
      postPluginCallback(err, server);
    } else if (server) {
      server.start();
    }
  }

  if (pluginModule.parent) {
    // Do nothing since the plugin is required
    return done();
  }

  createServer(pluginModule.exports, config, prePluginCallback, done);
};
