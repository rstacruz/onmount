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

describe('standard', function () {
  it('is conformed to', require('mocha-standard'))
})

describe('behavior:', function () {
  before(function () {
    $.behavior('my-behavior', function () {
      var $this = $(this)
      $this.html($this.html() + 'clicked')
    })
  })

  beforeEach(function () {
    $div = $('<div class="js-my-behavior">').appendTo('body')
  })

  afterEach(function () {
    $div.remove()
  })

  it('works', function () {
    $(document).trigger('init')
    expect($div.html()).eql('clicked')
  })

  it('is idempotent', function () {
    $(document).trigger('init')
    $(document).trigger('init')
    $(document).trigger('init')
    expect($div.html()).eql('clicked')
  })
})

describe('behavior with default selector:', function () {
  before(function () {
    $.behavior.selector = '[role~="your-behavior"]'
    $.behavior('your-behavior', function () {
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
    $(document).trigger('init')
    expect($div.html()).eql('clicked')
  })
})

describe('behavior with custom selector:', function () {
  before(function () {
    $.behavior('his-behavior', { selector: '[role="his-behavior"]' }, function () {
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
    $(document).trigger('init')
    expect($div.html()).eql('clicked')
  })
})
