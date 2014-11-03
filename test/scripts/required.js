'use strict';

var Peel = require('../../');

exports.register = function (plugin, options, next) {
  next();
};

exports.register.attributes = {
  name: 'required'
};

var config = {
  port: 8080
};

exports.test = function (callback) {
  Peel.create(module, config, callback);
};
