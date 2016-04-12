'use strict'

const os = require('os')

class Stat {
  constructor (name) {
    this._name = name
    this._stats = {}
    this._methods = {}
  }

  get name () {
    return this._name
  }

  list () {
    return Object.keys(this._stats)
  }

  declare (statname, method) {
    this._stats[statname] = []
    this._methods[statname] = method
  }

  pushStat (statname, value) {
    this._stats[statname].push(value)
  }

  values (statname) {
    return this._stats[statname]
  }

  avg (statname) {
    let avg, s
    s = this._stats[statname]
    avg = s.length ? s.reduce((a, b) => { return a + b }) / s.length : 0
    return avg
  }

  reset (statname) {
    this._stats[statname] = []
  }

  addStat (statname, method, interval, fn) {
    this.declare(statname, method)
    setInterval(() => {
      let val = fn()
      this.pushStat(statname, val)
    }, interval)
  }

  reportStats (interval, decimalLength, fn) {
    if (!fn) {
      fn = decimalLength
      decimalLength = 2
    }
    setInterval(() => {
      let stat = {}
      for (let statname of this.list()) {
        let value = this[this._methods[statname]](statname)
        stat[statname] = value.toFixed(decimalLength)
        this.reset(statname)
      }
      fn(stat)
    }, interval)
  }

  initLoadAvg (interval) {
    this.declare('load1', 'avg')
    this.declare('load5', 'avg')
    this.declare('load15', 'avg')
    setInterval(() => {
      let loadAvg = os.loadavg()
      this.pushStat('load1', loadAvg[0])
      this.pushStat('load5', loadAvg[1])
      this.pushStat('load15', loadAvg[2])
    }, interval)
  }

  initFreeMem (interval, unit) {
    if (!unit) {
      // default unit to 1KB
      unit = 1e3
    }
    let statname = 'freeMem'
    this.declare(statname, 'avg')
    setInterval(() => {
      let value = os.freemem() / unit
      this.pushStat(statname, value)
    }, interval)
  }

  initTotalMem (interval, unit) {
    if (!unit) {
      // default unit to 1KB
      unit = 1e3
    }
    let statname = 'totalMem'
    this.declare(statname, 'avg')
    setInterval(() => {
      let value = os.totalmem() / unit
      this.pushStat(statname, value)
    }, interval)
  }

}

module.exports = {
  Stat: Stat
}
