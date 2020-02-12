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
  const evaluatorId = state.getIn(['tasks', taskId, 'evaluatorId'])
  const taskStatus = state.getIn(['tasks', taskId, 'status'])
  server.clients.forEach(client => {
    if (client.id === evaluatorId && client.readyState === WebSocket.OPEN) {
      if (taskStatus === 'running') {
        msg.taskId = taskId
        client.send(JSON.stringify(msg))
      }

      store.dispatch(evaluateAction(taskId, msg.data))
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

      store.dispatch(evaluatedAction(taskId, msg.data))
    }
  })
}

module.exports = {
  evaluate,
  evaluated,
}
