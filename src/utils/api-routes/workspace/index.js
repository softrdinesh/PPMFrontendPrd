import { workspace } from '@endpoints/workspace'
import toast from 'react-hot-toast'
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

export const addWorkspace = async body => {
  return callApi({ uriEndPoint: workspace.addWorkspace, body })
    .then(res => {
      toast.success(res?.message ?? 'Workspace Added Successfully')

      return res?.data
    })
    .catch(err => {
      throw err
    })
}
