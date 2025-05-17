const JSDOM = require('jsdom').JSDOM
const DOM = new JSDOM(`<!doctype html>`)
global.window = DOM.window
global.document = DOM.window.document
global.navigator = DOM.window.navigator

require('tape')('dom', function (t) {
  t.pass(navigator.userAgent)
  t.end()
})

require('./mounting_test')
require('./exiting_test')
require('./with_at_role_test')
require('./with_role_test')
require('./state_test')
require('./multiple_behaviors_test')
require('./mutation_test')
require('./jquery_test')
require('./detect_mutate_test')
require('./selectify_escape_test')
require('tape')('eslint', require('tape-eslint')())
