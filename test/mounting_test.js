var test = require('tape')
var onmount = require('../index')
var around = require('./around')
var el = require('./helpers').el
var remove = require('./helpers').remove

test('mounting', function (t) {
  var run = around(
    function before () {
      onmount('.my-behavior', function () { this.innerHTML += '(on)' })
      var div = el('div', { 'class': 'my-behavior' })
      return div
    },
    function after (div) {
      remove(div)
      onmount.reset()
    })

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
