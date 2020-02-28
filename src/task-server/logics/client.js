const _ = require('lodash')

const store = require('../redux/store')
const {
  selectClients, selectClient,
} = require('../redux/selectors')
const {
  renameClient: renameClientAction,
} = require('../redux/actions')
const { closeSocket, sendToClientManagers } = require('../../utils/helpers')

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

const getClient = (msg, ws, server, logger) => {
  const { id } = msg
  const client = selectClient(id)(store.getState())
  client.id = id
  const res = {
    type: 'client',
    client,
    timestamp: Date.now(),
  }
  ws.send(JSON.stringify(res))
}

const closeClient = (msg, ws, server, logger) => {
  closeSocket(server)(msg.id)
}

const renameClient = (msg, ws, server, logger) => {
  store.dispatch(renameClientAction(msg.clientId, msg.name))

  const notif = JSON.stringify({
    type: 'updated',
    id: msg.clientId,
  })
  sendToClientManagers(server, store)(notif)

  logger.debug(`client ${msg.clientId} has been renamed to ${msg.name}`)
}

module.exports = {
  getClients,
  getClient,
  closeClient,
  renameClient,
}
