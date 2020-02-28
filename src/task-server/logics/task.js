const WebSocket = require('ws')
const sid = require('shortid')
const generate = require('project-name-generator')
const _ = require('lodash')

const store = require('../redux/store')
const {
  newTask: newTaskAction,
  pauseTask: pauseTaskAction,
  startTask: startTaskAction,
  stopTask: stopTaskAction,
  completeTask: completeTaskAction,
  renameTask: renameTaskAction,
  archiveTask: archiveTaskAction,
  unarchiveTask: unarchiveTaskAction,
  deleteTask: deleteTaskAction,
} = require('../redux/actions')
const {
  selectTasks,
  selectTask,
} = require('../redux/selectors')
const {
  sendToTaskManagers,
  sendToMonitors,
  sendToAlgorithm,
} = require('../../utils/helpers')

const getTasks = (msg, ws, server, logger) => {
  const tasks = selectTasks(store.getState())
  const sortedTasks = _.toPairs(tasks).map(([taskId, task]) => {
    return _.assign(task, { id: taskId })
  }).sort((t1, t2) => {
    return t2.createdAt - t1.createdAt
  })
  const res = {
    type: 'tasks',
    tasks: sortedTasks,
  }
  ws.send(JSON.stringify(res))
}

const getTasksOverview = (msg, ws, server, logger) => {
  const tasks = selectTasks(store.getState())
  const sortedTasks = _.toPairs(tasks).map(([taskId, task]) => {
    const taskAbstract = _.assign({ id: taskId }, task)
    delete taskAbstract.history
    delete taskAbstract.pending
    return taskAbstract
  }).sort((t1, t2) => {
    return t2.createdAt - t1.createdAt
  })
  const res = {
    type: 'tasksOverview',
    tasks: sortedTasks,
  }
  ws.send(JSON.stringify(res))
}

const getTask = (msg, ws, server, logger) => {
  const { id } = msg
  const task = selectTask(id)(store.getState())
  task.id = id
  const res = {
    type: 'task',
    task,
    timestamp: Date.now(),
  }
  ws.send(JSON.stringify(res))
}

const newTask = (msg, ws, server, logger) => {
  const id = sid.generate()
  const { name: _name, algorithmId, evaluatorId } = msg
  let name = _name
  if (!name) {
    name = generate().dashed
  }
  store.dispatch(newTaskAction(id, name, algorithmId, evaluatorId))

  const res = JSON.stringify({
    type: 'taskCreated',
    algorithmId,
    evaluatorId,
    id,
  })
  ws.send(res)

  sendToTaskManagers(server, store)(res)
  sendToAlgorithm(server, store)(id, res)

  logger.debug(`task ${id} has been created`)
}

const pauseTask = (msg, ws, server, logger) => {
  const { id } = msg
  store.dispatch(pauseTaskAction(id))

  const notif = JSON.stringify({
    type: 'pauseTask',
    id,
  })
  sendToTaskManagers(server, store)(notif)
  sendToMonitors(server, store)(id, notif)

  logger.debug(`try to pause task ${id}`)
}

const startTask = (msg, ws, server, logger) => {
  const { id } = msg
  const state = store.getState()
  const status = state.getIn(['tasks', id, 'status']) // save for later
  
  store.dispatch(startTaskAction(id))

  // Process the pending queue
  const pending = state.getIn(['tasks', id, 'pending'])
  if (pending.size) {
    const evaluatorId = state.getIn(['tasks', id, 'evaluatorId'])
    server.clients.forEach(client => {
      if (client.id === evaluatorId && client.readyState === WebSocket.OPEN) {
        pending.forEach(point => {
          const msg = {
            type: 'evaluate',
            data: point.get(0).toJS(),
            taskId: id,
          }
          client.send(JSON.stringify(msg))
        })
      }
    })
  }

  const notif = JSON.stringify({
    type: 'startTask',
    id,
  })
  sendToTaskManagers(server, store)(notif)
  sendToMonitors(server, store)(id, notif)
  if (status === 'init') { // new start
    sendToAlgorithm(server, store)(id, notif)
  }

  logger.debug(`try to start task ${id}`)
}

const stopTask = (msg, ws, server, logger) => {
  const { id } = msg
  const notif = JSON.stringify({
    type: 'stopTask',
    id,
  })
  sendToAlgorithm(server, store)(id, notif)
  store.dispatch(stopTaskAction(id))

  sendToTaskManagers(server, store)(notif)
  sendToMonitors(server, store)(id, notif)

  logger.debug(`try to terminate task ${id}`)
}

const completeTask = (msg, ws, server, logger) => {
  const { id } = msg
  store.dispatch(completeTaskAction(id))

  const notif = JSON.stringify({
    type: 'completeTask',
    id,
  })
  sendToTaskManagers(server, store)(notif)
  sendToMonitors(server, store)(id, notif)

  logger.debug(`try to complete task ${id}`)
}

const renameTask = (msg, ws, server, logger) => {
  store.dispatch(renameTaskAction(msg.taskId, msg.name))

  const notif = JSON.stringify({
    type: 'updateTask',
    id: msg.taskId,
  })
  sendToTaskManagers(server, store)(notif)

  logger.debug(`task ${msg.taskId} has been renamed to ${msg.name}`)
}

const archiveTask = (msg, ws, server, logger) => {
  store.dispatch(archiveTaskAction(msg.id))

  const notif = JSON.stringify({
    type: 'updateTask',
    id: msg.id,
  })
  sendToTaskManagers(server, store)(notif)

  logger.debug(`try to archive task ${msg.id}`)
}

const unarchiveTask = (msg, ws, server, logger) => {
  store.dispatch(unarchiveTaskAction(msg.id))

  const notif = JSON.stringify({
    type: 'updateTask',
    id: msg.id,
  })
  sendToTaskManagers(server, store)(notif)

  logger.debug(`try to unarchive task ${msg.id}`)
}

const deleteTask = (msg, ws, server, logger) => {
  store.dispatch(deleteTaskAction(msg.id))

  const notif = JSON.stringify({
    type: 'updateTask',
    id: msg.id,
  })
  sendToTaskManagers(server, store)(notif)

  logger.debug(`try to delete task ${msg.id}`)
}

module.exports = {
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
}
