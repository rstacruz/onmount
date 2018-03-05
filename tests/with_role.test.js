/* eslint-env jest */

const onmount = require('../dist/onmount')
const { el, remove } = require('../lib/test_helpers')

describe('with role', () => {
  let div

  beforeEach(() => {
    onmount('[role~="your-behavior"]', function () {
      this.innerHTML += '(on)'
    })

    div = el('div', { role: 'your-behavior' })
  })

  afterEach(() => {
    remove(div)
    onmount.reset()
  })

  it('works', () => {
    onmount()
    expect(div.innerHTML).toEqual('(on)')
  })

  it('works with onmount(selector)', () => {
    onmount('[role~="your-behavior"]')
    expect(div.innerHTML).toEqual('(on)')
  })
})
