const Logger = require('../../logger')
const { taskLog } = require('../../configs')

const taskLogger = Logger(taskLog)

module.exports = { taskLogger }
