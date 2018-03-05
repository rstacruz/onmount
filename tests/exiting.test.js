/* eslint-env jest */

const onmount = require('../index')
const { el, remove } = require('../lib/test_helpers')

describe('tests', () => {
  let div

  beforeEach(() => {
    onmount('.their-behavior', function () {
      // Triggered on load
      this.innerHTML += '(on)'
    }, function () {
      // Triggered on unload
      this.innerHTML += '(off)'
    })
  })

  afterEach(() => {
    remove(div)
    onmount.reset()
  })

  it('calls the unloader', () => {
    div = el('div', { 'class': 'their-behavior' })
    onmount()

    // Unload it via polling onmount()
    remove(div)
    onmount()

    expect(div.innerHTML).toEqual('(on)(off)')
  })

  it('using onmount.teardown()', () => {
    div = el('div', { 'class': 'their-behavior' })
    onmount()

    // Unload it via .teardown()
    onmount.teardown()

    expect(div.innerHTML).toEqual('(on)(off)')
  })

  it('gets double-applied intentionally', () => {
    // Load it the first time
    div = el('div', { 'class': 'their-behavior' })
    onmount()

    // Remove it (should trigger unload)
    remove(div)
    onmount()

    // Load it again (should trigger load again)
    document.body.appendChild(div)
    onmount()

    expect(div.innerHTML).toEqual('(on)(off)(on)')
  })
})
