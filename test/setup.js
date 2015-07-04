/* global before */

if (typeof process === 'object') {
  module.exports = function () {
    var jsdom = require('mocha-jsdom')
    jsdom()

    before(function () {
      global.expect = require('expect')
      global.onmount = require('../index')
    })
  }
} else {
  if (window.$) {
    window.onmount = $.onmount
  }
  window.require = function () { /* noop */ }
}
