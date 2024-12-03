import { taskUpdates } from '@endpoints/task-updates'
import { callApi } from 'src/utils/api-utils'

export const fetchTaskUpdatesList = async taskID => {
  return callApi({ uriEndPoint: taskUpdates.list, pathParams: { taskID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const writeTaskUpdate = async body => {
  return callApi({ uriEndPoint: taskUpdates.writeUpdate, body })
    .then(res => res)
    .catch(err => {
      throw err
    })
}
