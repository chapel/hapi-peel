/*jshint expr: true*/
'use strict';

var Lab = require('lab');
var expect = require('chai').expect;

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var it = lab.it;

var Peel = require('../');
var required = require('./scripts/required');

describe('Peel', function () {
  var config = {
    port: 8080
  };

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
