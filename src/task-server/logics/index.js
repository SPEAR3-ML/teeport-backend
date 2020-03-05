const { connect, disconnect } = require('./connect')
const { evaluate, evaluated } = require('./evaluate')
const { process, processed } = require('./process')
const monitor = require('./monitor')
const {
  getTasks, getTasksOverview, getTask,
  newTask, pauseTask, startTask, stopTask, completeTask, renameTask,
  archiveTask, unarchiveTask, deleteTask,
} = require('./task')
const {
  getClients, getClient,
  closeClient,
  renameClient,
  observeTask,
} = require('./client')

module.exports = {
  connect,
  disconnect,
  evaluate,
  evaluated,
  process,
  processed,
  monitor,
  getTasks,
  getTasksOverview,
  getTask,
  newTask,
  pauseTask,
  startTask,
  stopTask,
  completeTask,
  renameTask,
  archiveTask,
  unarchiveTask,
  deleteTask,
  getClients,
  getClient,
  closeClient,
  renameClient,
  observeTask,
}
