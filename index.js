'use strict';

var Hoek = require('hoek');

function createServer(plugin, config, callback) {
  var Hapi = require('hapi');

  var server = new Hapi.Server(config.options);

  server.connection({
    host: config.host,
    port: config.port
  });

  server.register(plugin, function (err) {
    if (err) {
      return callback(err);
    }

    callback(null, server);
  });
}

exports.create = function create(pluginModule, config, callback) {

  Hoek.assert(pluginModule.exports, 'Must provide the plugin module object');
  Hoek.assert(typeof config === 'object', 'Must provide a server config object');

  var doneCalled = false;
  function done(err, server) {
    if (doneCalled) {
      return;
    }
    doneCalled = true;

    if (callback) {
      callback(err, server);
    } else if (server) {
      server.start();
    }
  }

  if (pluginModule.parent) {
    // Do nothing since the plugin is required
    return done();
  }

  createServer(pluginModule.exports, config, done);
};
