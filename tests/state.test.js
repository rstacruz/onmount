/* eslint-env jest */

const onmount = require('../index')
const { el, remove } = require('../lib/test_helpers')

describe('state', () => {
  let div, state

  beforeEach(() => {
    onmount('.our-behavior', function (b) {
      state = b
      b.number = 10
    }, function (b) {
      b.number += 1
    })

    // Trigger the on-mount handler
    div = el('div', { 'class': 'our-behavior' })
    onmount()

    // Trigger the on-unmount handler
    remove(div)
    onmount()
  })

  afterEach(() => {
    remove(div)
    onmount.reset()
  })

  it('has an id', () => {
    expect(state['id']).toMatch(/^c\d+$/)
  })

  it('passes the selector', () => {
    expect(state.selector).toEqual('.our-behavior')
  })

  it('works', () => {
    expect(state.number).toEqual(11)
  })
})
