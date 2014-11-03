'use strict';

var Peel = require('./');

exports.register = function (plugin, options, next) {

  plugin.route({
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
      reply('Hello world');
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

var config = {
  port: 8080
};

Peel.create(module, config, function (err, server) {
  if (err) {
    return console.log(err);
  }

  if (!server) {
    return console.log('required');
  }

  server.start(function () {
    console.log('server started');
  });
});
