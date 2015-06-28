/* global window, before, describe, it, document, beforeEach, afterEach */
'use strict'
var $, $div, expect

if (typeof process === 'object') {
  var jsdom = require('mocha-jsdom')
  var rerequire = jsdom.rerequire
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
  $.behavior.reset()
})

describe('jquery:', function () {
  it('is an working environment', function () {
    $div = $('<div class="hello">').appendTo('body')
    expect($('body')[0].innerHTML).include('hello')
    expect(window.document.body.innerHTML).include('hello')
  })
})

describe('behavior:', function () {
  beforeEach(function () {
    $.behavior('.my-behavior', function () {
      this.innerHTML += '(on)'
    })
  })

  beforeEach(function () {
    $div = $('<div class="my-behavior">').appendTo('body')
  })

  it('works', function () {
    $.behavior()
    expect($div.html()).eql('(on)')
  })

  it('can be triggered on its own', function () {
    $.behavior('.my-behavior')
    expect($div.html()).eql('(on)')
  })

  it('is idempotent', function () {
    $.behavior()
    $.behavior()
    $.behavior()
    expect($div.html()).eql('(on)')
  })

  it('functions even without an exit handler', function () {
    $.behavior()
    $div.remove()
    $.behavior()
  })

  it('doesnt get double-applied even when removed', function () {
    $.behavior()
    $div.remove()
    $.behavior()
    $div.appendTo('body')
    $.behavior()
    expect($div.html()).eql('(on)')
  })
})

describe('exiting:', function () {
  beforeEach(function () {
    $.behavior('.their-behavior', function () {
      this.innerHTML += '(on)'
    }, function () {
      this.innerHTML += '(off)'
    })
  })

  it('calls the unloader', function () {
    $div = $('<div class="their-behavior">').appendTo('body')
    $.behavior()
    $div.remove()
    $.behavior()

    expect($div.html()).eql('(on)(off)')
  })

  it('will intentionally get double applied when removed', function () {
    $div.remove()
    $.behavior()
    $div.appendTo('body')
    $.behavior()
    expect($div.html()).eql('(on)(off)(on)')
  })
})

describe('state:', function () {
  var state

  beforeEach(function () {
    $.behavior('.our-behavior', function (b) {
      state = b
      b.number = 10
    }, function (b) {
      b.number++
    })

    $div = $('<div class="our-behavior">').appendTo('body')
    $.behavior()
    $div.remove()
    $.behavior()
  })

  it('has an id', function () {
    expect(state.id).match(/^b\d+$/)
  })

  it('passes the selector', function () {
    expect(state.selector).to.eql('.our-behavior')
  })

  it('works', function () {
    expect(state.number).eql(11)
  })
})

describe('behavior with role selector:', function () {
  beforeEach(function () {
    $.behavior('[role~="your-behavior"]', function () {
      this.innerHTML += '(on)'
    })
  })

  beforeEach(function () {
    $div = $('<div role="your-behavior">').appendTo('body')
  })

  it('works', function () {
    $.behavior()
    expect($div.html()).eql('(on)')
  })

  it('can be called', function () {
    $.behavior('[role~="your-behavior"]')
    expect($div.html()).eql('(on)')
  })
})

describe('behavior with @role:', function () {
  beforeEach(function () {
    $.behavior('@his-behavior', function () {
      this.innerHTML += '(on)'
    })
  })

  beforeEach(function () {
    $div = $('<div role="his-behavior">').appendTo('body')
  })

  it('works', function () {
    $.behavior()
    expect($div.html()).eql('(on)')
  })

  it('can be called via @', function () {
    $.behavior('@his-behavior')
    expect($div.html()).eql('(on)')
  })

  it('can be called', function () {
    $.behavior('[role~="his-behavior"]')
    expect($div.html()).eql('(on)')
  })
})

if (typeof process === 'object') {
  describe('standard', function () {
    it('is conformed to', require('mocha-standard'))
  })
}
