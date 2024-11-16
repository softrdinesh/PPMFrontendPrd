import { columnType } from '@endpoints/column-type'
import { callApi } from 'src/utils/api-utils'

export const fetchColumnType = async () => {
  return callApi({ uriEndPoint: columnType.columnTypeList })
    .then(res => {
      return res?.data
    })
    .catch(err => {
      throw err
    })
}
