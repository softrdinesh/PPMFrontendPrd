import { recentActivity } from '@endpoints/recent-activity'
import { callApi } from 'src/utils/api-utils'

export const fetchRecentActivityList = async ({ taskID }) => {
  return callApi({ uriEndPoint: recentActivity.list, query: { taskID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      return err
    })
}
