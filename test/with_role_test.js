var test = require('tape')
var onmount = require('../index')
var around = require('./around')
var el = require('./helpers').el
var remove = require('./helpers').remove

test('with role selector', function (t) {
  var run = around(
    function before () {
      onmount('[role~="your-behavior"]', function () {
        this.innerHTML += '(on)'
      })
      var div = el('div', { role: 'your-behavior' })
      return div
    },
    function after (div) {
      remove(div)
      onmount.reset()
    })

  run(function (div) {
    onmount()
    t.equal(div.innerHTML, '(on)', 'works')
  })

  run(function (div) {
    onmount('[role~="your-behavior"]')
    t.equal(div.innerHTML, '(on)', 'works with onmount(sel)')
  })

  t.end()
})
