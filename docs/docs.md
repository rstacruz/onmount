## Premise

Given this HTML snippet:

```html
<div class='js-expandable-nav'>
  <a href=''>Home</a>
  <a href=''>Inbox</a>
  <a href=''>Messages</a>
  
  <div class='more'>
    <a href=''>Help</a>
    <a href=''>Support</a>
  </div>
  
  <button>more...</button>
</div>
```

Typically, to make this work, you'll make code like this:

```js
$(function () {
  $('.js-expandable-nav button').on('click', function () {
    $('.js-expandable-nav .more').show()
    $('.js-expandable-nav button').hide()
  })
})
```

However, you have a few problems with this approach.

* __It's not testable.__ You can't make unit tests from this code.
* __Assumes just one instance.__ When there are 2 .js-expandable-nav elements in the page, this will break.
* __It doesn't work in modal dialogs.__ Since it works in `$(function() { ... })`, it doesn't work on elements loaded later.
* __There's no provision for cleanups.__ What happens when `.js-expandable-nav` exits the DOM (eg, the dialog box was closed)?

Behaviors solve that. You don't write your code any differently, but it will be accessible in a way that it's testable, isolated, and idempotent.

```js
/*
 * initializes behaviors on document.ready and on bootstrap modal show.
 */

$(function () { $.onmount() })
$(document).on('show.bs.modal', function () { $.onmount() })

/*
 * attach a behavior to `.js-expandable-nav`
 */

$.onmount('.js-expandable-nav', function () {
  var $this   = $(this)
  var $button = $this.find('button')
  var $more   = $this.find('.more')

  $button.on('click', function () {
    $more.toggle()
    $button.hide()
  })
})
```

By simply wrapping your code in `$.onmount(...)` instead of `$(function)`, it gives you the power of a few features:

* You're assured that the block will only run once for every `.js-expandable-nav` element.

* You can retrigger this behavior for tests.

* You can call behaviors again and again (`$.onmount()`) every time your DOM changes to make it work for any new elements.

<br>

## Idempotency

You can call `$.onmount()` as much as you like. This will skip any behavior initialization for DOM nodes that have already been initialized. This is done to account for any new elements that may appear in your DOM.

```js
// add more content
$('#content').append(...)

$.onmount()
```

This allows you to set up polling checkpoints to trigger new behaviors on certain events.
Great for events such as [Bootstrap events] or [Turbolinks load].

Also, when used with jQuery, `onmount` can be passed as an event handler, eg,
`$(onmount)`.

```js
$(document)
  .ready($.onmount)
  .on('show.bs closed.bs load page:change', $.onmount)
```

[Bootstrap events]: http://getbootstrap.com/javascript/
[Turbolinks load]: https://github.com/rails/turbolinks#events

<br>

## Turbolinks

You'll notice that document.ready is not friendly for Turbolinks applications. This solves that.

```js
$(function () { $.onmount() })
$(document).on('page:change', function () { $.onmount() })
```

<br>

## Performing cleanups

When your behavior modifies things outside itself (eg, binds events to the `document` element), you might want to clean up when the behavior is removed. Just pass a 2nd function to `onmount()`.

In this example below, behaviors are checked once dialog boxes are opened and closed (`$.onmount()`). When it's called after closing, it will see that the old `.js-sticky` element is not part of the document anymore, and its exit callback will be called.

```js
$.onmount('.js-sticky', function () {
  $(document).on('scroll.sticky', function () {
    // do stuff
  })
}, function () {
  $(document).off('scroll.sticky')
})

$(function () { $.onmount() })
$(document).on('show.bs.modal close.bs.modal', function () { $.onmount() })
```

<br>

## Cancelling

You can cancel an initialization by returning `false`. This makes it so that the initialization will run again when `init` is triggered again.

This is also available for exit callbacks.

```js
$.onmount('.expandable-nav', function () {
  if ($(this).is(':hidden')) return false

  /* ... */
})
```

<br>

## Role attributes

Some recommend [using the role attribute][rsjs] to bind your behaviors. To aid this, you can define behaviors as `@xxxx`, which is shorthand of `[role~="xxxx"]`. (This convention is taken from [jquery-role].)

```js
$.onmount('@hiding-menu', function () {
  /* ... */
})

/* same as $.onmount('[role~="hiding-menu"]', ...) */
```

[rsjs]: https://github.com/rstacruz/rsjs
[jquery-role]: https://github.com/kossnocorp/role

<br>

## Testing behaviors

You can trigger just one onmount via `$.onmount(SELECTOR)`. This is useful for tests.

```js
var $div

beforeEach(function () {
  $div = $("<div class='js-user-profile' data-user='rstacruz'>")
    .appendTo('body')

  $.onmount('.js-user-profile')
})

afterEach(function () {
  $div.remove()
})

it('renders an avatar', function () {
  expect($div.html()).to.include("<img src='avatars/rstacruz.png'>")
})
```

<br>

## Unique IDs

The `init()` and `exit()` callbacks get passed an object with a unique ID. This ID is guaranteed to be unique for every behavior-element pair. It looks like this:

> `{ id: 'c12' }`

This makes it possible to assign event handlers with tags that are unique to that behavior-and-element so that it may be unbound later.

```js
$.onmount('@hiding-menu', function (b) {
  $('html, body').on('scroll.' + b.id, function () {
  })
}, function (b) {
  $('html, body').off('scroll.' + b.id)
})
```

<br>

## Automatic observation

You can turn on automatic observation via the [MutationObserver] API. Not supported in Opera and IE10 and below. (*experimental*)

```js
onmount.observe()
```

Considering not all browsers support this, you can set up fallbacks via:

```js
if (!$.onmount.observe()) {
  $(document)
    .ready($.onmount)
    .on('show.bs hide.bs load', $.onmount)
}
```

While this is convenient, it is not recommended as it can accrue some performance penalty by checking every DOM insertion that happens in realtime. Consider this an experimental feature and subject to future optimizations.

[MutationObserver]: https://developer.mozilla.org/en/docs/Web/API/MutationObserver

<br>

## Debugging

To turn debug logging on, set `onmount.debug` to `true`.

```js
onmount.debug = true
```

If you'd like to do this automatically, you can turn it on by a secret flag:

```js
onmount.debug = (window.localStorage &&
  window.localStorage['onmount_debug'] &&
  true)
```

You can turn it on in your JavaScript console by typing `localStorage.onmount_debug = true`, and turn it off with `delete localStorage.onmount_debug`.
