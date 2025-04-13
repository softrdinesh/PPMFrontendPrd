import type { ApiEndpoint } from '@/types/api-utils'

type Endpoints = {
  list: ApiEndpoint
}

export const bugQueue: Endpoints = {
  list: {
    method: 'GET',
    uri: '/api/bug-queue'
  }
}
