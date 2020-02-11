const sid = require('shortid')
const generate = require('project-name-generator')
const parse = require('url-parse')

const store = require('../redux/store')
const {
  connect: connectAction,
  disconnect: disconnectAction,
} = require('../redux/actions')

const connect = (req, ws, server, logger) => {
  ws.id = sid.generate()
  const { query: { name: _name, type: _type } } = parse(req.url, true)
  let name = _name
  if (!name) {
    name = generate().dashed
  }
  let type = _type
  if (!type) {
    type = null
  }
  store.dispatch(connectAction(ws.id, name, type))

  const msg = {
    type: 'hello',
    id: ws.id,
  }
  ws.send(JSON.stringify(msg))

  logger.debug(`client ${ws.id} connected`)
}

const disconnect = (code, reason, ws, server, logger) => {
  store.dispatch(disconnectAction(ws.id))

  logger.debug(`client ${ws.id} disconnected with code ${code} and reason ${reason}`)
}

module.exports = {
  connect,
  disconnect,
}
