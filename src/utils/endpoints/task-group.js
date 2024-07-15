import { defaults } from './defaults'

export const taskGroup = {
  taskGroupList: {
    ...defaults.methods.GET,
    uri: '/api/task-group'
  },
  addTaskGroup: {
    ...defaults.methods.POST,
    uri: '/api/task-group'
  },
  viewTaskGroup: {
    ...defaults.methods.GET,
    uri: '/api/task-group/:id'
  },
  updateTaskGroup: {
    ...defaults.methods.PUT,
    uri: '/api/task-group/:id'
  }
}
