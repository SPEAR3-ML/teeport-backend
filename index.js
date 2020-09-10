const df = require('dateformat')

const version = '0.3.0'
const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info'
const port = parseInt(process.env.NODE) || 8080

const serve = async () => {
  console.log(`================== Teeport Server v${version} ==================`)
  const current = new Date()
  console.log(`Service starting time : ${df(current, 'yyyy-mm-dd HH:MM:ss')}`)
  console.log(`Service mode          : ${process.env.NODE_ENV}`)
  console.log(`Service log level     : ${logLevel}`)
  console.log(`Service port          : ${port}\n`)

  const configs = {
    taskServer: {
      port,
    },
    taskLog: {
      level: logLevel,
      label: 'task-server',
    },
  }
  const conf = require('./src/configs')
  conf.init(configs)

  const taskServer = require('./src/singletons/task-server')
  taskServer.start()
}

serve()
