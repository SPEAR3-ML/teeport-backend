const { List, fromJS } = require('immutable')

const {
  CONNECT, DISCONNECT, RENAME_CLIENT,
  NEW_TASK, UPDATE_TASK, PAUSE_TASK, START_TASK, STOP_TASK, COMPLETE_TASK, RENAME_TASK,
  ARCHIVE_TASK, UNARCHIVE_TASK, DELETE_TASK,
  EVALUATE, EVALUATED,
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
      const { name, type, taskId } = _client
      client.name = name
      client.type = type
      client.taskId = taskId
      client.connectedAt = Date.now()
      return state.setIn(['clients', id], fromJS(client))
    }
    case DISCONNECT: {
      return state.deleteIn(['clients', action.id])
    }
    case RENAME_CLIENT: {
      return state.withMutations(prev => {
        const client = prev.getIn(['clients', action.id])
        if (client) {
          prev.setIn(['clients', action.id, 'name'], action.name)
        }
      })
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
          evalTaskIds = List()
        }
        evalTaskIds = evalTaskIds.push(id)
        prev.setIn(['tasks', id], fromJS(task))
        prev.setIn(['clients', algorithmId, 'taskId'], id)
        prev.setIn(['clients', evaluatorId, 'taskId'], evalTaskIds)
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
        const algorithmId = prev.getIn(['tasks', action.id, 'algorithmId'])
        const evaluatorId = prev.getIn(['tasks', action.id, 'evaluatorId'])
        if (['init', 'paused', 'running'].includes(status)) {
          prev.setIn(['tasks', action.id, 'stoppedAt'], Date.now())
          prev.setIn(['tasks', action.id, 'status'], 'cancelled')
          const algorithm = prev.getIn(['clients', algorithmId])
          if (algorithm) {
            prev.setIn(['clients', algorithmId, 'taskId'], null)
          }
          const evaluator = prev.getIn(['clients', evaluatorId])
          if (evaluator) {
            const evalTaskIds = evaluator.get('taskId')
            if (evalTaskIds) {
              const filteredEvalTaskIds = evalTaskIds.filter(item => item !== action.id)
              prev.setIn(['clients', evaluatorId, 'taskId'], filteredEvalTaskIds)
            }
          }
        }
      })
    }
    case COMPLETE_TASK: {
      return state.withMutations(prev => {
        const status = prev.getIn(['tasks', action.id, 'status'])
        const algorithmId = prev.getIn(['tasks', action.id, 'algorithmId'])
        const evaluatorId = prev.getIn(['tasks', action.id, 'evaluatorId'])
        if (status === 'running') {
          prev.setIn(['tasks', action.id, 'stoppedAt'], Date.now())
          prev.setIn(['tasks', action.id, 'status'], 'completed')
          const algorithm = prev.getIn(['clients', algorithmId])
          if (algorithm) {
            prev.setIn(['clients', algorithmId, 'taskId'], null)
          }
          const evaluator = prev.getIn(['clients', evaluatorId])
          if (evaluator) {
            const evalTaskIds = evaluator.get('taskId')
            if (evalTaskIds) {
              const filteredEvalTaskIds = evalTaskIds.filter(item => item !== action.id)
              prev.setIn(['clients', evaluatorId, 'taskId'], filteredEvalTaskIds)
            }
          }
        }
      })
    }
    case RENAME_TASK: {
      return state.withMutations(prev => {
        const task = prev.getIn(['tasks', action.id])
        if (task) {
          prev.setIn(['tasks', action.id, 'name'], action.name)
        }
      })
    }
    case ARCHIVE_TASK: {
      return state.withMutations(prev => {
        const task = prev.getIn(['tasks', action.id])
        if (task) {
          prev.setIn(['tasks', action.id, 'archivedAt'], Date.now())
        }
      })
    }
    case UNARCHIVE_TASK: {
      return state.withMutations(prev => {
        const task = prev.getIn(['tasks', action.id])
        if (task) {
          prev.setIn(['tasks', action.id, 'archivedAt'], null)
        }
      })
    }
    case DELETE_TASK: {
      return state.withMutations(prev => {
        const task = prev.getIn(['tasks', action.id])
        if (task) {
          prev.deleteIn(['tasks', action.id])
        }
      })
    }
    case EVALUATE: {
      return state.withMutations(prev => {
        const { taskId, data: X } = action
        const status = prev.getIn(['tasks', taskId, 'status'])
        const pending = prev.getIn(['tasks', taskId, 'pending'])
        if (['init', 'paused', 'running'].includes(status)) {
          prev.setIn(['tasks', taskId, 'pending', pending.size], fromJS([X, null]))
        }
      })
    }
    case EVALUATED: {
      return state.withMutations(prev => {
        const { taskId, data: Y } = action
        const XList = prev.getIn(['tasks', taskId, 'pending', 0, 0])
        if (!XList) {
          return
        }
        const XYList = List().push(XList).push(fromJS(Y))
        const history = prev.getIn(['tasks', taskId, 'history'])
        prev.setIn(['tasks', taskId, 'history', history.size], XYList)
        prev.deleteIn(['tasks', taskId, 'pending', 0])
      })
    }
    default:
      return state
  }
}

module.exports = reducer
