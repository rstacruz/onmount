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

  return behavior

  /**
   * Adds a behavior, or triggers behaviors.
   *
   * When no parameters are passed, it triggers all behaviors. When one
   * parameter is passed, it triggers the given behavior. Otherwise, it adds a
   * behavior.
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
    // trigger all behaviors on $.behavior(). Also account for cases such as
    // $($.behavior), where it's triggered with an event object.
    if (arguments.length === 0 || selector === $ || selector.target) {
      return $(document).trigger('behavior')
    }
    if (arguments.length === 1) {
      return $(document).trigger('behavior.' + slugify(selectify(selector)))
    }

    selector = selectify(selector)
    var name = slugify(selector)

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

  /**
   * Internal: Converts `@role` to `[role~="role"]` if needed.
   *
   *     selectify('@hi')   //=> '[role="hi"]'
   *     selectify('.btn')  //=> '.btn'
   */

  function selectify (selector) {
    if (selector[0] === '@') {
      return '[role~=' + JSON.stringify(selector.substr(1)) + ']'
    }
    return selector
  }

  /**
   * Internal: Neutralizes a string so that it can be used as an event tag.
   *
   *     slugify('[role="hi"]')  //=> "_5Brole_3D_22hi_22_5D"
   */

  function slugify (str) {
    return encodeURIComponent(str).replace(/[^a-zA-Z0-9]/g, '_')
  }

}))
