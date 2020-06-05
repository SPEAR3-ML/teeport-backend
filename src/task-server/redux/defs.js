const clientDef = () => {
  return {
    name: null,
    type: null,
    classId: null, // which class does it belong to, like NSGA-II and ZDT-2
    private: false,
    taskId: null,
    connectedAt: null,
    configs: {},
    descr: null,
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
    optimizerId: null, // optimizer socket id
    algorithmId: null, // optimizer id, like NSGA-II
    evaluatorId: null, // evaluator socket id
    problemId: null, // evaluator id, like ZDT-2
    pending: [],
    history: [],
    configs: {},
    descr: null,
  }
}

module.exports = { clientDef, taskDef }
