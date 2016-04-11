'use strict'

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

  reportStats (interval, fn) {
    setInterval(() => {
      let stat = {}
      for (let statname of this.list()) {
        let value = this[this._methods[statname]](statname)
        stat[statname] = value
        this.reset(statname)
      }
      fn(stat)
    }, interval)
  }
}

module.exports = {
  Stat: Stat
}
