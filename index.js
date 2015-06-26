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

  var B = behavior

  behavior.selectify = selectify
  behavior.slugify = slugify
  behavior.handlers = []

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
      return trigger()
    }

    selector = B.selectify(selector)

    if (arguments.length === 1) {
      return trigger(selector)
    }

    if (typeof options === 'function') {
      init = options
      options = {}
    }

    register(selector, function () {
      each(selector, function () {
        var key = '__behavior:' + B.slugify(selector) + ':loaded'
        if (this[key]) return
        var result = init.call(this)
        if (result !== false) this[key] = true
      })
    })
  }

  function each (selector, fn) {
    $(selector).each(fn)
  }

  function register (selector, fn) {
    $(document).on('behavior.' + behavior.slugify(selector), fn)
  }

  function trigger (selector) {
    if (selector) {
      $(document).trigger('behavior.' + behavior.slugify(selector))
    } else {
      $(document).trigger('behavior')
    }
  }

  /**
   * Internal: Converts `@role` to `[role~="role"]` if needed. You can override
   * this by reiimplementing `behavior.selectify`.
   *
   *     selectify('@hi')   //=> '[role="hi"]'
   *     selectify('.btn')  //=> '.btn'
   */

  function selectify (selector) {
    if (selector[0] === '@') {
      return '[role~="' + selector.substr(1).replace(/"/g, '\\"') + '"]'
    }
    return selector
  }

  /**
   * Internal: Neutralizes a string so that it can be used as an event tag. You
   * may override this by reiimplementing `behavior.slugify`.
   *
   *     slugify('[role="hi"]')  //=> "_5Brole_3D_22hi_22_5D"
   */

  function slugify (str) {
    return encodeURIComponent(str).replace(/[^a-zA-Z0-9]/g, '_')
  }

}))
