const {
  CONNECT, DISCONNECT,
  NEW_TASK, UPDATE_TASK, PAUSE_TASK, START_TASK, STOP_TASK,
} = require('./actionTypes')

const connect = (id, name, type) => ({
  type: CONNECT,
  id,
  client: {
    name,
    type,
  },
})

const disconnect = (id) => ({
  type: DISCONNECT,
  id,
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

module.exports = {
  connect,
  disconnect,
  newTask,
  updateTask,
  pauseTask,
  startTask,
  stopTask,
}
