const sid = require('shortid')

const store = require('../redux/store')
const {
  connect: connectAction,
  disconnect: disconnectAction,
} = require('../redux/actions')

const connect = (ws, server, logger) => {
  ws.id = sid.generate()
  logger.debug(`client ${ws.id} connected`)
  store.dispatch(connectAction(ws.id))

  const msg = {
    type: 'hello',
    id: ws.id,
  }
  ws.send(JSON.stringify(msg))
}

const disconnect = (code, reason, ws, server, logger) => {
  logger.debug(`client ${ws.id} disconnected with code ${code} and reason ${reason}`)
  store.dispatch(disconnectAction(ws.id))
}

module.exports = {
  connect,
  disconnect,
}
