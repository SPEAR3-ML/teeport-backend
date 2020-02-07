const WebSocket = require('ws')
const { sleep } = require('../../utils/helpers')
// const math = require('mathjs')

const evaluate = async (msg, ws, server, logger) => {
  if (msg.gen === 5) {
    await sleep(3000)
  }

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
