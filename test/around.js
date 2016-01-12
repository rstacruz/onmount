module.exports = function around (before, after) {
  return function (fn) {
    var ctx
    try {
      ctx = before && before()
      fn(ctx)
    } finally {
      after && after(ctx)
    }
  }
}
