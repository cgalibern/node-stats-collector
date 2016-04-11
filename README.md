## stat example:

```javascript
'use strict'
var Stat = require('./index').Stat
var stat = new Stat('example')
var interval = 100

function createCalculateLoopDelay (interval) {
  var previous = process.hrtime()
  return function () {
    var now = process.hrtime()
    var delay = (now[0] - previous[0]) * 1e3 + (now[1] - previous[1]) / 1e6 - interval
    previous = now
    return delay
  }
}

stat.addStat('loopDelay-'+interval, 'avg', interval, createCalculateLoopDelay(interval))

stat.reportStats(interval * 50, function (value) {
  console.log('stat value: %s', JSON.stringify(value))
})
```

