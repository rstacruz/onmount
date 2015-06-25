/* global define */
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'))
  } else {
    root.jQuery.behavior = factory(root.jQuery)
  }
}(this, function ($) {

  /*
   * defaults
   */

  behavior.selector = '.js-{name}'
  behavior.eventName = 'init'

  /*
   * adds a behavior
   *
   *     $.behavior('select-box', function () {
   *       $(this).on('...')
   *     })
   */

  function behavior (name, options, init) {
    if (typeof options === 'function') {
      init = options
      options = {}
    }

    options = $.extend({}, behavior, options || {})

    var sel = options.selector.replace('{name}', name)
    var event = '' + options.eventName + '.' + name

    $(document).on(event, function () {
      $(sel).each(function () {
        var $this = $(this)
        var key = 'behavior:' + name + ':loaded'

        if ($this.data(key)) return

        var result = init.call(this)

        if (result !== false) $this.data(key, true)
      })
    })
  }

  return behavior
}))
