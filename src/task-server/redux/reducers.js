const { fromJS } = require('immutable')

const {
  CONNECT, DISCONNECT,
  NEW_TASK, UPDATE_TASK,
} = require('./actionTypes')
const { clientDef, taskDef } = require('./defs')

const initialState = fromJS({
  clients: {},
  tasks: {},
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT: {
      const patch = {
        clients: {
          [action.id]: clientDef(),
        },
      }
      return state.mergeDeep(patch)
    }
    case DISCONNECT: {
      return state.deleteIn(['clients', action.id])
    }
    case NEW_TASK: {
      const task = taskDef()
      const { id, task: _task } = action
      const { name, algorithmId, evaluatorId } = _task
      task.name = name
      task.algorithmId = algorithmId
      task.evaluatorId = evaluatorId
      task.createdAt = Date.now()
      const patch = {
        tasks: {
          [id]: task,
        },
      }
      return state.mergeDeep(patch)
    }
    case UPDATE_TASK: {
      const patch = {
        tasks: {
          [action.id]: action.task,
        },
      }
      return state.mergeDeep(patch)
    }
    default:
      return state
  }
}

module.exports = reducer
