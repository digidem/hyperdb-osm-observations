# hyperdb-osm-observations

> Create and manage observations of OSM data.

For the purposes of this module, an "observation" is defined as a record of some
observed fact about a geospatial object at a specific point in time. To this
end, every observation is associated with another OSM element, and has a
timestamp set to the local time at its moment of creation.

This module provides some convenience functions for retrieving this data.

## Usage

```js
var hyperdb = require('hyperdb')
var hyperosm = require('hyperdb-osm')
var osmObservations = require('hyperdb-osm-observations')
var geo = require('grid-point-store')
var memdb = require('memdb')
var ram = require('random-access-memory')

var db = hyperdb(ram, { valueEncoding: 'json' })
var osm = hyperosm({
  db: db,
  index: memdb(),
  pointstore: geo(memdb())
})
var obs = osmObservations(osm)

var node = {
  type: 'node',
  lat: '100',
  lon: '45'
}
db.create(node, function (_, theNode) {
  var o = {
    type: 'observation',
    observedId: theNode.id,
    lat: '23',
    lon: '45'
  }
  db.create(o, function () {
    obs.query([[-200,200],[-200,200]], function (err, observations) {
      console.log('query', observations)
    })
    obs.observations(res.id, function (err, observations) {
      console.log('get', observations)
    })
  })
})
```

outputs

```
query [
  {
    type: 'observation',
    observedId: '...',
    lat: '100',
    lon: '45',
    timestamp: '...',
    id: '...',
    version: '...'
  }
]
get [
  {
    type: 'observation',
    observedId: '...',
    lat: '100',
    lon: '45',
    timestamp: '...',
    id: '...',
    version: '...'
  }
]
```

## API

```js
var osmObservations = require('hyperdb-osm-observations')
```

### var obs = osmObservations(db)

Create a new observations instance from a hyperdb `db`.

### obs.create(elm, cb)

Create a new observation. The object `elm` must include the following
properties:

- `observedId` (string): the ID of the OSM element being observed.
- `lat` (string): the latitude coordinate of the observation.
- `lon` (string): the longitude coordinate of the observation.

`cb` is called as `cb(error, observationElement)`.

### var rs = obs.query(bbox[, cb])

Query the database for all observations in the bounding box `bbox`.

If `cb` is given it will be called with all results; otherwise the readable
stream `rs` is returned and will emit results as they become available.

Note that this only returns `observation` elements. You can use something like
[pull-many](https://github.com/pull-stream/pull-many) to combine this with the
[hyperdb-osm#query](https://github.com/digidem/hyperdb-osm#var-rs--osmquerybbox-cb):

```js
var pullify = require('stream-to-pull-stream')
var pull = require('pull-stream')
var many = require('pull-many')

...

pull(
  pull.many([
    pullify.source(obs.query(bbox)),
    pullify.source(osm.query(bbox))
  ]),
  pull.drain(function (elm) {
    console.log('got element', elm.version)
  })
)
```

### var rs = obs.observations(id[, cb])

Retrieve all observations linked to the OSM element with id `id`.

If `cb` is given it will be called with all results; otherwise the readable
stream `rs` is returned and will emit results as they become available.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install hyperdb-osm-observations
```

## License

ISC
