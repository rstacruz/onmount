var test = require('tape')
var onmount = require('../index')
var around = require('./around')
var el = require('./helpers').el
var remove = require('./helpers').remove

test('with @role', function (t) {
  var run = around(
    function before () {
      onmount('@his-behavior', function () {
        this.innerHTML += '(on)'
      })
      return el('div', { role: 'his-behavior' })
    },
    function after (div) {
      onmount.reset()
      remove(div)
    })

  run(function (div) {
    onmount()
    t.equal(div.innerHTML, '(on)', 'works')
  })

  run(function (div) {
    onmount('@his-behavior')
    t.equal(div.innerHTML, '(on)', 'can be called via @')
  })

  run(function (div) {
    onmount('[role~="his-behavior"]')
    t.equal(div.innerHTML, '(on)', 'can be called via selector')
  })

  t.end()
})
