/* global window, before, describe, it, document, beforeEach, afterEach, MutationObserver */
'use strict'
var $, $div, expect, onmount

if (typeof process === 'object') {
  var jsdom = require('mocha-jsdom')
  var rerequire = jsdom.rerequire
  jsdom()
  before(function () {
    $ = rerequire('jquery')
    onmount = rerequire('../index')
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
    $div = $('<div class="hello">').appendTo('body')
    expect($('body')[0].innerHTML).include('hello')
    expect(window.document.body.innerHTML).include('hello')
  })
})

describe('onmount:', function () {
  beforeEach(function () {
    onmount('.my-behavior', function () {
      this.innerHTML += '(on)'
    })
  })

  beforeEach(function () {
    $div = $('<div class="my-behavior">').appendTo('body')
  })

  it('works', function () {
    onmount()
    expect($div.html()).eql('(on)')
  })

  it('can be triggered on its own', function () {
    onmount('.my-behavior')
    expect($div.html()).eql('(on)')
  })

  it('is idempotent', function () {
    onmount()
    onmount()
    onmount()
    expect($div.html()).eql('(on)')
  })

  describe('in jquery', function () {
    var old$

    beforeEach(function () {
      old$ = onmount.$
      onmount.$ = $
    })

    afterEach(function () {
      onmount.$ = old$
    })

    it('is callable via dom ready', function () {
      $(onmount)
      expect($div.html()).eql('(on)')
    })

    it('is callable via dom ready (verbose)', function () {
      $(document).ready(onmount)
      expect($div.html()).eql('(on)')
    })

    it('is callable via dom events', function () {
      $(document).on('onmount', onmount)
      $(document).trigger('onmount')
      expect($div.html()).eql('(on)')
    })
  })

  it('functions even without an exit handler', function () {
    onmount()
    $div.remove()
    onmount()
  })

  it('doesnt get double-applied even when removed', function () {
    onmount()
    $div.remove()
    onmount()
    $div.appendTo('body')
    onmount()
    expect($div.html()).eql('(on)')
  })
})

describe('exiting:', function () {
  beforeEach(function () {
    onmount('.their-behavior', function () {
      this.innerHTML += '(on)'
    }, function () {
      this.innerHTML += '(off)'
    })
  })

  it('calls the unloader', function () {
    $div = $('<div class="their-behavior">').appendTo('body')
    onmount()
    $div.remove()
    onmount()

    expect($div.html()).eql('(on)(off)')
  })

  it('will intentionally get double applied when removed', function () {
    $div.remove()
    onmount()
    $div.appendTo('body')
    onmount()
    expect($div.html()).eql('(on)(off)(on)')
  })
})

describe('state:', function () {
  var state

  beforeEach(function () {
    onmount('.our-behavior', function (b) {
      state = b
      b.number = 10
    }, function (b) {
      b.number++
    })

    $div = $('<div class="our-behavior">').appendTo('body')
    onmount()
    $div.remove()
    onmount()
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

describe('multiple behaviors per selector:', function () {
  it('works', function () {
    onmount('.nobodys-behavior', function () {
      this.innerHTML += '(1)'
    })
    onmount('.nobodys-behavior', function () {
      this.innerHTML += '(2)'
    })
    $div = $('<div class="nobodys-behavior">').appendTo('body')
    onmount()
    expect($div.html()).eql('(1)(2)')
  })
})
describe('with role selector:', function () {
  beforeEach(function () {
    onmount('[role~="your-behavior"]', function () {
      this.innerHTML += '(on)'
    })
  })

  beforeEach(function () {
    $div = $('<div role="your-behavior">').appendTo('body')
  })

  it('works', function () {
    onmount()
    expect($div.html()).eql('(on)')
  })

  it('can be called', function () {
    onmount('[role~="your-behavior"]')
    expect($div.html()).eql('(on)')
  })
})

describe('with @role:', function () {
  beforeEach(function () {
    onmount('@his-behavior', function () {
      this.innerHTML += '(on)'
    })
  })

  beforeEach(function () {
    $div = $('<div role="his-behavior">').appendTo('body')
  })

  it('works', function () {
    onmount()
    expect($div.html()).eql('(on)')
  })

  it('can be called via @', function () {
    onmount('@his-behavior')
    expect($div.html()).eql('(on)')
  })

  it('can be called', function () {
    onmount('[role~="his-behavior"]')
    expect($div.html()).eql('(on)')
  })
})

if (typeof MutationObserver !== 'undefined') {
  describe('.observe():', function () {
    afterEach(function () {
      onmount.unobserve()
    })

    beforeEach(function () {
      onmount.observe()
    })

    it('works', function (next) {
      onmount('.his-behavior', function () {
        this.innerHTML += '(on)'
      })

      $div = $('<div class="his-behavior">').appendTo('body')
      setTimeout(function () {
        expect($div.html()).eq('(on)')
        next()
      })
    })

    it('works for removal', function (next) {
      onmount('.his-behavior', function () {
        this.innerHTML += '(on)'
      }, function () {
        this.innerHTML += '(off)'
      })

      $div = $('<div class="his-behavior">').appendTo('body')
      setTimeout(function () {
        $div.remove()
        setTimeout(function () {
          expect($div.html()).eq('(on)(off)')
          next()
        })
      })
    })
  })
} else {
  describe('.observe():', function () {
    it('not supported in this platform')
  })
}

if (typeof process === 'object') {
  describe('standard', function () {
    it('is conformed to', require('mocha-standard'))
  })
}
