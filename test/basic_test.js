/* global before, describe, it, document, beforeEach, afterEach, expect */
'use strict'
var $, $div

if (typeof process === 'object') {
  require('mocha-jsdom')()
  before(function () {
    $ = require('jquery')
    $.behavior = require('../index')
  })
}

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

  afterEach(function () {
    $div.remove()
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

  afterEach(function () {
    $div.remove()
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

  afterEach(function () {
    $div.remove()
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

describe('standard', function () {
  it('is conformed to', require('mocha-standard'))
})
