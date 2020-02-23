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
    if (clientType === 'monitor' && clientTaskId === taskId) {
      client.send(res)
    }
  })
}

const sendToAlgorithm = (server, store) => (taskId, res) => {
  const state = store.getState()
  server.clients.forEach(client => {
    const clientType = state.getIn(['clients', client.id, 'type'])
    const clientTaskId = state.getIn(['clients', client.id, 'taskId'])
    if (clientType === 'algorithm' && clientTaskId === taskId) {
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
  sendToAlgorithm,
  sendToMonitors,
  sendToTaskManagers,
  sendToClientManagers,
  closeSocket,
}
