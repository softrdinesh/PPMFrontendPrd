import { callApi } from 'src/utils/api-utils'
import { bugQueue } from './endpoint'
import type { BugQueueListAPI } from './types'

export const fetchBugQueueList = async (): Promise<BugQueueListAPI[]> => {
  return callApi({ uriEndPoint: bugQueue.list })
    .then(res => {
      console.log('res :', res)

      return res?.data
    })
    .catch(err => {
      console.log('err :', err)

      return []
    })
}
