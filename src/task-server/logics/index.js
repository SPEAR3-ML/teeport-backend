const { connect, disconnect } = require('./connect')
const { evaluate, evaluated } = require('./evaluate')
const { process, processed } = require('./process')
const monitor = require('./monitor')
const {
  getTasks, getTasksOverview, getTask, importTasks,
  newTask, pauseTask, startTask, stopTask, completeTask, renameTask,
  newBenchmarkTask,
  archiveTask, unarchiveTask, deleteTask, updateTaskDescr,
} = require('./task')
const {
  getClients, getClient,
  closeClient,
  renameClient,
  observeTask,
  updateClientDescr,
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
  importTasks,
  pauseTask,
  startTask,
  stopTask,
  completeTask,
  renameTask,
  newBenchmarkTask,
  archiveTask,
  unarchiveTask,
  deleteTask,
  updateTaskDescr,
  getClients,
  getClient,
  closeClient,
  renameClient,
  observeTask,
  updateClientDescr,
}
