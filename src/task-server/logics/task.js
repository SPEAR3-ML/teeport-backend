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

  logger.debug(`task ${id} started`)
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
