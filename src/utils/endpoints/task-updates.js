import { defaults } from './defaults'

export const taskUpdates = {
  list: {
    ...defaults.methods.GET,
    uri: '/api/task-updates/:taskID'
  },
  writeUpdate: {
    ...defaults.methods.POST,
    uri: '/api/task-updates'
  },
  likeUpdate: {
    ...defaults.methods.PUT,
    uri: '/api/task-updates/like/:id'
  },
  replyUpdate: {
    ...defaults.methods.POST,
    uri: '/api/task-updates/reply'
  }
}
