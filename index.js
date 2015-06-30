/* global define */
void (function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else {
    if (window.jQuery) window.jQuery.onmount = factory()
    else root.onmount = factory()
  }
}(this, function ($) {

  /*
   * Registry.
   */

  var handlers = onmount.handlers = []
  var behaviors = onmount.behaviors = []
  var selectors = onmount.selectors = {}

  /*
   * IDs for auto-incrementing.
   */

  var id = 0
  var bid = 0

  /*
   * Use jQuery (or a jQuery-like) when available. This will allow
   * the use of jQuery selectors.
   */

  onmount.$ = window.jQuery || window.Zepto || window.Ender

  /*
   * Detect MutationObserver support for `onmount.observe()`.
   */

  var MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver

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

    var b = new Behavior(selector, bid++, init, exit)
    behaviors.push(b)
    b.register()

    // allow $.onmount().onmount() chain
    return this
  }

  /**
   * Observes automatically using MutationObserver events.
   *
   *     $.onmount.observe()
   */

  onmount.observe = function observe () {
    if (!MutationObserver) return

    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        each(mutation.addedNodes, function (el) {
          behaviors.forEach(function (behavior) {
            if (matches(el, behavior.selector)) {
              behavior.visitEnter(el)
            }
          })
        })

        each(mutation.removedNodes, function (el) {
          behaviors.forEach(function (behavior) {
            if (matches(el, behavior.selector)) {
              behavior.visitExit(el)
            }
          })
        })
      })
    })

    onmount.observer = obs
    obs.observe(document, { subtree: true, childList: true })

    // trigger everything before going
    onmount()
    return true
  }

  /**
   * Turns off observation first issued by `onmount.observe()`.
   */

  onmount.unobserve = function unobserve () {
    if (this.observer) {
      this.observer.disconnect()
      delete this.observer
    }
  }

  /**
   * Clears all behaviors. Useful for tests.
   * This will NOT call exit handlers.
   */

  onmount.reset = function reset () {
    handlers = onmount.handlers = []
    selectors = onmount.selectors = {}
    behaviors = onmount.behaviors = []
  }

  /**
   * Internal: Converts `@role` to `[role~="role"]` if needed. You can override
   * this by reimplementing `onmount.selectify`.
   *
   *     selectify('@hi')   //=> '[role="hi"]'
   *     selectify('.btn')  //=> '.btn'
   */

  onmount.selectify = function selectify (selector) {
    if (selector[0] === '@') {
      return '[role~="' + selector.substr(1).replace(/"/g, '\\"') + '"]'
    }
    return selector
  }

  /**
   * Internal: behavior class
   */

  function Behavior (selector, bid, init, exit) {
    this.id = bid
    this.init = init
    this.exit = exit
    this.selector = selector

    // keep track of dom elements loaded for this behavior
    this.loaded = []

    // leave the state object into el['__onmount:12']
    this.key = '__onmount:' + bid
  }

  /**
   * Internal: Register this behavior
   */

  Behavior.prototype.register = function () {
    var b = this
    var loaded = this.loaded
    var selector = this.selector

    register(selector, function () {
      // clean up old ones
      for (var i = 0, len = loaded.length; i < len; i++) {
        var element = loaded[i]
        b.visitExit(element, i)
      }

      // initialize new ones
      query(selector, function () { b.visitEnter(this) })
    })
  }

  /**
   * Internal: visits the element `el` and turns it on if applicable
   */

  Behavior.prototype.visitEnter = function (el) {
    if (el[this.key]) return
    var options = { id: 'b' + id, selector: this.selector }
    if (this.init.call(el, options) !== false) {
      el[this.key] = options
      this.loaded.push(el)
      id++
    }
  }

  /**
   * Internal: visits the element `el` and sees if it needs its exit handler
   * called
   */

  Behavior.prototype.visitExit = function (el, i) {
    if (el && !isAttached(el)) {
      if (typeof i === 'undefined') i = this.loaded.indexOf(el)
      this.loaded[i] = undefined
      if (this.exit && this.exit.call(el, el[this.key]) !== false) {
        delete el[this.key]
      }
    }
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

  function query (selector, fn) {
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
   * Checks if a given element `el` matches `selector`.
   * Compare with [$.fn.is](http://api.jquery.com/is/).
   *
   *     var matches = require('dom101/matches');
   *
   *     matches(button, ':focus');
   */

  function matches (el, selector) {
    var _matches = el.matches ||
      el.matchesSelector ||
      el.msMatchesSelector ||
      el.mozMatchesSelector ||
      el.webkitMatchesSelector ||
      el.oMatchesSelector

    if (onmount.$) {
      return onmount.$(el).is(selector)
    } else if (_matches) {
      return _matches.call(el, selector)
    } else if (el.parentNode) {
      // IE8 and below
      var nodes = el.parentNode.querySelectorAll(selector)
      for (var i = nodes.length; i--; 0) {
        if (nodes[i] === el) return true
      }
      return false
    }
  }

  /**
   * Iterates through `list` (an array or an object). This is useful when dealing
   * with NodeLists like `document.querySelectorAll`.
   *
   *     var each = require('dom101/each');
   *     var qa = require('dom101/query-selector-all');
   *
   *     each(qa('.button'), function (el) {
   *       addClass('el', 'selected');
   *     });
   */

  function each (list, fn) {
    var i, len = list.length

    if (len === +len) {
      for (i = 0; i < len; i++) { fn(list[i], i) }
    } else {
      for (i in list) {
        if (list.hasOwnProperty(i)) fn(list[i], i)
      }
    }

    return list
  }

  /*
   * Export
   */

  return onmount

}))
