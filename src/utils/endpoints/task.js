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
  },
  deleteMulitpleTask: {
    ...defaults.methods.DELETE,
    uri: '/api/task-delete-mulitple'
  },
  dlDynamicValue: {
    ...defaults.methods.DELETE,
    uri: '/api/dynamic-task/:dynamicId'
  },
  subTaskList: {
    ...defaults.methods.GET,
    uri: '/api/sub-task'
  },
  addSubTask: {
    ...defaults.methods.POST,
    uri: '/api/sub-task'
  },
  fileUpload: {
    ...defaults.methods.POST,
    uri: '/api/task/fileupload/:id',
    headerProps: {
      'Content-Type': 'multipart-formdata'
    }
  }
}
