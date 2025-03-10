export type ApiResponse = {
  status: boolean
  statusCode: number
  message: string
  data: any
}

export type CookieEncData = {
  token: string
  tokenTime: number
  refreshTokenTime: number
  refreshToken: string
}
