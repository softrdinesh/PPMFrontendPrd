import { defaults } from './defaults'

export const project = {
  projectList: {
    ...defaults.methods.GET,
    uri: '/api/project'
  },
  addProject: {
    ...defaults.methods.POST,
    uri: '/api/project'
  }
}
