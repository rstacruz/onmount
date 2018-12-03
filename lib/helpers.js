/**
 * Iterates through `list` (an array or an object). This is useful when dealing
 * with NodeLists like `document.querySelectorAll`.
 */

export function each (list, fn) {
  return Array.from(list).map(fn)
}

export function isjQuery ($) {
  // TODO deprecate isJquery
  return typeof $ === 'function' && $.fn && $.noConflict
}

/**
 * Checks if this is an event object.
 */

export function isEvent (e) {
  return typeof e === 'object' && e.target
}

/**
 * Internal: check if an element is still attached to its document.
 */

export function isAttached (el) {
  while (el) {
    if (el === document.documentElement) return true
    el = el.parentElement
  }
}

/**
 * Internal: reimplementation of `$('...')`. If jQuery is available,
 * use it (I guess to preserve IE compatibility and to enable special jQuery
 * attribute selectors). Use with `each()` or `has()`.
 */

export function query (selector) {
  return document.querySelectorAll(selector)
}

/**
 * Internal: checks if given element `el` is in the query result `list`.
 */

export function has (list, el) {
  return Array.from(list).includes(el)
}
