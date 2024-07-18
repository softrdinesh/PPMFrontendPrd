import { defaults } from './defaults'

export const task = {
  taskList: {
    ...defaults.methods.GET,
    uri: '/api/task'
  },
  addTask: {
    ...defaults.methods.POST,
    uri: '/api/task'
  },
  viewTask: {
    ...defaults.methods.GET,
    uri: '/api/task/:id'
  },
  updateTask: {
    ...defaults.methods.PUT,
    uri: '/api/task/:id'
  }
}
