const { List, fromJS } = require('immutable')

const {
  CONNECT, DISCONNECT, RENAME_CLIENT, OBSERVE_TASK, UPDATE_CLIENT_DESCR,
  IMPORT_TASKS, NEW_TASK, UPDATE_TASK, PAUSE_TASK, START_TASK, STOP_TASK, COMPLETE_TASK, RENAME_TASK,
  NEW_BENCHMARK_TASK, ARCHIVE_TASK, UNARCHIVE_TASK, DELETE_TASK, UPDATE_TASK_DESCR, NEW_RUN,
  EVALUATE, EVALUATED,
} = require('./actionTypes')
const { clientDef, taskDef, benchmarkTaskDef } = require('./defs')

const initialState = fromJS({
  clients: {},
  tasks: {},
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT: {
      const client = clientDef()
      const { id, client: _client } = action
      const { name, type, classId, taskId, configs, private: priv } = _client
      client.name = name
      client.type = type
      client.classId = classId
      client.taskId = taskId
      client.configs = configs
      client.private = priv
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
    case OBSERVE_TASK: {
      return state.withMutations(prev => {
        const client = prev.getIn(['clients', action.clientId])
        if (client) {
          const task = prev.getIn(['tasks', action.taskId])
          if (task) {
            prev.setIn(['clients', action.clientId, 'taskId'], action.taskId)
          }
        }
      })
    }
    case UPDATE_CLIENT_DESCR: {
      return state.withMutations(prev => {
        const client = prev.getIn(['clients', action.id])
        if (client) {
          prev.setIn(['clients', action.id, 'descr'], action.descr)
        }
      })
    }
    case IMPORT_TASKS: {
      return state.withMutations(prev => {
        action.tasks.forEach(task => {
          if (!prev.getIn(['tasks', task.id])) {
            prev.setIn(['tasks', task.id], fromJS(task))
          }
        })
      })
    }
    case NEW_TASK: {
      const task = taskDef()
      const { id, task: _task } = action
      const { configs, optimizerId, evaluatorId } = _task
      task.name = configs.task.name
      task.optimizerId = optimizerId
      task.evaluatorId = evaluatorId
      task.configs = configs
      task.createdAt = Date.now()
      return state.withMutations(prev => {
        let evalTaskIds = prev.getIn(['clients', evaluatorId, 'taskId'])
        if (!evalTaskIds) {
          evalTaskIds = List()
        }
        evalTaskIds = evalTaskIds.push(id)
        const algorithmId = prev.getIn(['clients', optimizerId, 'classId'])
        const problemId = prev.getIn(['clients', evaluatorId, 'classId'])
        task.algorithmId = algorithmId
        task.problemId = problemId
        prev.setIn(['tasks', id], fromJS(task))
        prev.setIn(['clients', optimizerId, 'taskId'], id)
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
        const optimizerId = prev.getIn(['tasks', action.id, 'optimizerId'])
        const evaluatorId = prev.getIn(['tasks', action.id, 'evaluatorId'])
        if (['init', 'paused', 'running'].includes(status)) {
          prev.setIn(['tasks', action.id, 'stoppedAt'], Date.now())
          prev.setIn(['tasks', action.id, 'status'], 'cancelled')
          const optimizer = prev.getIn(['clients', optimizerId])
          if (optimizer) {
            prev.setIn(['clients', optimizerId, 'taskId'], null)
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
        const optimizerId = prev.getIn(['tasks', action.id, 'optimizerId'])
        const evaluatorId = prev.getIn(['tasks', action.id, 'evaluatorId'])
        if (status === 'running') {
          prev.setIn(['tasks', action.id, 'stoppedAt'], Date.now())
          prev.setIn(['tasks', action.id, 'status'], 'completed')
          const optimizer = prev.getIn(['clients', optimizerId])
          if (optimizer) {
            prev.setIn(['clients', optimizerId, 'taskId'], null)
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
    case NEW_BENCHMARK_TASK: {
      const task = benchmarkTaskDef()
      const { id, task: _task } = action
      const { configs, optimizerId, evaluatorId } = _task
      task.name = configs.task.name
      task.optimizerId = optimizerId
      task.evaluatorId = evaluatorId
      task.configs = configs
      task.createdAt = Date.now()
      return state.withMutations(prev => {
        let evalTaskIds = prev.getIn(['clients', evaluatorId, 'taskId'])
        if (!evalTaskIds) {
          evalTaskIds = List()
        }
        evalTaskIds = evalTaskIds.push(id)
        const algorithmId = prev.getIn(['clients', optimizerId, 'classId'])
        const problemId = prev.getIn(['clients', evaluatorId, 'classId'])
        task.algorithmId = algorithmId
        task.problemId = problemId
        prev.setIn(['tasks', id], fromJS(task))
        prev.setIn(['clients', optimizerId, 'taskId'], id)
        prev.setIn(['clients', evaluatorId, 'taskId'], evalTaskIds)
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
    case UPDATE_TASK_DESCR: {
      return state.withMutations(prev => {
        const task = prev.getIn(['tasks', action.id])
        if (task) {
          prev.setIn(['tasks', action.id, 'descr'], action.descr)
        }
      })
    }
    case NEW_RUN: {
      return state.withMutations(prev => {
        const task = prev.getIn(['tasks', action.id])
        if (task) {
          prev.updateIn(['tasks', action.id, 'currentRun'], run => run + 1)
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
        const currentRun = state.getIn(['tasks', taskId, 'currentRun']) // benchmark flag
        if (currentRun === undefined) { // normal task
          const history = prev.getIn(['tasks', taskId, 'history'])
          prev.setIn(['tasks', taskId, 'history', history.size], XYList)
        } else { // benchmark task
          const history = prev.getIn(['tasks', taskId, 'history', currentRun])
          let idx = 0
          if (history === undefined) { // first evaluation in a run
            // initialize the list
            prev.setIn(['tasks', taskId, 'history', currentRun], List())
          } else {
            idx = history.size
          }
          prev.setIn(['tasks', taskId, 'history', currentRun, idx], XYList)
        }
        prev.deleteIn(['tasks', taskId, 'pending', 0])
      })
    }
    default:
      return state
  }
}

module.exports = reducer
