const { connect, disconnect } = require('./connect')
const { evaluate, evaluated, done } = require('./evaluate')
const monitor = require('./monitor')
const { getTasks, newTask, pauseTask, startTask, stopTask, completeTask } = require('./task')
const { getClients } = require('./client')

module.exports = {
  connect,
  disconnect,
  evaluate,
  evaluated,
  done,
  monitor,
  getTasks,
  newTask,
  pauseTask,
  startTask,
  stopTask,
  completeTask,
  getClients,
}
