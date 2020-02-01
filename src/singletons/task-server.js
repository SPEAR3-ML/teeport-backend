const TaskServer = require('../task-server')
const configs = require('../configs')
const { taskLogger } = require('./loggers')

const taskServer = new TaskServer(configs.taskServer, { logger: taskLogger })

module.exports = taskServer
