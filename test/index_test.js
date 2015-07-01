/* global window, before, describe, it, document, beforeEach, afterEach, MutationObserver */
/* jshint expr: true */
describe('index', function () {
  'use strict'
  var $div, expect, onmount

  if (typeof process === 'object') {
    var jsdom = require('mocha-jsdom')
    var rerequire = jsdom.rerequire
    jsdom()
    before(function () {
      onmount = rerequire('../index')
      expect = require('chai').expect
    })
  } else {
    onmount = window.onmount
    expect = window.chai.expect
  }

  afterEach(function () {
    if ($div.remove) $div.remove()
    else remove($div)
    onmount.reset()
  })

  describe('onmount:', function () {
    beforeEach(function () {
      onmount('.my-behavior', function () {
        this.innerHTML += '(on)'
      })
      $div = el('div', { class: 'my-behavior' })
    })

    it('works', function () {
      onmount()
      expect($div.innerHTML).eql('(on)')
    })

    it('can be triggered on its own', function () {
      onmount('.my-behavior')
      expect($div.innerHTML).eql('(on)')
    })

    it('is idempotent', function () {
      onmount()
      onmount()
      onmount()
      expect($div.innerHTML).eql('(on)')
    })

    it('functions even without an exit handler', function () {
      onmount()
      remove($div)
      onmount()
    })

    it('doesnt get double-applied even when removed', function () {
      onmount()
      remove($div)
      onmount()
      document.body.appendChild($div)
      onmount()
      expect($div.innerHTML).eql('(on)')
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
      $div = el('div', { class: 'their-behavior' })
      onmount()
      remove($div)
      onmount()

      expect($div.innerHTML).eql('(on)(off)')
    })

    it('will intentionally get double applied when removed', function () {
      remove($div)
      onmount()
      document.body.appendChild($div)
      onmount()
      expect($div.innerHTML).eql('(on)(off)(on)')
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

      $div = el('div', { class: 'our-behavior' })
      onmount()
      remove($div)
      onmount()
    })

    it('has an id', function () {
      expect(state.id).match(/^c\d+$/)
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
      $div = el('div', { class: 'nobodys-behavior' })
      onmount()
      expect($div.innerHTML).eql('(1)(2)')
    })
  })
  describe('with role selector:', function () {
    beforeEach(function () {
      onmount('[role~="your-behavior"]', function () {
        this.innerHTML += '(on)'
      })
    })

    beforeEach(function () {
      $div = el('div', { role: 'your-behavior' })
    })

    it('works', function () {
      onmount()
      expect($div.innerHTML).eql('(on)')
    })

    it('can be called', function () {
      onmount('[role~="your-behavior"]')
      expect($div.innerHTML).eql('(on)')
    })
  })

  describe('with @role:', function () {
    beforeEach(function () {
      onmount('@his-behavior', function () {
        this.innerHTML += '(on)'
      })
    })

    beforeEach(function () {
      $div = el('div', { role: 'his-behavior' })
    })

    it('works', function () {
      onmount()
      expect($div.innerHTML).eql('(on)')
    })

    it('can be called via @', function () {
      onmount('@his-behavior')
      expect($div.innerHTML).eql('(on)')
    })

    it('can be called', function () {
      onmount('[role~="his-behavior"]')
      expect($div.innerHTML).eql('(on)')
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

        $div = el('div', { class: 'his-behavior' })
        setTimeout(function () {
          expect($div.innerHTML).eq('(on)')
          next()
        })
      })

      it('works for removal', function (next) {
        onmount('.his-behavior', function () {
          this.innerHTML += '(on)'
        }, function () {
          this.innerHTML += '(off)'
        })

        $div = el('div', { class: 'his-behavior' })
        setTimeout(function () {
          $div.remove()
          setTimeout(function () {
            expect($div.innerHTML).eq('(on)(off)')
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

  function el (name, options) {
    if (!options) options = {}
    var div = document.createElement(name)
    if (options.class) div.className = options.class
    if (options.role) div.setAttribute('role', options.role)
    document.body.appendChild(div)
    return div
  }

  function remove (el) {
    el && el.parentNode && el.parentNode.removeChild(el)
  }
})
