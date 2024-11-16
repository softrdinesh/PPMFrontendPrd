import { defaults } from './defaults'

export const recentActivity = {
  list: {
    ...defaults.methods.GET,
    uri: '/api/recent-activity'
  }
}
