module.exports = function around (before, after) {
  return function (fn) {
    var ctx
    try {
      ctx = before && before()
      if (!Array.isArray(ctx)) ctx = [ ctx ]
      fn.apply(this, ctx)
    } finally {
      after && after.apply(this, ctx)
    }
  }
}
