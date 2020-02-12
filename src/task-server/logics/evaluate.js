const WebSocket = require('ws')
// const { sleep } = require('../../utils/helpers')
// const math = require('mathjs')

const store = require('../redux/store')

const evaluate = async (msg, ws, server, logger) => {
  const state = store.getState()
  const taskId = state.getIn(['clients', ws.id, 'taskId'])
  const evaluatorId = state.getIn(['tasks', taskId, 'evaluatorId'])
  server.clients.forEach(client => {
    if (client.id === evaluatorId && client.readyState === WebSocket.OPEN) {
      msg.taskId = taskId
      client.send(JSON.stringify(msg))
    }
  })
}

const evaluated = (msg, ws, server, logger) => {
  const { taskId } = msg
  const state = store.getState()
  const algorithmId = state.getIn(['tasks', taskId, 'algorithmId'])
  server.clients.forEach(client => {
    if (client.id === algorithmId && client.readyState === WebSocket.OPEN) {
      delete msg.taskId
      client.send(JSON.stringify(msg))
    }
  })
}

module.exports = {
  evaluate,
  evaluated,
}
