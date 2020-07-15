const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const sendToClientManagers = (server, store, exclude = []) => res => {
  const state = store.getState()
  server.clients.forEach(client => {
    const type = state.getIn(['clients', client.id, 'type'])
    if (type === 'clientManager' && exclude.indexOf(client.id) === -1) {
      client.send(res)
    }
  })
}

const sendToTaskManagers = (server, store) => res => {
  const state = store.getState()
  server.clients.forEach(client => {
    const type = state.getIn(['clients', client.id, 'type'])
    if (type === 'taskManager') {
      client.send(res)
    }
  })
}

const sendToMonitors = (server, store) => (taskId, res) => {
  const state = store.getState()
  server.clients.forEach(client => {
    const clientType = state.getIn(['clients', client.id, 'type'])
    const clientTaskId = state.getIn(['clients', client.id, 'taskId'])
    if (clientType === 'monitor' && clientTaskId.contains(taskId)) { // taskId in monitor is a List
      client.send(res)
    } else if (clientType === 'wildcard' && clientTaskId === taskId) {
      client.send(res)
    }
  })
}

const sendToOptimizer = (server, store) => (taskId, res) => {
  const state = store.getState()
  server.clients.forEach(client => {
    const clientType = state.getIn(['clients', client.id, 'type'])
    const clientTaskId = state.getIn(['clients', client.id, 'taskId'])
    if (clientType === 'optimizer' && clientTaskId === taskId) {
      client.send(res)
    }
  })
}

const closeSocket = server => id => {
  server.clients.forEach(client => {
    if (client.id === id) {
      client.close()
    }
  })
}

module.exports = {
  sleep,
  sendToOptimizer,
  sendToMonitors,
  sendToTaskManagers,
  sendToClientManagers,
  closeSocket,
}
