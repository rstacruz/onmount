/* eslint-env jest */

const onmount = require('../index')
const { el } = require('../lib/test_helpers')

describe('tests', () => {
  beforeEach(() => {
    onmount('.their-behavior', function () {
      this.innerHTML += '(on)'
    }, function () {
      this.innerHTML += '(off)'
    })
  })

  afterEach(() => {
    onmount.reset()
  })

  it('calls the unloader', () => {
    const div = el('div', { 'class': 'their-behavior' })
    onmount()
    div.parentNode.removeChild(div)
    onmount()

    expect(div.innerHTML).toEqual('(on)(off)')
  })

  it('using onmount.teardown()', () => {
    const div = el('div', { 'class': 'their-behavior' })
    onmount()
    onmount.teardown()

    expect(div.innerHTML).toEqual('(on)(off)')
  })

  it('gets double-applied intentionally', () => {
    const div = el('div', { 'class': 'their-behavior' })
    onmount()
    div.parentNode.removeChild(div)
    onmount()
    document.body.appendChild(div)
    onmount()

    expect(div.innerHTML).toEqual('(on)(off)(on)')
  })
})
