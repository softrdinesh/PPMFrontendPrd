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

export const likeTaskUpdate = async id => {
  return callApi({ uriEndPoint: taskUpdates.likeUpdate, pathParams: { id } })
    .then(res => res)
    .catch(err => {
      throw err
    })
}

export const giveReplyToUpdate = async body => {
  return callApi({ uriEndPoint: taskUpdates.replyUpdate, body })
    .then(res => res)
    .catch(err => {
      throw err
    })
}
