# Using with Turbolinks

onmount is a perfect fit with projects that use Turbolinks. You'll notice that jQuery's `document` `ready` event is not friendly for Turbolinks applications. You should call `$.onmount()` when Turbolinks changes pages.

For Turbolinks 2 and below, the event is `page:change`:

```js
$(document).on('ready page:change', function () { $.onmount() })
```

For Turbolinks 5, the event is `turbolinks:load`:

```js
$(document).on('ready turbolinks:load', function () { $.onmount() })
```
