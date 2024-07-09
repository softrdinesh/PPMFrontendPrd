import { project } from '@endpoints/project'
import { callApi } from 'src/utils/api-utils'

export const fetchProjectList = async () => {
  return callApi({ uriEndPoint: project.projectList })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}
