import { workspace } from '@endpoints/workspace'
import { callApi } from 'src/utils/api-utils'

export const fetchWorkspaceList = async () => {
  return callApi({ uriEndPoint: workspace.workspaceList })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}
