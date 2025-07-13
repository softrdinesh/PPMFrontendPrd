import type { ApiEndpoint } from '@/types/api-utils'

type SprintEndpoints = {
  list: ApiEndpoint
  add: ApiEndpoint
  deleteItem: ApiEndpoint
}

export const sprint: SprintEndpoints = {
  list: {
    method: 'GET',
    uri: '/api/sprints'
  },
  add: {
    method: 'POST',
    uri: '/api/sprints'
  },
  deleteItem: {
    method: 'DELETE',
    uri: '/api/sprints/:id'
  }
}
