const WebSocket = require('ws')
const {
  connect, disconnect,
  evaluate, evaluated,
  process, processed,
  monitor,
  getTasks, getTasksOverview, getTask,
  newTask, pauseTask, startTask, stopTask, completeTask, renameTask,
  archiveTask, unarchiveTask, deleteTask,
  getClients, getClient,
  closeClient, renameClient,
  observeTask,
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
      ws.on('message', message => {
        const msg = JSON.parse(message)
        const { type } = msg
        switch (type) {
          case 'evaluate':
            evaluate(msg, ws, server, logger)
            break
          case 'evaluated':
            evaluated(msg, ws, server, logger)
            break
          case 'process':
            process(msg, ws, server, logger)
            break
          case 'processed':
            processed(msg, ws, server, logger)
            break
          case 'monitor':
            monitor(msg, ws, server, logger)
            break
          case 'getTasks':
            getTasks(msg, ws, server, logger)
            break
          case 'getTasksOverview':
            getTasksOverview(msg, ws, server, logger)
            break
          case 'getTask':
            getTask(msg, ws, server, logger)
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
          case 'completeTask':
            completeTask(msg, ws, server, logger)
            break
          case 'renameTask':
            renameTask(msg, ws, server, logger)
            break
          case 'archiveTask':
            archiveTask(msg, ws, server, logger)
            break
          case 'unarchiveTask':
            unarchiveTask(msg, ws, server, logger)
            break
          case 'deleteTask':
            deleteTask(msg, ws, server, logger)
            break
          case 'getClients':
            getClients(msg, ws, server, logger)
            break
          case 'getClient':
            getClient(msg, ws, server, logger)
            break
          case 'closeClient':
            closeClient(msg, ws, server, logger)
            break
          case 'renameClient':
            renameClient(msg, ws, server, logger)
            break
          case 'observeTask':
            observeTask(msg, ws, server, logger)
            break
          default:
            logger.warn(`received: ${message}`)
        }
      })

      ws.on('close', (code, reason) => {
        disconnect(code, reason, ws, server, logger)
      })

      connect(req, ws, server, logger)
    })
  }
}

module.exports = TaskServer
