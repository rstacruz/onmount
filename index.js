import { each, isjQuery, isEvent } from './lib/helpers'
import Behavior from './lib/behavior'

/**
 * (Module) Adds a behavior, or triggers behaviors.
 *
 * When no parameters are passed, it triggers all behaviors. When one
 * parameter is passed, it triggers the given behavior. Otherwise, it adds a
 * behavior.
 *
 *     // define a behavior
 *     onmount('.select-box', function () {
 *       $(this).on('...')
 *     })
 *
 *     // define a behavior with exit
 *     onmount('.select-box', function () {
 *       $(document).on('...')
 *     }, function () {
 *       $(document).off('...')
 *     })
 *
 *     // retrigger a onmount
 *     onmount('.select-box')
 *
 *     // retriggers all behaviors
 *     onmount()
 */

function onmount (selector, init, exit, options) {
  if (typeof exit === 'object') {
    options = exit
    exit = undefined
  }

  if (arguments.length === 0 || isjQuery(selector) || isEvent(selector)) {
    // onmount() - trigger all behaviors. Also account for cases such as
    // $(onmount), where it's triggered with a jQuery event object.
    onmount.poll()
  } else if (arguments.length === 1) {
    // onmount(selector) - trigger for a given selector.
    onmount.poll(selector)
  } else {
    // onmount(sel, fn, [fn]) - register a new behavior.
    var be = new Behavior(selector, init, exit, options)
    onmount.behaviors.push(be)
    be.register(register)
  }

  return this
}

/**
 * Detect MutationObserver support for `onmount.observe()`.
 * You may even add a polyfill here via
 * `onmount.MutationObserver = require('mutation-observer')`.
 */

onmount.MutationObserver =
  (global || window).MutationObserver ||
  (global || window).WebKitMutationObserver ||
  (global || window).MozMutationObserver

/**
 * Internal: triggers behaviors for a selector or for all.
 *
 *     onmount.poll()
 *     onmount.poll('.js-button')
 */

onmount.poll = function poll (selector) {
  const { selectors, handlers } = onmount

  const functions = (selector ? selectors[selector] : handlers) || []
  each(functions, (fn) => { fn() })
}

/**
 * Observes automatically using MutationObserver events.
 *
 *     onmount.observe()
 */

onmount.observe = function observe () {
  const { behaviors, MutationObserver } = onmount
  if (typeof MutationObserver === 'undefined') return

  var obs = new MutationObserver(function (mutations) {
    each(behaviors, (be) => {
      each(mutations, (mutation) => {
        each(mutation.addedNodes, (el) => {
          if (el.matches(be.selector)) be.visitEnter(el)
        })

        each(mutation.removedNodes, (el) => {
          if (el.matches(be.selector)) be.doExit(el)
        })
      })
    })
  })

  obs.observe(document, { subtree: true, childList: true })
  onmount.observer = obs

  // trigger everything before going
  onmount()
  return true
}

/**
 * Turns off observation first issued by `onmount.observe()`.
 */

onmount.unobserve = function unobserve () {
  if (!this.observer) return
  this.observer.disconnect()
  delete this.observer
}

/**
 * Forces teardown of all behaviors currently applied.
 */

onmount.teardown = function teardown () {
  each(onmount.behaviors, function (be) {
    each(be.loaded, function (el, i) {
      if (el) be.doExit(el, i)
    })
  })
}

/**
 * Clears all behaviors. Useful for tests.
 * This will NOT call exit handlers.
 */

onmount.reset = function reset () {
  onmount.handlers = []
  onmount.selectors = {}
  onmount.behaviors = []
}

/**
 * Internal: registers a behavior handler for a selector.
 */

function register (selector, fn) {
  const { selectors, handlers } = onmount

  if (!selectors[selector]) selectors[selector] = []
  selectors[selector].push(fn)
  handlers.push(fn)
}

/*
 * Export
 */

onmount.reset()

export default onmount
