## stat example:

```javascript
'use strict'
var Stat = require('node-stats-collector').Stat
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

// add custom stat
stat.addStat('loopDelay-'+interval, 'avg', interval, createCalculateLoopDelay(interval))

// add standard load average stat
stat.initLoadAvg(1000)

// add standard freemem average stat (in Kb)
stat.initFreeMem(1000, 1e3)

// add standard totalMem average stat (in Mb)
// stat.initTotalMem(1000, 1e6)

/* stat.reportStats(reportInterval, precision, reportFunction)
 * or
 * stat.reportStats(reportInterval, reportFunction)
 * same but use default precision = 2
 */

stat.reportStats(interval * 50, function (value) {
  console.log('stat value: %s', JSON.stringify(value))
})
```

