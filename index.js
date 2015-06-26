/* global define */
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else {
    if (window.jQuery) window.jQuery.behavior = factory()
    else root.behavior = factory()
  }
}(this, function ($) {

  // Allow users to override this if needed.
  behavior.selectify = selectify

  // Initializer registry.
  var handlers = []
  var selectors = {}

  // Use jQuery when available.
  if (window.jQuery) behavior.$ = window.jQuery

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

    selector = behavior.selectify(selector)

    if (arguments.length === 1) {
      return trigger(selector)
    }

    if (typeof options === 'function') {
      init = options
      options = {}
    }

    register(selector, function () {
      each(selector, function () {
        var key = '__behavior:' + slugify(selector) + ':loaded'
        if (this[key]) return
        var result = init.call(this)
        if (result !== false) this[key] = true
      })
    })
  }

  /**
   * Internal: reimplementation of `$('...').each()`.
   */

  function each (selector, fn) {
    if (behavior.$) return behavior.$(selector).each(fn)

    var list = document.querySelectorAll(selector)
    for (var i = 0, len = list.length; i < len; i++) {
      fn.apply(list[i])
    }
  }

  /**
   * Internal: registers a behavior handler for a selector.
   */

  function register (selector, fn) {
    if (!selectors[selector]) selectors[selector] = []
    selectors[selector].push(fn)
    handlers.push(fn)
  }

  /**
   * Internal: triggers behaviors for a selector.
   *
   *     trigger()
   *     trigger('.js-button')
   */

  function trigger (selector) {
    var list

    if (selector) {
      list = selectors[selector] || []
    } else {
      list = handlers
    }

    for (var i = 0, len = list.length; i < len; i++) {
      list[i].call(this)
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
