import { project } from '@endpoints/project'
import toast from 'react-hot-toast'
import { callApi } from 'src/utils/api-utils'

export const fetchProjectList = async workspaceID => {
  return callApi({ uriEndPoint: project.projectList, query: { workspaceID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const viewProject = async id => {
  return callApi({ uriEndPoint: project.viewProject, pathParams: { id } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      return err
    })
}

export const updateProject = async ({ id, body }) => {
  return callApi({ uriEndPoint: project.updateProject, pathParams: { id }, body })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addProject = async body => {
  return callApi({ uriEndPoint: project.addProject, body })
    .then(res => {
      toast.success(res?.message ?? 'Project Added Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Project Added Successfully')

      return err
    })
}

export const fetchProjectPriorityList = async ({ taskGroupID = null }) => {
  return callApi({ uriEndPoint: project.priorityList, query: { taskGroupID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addProjectPriority = async body => {
  return callApi({ uriEndPoint: project.priorityAdd, body })
    .then(res => res)
    .catch(err => err)
}

export const updateProjectPriority = async ({ body, id }) => {
  return callApi({ uriEndPoint: project.priorityUpdate, pathParams: { id }, body })
    .then(res => res)
    .catch(err => err)
}

export const fetchProjectStatusList = async ({ taskGroupID = null }) => {
  return callApi({ uriEndPoint: project.statusList, query: { taskGroupID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addProjectStatus = async body => {
  return callApi({ uriEndPoint: project.statusAdd, body })
    .then(res => res)
    .catch(err => err)
}

export const updateProjectStatus = async ({ body, id }) => {
  return callApi({ uriEndPoint: project.statusUpdate, pathParams: { id }, body })
    .then(res => res)
    .catch(err => err)
}

export const fetchProjectDropDownList = async ({ taskGroupID = null }) => {
  return callApi({ uriEndPoint: project.dropdownList, query: { taskGroupID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addDropdownItem = async body => {
  return callApi({ uriEndPoint: project.dropdownAdd, body })
    .then(res => res)
    .catch(err => err)
}

export const inviteMember = async body => {
  return callApi({ uriEndPoint: project.inviteMember, body })
    .then(res => {
      toast.success(res?.message ?? 'Invitation sent successfully')

      return res
    })
    .catch(err => err)
}

export const acceptInvitationApi = async id => {
  return callApi({ uriEndPoint: project.acceptInvite, pathParams: { id } })
    .then(res => res)
    .catch(err => err)
}

export const projectMembers = async projectID => {
  return callApi({ uriEndPoint: project.projectMembers, query: { projectID } })
    .then(res => res?.data)
    .catch(err => err)
}
