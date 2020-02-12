const { fromJS } = require('immutable')

const {
  CONNECT, DISCONNECT,
  NEW_TASK, UPDATE_TASK, PAUSE_TASK, START_TASK, STOP_TASK,
} = require('./actionTypes')
const { clientDef, taskDef } = require('./defs')

const initialState = fromJS({
  clients: {},
  tasks: {},
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT: {
      const client = clientDef()
      const { id, client: _client } = action
      const { name, type } = _client
      client.name = name
      client.type = type
      const patch = {
        clients: {
          [id]: client,
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
      return state.withMutations(prev => {
        let evalTaskIds = prev.getIn(['clients', evaluatorId, 'taskId'])
        if (!evalTaskIds) {
          evalTaskIds = []
        }
        evalTaskIds.push(id)
        prev.setIn(['tasks', id], fromJS(task))
        prev.setIn(['clients', algorithmId, 'taskId'], id)
        prev.setIn(['clients', evaluatorId, 'taskId'], fromJS(evalTaskIds))
      })
    }
    case UPDATE_TASK: {
      const patch = {
        tasks: {
          [action.id]: action.task,
        },
      }
      return state.mergeDeep(patch)
    }
    case PAUSE_TASK: {
      return state.withMutations(prev => {
        const status = prev.getIn(['tasks', action.id, 'status'])
        if (status === 'running') {
          prev.setIn(['tasks', action.id, 'status'], 'paused')
        }
      })
    }
    case START_TASK: {
      return state.withMutations(prev => {
        const status = prev.getIn(['tasks', action.id, 'status'])
        if (status === 'init') {
          prev.setIn(['tasks', action.id, 'startedAt'], Date.now())
          prev.setIn(['tasks', action.id, 'status'], 'running')
        } else if (status === 'paused') {
          prev.setIn(['tasks', action.id, 'status'], 'running')
        }
      })
    }
    case STOP_TASK: {
      return state.withMutations(prev => {
        const status = prev.getIn(['tasks', action.id, 'status'])
        if (['init', 'paused', 'running'].includes(status)) {
          prev.setIn(['tasks', action.id, 'stoppedAt'], Date.now())
          prev.setIn(['tasks', action.id, 'status'], 'cancelled')
        }
      })
    }
    default:
      return state
  }
}

module.exports = reducer
