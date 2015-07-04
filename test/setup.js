/* global before */

if (typeof process === 'object') {
  module.exports = function () {
    var jsdom = require('mocha-jsdom')
    var rerequire = jsdom.rerequire

    jsdom()

    before(function () {
      global.expect = require('expect')
      global.onmount = rerequire('../index')
    })
  }
} else {
}

