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
  try {
    msg.configs = state.getIn(['tasks', taskId, 'configs', 'evaluator']).toJS()
  } catch (error) {
    msg.configs = null
  }
  const msgStr = JSON.stringify(msg)

  const evaluatorId = state.getIn(['tasks', taskId, 'evaluatorId'])
  const taskStatus = state.getIn(['tasks', taskId, 'status'])
  server.clients.forEach(client => {
    const clientType = state.getIn(['clients', client.id, 'type'])
    const clientTaskId = state.getIn(['clients', client.id, 'taskId'])
    if (client.id === evaluatorId && client.readyState === WebSocket.OPEN) {
      if (taskStatus === 'running') {
        client.send(msgStr)
      }
      store.dispatch(evaluateAction(taskId, msg.data))
    } else if (clientType === 'monitor' && clientTaskId.contains(taskId)) {
      client.send(msgStr)
    }
  })
}

const evaluated = (msg, ws, server, logger) => {
  const { taskId } = msg
  // delete msg.taskId // no need to delete the taskId, the client actually doesn't care
  msg.timestamp = Date.now()
  const msgStr = JSON.stringify(msg)

  const state = store.getState()
  const optimizerId = state.getIn(['tasks', taskId, 'optimizerId'])
  server.clients.forEach(client => {
    const clientType = state.getIn(['clients', client.id, 'type'])
    const clientTaskId = state.getIn(['clients', client.id, 'taskId'])
    if (client.id === optimizerId && client.readyState === WebSocket.OPEN) {
      client.send(msgStr)
    } else if (clientType === 'monitor' && clientTaskId.contains(taskId)) {
      client.send(msgStr)
    }
  })
  store.dispatch(evaluatedAction(taskId, msg.data))
}

module.exports = {
  evaluate,
  evaluated,
}
