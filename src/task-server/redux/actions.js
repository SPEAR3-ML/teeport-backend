const {
  CONNECT, DISCONNECT, RENAME_CLIENT,
  NEW_TASK, UPDATE_TASK, PAUSE_TASK, START_TASK, STOP_TASK, COMPLETE_TASK,
  EVALUATE, EVALUATED,
} = require('./actionTypes')

const connect = (id, name, type, taskId) => ({
  type: CONNECT,
  id,
  client: {
    name,
    type,
    taskId,
  },
})

const disconnect = (id) => ({
  type: DISCONNECT,
  id,
})

const renameClient = (id, name) => ({
  type: RENAME_CLIENT,
  id,
  name,
})

const newTask = (id, name, algorithmId, evaluatorId) => ({
  type: NEW_TASK,
  id,
  task: {
    name,
    algorithmId,
    evaluatorId,
  },
})

const updateTask = (id, task) => ({
  type: UPDATE_TASK,
  id,
  task,
})

const pauseTask = (id, task) => ({
  type: PAUSE_TASK,
  id,
})

const startTask = (id, task) => ({
  type: START_TASK,
  id,
})

const stopTask = (id, task) => ({
  type: STOP_TASK,
  id,
})

const completeTask = (id, task) => ({
  type: COMPLETE_TASK,
  id,
})

const evaluate = (taskId, data) => ({
  type: EVALUATE,
  taskId,
  data,
})

const evaluated = (taskId, data) => ({
  type: EVALUATED,
  taskId,
  data,
})

module.exports = {
  connect,
  disconnect,
  renameClient,
  newTask,
  updateTask,
  pauseTask,
  startTask,
  stopTask,
  completeTask,
  evaluate,
  evaluated,
}
