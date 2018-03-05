/* eslint-env jest */

const onmount = require('../index')
const { el } = require('../lib/test_helpers')

describe('multiple behaviors', () => {
  let div

  beforeEach(() => {
    onmount('.multi-behavior', function () {
      this.innerHTML += '(1)'
    })

    onmount('.multi-behavior', function () {
      this.innerHTML += '(2)'
    })

    div = el('div', { 'class': 'multi-behavior' })
  })

  afterEach(() => {
    onmount.reset()
  })

  it('runs both behaviors', () => {
    onmount()
    expect(div.innerHTML).toEqual('(1)(2)')
  })

  it('runs both behaviors when calling onmount(selector)', () => {
    onmount('.multi-behavior')
    expect(div.innerHTML).toEqual('(1)(2)')
  })
})
