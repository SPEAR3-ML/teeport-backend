const clientDef = () => {
  return {
    name: null,
    type: null,
    private: false,
    taskId: null,
    connectedAt: null,
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
    optimizerId: null,
    evaluatorId: null,
    pending: [],
    history: [],
    configs: {},
  }
}

module.exports = { clientDef, taskDef }
