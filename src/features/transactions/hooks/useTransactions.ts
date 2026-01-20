import { useQuery } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import type { TransactionsQueryParams } from '../types/transaction.types'

const DEFAULT_LIMIT = 10

/**
 * Hook to fetch transactions with pagination and sorting
 */
export function useTransactions(
  walletId: string | null,
  page: number = 1,
  limit: number = DEFAULT_LIMIT,
  sortBy: 'date' | 'amount' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const skip = (page - 1) * limit

  return useQuery({
    queryKey: ['transactions', walletId, page, limit, sortBy, sortOrder],
    queryFn: () => {
      if (!walletId) {
        throw new Error('Wallet ID is required')
      }
      const params: TransactionsQueryParams = {
        walletId,
        skip,
        limit,
        sortBy,
        sortOrder,
      }
      return transactionService.getAll(params)
    },
    enabled: !!walletId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  })
}
