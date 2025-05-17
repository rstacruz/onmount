## [v2.0.0]
> May 17, 2025

- Security: Address incomplete string escaping in CSS selectors by escaping both backslashes and double quotes, as flagged by GitHub CodeQL. This prevents malformed selectors and potential injection issues.
- [#210] - Remove support for `onmount.debug`.

[v2.0.0]: https://github.com/rstacruz/onmount/compare/v1.2.1...v2.0.0
[#210]: https://github.com/rstacruz/onmount/issues/210

## [v1.2.1]
> Mar 28, 2016

* [#76] - Fix errors in exit handlers called via `onmount.teardown()`.

[v1.2.1]: https://github.com/rstacruz/onmount/compare/v1.2.0...v1.2.1

## [v1.2.0]
> Mar 15, 2016

For Turbolinks 5 users, please see the updated [Using with Turbolinks](http://ricostacruz.com/onmount/turbolinks.html) documentation. You will need to use `onmount.teardown()`.

* Add `onmount.teardown()`.
* Improve compatibility with Turbolinks 5.

[v1.2.0]: https://github.com/rstacruz/onmount/compare/v1.1.0...v1.2.0

## [v1.1.0]
> Oct  1, 2015

* Add `onmount.debug`.

## [v1.0.2]
> Jul  1, 2015

* Fix devDependencies being wrongfully installed.
* Update tests.

## [v1.0.1]
> Jul  1, 2015

* Update keywords and description
* Allow overriding of MutationObserver via polyfill (`onmount.MutationObserver = ..`)

## v1.0.0
> Jun 30, 2015

* Initial release.

[v1.0.1]: https://github.com/rstacruz/onmount/compare/v1.0.0...v1.0.1
[v1.0.2]: https://github.com/rstacruz/onmount/compare/v1.0.1...v1.0.2
[v1.1.0]: https://github.com/rstacruz/onmount/compare/v1.0.2...v1.1.0
[#76]: https://github.com/rstacruz/onmount/issues/76
