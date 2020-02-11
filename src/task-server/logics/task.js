const sid = require('shortid')
const generate = require('project-name-generator')

const store = require('../redux/store')
const {
  newTask: newTaskAction,
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

module.exports = {
  getTasks,
  newTask,
}
