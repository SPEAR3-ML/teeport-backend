const clientDef = () => {
  return {
    name: null,
    type: null,
    taskId: null,
    configs: {},
  }
}

const taskDef = () => {
  return {
    name: null,
    createdAt: null,
    startedAt: null,
    stoppedAt: null,
    archivedAt: null,
    status: 'init',
    algorithmId: null,
    evaluatorId: null,
    history: [],
    configs: {},
  }
}

module.exports = { clientDef, taskDef }
