import { defaults } from './defaults'

export const subTask = {
  subTaskList: {
    ...defaults.methods.GET,
    uri: '/api/sub-task'
  },
  addSubTask: {
    ...defaults.methods.POST,
    uri: '/api/sub-task'
  },
  updateSubTask: {
    ...defaults.methods.PUT,
    uri: '/api/sub-task/:id'
  },
  delete: {
    ...defaults.methods.DELETE,
    uri: '/api/sub-task/:id'
  }
}
