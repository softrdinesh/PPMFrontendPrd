import { defaults } from './defaults'

export const project = {
  addProject: {
    ...defaults.methods.POST,
    uri: '/api/project'
  }
}
