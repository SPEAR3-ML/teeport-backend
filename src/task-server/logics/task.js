const WebSocket = require('ws')
const sid = require('shortid')
const generate = require('project-name-generator')

const store = require('../redux/store')
const {
  newTask: newTaskAction,
  pauseTask: pauseTaskAction,
  startTask: startTaskAction,
  stopTask: stopTaskAction,
  completeTask: completeTaskAction,
} = require('../redux/actions')
const {
  selectTasks,
} = require('../redux/selectors')

const getTasks = (msg, ws, server, logger) => {
  const tasks = selectTasks(store.getState())
  const res = {
    type: 'tasks',
    tasks,
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

  const res = {
    type: 'taskCreated',
    id,
  }
  ws.send(JSON.stringify(res))

  logger.debug(`task ${id} has been created`)
}

const pauseTask = (msg, ws, server, logger) => {
  const { id } = msg
  store.dispatch(pauseTaskAction(id))

  logger.debug(`task ${id} has been paused`)
}

const startTask = (msg, ws, server, logger) => {
  const { id } = msg
  store.dispatch(startTaskAction(id))

  // Process the pending queue
  const state = store.getState()
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

  logger.debug(`task ${id} has been started`)
}

const stopTask = (msg, ws, server, logger) => {
  const { id } = msg
  store.dispatch(stopTaskAction(id))

  logger.debug(`task ${id} has been terminated`)
}

const completeTask = (msg, ws, server, logger) => {
  const { id } = msg
  store.dispatch(completeTaskAction(id))

  logger.debug(`task ${id} has been completed`)
}

module.exports = {
  getTasks,
  newTask,
  pauseTask,
  startTask,
  stopTask,
  completeTask,
}
