import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import type { ApiError, ApiRequestConfig } from './types'

const DEFAULT_TIMEOUT = 10000 // 10 seconds
const DEFAULT_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second

// Base URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

/**
 * Creates an API error from various error types
 */
function createApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError

    // Network error (no response)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
        return {
          code: 'TIMEOUT',
          message: 'Request timeout. Please try again.',
          retryable: true,
        }
      }
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        retryable: true,
      }
    }

    // HTTP error (4xx, 5xx)
    const status = axiosError.response.status
    const isClientError = status >= 400 && status < 500
    const isServerError = status >= 500

    return {
      code: isClientError ? 'CLIENT_ERROR' : 'SERVER_ERROR',
      message: axiosError.response.data?.message || axiosError.message || 'An error occurred',
      status,
      retryable: isServerError, // Retry only server errors
    }
  }

  // Parse error or unknown error
  if (error instanceof SyntaxError) {
    return {
      code: 'PARSE_ERROR',
      message: 'Failed to parse response',
      retryable: false,
    }
  }

  return {
    code: 'NETWORK_ERROR',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    retryable: false,
  }
}

/**
 * Calculates exponential backoff delay
 */
function getRetryDelay(attempt: number, baseDelay: number): number {
  return baseDelay * Math.pow(2, attempt)
}

/**
 * Determines if a request should be retried
 */
function shouldRetry(error: ApiError, attempt: number, maxRetries: number): boolean {
  if (attempt >= maxRetries) return false
  if (!error.retryable) return false
  return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT' || error.code === 'SERVER_ERROR'
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry logic wrapper
 */
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  config: ApiRequestConfig,
  attempt = 0
): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    const apiError = createApiError(error)
    const maxRetries = config.retries ?? DEFAULT_RETRIES

    if (shouldRetry(apiError, attempt, maxRetries)) {
      const delay = getRetryDelay(attempt, config.retryDelay ?? DEFAULT_RETRY_DELAY)
      await sleep(delay)
      return retryRequest(requestFn, config, attempt + 1)
    }

    throw apiError
  }
}

/**
 * Creates and configures an Axios instance with interceptors
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add any auth tokens, request IDs, etc. here if needed
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Error transformation happens in createApiError
      return Promise.reject(error)
    }
  )

  return client
}

// Create the API client instance
const apiClient = createApiClient()

/**
 * API Client with retry logic
 */
export const api = {
  /**
   * GET request with retry logic
   */
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    const { retries, retryDelay, timeout, ...axiosConfig } = config || {}
    
    if (timeout) {
      axiosConfig.timeout = timeout
    }

    return retryRequest(
      () => apiClient.get<T>(url, axiosConfig).then((res) => res.data),
      { retries, retryDelay }
    )
  },

  /**
   * POST request with retry logic
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    const { retries, retryDelay, timeout, ...axiosConfig } = config || {}
    
    if (timeout) {
      axiosConfig.timeout = timeout
    }

    return retryRequest(
      () => apiClient.post<T>(url, data, axiosConfig).then((res) => res.data),
      { retries, retryDelay }
    )
  },

  /**
   * PUT request with retry logic
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    const { retries, retryDelay, timeout, ...axiosConfig } = config || {}
    
    if (timeout) {
      axiosConfig.timeout = timeout
    }

    return retryRequest(
      () => apiClient.put<T>(url, data, axiosConfig).then((res) => res.data),
      { retries, retryDelay }
    )
  },

  /**
   * DELETE request with retry logic
   */
  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    const { retries, retryDelay, timeout, ...axiosConfig } = config || {}
    
    if (timeout) {
      axiosConfig.timeout = timeout
    }

    return retryRequest(
      () => apiClient.delete<T>(url, axiosConfig).then((res) => res.data),
      { retries, retryDelay }
    )
  },
}

export { createApiError }
export default api
