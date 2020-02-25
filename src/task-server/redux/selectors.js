const { createSelector } = require('reselect')

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

const selectTask = taskId => createSelector(
  [
    state => state.getIn(['tasks', taskId]),
  ],
  task => task ? task.toJS() : {},
)

module.exports = { selectClients, selectTasks, selectTask }
