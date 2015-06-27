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

$(function () { $.behavior() })
$(document).on('show.bs.modal', function () { $.behavior() })

/*
 * attach a behavior to `.js-expandable-nav`
 */

$.behavior('.js-expandable-nav', function () {
  var $this   = $(this)
  var $button = $this.find('button')
  var $more   = $this.find('.more')

  $button.on('click', function () {
    $more.toggle()
    $button.hide()
  })
})
```

By simply wrapping your code in `$.behavior(...)` instead of `$(function)`, it gives you the power of a few features:

* You're assured that the block will only run once for every `.js-expandable-nav` element.

* You can retrigger this behavior for tests.

* You can call behaviors again and again (`$.behavior()`) every time your DOM changes to make it work for any new elements.

<br>

## Idempotency

You can call `$.behavior()` as much as you like. This will skip any behavior initialization for DOM nodes that have already been initialized. This is done to account for any new elements that may appear in your DOM.

```js
// add more content
$('#content').append(...)

$.behavior()
```

<br>

## Turbolinks

You'll notice that document.ready is not friendly for Turbolinks applications. This solves that.

```js
$(function () { $.behavior() })
$(document).on('page:change', function () { $.behavior() })
```

<br>

## Performing cleanups

When your behavior modifies things outside itself (eg, binds events to the `document` element), you might want to clean up when the behavior is removed. Just pass a 2nd function to `behavior()`.

In this example below, behaviors are checked once dialog boxes are opened and closed (`$.behavior()`). When it's called after closing, it will see that the old `.js-sticky` element is not part of the document anymore, and its exit callback will be called.

```js
$.behavior('.js-sticky', function () {
  $(document).on('scroll.sticky', function () {
    // do stuff
  })
}, function () {
  $(document).off('scroll.sticky')
})

$(function () { $.behavior() })
$(document).on('show.bs.modal close.bs.modal', function () { $.behavior() })
```

<br>

## Cancelling

You can cancel an initialization by returning `false`. This makes it so that the initialization will run again when `init` is triggered again.

This is also available for exit callbacks.

```js
$.behavior('.expandable-nav', function () {
  if ($(this).is(':hidden')) return false

  /* ... */
})
```

<br>

## Role attributes

Some recommend [using the role attribute][rsjs] to bind your behaviors. To aid this, you can define behaviors as `@xxxx`, which is shorthand of `[role~="xxxx"]`. (This convention is taken from [jquery-role].)

```js
$.behavior('@hiding-menu', function () {
  /* ... */
})

/* same as $.behavior('[role~="hiding-menu"]', ...) */
```

[rsjs]: https://github.com/rstacruz/rsjs
[jquery-role]: https://github.com/kossnocorp/role

<br>

## Testing behaviors

You can trigger just one behavior via `$.behavior(SELECTOR)`. This is useful for tests.

```js
var $div

beforeEach(function () {
  $div = $("<div class='js-user-profile' data-user='rstacruz'>")
    .appendTo('body')

  $.behavior('.js-user-profile')
})

afterEach(function () {
  $div.remove()
})

it('renders an avatar', function () {
  expect($div.html()).to.include("<img src='avatars/rstacruz.png'>")
})
```
