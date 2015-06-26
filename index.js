/* global define */
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else {
    if (window.jQuery) window.jQuery.behavior = factory()
    else root.behavior = factory()
  }
}(this, function ($) {

  // Initializer registry.
  var handlers = behavior.handlers = []
  var selectors = behavior.selectors = {}

  // Allow users to override this if needed.
  behavior.selectify = selectify

  // Use jQuery (or a jQuery-like) when available. This will allow
  // the use of jQuery selectors.
  behavior.$ = window.jQuery || window.Zepto || window.Ender

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
   *     // define a behavior with exit
   *     $.behavior('.select-box', function () {
   *       $(document).on('...')
   *     }, function () {
   *       $(document).off('...')
   *     })
   *
   *     // retrigger a behavior
   *     $.behavior('.select-box')
   *
   *     // retriggers all behaviors
   *     $.behavior()
   */

  function behavior (selector, init, exit) {
    // trigger all behaviors on $.behavior(). Also account for cases such as
    // $($.behavior), where it's triggered with an event object.
    if (arguments.length === 0 || selector === $ || selector.target) {
      return trigger()
    }

    // account for `@role` selectors and such
    selector = behavior.selectify(selector)

    // trigger with $.behavior(selector)
    if (arguments.length === 1) return trigger(selector)

    // keep track of dom elements loaded for this behavior
    var loaded = []
    var key = '__behavior:' + slugify(selector) + ':loaded'

    register(selector, function () {
      // clean up old ones
      for (var i = 0, len = loaded.length; i < len; i++) {
        var element = loaded[i]
        if (element && !isAttached(element) && exit) {
          if (exit.call(element) !== false) {
            loaded[i] = undefined
            delete element[key]
          }
        }
      }

      // initialize new ones
      each(selector, function () {
        if (!this[key] && init.call(this) !== false) {
          this[key] = true
          loaded.push(this)
        }
      })
    })

    // allow $.behavior().behavior() chain
    return this
  }

  /**
   * Internal: check if an element is still attached to its document.
   */

  function isAttached (el) {
    while (el) {
      if (el === document.documentElement) return true
      el = el.parentElement
    }
  }

  /**
   * Internal: reimplementation of `$('...').each()`. If jQuery is available,
   * use it (I guess to preserve IE compatibility and to enable special jQuery
   * attribute selectors).
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
   * Internal: triggers behaviors for a selector or for all.
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
