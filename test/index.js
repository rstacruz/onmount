require('jsdom-global')()

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

// Smokestack
require('tape').onFinish(function () { window.close() })
