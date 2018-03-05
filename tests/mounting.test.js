/* eslint-env jest */

const onmount = require('../dist/onmount')
const { el } = require('../lib/test_helpers')

describe('mounting', () => {
  let div

  beforeEach(() => {
    onmount('.my-behavior', function () { this.innerHTML += '(on)' })
    div = el('div', { 'class': 'my-behavior' })
  })

  afterEach(() => {
    if (div) div.parentNode.removeChild(div)
    onmount.reset()
  })

  it('onmount(selector)', () => {
    onmount('.my-behavior')
    expect(div.innerHTML).toEqual('(on)')
  })

  it('onmount(selector) idempotency', () => {
    onmount('.my-behavior')
    onmount('.my-behavior')
    onmount('.my-behavior')
    expect(div.innerHTML).toEqual('(on)')
  })

  it('onmount()', () => {
    onmount()
    expect(div.innerHTML).toEqual('(on)')
  })
})
