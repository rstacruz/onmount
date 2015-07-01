/* global window, before, describe, it, document, afterEach, beforeEach */
describe('jquery', function () {
  var $, $div, expect, onmount

  if (typeof process === 'object') {
    var jsdom = require('mocha-jsdom')
    var rerequire = jsdom.rerequire
    jsdom()
    before(function () {
      $ = rerequire('jquery')
      onmount = rerequire('../../index')
      expect = require('chai').expect
    })
  } else {
    $ = window.jQuery
    onmount = $.onmount
    expect = window.chai.expect
  }

  afterEach(function () {
    $div.remove()
    onmount.reset()
  })

  describe('jquery:', function () {
    it('is an working environment', function () {
      $div = $('<div>hello</div>').appendTo('body')
      expect($('body')[0].innerHTML).include('hello')
      expect(window.document.body.innerHTML).include('hello')
    })
  })
  describe('in jquery', function () {
    var old$

    beforeEach(function () {
      $div = $('<div class="my-behavior"></div>').appendTo('body')
      onmount('.my-behavior', function () {
        this.innerHTML += '(on)'
      })
    })

    beforeEach(function () {
      old$ = onmount.$
      onmount.$ = $
    })

    afterEach(function () {
      onmount.$ = old$
    })

    it('is callable via dom ready', function (next) {
      $(onmount)
      setTimeout(function () {
        expect($div.html()).eql('(on)')
        next()
      })
    })

    it('is callable via dom ready (verbose)', function (next) {
      $(document).ready(onmount)
      setTimeout(function () {
        expect($div.html()).eql('(on)')
        next()
      })
    })

    it('is callable via dom events', function (next) {
      $(document).on('onmount', onmount)
      $(document).trigger('onmount')
      setTimeout(function () {
        expect($div.html()).eql('(on)')
        next()
      })
    })
  })
})
