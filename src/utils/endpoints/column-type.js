import { defaults } from './defaults'

export const columnType = {
  columnTypeList: {
    ...defaults.methods.GET,
    uri: '/api/column-type'
  }
}
