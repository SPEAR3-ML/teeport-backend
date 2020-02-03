const WebSocket = require('ws')
const { sleep } = require('../utils/helpers')

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
            break
          case 'monitor':
            logger.info('monitor')
            break
          default:
            logger.warn(`received: ${message}`)
        }

        await sleep(3000)
        ws.send(JSON.stringify({
          msg,
        }))
      })

      ws.send('hello there')
    })
  }
}

module.exports = TaskServer
