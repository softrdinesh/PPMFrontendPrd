import { defaults } from './defaults'

export const taskGroup = {
  taskGroupList: {
    ...defaults.methods.GET,
    uri: '/api/project'
  },
  addTaskGroup: {
    ...defaults.methods.POST,
    uri: '/api/project'
  },
  viewTaskGroup: {
    ...defaults.methods.GET,
    uri: '/api/project/:id'
  },
  updateTaskGroup: {
    ...defaults.methods.PUT,
    uri: '/api/project/:id'
  }
}
