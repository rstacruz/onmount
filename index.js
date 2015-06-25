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

  behavior.all = all

  return behavior

  /*
   * adds a behavior, or triggers behaviors
   *
   *     // define a behavior
   *     $.behavior('.select-box', function () {
   *       $(this).on('...')
   *     })
   *
   *     // retrigger a behavior
   *     $.behavior('.select-box')
   *
   *     // retriggers all behaviors
   *     $.behavior()
   */

  function behavior (selector, options, init) {
    var name = slugify(selector)

    // trigger all behaviors
    if (arguments.length === 0) {
      return $(document).trigger('behavior')
    }
    if (arguments.length === 1) {
      return $(document).trigger('behavior.' + name)
    }

    if (typeof options === 'function') {
      init = options
      options = {}
    }

    options = $.extend({}, behavior, options || {})

    var event = 'behavior.' + name

    $(document).on(event, function () {
      $(selector).each(function () {
        var $this = $(this)
        var key = 'behavior:' + name + ':loaded'

        if ($this.data(key)) return

        var result = init.call(this)

        if (result !== false) $this.data(key, true)
      })
    })

    return $
  }

  function all () {
    return behavior()
  }

  function slugify (str) {
    return encodeURIComponent(str).replace(/[^a-z0-9]/g, '_')
  }

}))
