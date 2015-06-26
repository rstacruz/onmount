/* global window, before, describe, it, document, beforeEach, afterEach */
'use strict'
var $, $div, expect

var jsdom = require('mocha-jsdom')
var rerequire = jsdom.rerequire

if (typeof process === 'object') {
  jsdom()
  before(function () {
    $ = rerequire('jquery')
    $.behavior = rerequire('../index')
    expect = require('chai').expect
  })
} else {
  $ = window.jQuery
  expect = window.chai.expect
}

afterEach(function () {
  $div.remove()
})

describe('jquery:', function () {
  it('is an working environment', function () {
    $div = $('<div class="hello">').appendTo('body')
    expect($('body')[0].innerHTML).include('hello')
    expect(window.document.body.innerHTML).include('hello')
  })
})

describe('behavior:', function () {
  before(function () {
    $.behavior('.my-behavior', function () {
      var $this = $(this)
      $this.html($this.html() + 'clicked')
    })
  })

  beforeEach(function () {
    $div = $('<div class="my-behavior">').appendTo('body')
  })

  it('works', function () {
    $.behavior()
    expect($div.html()).eql('clicked')
  })

  it('can be triggered on its own', function () {
    $.behavior('.my-behavior')
    expect($div.html()).eql('clicked')
  })

  it('is idempotent', function () {
    $.behavior()
    $.behavior()
    $.behavior()
    expect($div.html()).eql('clicked')
  })
})

describe('behavior with role selector:', function () {
  before(function () {
    $.behavior('[role~="your-behavior"]', function () {
      var $this = $(this)
      $this.html($this.html() + 'clicked')
    })
  })

  beforeEach(function () {
    $div = $('<div role="your-behavior">').appendTo('body')
  })

  it('works', function () {
    $.behavior()
    expect($div.html()).eql('clicked')
  })

  it('can be called', function () {
    $.behavior('[role~="your-behavior"]')
    expect($div.html()).eql('clicked')
  })
})

describe('behavior with @role:', function () {
  before(function () {
    $.behavior('@his-behavior', function () {
      var $this = $(this)
      $this.html($this.html() + 'clicked')
    })
  })

  beforeEach(function () {
    $div = $('<div role="his-behavior">').appendTo('body')
  })

  it('works', function () {
    $.behavior()
    expect($div.html()).eql('clicked')
  })

  it('can be called via @', function () {
    $.behavior('@his-behavior')
    expect($div.html()).eql('clicked')
  })

  it('can be called', function () {
    $.behavior('[role~="his-behavior"]')
    expect($div.html()).eql('clicked')
  })
})

if (typeof process === 'object') {
  describe('standard', function () {
    it('is conformed to', require('mocha-standard'))
  })
}
