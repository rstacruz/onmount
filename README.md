# jq-behavior

Provides an safe, reliable, idempotent, and testable way to attach JavaScript
behaviors to DOM node using jQuery.

[![Status](https://travis-ci.org/rstacruz/jq-behavior.svg?branch=master)](https://travis-ci.org/rstacruz/jq-behavior "See test builds")

```js
$.behavior('.push-button', function () {
  $(this).on('click', function () {
    alert('working...')
  })
})
```

You can then trigger all defined behaviors for all applicable elements using `behavior()`:

```js
$(function () {
  $.behavior()
})
```

This is idempotent, so you can call it as many times as you like.

```js
$(function () { $.behavior() })
$(document).on('show.bs.modal', function () { $.behavior() })
$(document).on('page:load', function () { $.behavior() })
```

Or you can trigger just one:

```js
$.behavior('.push-button')
```

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
    $('.js-expandable-nav .more').show();
    $('.js-expandable-nav button').hide();
  })
})
```

However, you have a few problems with this approach.

* __It's not testable.__ You can't make unit tests from this code.
* __Assumes just one instance.__ When there are 2 .js-expandable-nav elements in the page, this will break.
* __It doesn't work in modal dialogs.__ Since it works in `$(function() { ... })`, it doesn't work on elements loaded later.

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
  var $more   = $this.find('more')

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
$("#content").append(...)

$.behavior()
```

### Turbolinks

You'll notice that document.ready is not friendly for Turbolinks applications. This solves that.

```js
$(function () { $.behavior() })
$(document).on('page:load', function () { $.behavior() })
```

### Using with Commonjs/AMD

When loading from a module loader like browserify or Require.js, `$.behavior` is not overriden. Instead, it is returned as a value.

```js
var behavior = require('jq-behavior')

behavior('.js-hover-card', function () {
  ...
})
```

### Cancelling

You can cancel an initialization by returning `false`. This makes it so that the initialization will run again when `init` is triggered again.

```js
$.behavior('.expandable-nav', function () {
  if ($(this).is(':hidden')) return false

  /* ... */
})
```

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
