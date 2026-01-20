export type ApiError = {
  code: 'NETWORK_ERROR' | 'TIMEOUT' | 'SERVER_ERROR' | 'CLIENT_ERROR' | 'PARSE_ERROR'
  message: string
  status?: number
  retryable: boolean
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: ApiError
}

export interface ApiRequestConfig {
  retries?: number
  retryDelay?: number
  timeout?: number
}
