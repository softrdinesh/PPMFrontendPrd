import { taskGroup } from '@endpoints/task-group'
import toast from 'react-hot-toast'
import { callApi } from 'src/utils/api-utils'

export const fetchTaskGroupList = async projectID => {
  return callApi({ uriEndPoint: taskGroup.taskGroupList, query: { projectID } })
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

export const createColumn = async body => {
  return callApi({ uriEndPoint: taskGroup.createColumn, body })
    .then(res => {
      toast.success(res?.message ?? 'Created Column Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to create column')

      return err
    })
}

export const updateColumn = async ({ body, id }) => {
  return callApi({ uriEndPoint: taskGroup.updateColumn, pathParams: { id }, body })
    .then(res => {
      toast.success(res?.message ?? 'Updated Column Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to update column')

      return err
    })
}

export const deleteColumn = async id => {
  return callApi({ uriEndPoint: taskGroup.deleteColumn, pathParams: { id } })
    .then(res => {
      toast.success(res?.message ?? 'Deleted Column Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to delete column')

      return err
    })
}
