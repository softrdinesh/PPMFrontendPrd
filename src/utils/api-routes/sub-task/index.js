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
      toast.success(res?.message ?? 'Sub Task Added Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to add subtask')

      return err
    })
}

export const deleteSubTask = async id => {
  return callApi({ uriEndPoint: subTask.delete, pathParams: { id } })
    .then(res => {
      toast.success(res?.message ?? 'Sub Task Deleted Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to delete subtask')

      return err
    })
}
