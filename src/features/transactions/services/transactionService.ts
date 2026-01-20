import api from '../../../shared/services/api/client'
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  Transaction,
  TransactionsPagination,
  TransactionsQueryParams,
  TransactionsResponse,
} from '../types/transaction.types'

type TransactionsApiResponse =
  | TransactionsResponse
  | { data: Transaction[]; pagination?: TransactionsPagination }
  | { data: { data: Transaction[] }; pagination?: TransactionsPagination }
  | { transactions: Transaction[]; pagination?: TransactionsPagination }
  | { transactions: { data: Transaction[]; limit?: number; skip?: number; count?: number }; pagination?: TransactionsPagination }
  | Transaction[]

const extractTransactions = (payload: unknown): Transaction[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const nested = (payload as { data?: unknown }).data
    if (Array.isArray(nested)) {
      return nested
    }
  }

  return []
}

const extractPagination = (payload: unknown): TransactionsPagination | undefined => {
  if (!payload || typeof payload !== 'object') {
    return undefined
  }

  if ('pagination' in payload) {
    const pagination = (payload as { pagination?: TransactionsPagination }).pagination
    if (pagination && typeof pagination === 'object') {
      return pagination
    }
  }

  if ('transactions' in payload) {
    const transactions = (payload as { transactions?: unknown }).transactions
    if (transactions && typeof transactions === 'object') {
      const { limit, skip, count } = transactions as Partial<TransactionsPagination> & {
        count?: number
      }

      if (typeof limit === 'number' && typeof skip === 'number') {
        return {
          limit,
          skip,
          ...(typeof count === 'number' ? { count } : {}),
        }
      }
    }
  }

  return undefined
}

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

    const res = await api.get<TransactionsApiResponse>(`/transaction?${queryParams.toString()}`)

    if (Array.isArray(res)) {
      return { data: res }
    }

    if ('transactions' in res) {
      const pagination = extractPagination(res)
      const data = extractTransactions(res.transactions)

      return {
        data,
        pagination,
      }
    }

    if ('data' in res) {
      const pagination = extractPagination(res)
      const data = extractTransactions(res.data)

      return {
        data,
        pagination,
      }
    }

    return { data: [] }
  },
}
