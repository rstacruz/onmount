/* global define */
void (function (root, factory) {
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
  var id = 0

  behavior.selectify = selectify
  behavior.reset = reset

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
    var key = '__behavior:' + slugify(selector)

    register(selector, function () {
      // clean up old ones
      for (var i = 0, len = loaded.length; i < len; i++) {
        var element = loaded[i]
        if (element && !isAttached(element)) {
          loaded[i] = undefined
          if (exit && exit.call(element, element[key]) !== false) {
            delete element[key]
          }
        }
      }

      // initialize new ones
      each(selector, function () {
        var options = { id: 'b' + id }
        if (!this[key] && init.call(this, options) !== false) {
          this[key] = options
          id++
          loaded.push(this)
        }
      })
    })

    // allow $.behavior().behavior() chain
    return this
  }

  /**
   * Clears all behaviors. Useful for tests.
   * This will NOT call exit handlers.
   */

  function reset () {
    handlers = behavior.handlers = []
    selectors = behavior.selectors = {}
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
   * this by reimplementing `behavior.selectify`.
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
   * may override this by reimplementing `behavior.slugify`.
   *
   *     slugify('[role="hi"]')  //=> "_5Brole_3D_22hi_22_5D"
   */

  function slugify (str) {
    return encodeURIComponent(str).replace(/[^a-zA-Z0-9]/g, '_')
  }

}))
