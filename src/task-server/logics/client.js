const store = require('../redux/store')
const {
  selectClients,
} = require('../redux/selectors')

const getClients = (msg, ws, server, logger) => {
  const clients = selectClients(store.getState())
  const res = {
    type: 'clients',
    clients,
  }
  ws.send(JSON.stringify(res))
}

module.exports = {
  getClients,
}
