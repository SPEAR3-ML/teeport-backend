const WebSocket = require('ws')
// const { sleep } = require('../../utils/helpers')
// const math = require('mathjs')

const store = require('../redux/store')
const {
  evaluate: evaluateAction,
  evaluated: evaluatedAction,
} = require('../redux/actions')

const evaluate = async (msg, ws, server, logger) => {
  const state = store.getState()
  const taskId = state.getIn(['clients', ws.id, 'taskId'])
  msg.taskId = taskId
  msg.timestamp = Date.now()
  const evaluatorId = state.getIn(['tasks', taskId, 'evaluatorId'])
  const taskStatus = state.getIn(['tasks', taskId, 'status'])
  server.clients.forEach(client => {
    const clientType = state.getIn(['clients', client.id, 'type'])
    const clientTaskId = state.getIn(['clients', client.id, 'taskId'])
    if (client.id === evaluatorId && client.readyState === WebSocket.OPEN) {
      if (taskStatus === 'running') {
        client.send(JSON.stringify(msg))
      }
      store.dispatch(evaluateAction(taskId, msg.data))
    } else if (clientType === 'monitor' && clientTaskId === taskId) {
      client.send(JSON.stringify(msg))
    }
  })
}

const evaluated = (msg, ws, server, logger) => {
  const { taskId } = msg
  delete msg.taskId
  msg.timestamp = Date.now()
  const state = store.getState()
  const algorithmId = state.getIn(['tasks', taskId, 'algorithmId'])
  server.clients.forEach(client => {
    const clientType = state.getIn(['clients', client.id, 'type'])
    const clientTaskId = state.getIn(['clients', client.id, 'taskId'])
    if (client.id === algorithmId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg))
      store.dispatch(evaluatedAction(taskId, msg.data))
    } else if (clientType === 'monitor' && clientTaskId === taskId) {
      client.send(JSON.stringify(msg))
    }
  })
}

module.exports = {
  evaluate,
  evaluated,
}
