import { task } from '@endpoints/task'
import toast from 'react-hot-toast'
import { callApi } from 'src/utils/api-utils'

export const fetchTaskList = async taskGroupID => {
  return callApi({ uriEndPoint: task.taskList, query: { taskGroupID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const viewTask = async id => {
  return callApi({ uriEndPoint: task.viewTask, pathParams: { id } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const updateTask = async ({ id, body }) => {
  return callApi({ uriEndPoint: task.updateTask, pathParams: { id }, body })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addTask = async body => {
  return callApi({ uriEndPoint: task.addTask, body })
    .then(res => {
      toast.success(res?.message ?? 'Task Added Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Task Added Successfully')

      return err
    })
}

export const deleteMultipleTask = async body => {
  return callApi({ uriEndPoint: task.deleteMulitpleTask, body: { taskIds: body } })
    .then(res => {
      toast.success(res?.message ?? 'Tasks Deleted Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to delete tasks')

      return err
    })
}

export const deleteDynamicValue = async dynamicId => {
  return callApi({ uriEndPoint: task.dlDynamicValue, pathParams: { dynamicId } })
    .then(res => {
      return res
    })
    .catch(err => {
      return err
    })
}
