import { callApi } from '@/utils/api-utils'
import { sprint } from './endpoint'
import type { SprintItem } from './types'
import type { ApiResponse } from '@/types/api-response'

export const fetchSprintListBasic = async (workspaceID: string): Promise<SprintItem[]> => {
  return callApi({ uriEndPoint: sprint.listBasic, query: { workspaceID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const fetchSprintList = async (params: any): Promise<ApiResponse<SprintItem[]>> => {
  return callApi({ uriEndPoint: sprint.list, query: params })
}

export const createSprint = async (body: any) => {
  return callApi({ uriEndPoint: sprint.add, body })
}

export const updateSprint = async ({ id, body }: { id: string; body: any }) => {
  return callApi({ uriEndPoint: sprint.update, pathParams: { id }, body })
}
export const deleteSprint = async (id: string) => {
  return callApi({ uriEndPoint: sprint.deleteItem, pathParams: { id } })
}
