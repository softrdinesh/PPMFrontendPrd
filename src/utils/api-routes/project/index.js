import { project } from '@endpoints/project'
import toast from 'react-hot-toast'
import { callApi } from 'src/utils/api-utils'

export const fetchProjectList = async workspaceID => {
  return callApi({ uriEndPoint: project.projectList, body: { workspaceID } })
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

      return res?.data
    })
    .catch(err => {
      throw err
    })
}
