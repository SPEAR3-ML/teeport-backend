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
  getClients,
  closeClient,
  renameClient,
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
  closeClient,
  renameClient,
}
