/* global $ */
/* jshint expr: true */

/*
 * <div class='js-expandable'>
 *   This is some content. It is long<span class='js-ellipsis'>...</span>
 *   <span class='js-content'>and some parts can be collapsed.</span>
 *
 *   <button class='js-toggle'>More</button>
 * </div>
 */

$.behavior('.js-expandable', function () {
  var $this = $(this)

  // cached element lookups.
  var $button = $('.js-toggle', this)
  var $content = $('.js-content', this)
  var $ellipsis = $('.js-ellipsis', this)

  // how we store state.
  var expanded = false

  // bind events.
  $this
    .on('click', '.js-toggle', toggle)
    .on('click', '.js-content', close)

  // run on initialize.
  init()

  function init () {
    expanded = $this.hasClass('-expanded')
    expanded ? open() : close()
  }

  function close () {
    $this.removeClass('-expanded')
    $ellipsis.show()
    $content.slideUp()
    $button.html('More...')
    expanded = false
  }

  function open () {
    $this.addClass('-expanded')
    $ellipsis.hide()
    $content.slideDown()
    $button.html('Less')
    expanded = true
  }

  function toggle () {
    return expanded ? close() : open()
  }
})
