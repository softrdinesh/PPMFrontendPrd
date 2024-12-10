import { defaults } from './defaults'

export const taskUpdates = {
  list: {
    ...defaults.methods.GET,
    uri: '/api/task-updates/:taskID'
  },
  writeUpdate: {
    ...defaults.methods.POST,
    uri: '/api/task-updates'
  }
}
