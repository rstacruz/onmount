require('jsdom-global')()
var test = require('tape')
var onmount = require('../index')
var around = require('./around')

test('mounting', function (t) {
  function before () {
    onmount('.my-behavior', function () { this.innerHTML += '(on)' })
    var div = el('div', { 'class': 'my-behavior' })
    return div
  }

  function after (div) {
    remove(div)
    onmount.reset()
  }

  var run = around(before, after)

  run(function (div) {
    onmount('.my-behavior')
    t.equal(div.innerHTML, '(on)', 'onmount(selector) works')
  })

  run(function (div) {
    onmount()
    t.equal(div.innerHTML, '(on)', 'onmount() works')
  })

  run(function (div) {
    onmount()
    onmount()
    onmount()
    t.equal(div.innerHTML, '(on)', 'onmount() is idempotent')
  })

  run(function (div) {
    onmount()
    div.parentNode.removeChild(div)
    onmount()
    t.pass('works even without an exit handler')
  })

  t.end()
})

test('exiting', function (t) {
  function before () {
    onmount('.their-behavior', function () {
      this.innerHTML += '(on)'
    }, function () {
      this.innerHTML += '(off)'
    })
  }

  function after () {
    onmount.reset()
  }

  var run = around(before, after)

  run(function () {
    var div = el('div', { 'class': 'their-behavior' })
    onmount()
    remove(div)
    onmount()

    t.equal(div.innerHTML, '(on)(off)', 'calls the unloader')
  })

  run(function () {
    var div = el('div', { 'class': 'their-behavior' })
    onmount()
    remove(div)
    onmount()
    document.body.appendChild(div)
    onmount()

    t.equal(div.innerHTML, '(on)(off)(on)', 'gets double-applied intentionally')
  })

  t.end()
})

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
