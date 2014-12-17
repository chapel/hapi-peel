'use strict';

var Peel = require('./');
var good = require('good');
var goodConsole = require('good-console');

exports.register = function (plugin, options, next) {
  plugin.log(['debug'], 'plugin registration happening');

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

var callbackObj = {
  pre: function (server, next) {
    console.log('pre-register');

    server.register({
        register: good,
        options: {
            reporters: [{
                reporter: goodConsole,
                args: [
                    { log: '*' }
                ]
            }]
        }
    }, next);
  },
  post: function (err, server) {
    server.log(['debug'], 'post-register');

    server.start(function () {
      server.log(['debug'], 'server started');
    });
  }
};

Peel.create(module, config, callbackObj);
