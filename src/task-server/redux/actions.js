const {
  CONNECT, DISCONNECT, RENAME_CLIENT, OBSERVE_TASK, UPDATE_CLIENT_DESCR,
  NEW_TASK, UPDATE_TASK, PAUSE_TASK, START_TASK, STOP_TASK, COMPLETE_TASK,
  RENAME_TASK, ARCHIVE_TASK, UNARCHIVE_TASK, DELETE_TASK,
  EVALUATE, EVALUATED,
} = require('./actionTypes')

const connect = (id, name, type, classId, taskId, configs, priv) => ({
  type: CONNECT,
  id,
  client: {
    name,
    type,
    classId,
    taskId,
    configs,
    private: priv,
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

const observeTask = (clientId, taskId) => ({
  type: OBSERVE_TASK,
  clientId,
  taskId,
})

const updateClientDescr = (id, descr) => ({
  type: UPDATE_CLIENT_DESCR,
  id,
  descr,
})

const newTask = (id, name, optimizerId, evaluatorId) => ({
  type: NEW_TASK,
  id,
  task: {
    name,
    optimizerId,
    evaluatorId,
  },
})

const updateTask = (id, task) => ({
  type: UPDATE_TASK,
  id,
  task,
})

const pauseTask = id => ({
  type: PAUSE_TASK,
  id,
})

const startTask = id => ({
  type: START_TASK,
  id,
})

const stopTask = id => ({
  type: STOP_TASK,
  id,
})

const completeTask = id => ({
  type: COMPLETE_TASK,
  id,
})

const renameTask = (id, name) => ({
  type: RENAME_TASK,
  id,
  name,
})

const archiveTask = id => ({
  type: ARCHIVE_TASK,
  id,
})

const unarchiveTask = id => ({
  type: UNARCHIVE_TASK,
  id,
})

const deleteTask = id => ({
  type: DELETE_TASK,
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
  observeTask,
  updateClientDescr,
  newTask,
  updateTask,
  pauseTask,
  startTask,
  stopTask,
  completeTask,
  renameTask,
  archiveTask,
  unarchiveTask,
  deleteTask,
  evaluate,
  evaluated,
}
