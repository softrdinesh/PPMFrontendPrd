import { defaults } from './defaults'

export const workspace = {
  workspaceList: {
    ...defaults.methods.GET,
    uri: '/api/workspace'
  }
}
