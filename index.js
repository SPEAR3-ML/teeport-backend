const df = require('dateformat')

const version = '0.1'

const serve = async () => {
  console.log(`================== SPEAR3 Platform v${version} ==================`)
  const current = new Date()
  console.log(`Service starting time : ${df(current, 'yyyy-mm-dd HH:MM:ss')}\n`)

  const configs = {
    taskServer: {
      port: 8080,
    },
    taskLog: {
      level: 'info',
      label: 'task-server',
    },
  }
  const conf = require('./src/configs')
  conf.init(configs)

  const taskServer = require('./src/singletons/task-server')
  taskServer.start()
}

serve()
