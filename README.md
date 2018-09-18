# onmount

<!-- {.massive-header} -->

Run something when a DOM element appears and when it exits.<br>
No dependencies. Legacy IE compatible. 1kb .min.gz.

[![Status](https://travis-ci.org/rstacruz/onmount.svg?branch=master)](https://travis-ci.org/rstacruz/onmount 'See test builds')

## Overview

### Detecting elements

Run something to initialize an element on its first appearance.

```js
onmount = require('onmount')

onmount('.push-button', function() {
  $(this).on('click', function() {
    alert('working...')
  })
})
```

> _See: [Premise](/docs/premise.md)_

### Using with React

:tada: If you're looking to use Onmount to mount React components, check out [Remount] instead.

### Polling for changes

Call `$.onmount()` everytime your code changes.

```js
$('<button class="push-button">Do something</button>').appendTo('body')

$.onmount()

$('.push-button').click() //=> 'working...'
```

> _See: [Idempotency](/docs/idempotency.md)_

### jQuery integration

jQuery is optional; use it to poll on popular events.

```js
$(document).on('ready show.bs closed.bs load page:change', function() {
  $.onmount()
})
```

> _See: [API](/docs/api.md)_

### Cleanups

Supply a 2nd function to _onmount()_ to execute something when the node is first detached.

```js
$.onmount(
  '.push-button',
  function() {
    /*...*/
  },
  function() {
    alert('button was removed')
  }
)

document.body.innerHTML = ''

$.onmount() //=> 'button was removed'
```

> _See: [Cleanups](/docs/cleanup.md)_

## What for?

Onmount is a safe, reliable, idempotent, and testable way to attach JavaScript behaviors to DOM nodes. It's great for common websites that are not Single-Page Apps. Read more on its [premise and motivation](docs/premise.md).

[rsjs][rsjs] (Reasonable System for JavaScript Structure) is a great standard that onmount fits perfectly into.

## Usage

Onmount is available via [npm](https://www.npmjs.com/package/onmount) and Bower.

```
npm install onmount
bower install onmount
```

It can be used as a CommonJS module or on its own. It doesn't require jQuery, but if jQuery is found, it'll attach itself to it as `$.onmount`.

```js
onmount = require('onmount') // With CommonJS (ie, Browserify)
window.onmount // with no module loaders:
$.onmount // with jQuery
```

[bootstrap events]: http://getbootstrap.com/javascript/
[turbolinks load]: https://github.com/rails/turbolinks#events
[idempotent]: https://en.wiktionary.org/wiki/idempotent
[browserify]: http://browserify.org/

## API

> _See: [API](docs/api.md)_

## Browser compatibility

All modern browsers and IE8+. For legacy IE, use it with jQuery 1.x.

## Examples

Examples are available in the source repo. [See examples →](https://github.com/rstacruz/onmount/examples)

## Thanks

**onmount** © 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[mit]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/onmount/contributors
[rsjs]: https://github.com/rstacruz/rsjs

[![](https://img.shields.io/badge/%E2%9C%93-collaborative_etiquette-brightgreen.svg)](http://git.io/col)

[remount]: https://github.com/rstacruz/remount
