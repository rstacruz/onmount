# jq-behavior

Provides an safe, reliable, idempotent, and testable way to attach JavaScript
behaviors to DOM node using jQuery.

[![Status](https://travis-ci.org/rstacruz/jq-behavior.svg?branch=master)](https://travis-ci.org/rstacruz/jq-behavior "See test builds")

```js
$.behavior('NAME', function () {
  /* code here */
  $(this).on('click', function () {
    alert('working...')
  })
})
```

The code above is syntactic sugar for:

```js
// creates an 'init' event handler for document with the tag 'NAME'.
// this will be ran when calling $(document).trigger('init')

$(document).on('init.NAME', function () {
  $('.js-NAME').each(function () {
    var $this = $(this)

    if ($this.data('behavior:NAME:loaded')) return

    /* code here */
    $(this).on('click', function () {
      alert('working...')
    })

    $this.data('behavior:NAME:loaded', true)
  })
})
```

This achieves a few things:

* __Run on document load__: Assuming you also have `$(function() { $(document).trigger('init') })` (which you should), the behavior initializers will run on document load.

* __Idempotency__: The `data('behavior:NAME:loaded')` guard makes your initialization idempotent, so you can call `$(document).trigger('init')` as many times as you like.

* __Work with dynamic content__: Because it's idempotent, you can call it as many times as you like, such as when dynamic content is placed (like a modal dialog).

* __Testable__: You can create unit tests for your jQuery code by doing `$(document).trigger('init.NAME')` in your tests.

* __Turbolinks-compatible__: Since your initialization is now idempotent, you can use it with Turbolinks. Simply trigger `init` when the page loads.

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

$(function () { $(document).trigger('init') })
$(document).on('show.bs.modal', function () { $(document).trigger('init') })

/*
 * attach a behavior to `.js-expandable-nav`
 */

$.behavior('expandable-nav', function () {
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

You can call `$(document).trigger('init')` as much as you like. This will skip any behavior initialization for DOM nodes that have already been initialized. This is done to account for any new components in your DOM.

```js
// add more content
$("#content").append(...)

$(document).trigger('init')
```

### Different selectors

By default, the behaviors are attached to `.js-{name}`. To override this, pass the `selector` option.

```js
$.behavior('expandable-nav', { selector: '.nav' }, function () {
})
```

### Default selector pattern

The default pattern is `.js-{name}`. To override this, can you can use `behavior.selector`:

```js
$.behavior.selector = '[role~="{name}"]'
```

### Using with Commonjs/AMD

When loading from a module loader like browserify or Require.js, `$.behavior` is not overriden. Instead, it is returned as a value.

```js
var behavior = require('jq-behavior')

behavior('hover-card', function () {
  ...
})
```

### Cancelling

You can cancel an initialization by returning `false`. This makes it so that the initialization will run again when `init` is triggered again.

```js
$.behavior('expandable-nav', function () {
  if ($(this).is(':hidden')) return false

  /* ... */
})
```

### Testing behaviors

Events are attached as `init.NAME` to the `document` (where *NAME* is your behavior name). You can trigger it again in a test.

```js
var $div

beforeEach(function () {
  $div = $("<div class='js-user-profile' data-user='rstacruz'>")
    .appendTo('body')

  $(document).trigger('init.user-profile')
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
