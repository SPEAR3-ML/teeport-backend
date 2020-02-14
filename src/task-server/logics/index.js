const { connect, disconnect } = require('./connect')
const { evaluate, evaluated } = require('./evaluate')
const monitor = require('./monitor')
const {
  getTasks, getTask,
  newTask, pauseTask, startTask, stopTask, completeTask,
} = require('./task')
const { getClients } = require('./client')

module.exports = {
  connect,
  disconnect,
  evaluate,
  evaluated,
  monitor,
  getTasks,
  getTask,
  newTask,
  pauseTask,
  startTask,
  stopTask,
  completeTask,
  getClients,
}
