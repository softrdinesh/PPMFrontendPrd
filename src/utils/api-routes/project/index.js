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
      throw err
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

export const fetchProjectPriorityList = async () => {
  return callApi({ uriEndPoint: project.priorityList })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
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
