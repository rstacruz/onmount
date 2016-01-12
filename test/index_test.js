/* global window, describe, it, document, beforeEach, afterEach, MutationObserver */
/* global onmount, expect */

describe('index', function () {
  'use strict'
  var $div
  var setup = require('./setup')
  setup && setup()

  afterEach(function () {
    if ($div.remove) $div.remove()
    else remove($div)
    onmount.reset()
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
      expect($div.innerHTML).toEqual('(on)')
    })

    it('can be called', function () {
      onmount('[role~="your-behavior"]')
      expect($div.innerHTML).toEqual('(on)')
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

        $div = el('div', { 'class': 'his-behavior' })
        setTimeout(function () {
          expect($div.innerHTML).toEqual('(on)')
          next()
        })
      })

      it('works for removal', function (next) {
        onmount('.his-behavior', function () {
          this.innerHTML += '(on)'
        }, function () {
          this.innerHTML += '(off)'
        })

        $div = el('div', { 'class': 'his-behavior' })
        setTimeout(function () {
          $div.remove()
          setTimeout(function () {
            expect($div.innerHTML).toEqual('(on)(off)')
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
    if (options['class']) div.className = options['class']
    if (options.role) div.setAttribute('role', options.role)
    document.body.appendChild(div)
    return div
  }

  function remove (el) {
    el && el.parentNode && el.parentNode.removeChild(el)
  }
})
