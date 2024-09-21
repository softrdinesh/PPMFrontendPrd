import { subTask } from '@endpoints/sub-task'
import toast from 'react-hot-toast'
import { callApi } from 'src/utils/api-utils'

export const fetchSubTaskList = async taskID => {
  return callApi({ uriEndPoint: subTask.subTaskList, query: { taskID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addSubTask = async body => {
  return callApi({ uriEndPoint: subTask.addSubTask, body })
    .then(res => {
      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to add subtask')

      return err
    })
}

export const updateSubTask = async ({ id, body }) => {
  return callApi({ uriEndPoint: subTask.updateSubTask, pathParams: { id }, body })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const deleteSubTask = async id => {
  return callApi({ uriEndPoint: subTask.delete, pathParams: { id } })
    .then(res => {
      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to delete subtask')

      return err
    })
}

export const fetchSubTaskColumns = async query => {
  return callApi({ uriEndPoint: subTask.getColumn, query })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to fetch column')

      return err
    })
}

export const createSubTaskColumn = async body => {
  return callApi({ uriEndPoint: subTask.createColumn, body })
    .then(res => {
      toast.success(res?.message ?? 'Created Column Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to create column')

      return err
    })
}
