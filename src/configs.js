const _ = require('lodash')

const configs = (() => {
  this.init = (conf) => {
    _.assign(this, conf)
    delete this.init
  }
  return this
})()

module.exports = configs
