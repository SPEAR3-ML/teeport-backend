const { createSelector } = require('reselect')

const selectClients = createSelector(
  [
    state => state.getIn('clients'),
  ],
  clients => clients.toJS(),
)

module.exports = { selectClients }
