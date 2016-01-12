var test = require('tape')
var onmount = require('../index')
var around = require('./around')
var el = require('./helpers').el
var remove = require('./helpers').remove

test('exiting', function (t) {
  var run = around(
    function before () {
      onmount('.their-behavior', function () {
        this.innerHTML += '(on)'
      }, function () {
        this.innerHTML += '(off)'
      })
    },
    function after () {
      onmount.reset()
    })

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
