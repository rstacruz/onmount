# onmount

> Run something when a DOM element appears and when it exits.

[![Status](https://travis-ci.org/rstacruz/onmount.svg?branch=master)](https://travis-ci.org/rstacruz/onmount "See test builds")

<br>

**Detecting elements:**
Run something to initialize an element on its first appearance.

```js
$.onmount = require('onmount')
$.onmount('.push-button', function () {
  $(this).on('click', function () {
    alert('working...')
  })
})
```

<br>

**Polling for changes:**
Call `$.onmount()` everytime your code changes. ([automatic?](#automatic-observation))

```js
$('<button class="push-button">Do something</button>')
  .appendTo('body')

$.onmount()

$(".push-button").click()  //=> 'working...'
```

<br>

**jQuery integration:**
jQuery is optional; use it to poll on popular events. ([1][Bootstrap events] [2][Turbolinks load])

```js
$(document)
  .ready($.onmount)
  .on('show.bs closed.bs load page:change', $.onmount)
```

<br>

**Cleanups:**
Supply a 2nd function to *onmount()* to execute something when the node is first detached.

```js
$.onmount('.push-button', function () {
  /*...*/
}, function () {
  alert('button was removed')
})

document.body.innerHTML = ''

$.onmount() //=> 'button was removed'
```

<br>

## What for?

Onmount is a safe, reliable, idempotent, and testable way to attach JavaScript behaviors to DOM nodes. It's great for common websites that are not Single-Page Apps. Read:

- [Premise](docs/docs.md#premise)
- [rsjs][rsjs] (Reasonable System for JavaScript Structure)

<br>

## Usage

```
npm install rstacruz/onmount
bower install rstacruz/onmount
```

```js
// With CommonJS/AMD (ie, Browserify):
   onmount = require('onmount')
   
// with no module loaders:
   window.onmount
  
// with jQuery:
   $.onmount
```

[Bootstrap events]: http://getbootstrap.com/javascript/
[Turbolinks load]: https://github.com/rails/turbolinks#events
[idempotent]: https://en.wiktionary.org/wiki/idempotent
[Browserify]: http://browserify.org/


<br>

## API

* `onmount()`

  > Runs all behaviors.

* `onmount(selector)`

  > Runs all behaviors registered for `selector`.

* `onmount(selector, init())`

  > Registers a behavior for `selector` to run the callback `init()`.

* `onmount(selector, init(b), exit(b))`

  > Registers a behavior for `selector` to run the callback `init()`. The `exit()` callback will be called once the behavior is triggered again but the element is no longer attached to the DOM.
  >
  > The callbacks are passed an object `b`, and  the same object is passed for both `init` and `exit`. This allows them to communicate and keep aware of state.
  >
  > An ID is also provided, `b.id`, which is guaranteed unique for every behavior-element pair.

* `onmount.reset()`

  > Clears all defined behaviors. Useful for tests.

* `onmount.observe()`

  > Automatically invoke when new DOM elements appear using MutationObserver API. Returns `true` if it succeeds.

* `onmount.unobserve()`

  > Turns off observation previously turned on via `onmount.observe()`.

<br>

## Automatic observation

You can turn on automatic observation via the [MutationObserver] API. Not supported in Opera and IE10 and below.

```js
$.onmount.observe()
```

Considering not all browsers support this, you can set up fallbacks via:

```js
if (!$.onmount.observe()) {
  $(document)
    .ready($.onmount)
    .on('show.bs hide.bs load', $.onmount)
}
```

<br>

## Read more

Documentation:

- [Premise](docs/docs.md#premise)
- [Idempotency](docs/docs.md#idempotency)
- [Turbolinks](docs/docs.md#turbolinks)
- [Performing cleanups](docs/docs.md#performing-cleanups)
- [Cancelling](docs/docs.md#cancelling)
- [Role attributes](docs/docs.md#role-attributes)
- [Testing behaviors](docs/docs.md#testing-behaviors)
- [Unique IDs](docs/docs.md#unique-ids)

Examples:

- [Simple example](examples/simple.js)
- [Expandable block example](examples/expandable.js)

<br>

## Thanks

**onmount** © 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/onmount/contributors
[MutationObserver]: https://developer.mozilla.org/en/docs/Web/API/MutationObserver
[rsjs]: https://github.com/rstacruz/rsjs
