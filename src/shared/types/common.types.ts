// Common shared types

export type SortOrder = 'asc' | 'desc'

export type SortBy = 'date' | 'amount'

export interface PaginationParams {
  skip: number
  limit: number
}

export interface PaginationResponse {
  skip: number
  limit: number
}
