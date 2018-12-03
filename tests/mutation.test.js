/* eslint-env jest */

const onmount = require('../dist/onmount')
const { el, remove } = require('../lib/test_helpers')

if (typeof MutationObserver === 'undefined') {
  describe('mutation observer', () => {
    it('not supported on this platform', () => {
      expect(1).toEqual(1)
    })
  })
} else {
  describe('mutation observer', () => {
    let div

    beforeEach(() => {
      onmount.observe()
    })

    afterEach(() => {
      onmount.unobserve()
      onmount.reset()
      remove(div)
    })

    it('works', function () {
      return new Promise((resolve, reject) => {
        onmount.observe()

        onmount('.observed-behavior', function () {
          this.innerHTML += '(on)'
        })

        const div = el('div', { 'class': 'observed-behavior' })

        setTimeout(() => {
          expect(div.innerHTML).toEqual('(on)')
          resolve()
        })
      })
    })
  })

  it('works with offmount', function () {
    return new Promise((resolve, reject) => {
      onmount.observe()

      onmount('.observed-behavior', function () {
        this.innerHTML += '(on)'
      }, function () {
        this.innerHTML += '(off)'
      })

      const div = el('div', { 'class': 'observed-behavior' })

      setTimeout(() => {
        expect(div.innerHTML).toEqual('(on)')
        remove(div)

        setTimeout(() => {
          expect(div.innerHTML).toEqual('(on)(off)')
          resolve()
        })
      })
    })
  })
}
