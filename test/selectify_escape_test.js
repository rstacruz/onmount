var test = require('tape')
var onmount = require('../index')

test('selectify escapes double quotes and backslashes', function (t) {
  // Input with both a double quote and a backslash
  var input = '@foo\\"bar'
  var expected = '[role~="foo\\\\\\"bar"]'
  var actual = onmount.selectify(input)
  t.equal(actual, expected, 'escapes both backslashes and double quotes')
  t.end()
})
