const sid = require('shortid')
const generate = require('project-name-generator')
const parse = require('url-parse')

const store = require('../redux/store')
const {
  connect: connectAction,
  disconnect: disconnectAction,
} = require('../redux/actions')
const { sendToClientManagers } = require('../../utils/helpers')

const connect = (req, ws, server, logger) => {
  ws.id = sid.generate()
  const {
    query: {
      name: _name,
      type: _type,
      taskId: _taskId,
      private: _private,
    },
  } = parse(req.url, true)
  let name = _name
  if (!name) {
    name = generate().dashed
  }
  let type = _type
  if (!type) {
    type = null
  }
  let taskId = _taskId
  if (!taskId) {
    taskId = null
  }
  const priv = (_private === 'True' || _private === 'true')
  store.dispatch(connectAction(ws.id, name, type, taskId, priv))

  const res = JSON.stringify({
    type: 'hello',
    id: ws.id,
  })
  ws.send(res)

  const notif = JSON.stringify({
    type: 'connected',
    id: ws.id,
  })
  sendToClientManagers(server, store)(notif)

  logger.debug(`client ${ws.id} connected`)
}

const disconnect = (code, reason, ws, server, logger) => {
  store.dispatch(disconnectAction(ws.id))

  const notif = JSON.stringify({
    type: 'disconnected',
    id: ws.id,
  })
  sendToClientManagers(server, store)(notif)

  logger.debug(`client ${ws.id} disconnected with code ${code} and reason ${reason}`)
}

module.exports = {
  connect,
  disconnect,
}
