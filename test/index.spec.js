/*jshint expr: true*/
'use strict';

var Lab = require('lab');
var expect = require('chai').expect;

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var it = lab.it;

var Hapi = require('hapi');
var Peel = require('../');
var required = require('./scripts/required');

describe('Peel', function () {
  var config = {
    port: 8080
  };

  var hapiStart;
  beforeEach(function (done) {
    hapiStart = Hapi.Server.prototype.start;
    done();
  });

  afterEach(function (done) {
    Hapi.Server.prototype.start = hapiStart;
    done();
  });

  it('should not create server if required', function (done) {
    required.test(function (err, server) {
      expect(err).to.not.exist;
      expect(server).to.not.exist;
      done();
    });
  });

  it('should create server if not required', function (done) {
    var fakeModule = {
      parent: null,
      exports: required
    };
    Peel.create(fakeModule, config, function (err, server) {
      expect(err).to.not.exist;
      expect(server).to.exist;
      expect(server.start).to.be.a.function;
      done();
    });
  });

  it('should not auto start if callback is given and required', function (done) {
    var fakeModule = {
      parent: null,
      exports: required
    };

    Hapi.Server.prototype.start = function () {
      throw new Error('start should not be called');
    };

    Peel.create(fakeModule, config, function (err, server) {
      expect(err).to.not.exist;
      expect(server).to.exist;
      expect(server.start).to.be.a.function;
      done();
    });
  });

  it('should auto start if no callback is given and required', function (done) {
    var fakeModule = {
      parent: null,
      exports: required
    };

    // If not called, test will time out and fail
    Hapi.Server.prototype.start = function () {
      done();
    };

    Peel.create(fakeModule, config);
  });

  describe('callback is a set of pre- and post- register callbacks', function () {
    var fakeModule = {
      parent: null,
      exports: required
    };
    var callbackObj;
    var overriddenRegister;
    var registerCalled = false;

    beforeEach(function (done) {
      callbackObj = {};
      overriddenRegister = required.register;
      required.register = function (plugin, options, next) {
        registerCalled = true;
        next();
      };
      required.register.attributes = overriddenRegister.attributes;

      done();
    });

    afterEach(function (done) {
      callbackObj = null;
      required.register = overriddenRegister;
      registerCalled = false;

      done();
    });

    it('should call pre() at the appropriate point', function (done) {
      var preCalled = false;

      callbackObj.pre = function (server, next) {
        preCalled = true;

        expect(server).to.exist;
        expect(registerCalled).to.be.false;

        next();
      };

      Hapi.Server.prototype.start = function () {
        expect(preCalled).to.be.true;

        done();
      };

      Peel.create(fakeModule, config, callbackObj);
    });

    it('should call post() at the appropriate point', function (done) {
      callbackObj.post = function (err, server) {
        expect(err).to.not.exist;
        expect(server).to.exist;
        expect(registerCalled).to.be.true;

        done();
      };

      Peel.create(fakeModule, config, callbackObj);
    });

    it('should call pre() and post() callbacks at the appropriate point', function (done) {
      var preCalled = false;

      callbackObj.pre = function (server, next) {
        preCalled = true;

        expect(server).to.exist;
        expect(registerCalled).to.be.false;

        next();
      };
      callbackObj.post = function (err, server) {
        expect(err).to.not.exist;
        expect(server).to.exist;
        expect(preCalled).to.be.true;
        expect(registerCalled).to.be.true;

        done();
      };

      Peel.create(fakeModule, config, callbackObj);
    });
  });

  it('should throw if module is not passed', function (done) {
    function shouldThrow() {
      Peel.create({}, {});
    }

    expect(shouldThrow).to.throw('plugin module');
    done();
  });

  it('should throw if config is not passed', function (done) {
    function shouldThrow() {
      Peel.create(module);
    }

    expect(shouldThrow).to.throw('server config');
    done();
  });
});
