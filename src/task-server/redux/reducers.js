const { fromJS } = require('immutable')

const { CONNECT, DISCONNECT } = require('./actionTypes')

const initialState = fromJS({
  clients: {},
  tasks: {},
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT: {
      const patch = {
        clients: {
          [action.id]: {
            type: null,
            taskId: null,
          },
        },
      }
      return state.mergeDeep(patch)
    }
    case DISCONNECT: {
      return state.deleteIn(['clients', action.id])
    }
  }
}

module.exports = reducer
