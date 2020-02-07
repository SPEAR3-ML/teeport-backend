const WebSocket = require('ws')
// const math = require('mathjs')

const evaluate = (msg, ws, server, logger) => {
  server.clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg))
    }
  })
  // const { data } = msg
  // const y = math.sum(data)
  // const res = {
  //   type: 'evaluated',
  //   data: y,
  // }
  // ws.send(JSON.stringify(res))
  // logger.debug(`evaluate: ${data}`)
}

const evaluated = (msg, ws, server, logger) => {
  server.clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg))
    }
  })
}

const done = evaluated

module.exports = {
  evaluate,
  evaluated,
  done,
}
