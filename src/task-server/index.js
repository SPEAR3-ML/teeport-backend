const WebSocket = require('ws')
// const { sleep } = require('../utils/helpers')
const { evaluate, evaluated, done, monitor } = require('./logics')

class TaskServer {
  constructor (configs, plugins) {
    this.configs = configs
    this.plugins = plugins
    this.server = null
  }

  async start () {
    const { port } = this.configs
    const { logger } = this.plugins

    const server = this.server = new WebSocket.Server({ port })

    server.on('connection', (ws) => {
      ws.on('message', async (message) => {
        const msg = JSON.parse(message)
        const { type } = msg
        switch (type) {
          case 'evaluate':
            evaluate(msg, ws, server, logger)
            break
          case 'evaluated':
            evaluated(msg, ws, server, logger)
            break
          case 'done':
            done(msg, ws, server, logger)
            break
          case 'monitor':
            monitor(msg, ws, server, logger)
            break
          default:
            logger.warn(`received: ${message}`)
        }
        // await sleep(3000)
        // ws.send(JSON.stringify({
        //   msg,
        // }))
      })
      // ws.send('hello there')
    })
  }
}

module.exports = TaskServer
