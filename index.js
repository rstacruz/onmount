/* global define */
void (function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else {
    if (window.jQuery) window.jQuery.onmount = factory()
    else root.onmount = factory()
  }
}(this, function ($) {

  // Initializer registry.
  var handlers = onmount.handlers = []
  var selectors = onmount.selectors = {}
  var id = 0
  var bid = 0

  onmount.selectify = selectify
  onmount.reset = reset
  onmount.observe = observe

  // Use jQuery (or a jQuery-like) when available. This will allow
  // the use of jQuery selectors.
  onmount.$ = window.jQuery || window.Zepto || window.Ender

  return onmount

  /**
   * Adds a behavior, or triggers behaviors.
   *
   * When no parameters are passed, it triggers all behaviors. When one
   * parameter is passed, it triggers the given behavior. Otherwise, it adds a
   * behavior.
   *
   *     // define a behavior
   *     $.onmount('.select-box', function () {
   *       $(this).on('...')
   *     })
   *
   *     // define a behavior with exit
   *     $.onmount('.select-box', function () {
   *       $(document).on('...')
   *     }, function () {
   *       $(document).off('...')
   *     })
   *
   *     // retrigger a onmount
   *     $.onmount('.select-box')
   *
   *     // retriggers all behaviors
   *     $.onmount()
   */

  function onmount (selector, init, exit) {
    // trigger all behaviors on $.onmount(). Also account for cases such as
    // $($.onmount), where it's triggered with an event object.
    if (arguments.length === 0 || selector === $ || selector.target) {
      return trigger()
    }

    // account for `@role` selectors and such
    selector = onmount.selectify(selector)

    // trigger with $.onmount(selector)
    if (arguments.length === 1) return trigger(selector)

    // keep track of dom elements loaded for this behavior
    var loaded = []

    // leave the state object into el['__onmount:12']
    var key = '__onmount:' + bid++

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
        var options = { id: 'b' + id, selector: selector }
        if (!this[key] && init.call(this, options) !== false) {
          this[key] = options
          id++
          loaded.push(this)
        }
      })
    })

    // allow $.onmount().onmount() chain
    return this
  }

  /**
   * Observes automatically using MutationObserver events.
   *
   *     $.onmount.observe()
   */

  function observe () {
    var MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver

    if (!MutationObserver) return

    var obs = new MutationObserver(function (mutations) {
      onmount() // TODO optimize
    })

    onmount.observer = obs
    obs.observe(document, { subtree: true, childList: true })
    return true
  }

  /**
   * Clears all behaviors. Useful for tests.
   * This will NOT call exit handlers.
   */

  function reset () {
    handlers = onmount.handlers = []
    selectors = onmount.selectors = {}
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
    if (onmount.$) return onmount.$(selector).each(fn)

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
    var list = (selector ? selectors[selector] : handlers) || []
    for (var i = 0, len = list.length; i < len; i++) {
      list[i].call(this)
    }
  }

  /**
   * Internal: Converts `@role` to `[role~="role"]` if needed. You can override
   * this by reimplementing `onmount.selectify`.
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

}))
