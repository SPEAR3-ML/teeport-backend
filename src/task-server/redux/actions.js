const {
  CONNECT, DISCONNECT,
  NEW_TASK, UPDATE_TASK,
} = require('./actionTypes')

const connect = (id) => ({
  type: CONNECT,
  id,
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

module.exports = {
  connect,
  disconnect,
  newTask,
  updateTask,
}
