const _ = require('lodash')

const store = require('../redux/store')
const {
  selectClients,
} = require('../redux/selectors')

const getClients = (msg, ws, server, logger) => {
  const clients = selectClients(store.getState())
  const sortedClients = _.toPairs(clients).map(([clientId, client]) => {
    return _.assign(client, { id: clientId })
  }).sort((c1, c2) => {
    return c2.connectedAt - c1.connectedAt
  })
  const res = {
    type: 'clients',
    clients: sortedClients,
  }
  ws.send(JSON.stringify(res))
}

module.exports = {
  getClients,
}
