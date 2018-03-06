import { each, has, query, isAttached } from './helpers'

let bid = 0 // Behavior ID
let cid = 0 // Component ID

/**
 * Internal: behavior class
 */

export default function Behavior (selector, init, exit, options) {
  this.id = 'b' + bid++
  this.init = init
  this.exit = exit
  this.selector = selector
  this.loaded = [] // keep track of dom elements loaded for this behavior
  this.key = '__onmount:' + bid // leave the state in el['__onmount:12']
  this.detectMutate = options && options.detectMutate
}

/**
 * Internal: initialize this behavior by registering itself to the internal
 * `selectors` map. This allows you to call `onmount(selector)` later on.
 */

Behavior.prototype.register = function (register) {
  const { loaded, selector } = this

  register(selector, () => {
    const list = query(selector)

    // This is the function invoked on `onmount(selector)`.
    // Clean up old ones (if they're not in the DOM anymore).
    each(loaded, (element, i) => {
      this.visitExit(element, i, list)
    })

    // Clean up new ones (if they're not loaded yet).
    each(list, (element) => {
      this.visitEnter(element)
    })
  })
}

/**
 * Internal: visits the element `el` and turns it on if applicable.
 */

Behavior.prototype.visitEnter = function (el) {
  if (el[this.key]) return
  var options = { id: 'c' + cid, selector: this.selector }
  if (this.init.call(el, options) !== false) {
    el[this.key] = options
    this.loaded.push(el)
    cid++
  }
}

/**
 * Internal: visits the element `el` and sees if it needs its exit handler
 * called.
 */

Behavior.prototype.visitExit = function (el, i, list) {
  if (!el) return
  if (this.detectMutate) {
    if (!has(list, el)) return this.doExit(el, i)
  } else {
    if (!isAttached(el)) return this.doExit(el, i)
  }
}

/**
 * Internal: calls the exit handler for the behavior for element `el` (if
 * available), and marks the behavior/element as uninitialized.
 */

Behavior.prototype.doExit = function (el, i) {
  if (typeof i === 'undefined') i = this.loaded.indexOf(el)
  this.loaded[i] = undefined
  if (this.exit && this.exit.call(el, el[this.key]) !== false) {
    delete el[this.key]
  }
}
