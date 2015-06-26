# behavior

A safe, reliable, idempotent, and testable way to attach JavaScript behaviors to DOM node.

Works well with jQuery, but does *not* require jQuery at all.

> NB: this project will be renamed soon. name suggestions are welcome.

[![Status](https://travis-ci.org/rstacruz/jq-behavior.svg?branch=master)](https://travis-ci.org/rstacruz/jq-behavior "See test builds")

```js
$.behavior = require('jq-behavior')

$.behavior('.push-button', function () {
  $(this).on('click', function () {
    alert('working...')
  })
})
```

Then trigger all defined behaviors for all applicable elements using `behavior()`. If an element `.push-button` is found in the DOM, it'll have the function applied to it.

```js
$(function () { $.behavior() })
```

This is idempotent, so you can call it as many times as you like. If the behavior has already been applied to an element, it will not be reapplied.

```js
$(function () { $.behavior() })
$(document).on('show.bs.modal', function () { $.behavior() })
$(document).on('page:load', function () { $.behavior() })
```

Or you can trigger just one behavior. Perfect for testing.

```js
$.behavior('.push-button')
```

<br>

## Installation

```
npm install rstacruz/jq-behavior
bower install rstacruz/jq-behavior
```

### With CommonJS/AMD
When loading from a module loader like browserify or Require.js, `$.behavior` is not overriden. Instead, it is returned as a value.

```js
var behavior = require('jq-behavior')

behavior('.js-hover-card', function () {
  ...
})
```

### With no module loaders
When loading in a project without jQuery, it's registered as `window.behavior`. If jQuery was found, it'll be available as `jQuery.behavior` (aka, `$.behavior`).

```js
$.behavior('.js-hover-card', function () {
  ...
})
```

<br>

## API

* `$.behavior()`

  > Runs all behaviors.

* `$.behavior(selector)`

  > Runs all behaviors for `selector`.

* `$.behavior(selector, init())`

  > Creates a behavior for `selector` to run the callback `init()`.

* `$.behavior(selector, init(), exit())`

  > Creates a behavior for `selector` to run the callback `init()`. The `exit()` callback will be called once the behavior is triggered again but the element is no longer attached to the DOM.

  
<br>

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

Behaviors solve that.

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

<br>

## Concepts

### Idempotency

You can call `$.behavior()` as much as you like. This will skip any behavior initialization for DOM nodes that have already been initialized. This is done to account for any new elements that may appear in your DOM.

```js
// add more content
$('#content').append(...)

$.behavior()
```

### Turbolinks

You'll notice that document.ready is not friendly for Turbolinks applications. This solves that.

```js
$(function () { $.behavior() })
$(document).on('page:load', function () { $.behavior() })
```

### Cleanups

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

### Cancelling

You can cancel an initialization by returning `false`. This makes it so that the initialization will run again when `init` is triggered again.

This is also available for exit callbacks.

```js
$.behavior('.expandable-nav', function () {
  if ($(this).is(':hidden')) return false

  /* ... */
})
```

### Role attributes

Some recommend [using the role attribute][rsjs] to bind your behaviors. To aid this, you can define behaviors as `@xxxx`, which is shorthand of `[role~="xxxx"]`. (This convention is taken from [jquery-role].)

```js
$.behavior('@hiding-menu', function () {
  /* ... */
})

/* same as $.behavior('[role~="hiding-menu"]', ...) */
```

[rsjs]: https://github.com/rstacruz/rsjs
[jquery-role]: https://github.com/kossnocorp/role

### Testing behaviors

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

<br>

## Thanks

**jq-behavior** © 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/jq-behavior/contributors
