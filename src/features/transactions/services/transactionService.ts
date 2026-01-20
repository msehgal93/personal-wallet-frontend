import api from '../../../shared/services/api/client'
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  TransactionsQueryParams,
  TransactionsResponse,
} from '../types/transaction.types'

export const transactionService = {
  /**
   * Create a credit/debit transaction
   */
  create: async (
    walletId: string,
    data: CreateTransactionRequest
  ): Promise<CreateTransactionResponse> => {
    return api.post<CreateTransactionResponse>(`/transaction/${walletId}`, data)
  },

  /**
   * Fetch transactions with pagination and sorting
   */
  getAll: async (params: TransactionsQueryParams): Promise<TransactionsResponse> => {
    const queryParams = new URLSearchParams()
    queryParams.set('walletId', params.walletId)
    if (params.skip !== undefined) queryParams.set('skip', params.skip.toString())
    if (params.limit !== undefined) queryParams.set('limit', params.limit.toString())
    if (params.sortBy) queryParams.set('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)

    return api.get<TransactionsResponse>(`/transaction?${queryParams.toString()}`)
  },
}
