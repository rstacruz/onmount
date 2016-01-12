var test = require('tape')
var onmount = require('../index')
var around = require('./around')
var el = require('./helpers').el
var remove = require('./helpers').remove

test('multiple behaviors per selector', function (t) {
  var run = around(
    function before () {
      onmount('.nobodys-behavior', function () {
        this.innerHTML += '(1)'
      })

      onmount('.nobodys-behavior', function () {
        this.innerHTML += '(2)'
      })

      var div = el('div', { 'class': 'nobodys-behavior' })
      return div
    },
    function after (div) {
      remove(div)
      onmount.reset()
    })

  run(function (div) {
    onmount()
    t.equal(div.innerHTML, '(1)(2)', 'runs both behaviors')
  })

  run(function (div) {
    onmount('.nobodys-behavior')
    t.equal(div.innerHTML, '(1)(2)', 'runs both behaviors in onmount(sel)')
  })

  t.end()
})
