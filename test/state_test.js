var test = require('tape')
var onmount = require('../index')
var around = require('./around')
var el = require('./helpers').el
var remove = require('./helpers').remove

test('state', function (t) {
  var run = around(
    function before () {
      var state
      onmount('.our-behavior', function (b) {
        state = b
        b.number = 10
      }, function (b) {
        b.number++
      })

      var div = el('div', { 'class': 'our-behavior' })
      onmount()
      remove(div)
      onmount()
      return [ div, state ]
    },
    function after (div, state) {
      remove(div)
      onmount.reset()
    })

  run(function (div, state) {
    t.ok(state['id'].match(/^c\d+$/), 'has an id')
  })

  run(function (div, state) {
    t.equal(state.selector, '.our-behavior', 'passes the selector')
  })

  run(function (div, state) {
    t.equal(state.number, 11, 'works')
  })

  t.end()
})
