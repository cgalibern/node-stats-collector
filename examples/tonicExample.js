'use strict'
var Stat = require('node-stats-collector').Stat
var stat = new Stat('demo-example')

function createCalculateLoopDelay (interval) {
  var previous = process.hrtime()
  return function () {
    var now = process.hrtime()
    var delay = (now[0] - previous[0]) * 1e3 + (now[1] - previous[1]) / 1e6 - interval
    previous = now
    return delay
  }
}

// add stat with custom compute value
stat.addStat('loopDelay-100', 'avg', 100, createCalculateLoopDelay(100))

// add loadavg stat from pre defined compute values,
// take a value every seconds (1000), for memory convert byte to MB (1e6)
stat.initLoadAvg(1000)
stat.initFreeMem(1000, 1e6)
stat.initTotalMem(1000, 1e6)

// report stat values every 5 seconds, with 1 decimal-Length
stat.reportStats(5000, 2, function (value) {
  console.log('stat value: %s', JSON.stringify(value))
})
