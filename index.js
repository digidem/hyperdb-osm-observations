var streamify = require('./lib/streamify')

module.exports = Observations

function Observations (db) {
  if (!(this instanceof Observations)) return new Observations(db)
}

Observations.prototype.query = function (bbox, cb) {
  return streamify(cb, function (emit) {
    if (!bbox || !Array.isArray(bbox)) {
      return emit(new Error('bbox must be of the form [[minLat,maxLat],[minLon,maxLon]]'))
    }
    emit(null)
  })
}
