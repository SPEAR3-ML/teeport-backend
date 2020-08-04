const WebSocket = require('ws')
const sid = require('shortid')
const generate = require('project-name-generator')
const _ = require('lodash')

const store = require('../redux/store')
const {
  importTasks: importTasksAction,
  newTask: newTaskAction,
  pauseTask: pauseTaskAction,
  startTask: startTaskAction,
  stopTask: stopTaskAction,
  completeTask: completeTaskAction,
  renameTask: renameTaskAction,
  newBenchmarkTask: newBenchmarkTaskAction,
  archiveTask: archiveTaskAction,
  unarchiveTask: unarchiveTaskAction,
  deleteTask: deleteTaskAction,
  updateTaskDescr: updateTaskDescrAction,
  newRun: newRunAction,
} = require('../redux/actions')
const {
  selectTasks,
  selectTask,
} = require('../redux/selectors')
const {
  sendToTaskManagers,
  sendToMonitors,
  sendToOptimizer,
} = require('../../utils/helpers')

const getTasks = (msg, ws, server, logger) => {
  const { ids } = msg
  if (ids) {
    const tasks = ids.map(id => {
      const task = selectTask(id)(store.getState())
      task.id = id
      return task
    })

    const res = {
      type: 'tasks',
      tasks,
      timestamp: Date.now(),
    }
    ws.send(JSON.stringify(res))
    return
  }

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
  const { ids } = msg
  if (ids) {
    const tasks = ids.map(id => {
      const task = selectTask(id)(store.getState())
      task.id = id
      delete task.history
      delete task.pending
      return task
    })

    const res = {
      type: 'tasksOverview',
      tasks,
      timestamp: Date.now(),
    }
    ws.send(JSON.stringify(res))
    return
  }

  const tasks = selectTasks(store.getState())
  const sortedTasks = _.map(tasks, (task, taskId) => {
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
  const { id, mode } = msg
  const task = selectTask(id)(store.getState())
  task.id = id
  if (mode !== 'all') { // only return Y of the task
    task.pending = []
    let isBenchmark = false
    try {
      const { runNumber } = task.configs.task
      if (runNumber !== undefined) {
        isBenchmark = true
      }
    } catch (error) {
      // do nothing
    }
    if (isBenchmark) {
      task.history.forEach(run => {
        run.forEach(generation => {
          generation[0] = []
        })
      })
    } else {
      task.history.forEach(generation => {
        generation[0] = []
      })
    }
  }
  const res = {
    type: 'task',
    task,
    timestamp: Date.now(),
  }
  ws.send(JSON.stringify(res))
}

const importTasks = (msg, ws, server, logger) => {
  store.dispatch(importTasksAction(msg.tasks))
  const notif = JSON.stringify({
    type: 'updateTasks',
  })
  sendToTaskManagers(server, store)(notif)
}

const newTask = (msg, ws, server, logger) => {
  const id = sid.generate()
  const { configs, optimizerId, evaluatorId } = msg
  const { task: _task } = configs
  if (!_task) {
    configs.task = {
      name: generate().dashed,
    }
  } else if (!_task.name) {
    configs.task.name = generate().dashed
  }
  store.dispatch(newTaskAction(id, configs, optimizerId, evaluatorId))

  const res = JSON.stringify({
    type: 'taskCreated',
    optimizerId,
    evaluatorId,
    id,
  })
  ws.send(res)

  sendToTaskManagers(server, store)(res)
  sendToOptimizer(server, store)(id, res)

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

// start task includes create task and resume task
const startTask = (msg, ws, server, logger) => {
  const { id } = msg
  const state = store.getState()
  const status = state.getIn(['tasks', id, 'status']) // save for later

  store.dispatch(startTaskAction(id))

  const currentRun = state.getIn(['tasks', id, 'currentRun']) // benchmark flag
  if (currentRun === -1) { // init benchmark task
    store.dispatch(newRunAction(id))
  }

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

  const configs = state.getIn(['tasks', id, 'configs']).toJS()
  const notif = JSON.stringify({
    type: 'startTask',
    id,
    configs,
  })
  sendToTaskManagers(server, store)(notif)
  sendToMonitors(server, store)(id, notif)
  if (status === 'init') { // new start
    sendToOptimizer(server, store)(id, notif)
  }

  logger.debug(`try to start task ${id}`)
}

const stopTask = (msg, ws, server, logger) => {
  const { id } = msg
  const notif = JSON.stringify({
    type: 'stopTask',
    id,
  })
  sendToOptimizer(server, store)(id, notif)
  store.dispatch(stopTaskAction(id))

  sendToTaskManagers(server, store)(notif)
  sendToMonitors(server, store)(id, notif)

  logger.debug(`try to terminate task ${id}`)
}

const completeTask = (msg, ws, server, logger) => {
  const { id } = msg
  // check if the evalutor is a private one
  const state = store.getState()
  const evaluatorId = state.getIn(['tasks', id, 'evaluatorId'])
  const isPrivate = state.getIn(['clients', evaluatorId, 'private'])

  const currentRun = state.getIn(['tasks', id, 'currentRun']) // benchmark flag
  if (currentRun !== undefined) { // benchmark task
    const runNumber = state.getIn(['tasks', id, 'configs', 'task', 'runNumber'])
    if (currentRun < runNumber - 1) { // should start a new run
      store.dispatch(newRunAction(id))
      // cheat the optimizer that a new task has been created
      const optimizerId = state.getIn(['tasks', id, 'optimizerId'])
      const taskCreated = JSON.stringify({
        type: 'taskCreated',
        optimizerId,
        evaluatorId,
        id,
      })
      sendToOptimizer(server, store)(id, taskCreated)
      // and start running it
      const configs = state.getIn(['tasks', id, 'configs']).toJS()
      const notif = JSON.stringify({
        type: 'startTask',
        id,
        configs,
      })
      sendToOptimizer(server, store)(id, notif)
      sendToMonitors(server, store)(id, notif)
      return
    }
  }
  // Complete the task
  store.dispatch(completeTaskAction(id))

  const notif = JSON.stringify({
    type: 'completeTask',
    id,
  })
  sendToTaskManagers(server, store)(notif)
  sendToMonitors(server, store)(id, notif)

  // Notify the evaluator the task is completed if it's a private one
  if (isPrivate) {
    server.clients.forEach(client => {
      if (client.id === evaluatorId && client.readyState === WebSocket.OPEN) {
        client.send(notif)
      }
    })
  }

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

const newBenchmarkTask = (msg, ws, server, logger) => {
  const id = sid.generate()
  const { configs, optimizerId, evaluatorId } = msg
  const { task: _task } = configs
  if (!_task) {
    configs.task = {
      name: generate().dashed,
    }
  } else if (!_task.name) {
    configs.task.name = generate().dashed
  }
  store.dispatch(newBenchmarkTaskAction(id, configs, optimizerId, evaluatorId))

  const res = JSON.stringify({
    type: 'taskCreated',
    optimizerId,
    evaluatorId,
    id,
  })
  ws.send(res)

  sendToTaskManagers(server, store)(res)
  sendToOptimizer(server, store)(id, res)

  logger.debug(`benchmark task ${id} has been created`)
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

const updateTaskDescr = (msg, ws, server, logger) => {
  store.dispatch(updateTaskDescrAction(msg.taskId, msg.descr))

  const notif = JSON.stringify({
    type: 'updateTask',
    id: msg.taskId,
  })
  sendToTaskManagers(server, store)(notif)

  logger.debug(`task ${msg.taskId} descr has been updated to ${msg.descr}`)
}

module.exports = {
  getTasks,
  getTasksOverview,
  getTask,
  importTasks,
  newTask,
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
}
