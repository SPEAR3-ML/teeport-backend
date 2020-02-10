const { connect, disconnect } = require('./connect')
const { evaluate, evaluated, done } = require('./evaluate')
const monitor = require('./monitor')

module.exports = {
  connect,
  disconnect,
  evaluate,
  evaluated,
  done,
  monitor,
}
