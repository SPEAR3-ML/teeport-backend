const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const sendToClientManagers = (server, store) => res => {
  const state = store.getState()
  server.clients.forEach(client => {
    const type = state.getIn(['clients', client.id, 'type'])
    if (type === 'clientManager') {
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
    if (['monitor', 'wildcard'].includes(clientType) && clientTaskId === taskId) {
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
