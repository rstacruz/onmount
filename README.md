# onmount

**Run something when a DOM element appears and when it exits.** jQuery optional.

[![Status](https://travis-ci.org/rstacruz/onmount.svg?branch=master)](https://travis-ci.org/rstacruz/onmount "See test builds")


[rsjs]: https://github.com/rstacruz/rsjs

<br>

## Example

Onmount is a safe, reliable, idempotent, and testable way to attach JavaScript behaviors to DOM nodes. 

__Detecting elements:__ This example defines a block of code to be applied to all `.push-button` instances, and another block of code when it's been removed.

```js
$.onmount = require('onmount')

$.onmount('.push-button', function () {
  $(this).on('click', function () {
    alert('working...')
  })
})
```

__Polling:__ Call `$.onmount()` everytime your code changes. The behavior will be applied once ([and only once][idempotent]) per instance, even if *onmount()* is called multiple times.

```js
document.body.innerHTML =
  '<button class="push-button">Do something</button>'

$.onmount()

$(".push-button").click()  //=> 'working...'
```

__jQuery integration:__ If you're using jQuery, you'll want to do this by binding it to every event that may mutate the DOM.

```js
$(function () { $.onmount() })
$(document).on('show.bs closed.bs load page:change', $.onmount)
```

__Cleanups:__ supply a 2nd function parameter to `onmount()` to execute something when the DOM node is first detached from the DOM.

```js
$.onmount('.push-button', function () {
  /* ... */
}, function () {
  alert('button was removed')
})

document.body.innerHTML = ''

$.onmount()
//=> 'button was removed'
```

See [rsjs][rsjs] (Reasonable System for JavaScript Structure) for more info on how this is useful.


<br>

## Usage

```
npm install rstacruz/onmount
bower install rstacruz/onmount
```

* **With CommonJS/AMD:**<br>
  Great with [Browserify].

  ```js
  $.onmount = require('onmount')
  ```

* **With no module loaders:**<br>
  If it's loaded after jQuery, it's loaded as a jQuery plugin (`$.onmount`).

  ```js
  window.onmount(...)   // no jQuery
  $.onmount(...)        // with jquery
  ```

* **With jQuery:**<br>
  Call `$.onmount()` every time your DOM changes. In this example, it's fired on DOM ready, on [Bootstrap events], and on [Turbolinks load].

  ```js
  $(function () { $.onmount() })
  $(document).on('show.bs closed.bs load page:change', $.onmount)
  ```

[Bootstrap events]: http://getbootstrap.com/javascript/
[Turbolinks load]: https://github.com/rails/turbolinks#events
[idempotent]: https://en.wiktionary.org/wiki/idempotent
[Browserify]: http://browserify.org/


<br>

## API

* `$.onmount()`

  > Runs all behaviors.

* `$.onmount(selector)`

  > Runs all behaviors registered for `selector`.

* `$.onmount(selector, init())`

  > Registers a behavior for `selector` to run the callback `init()`.

* `$.onmount(selector, init(b), exit(b))`

  > Registers a behavior for `selector` to run the callback `init()`. The `exit()` callback will be called once the behavior is triggered again but the element is no longer attached to the DOM.
  >
  > The callbacks are passed an object `b`, and  the same object is passed for both `init` and `exit`. This allows them to communicate and keep aware of state.
  >
  > An ID is also provided, `b.id`, which is guaranteed unique for every behavior-element pair.

* `$.onmount.reset()`

  > Clears all defined behaviors. Useful for tests.

* `$.onmount.observe()`

  > Automatically invoke when new DOM elements appear using [MutationObserver] API. Returns `true` if it succeeds.

* `$.onmount.unobserve()`

  > Turns off observation previously turned on via `onmount.observe()`.

<br>

## Automatic observation

You can turn on automatic observation via [MutationObserver] API using `onmount.observe()`. This is not supported in Opera and IE10 (and below).

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
