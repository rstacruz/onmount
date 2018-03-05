/* eslint-env jest */

var onmount = require('../index')
var { el, remove } = require('../lib/test_helpers')

describe('detectMutate', () => {
  let div

  beforeEach(() => {
    onmount('.my-behavior', function () {
      this.innerHTML += '(on)'
    }, function () {
      this.innerHTML += '(off)'
    }, { detectMutate: true })
    div = el('div', { 'class': 'my-behavior' })
  })

  afterEach(() => {
    remove(div)
    onmount.reset()
  })

  it('works as is', () => {
    onmount('.my-behavior')
    expect(div.innerHTML).toEqual('(on)')
  })

  it('detects mutations', () => {
    onmount('.my-behavior')

    // Mutate it, it should trigger an exit
    div.className = 'not-my-behavior'
    onmount('.my-behavior')

    expect(div.innerHTML).toEqual('(on)(off)')
  })
})
