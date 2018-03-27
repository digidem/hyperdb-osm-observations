var through = require('through2')

module.exports = streamify

function streamify (cb, f) {
  var res = !cb ? through.obj() : []

  function emit (data) {
    if (data instanceof Error) {
      if (cb) return cb(data)
      else res.emit('error', data)
    }
    else if (data) {
      res.push(data)
    } else {
      if (cb) return cb(null, res)
      else res.push(data)
    }
  }

  process.nextTick(f, emit)

  if (!cb) return res
}
