import { callApi } from '@/utils/api-utils'
import { sprint } from './endpoint'

export const fetchSprintList = async (params: any) => {
  return callApi({ uriEndPoint: sprint.list, query: params })
}
