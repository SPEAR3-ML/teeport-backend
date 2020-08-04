const { createSelector } = require('reselect')
const _ = require('lodash')

const { removeXFromTask } = require('../../utils/helpers')

const selectClients = createSelector(
  [
    state => state.get('clients'),
  ],
  clients => clients.toJS(),
)

const selectTasks = createSelector(
  [
    state => state.get('tasks'),
  ],
  tasks => tasks.toJS(),
)

const selectTasksWithoutX = createSelector(
  [
    state => state.get('tasks'),
  ],
  tasks => {
    const _tasks = tasks.toJS()
    _.forEach(_tasks, (task, taskId) => {
      removeXFromTask(task)
    })
    return _tasks
  },
)

// This doesn't make sense since every time the selctor is being called,
// a new re-selector is created and the calculations are not saved
// const selectClient = clientId => createSelector(
//   [
//     state => state.getIn(['clients', clientId]),
//   ],
//   client => client ? client.toJS() : {},
// )

// const selectTask = taskId => createSelector(
//   [
//     state => state.getIn(['tasks', taskId]),
//   ],
//   task => task ? task.toJS() : {},
// )

const selectClient = clientId => state => {
  const client = state.getIn(['clients', clientId])
  return client ? client.toJS() : {}
}

const selectTask = taskId => state => {
  const task = state.getIn(['tasks', taskId])
  return task ? task.toJS() : {}
}

module.exports = {
  selectClients,
  selectTasks,
  selectTasksWithoutX,
  selectClient,
  selectTask,
}
