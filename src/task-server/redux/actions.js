const {
  CONNECT, DISCONNECT, RENAME_CLIENT, OBSERVE_TASK, UPDATE_CLIENT_DESCR,
  IMPORT_TASKS, NEW_TASK, UPDATE_TASK, PAUSE_TASK, START_TASK, STOP_TASK, COMPLETE_TASK,
  RENAME_TASK, NEW_BENCHMARK_TASK, ARCHIVE_TASK, UNARCHIVE_TASK, DELETE_TASK, UPDATE_TASK_DESCR,
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

const importTasks = tasks => ({
  type: IMPORT_TASKS,
  tasks,
})

const newTask = (id, configs, optimizerId, evaluatorId) => ({
  type: NEW_TASK,
  id,
  task: {
    configs,
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

const newBenchmarkTask = (id, configs, optimizerId, evaluatorId) => ({
  type: NEW_BENCHMARK_TASK,
  id,
  task: {
    configs,
    optimizerId,
    evaluatorId,
  },
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

const updateTaskDescr = (id, descr) => ({
  type: UPDATE_TASK_DESCR,
  id,
  descr,
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
  importTasks,
  newTask,
  updateTask,
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
  evaluate,
  evaluated,
}
