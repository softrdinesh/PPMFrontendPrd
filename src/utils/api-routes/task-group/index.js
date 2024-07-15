import { taskGroup } from '@endpoints/task-group'
import toast from 'react-hot-toast'
import { callApi } from 'src/utils/api-utils'

export const fetchTaskGroupList = async workspaceID => {
  return callApi({ uriEndPoint: taskGroup.taskGroupList, query: { workspaceID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const viewTaskGroup = async id => {
  return callApi({ uriEndPoint: taskGroup.viewTaskGroup, pathParams: { id } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const updateTaskGroup = async ({ id, body }) => {
  return callApi({ uriEndPoint: taskGroup.updateTaskGroup, pathParams: { id }, body })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addTaskGroup = async body => {
  return callApi({ uriEndPoint: taskGroup.addTaskGroup, body })
    .then(res => {
      toast.success(res?.message ?? 'Project Added Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Project Added Successfully')

      return err
    })
}
