const WebSocket = require('ws')

const process = (msg, ws, server, logger) => {
  const { processorId } = msg
  delete msg.processorId
  msg.timestamp = Date.now()
  server.clients.forEach(client => {
    if (client.id === processorId && client.readyState === WebSocket.OPEN) {
      msg.commanderId = ws.id
      client.send(JSON.stringify(msg))
    }
  })
}

const processed = (msg, ws, server, logger) => {
  const { commanderId } = msg
  delete msg.commanderId
  msg.timestamp = Date.now()
  server.clients.forEach(client => {
    if (client.id === commanderId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg))
    }
  })
}

module.exports = {
  process,
  processed,
}
