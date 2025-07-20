import type { ApiEndpoint } from '@/types/api-utils'

type SprintEndpoints = {
  list: ApiEndpoint
  listBasic: ApiEndpoint
  add: ApiEndpoint
  update: ApiEndpoint
  deleteItem: ApiEndpoint
}

export const sprint: SprintEndpoints = {
  list: {
    method: 'GET',
    uri: '/api/sprints'
  },
  listBasic: {
    method: 'GET',
    uri: '/api/sprints-basic'
  },
  add: {
    method: 'POST',
    uri: '/api/sprints'
  },
  update: {
    method: 'PUT',
    uri: '/api/sprints/:id'
  },
  deleteItem: {
    method: 'DELETE',
    uri: '/api/sprints/:id'
  }
}
