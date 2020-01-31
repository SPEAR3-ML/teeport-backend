const TaskServer = require('./src/task-server')

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const msg = JSON.parse(message)
    const { type } = msg
    switch (type) {
      case 'evaluate':
        break
      case 'monitor':
        console.log(`monitor`)
        break
      default:
        console.log(`received: ${message}`)
    }
    // await sleep(3000)
    ws.send(JSON.stringify({
      msg: msg,
    }))
  })
 
  ws.send('something')
})
