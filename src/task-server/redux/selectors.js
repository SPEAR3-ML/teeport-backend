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
  clients => clients.toJS(),
)

module.exports = { selectClients, selectTasks }
