import { defaults } from './defaults'

export const workspace = {
  workspaceList: {
    ...defaults.methods.GET,
    uri: '/api/workspace'
  },
  addWorkspace: {
    ...defaults.methods.POST,
    uri: '/api/workspace'
  }
}
