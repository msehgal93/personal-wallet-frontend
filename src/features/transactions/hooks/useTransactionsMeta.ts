import { useQuery } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'

/**
 * Fetches pagination metadata (count, default limit/skip) for a wallet.
 * Backend includes `pagination` only when skip/limit are omitted.
 */
export function useTransactionsMeta(
  walletId: string | null,
  sortBy: 'date' | 'amount' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  return useQuery({
    queryKey: ['transactions', walletId, 'meta', sortBy, sortOrder],
    queryFn: () => {
      if (!walletId) {
        throw new Error('Wallet ID is required')
      }
      return transactionService.getAll({
        walletId,
        // omit skip/limit on purpose to get pagination metadata from backend
        sortBy,
        sortOrder,
      })
    },
    enabled: !!walletId,
    staleTime: 30 * 1000,
    retry: 3,
  })
}

