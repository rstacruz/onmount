var $ = require('jquery')
var test = require('tape')

test('is a working environment', function (t) {
  document.body.innerHTML = ''
  $('<div>hello</div>').appendTo('body')
  t.equal($('body')[0].innerHTML, '<div>hello</div>')
  t.equal(window.document.body.innerHTML, '<div>hello</div>')
  t.end()
})
