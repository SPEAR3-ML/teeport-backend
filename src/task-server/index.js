const WebSocket = require('ws')
const {
  connect, disconnect,
  evaluate, evaluated, done,
  monitor,
  getTasks, newTask, pauseTask, startTask, stopTask,
  getClients,
} = require('./logics')

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

    server.on('connection', (ws, req) => {
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
          case 'getTasks':
            getTasks(msg, ws, server, logger)
            break
          case 'newTask':
            newTask(msg, ws, server, logger)
            break
          case 'pauseTask':
            pauseTask(msg, ws, server, logger)
            break
          case 'startTask':
            startTask(msg, ws, server, logger)
            break
          case 'stopTask':
            stopTask(msg, ws, server, logger)
            break
          case 'getClients':
            getClients(msg, ws, server, logger)
            break
          default:
            logger.warn(`received: ${message}`)
        }
        // await sleep(3000)
        // ws.send(JSON.stringify({
        //   msg,
        // }))
      })

      ws.on('close', (code, reason) => {
        disconnect(code, reason, ws, server, logger)
      })

      connect(req, ws, server, logger)
      // ws.send('hello there')
    })
  }
}

module.exports = TaskServer
