const { CONNECT, DISCONNECT } = require('./actionTypes')

const connect = (id) => ({
  type: CONNECT,
  id,
})

const disconnect = (id) => ({
  type: DISCONNECT,
  id,
})

module.exports = {
  connect,
  disconnect,
}
