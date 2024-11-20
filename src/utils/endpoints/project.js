import { defaults } from './defaults'

export const project = {
  projectList: {
    ...defaults.methods.GET,
    uri: '/api/project'
  },
  addProject: {
    ...defaults.methods.POST,
    uri: '/api/project'
  },
  viewProject: {
    ...defaults.methods.GET,
    uri: '/api/project/:id'
  },
  updateProject: {
    ...defaults.methods.PUT,
    uri: '/api/project/:id'
  },
  priorityList: {
    ...defaults.methods.GET,
    uri: '/api/project-priority'
  },
  priorityAdd: {
    ...defaults.methods.POST,
    uri: '/api/project-priority'
  },
  priorityUpdate: {
    ...defaults.methods.PUT,
    uri: '/api/project-priority/:id'
  },
  statusList: {
    ...defaults.methods.GET,
    uri: '/api/project-status'
  },
  statusAdd: {
    ...defaults?.methods?.POST,
    uri: '/api/project-status'
  },
  statusUpdate: {
    ...defaults?.methods?.PUT,
    uri: '/api/project-status/:id'
  },
  dropdownList: {
    ...defaults.methods.GET,
    uri: '/api/dropdown-items'
  },
  dropdownAdd: {
    ...defaults.methods.POST,
    uri: '/api/dropdown-items'
  },
  dropdownUpdate: {
    ...defaults.methods.PUT,
    uri: '/api/dropdown-items/:id'
  },
  inviteMember: {
    ...defaults?.methods?.POST,
    uri: '/api/invite-user'
  },
  acceptInvite: {
    ...defaults.methods.POST,
    uri: '/api/accept-invite/:id'
  },
  projectMembers: {
    ...defaults.methods.GET,
    uri: '/api/project-members'
  }
}
