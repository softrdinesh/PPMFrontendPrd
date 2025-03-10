import toast from 'react-hot-toast'

import { callApi } from '@/utils/api-utils'
import { taskGroup } from './endpoint'
import type { DynamicDropdownList } from './types'

export const fetchTaskGroupList = async (projectID: string) => {
  return callApi({ uriEndPoint: taskGroup.list, query: { projectID } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const viewTaskGroup = async (id: string) => {
  return callApi({ uriEndPoint: taskGroup.view, pathParams: { id } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const updateTaskGroup = async ({ id, body }: { id: string; body: any }) => {
  return callApi({ uriEndPoint: taskGroup.update, pathParams: { id }, body })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addTaskGroup = async (body: any) => {
  return callApi({ uriEndPoint: taskGroup.add, body })
    .then(res => {
      toast.success(res?.message ?? 'Project Added Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Project Added Successfully')

      return err
    })
}

export const createColumn = async (body: any) => {
  return callApi({ uriEndPoint: taskGroup.createColumn, body })
    .then(res => {
      toast.success(res?.message ?? 'Created Column Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to create column')

      return err
    })
}

export const updateColumn = async ({ body, id }: { body: any; id: string }) => {
  return callApi({ uriEndPoint: taskGroup.updateColumn, pathParams: { id }, body })
    .then(res => {
      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to update column')

      return err
    })
}

export const deleteColumn = async (id: string, isSubTask: boolean) => {
  return callApi({ uriEndPoint: taskGroup.deleteColumn, pathParams: { id }, query: { isSubTask: isSubTask ? 1 : 0 } })
    .then(res => {
      toast.success(res?.message ?? 'Deleted Column Successfully')

      return res
    })
    .catch(err => {
      toast.error(err?.message ?? 'Failed to delete column')

      return err
    })
}

// ** DROPDOWN APIS
export const fetchDropDownList = async ({ taskGroupID }: { taskGroupID: string }): Promise<DynamicDropdownList[]> => {
  return callApi({ uriEndPoint: taskGroup.dropdownList, query: { taskGroupID: taskGroupID || '' } })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}

export const addDropdownItem = async (body: any) => {
  return callApi({ uriEndPoint: taskGroup.dropdownAdd, body })
    .then(res => res)
    .catch(err => err)
}
