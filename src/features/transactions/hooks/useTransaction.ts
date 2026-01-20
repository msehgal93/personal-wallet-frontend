import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import type { CreateTransactionRequest } from '../types/transaction.types'
import { useWalletStore } from '../../../store/slices/walletSlice'
import { useUIStore } from '../../../store/slices/uiSlice'

/**
 * Hook for creating credit/debit transactions
 */
export function useTransaction() {
  const queryClient = useQueryClient()
  const { wallet, setWallet } = useWalletStore()
  const { addToast } = useUIStore()

  return useMutation({
    mutationFn: ({ walletId, data }: { walletId: string; data: CreateTransactionRequest }) =>
      transactionService.create(walletId, data),
    onSuccess: (data, variables) => {
      // Optimistically update wallet balance
      if (wallet) {
        setWallet({
          ...wallet,
          balance: data.balance,
        })
      }

      // Invalidate transactions list to refetch
      queryClient.invalidateQueries({ queryKey: ['transactions', variables.walletId] })
      
      // Invalidate wallet query to refetch latest balance
      queryClient.invalidateQueries({ queryKey: ['wallet', variables.walletId] })

      addToast({
        message: `Transaction ${data.type === 'CREDIT' ? 'credited' : 'debited'} successfully!`,
        type: 'success',
      })
    },
    onError: (error: Error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process transaction'
      addToast({
        message: errorMessage,
        type: 'error',
      })
    },
  })
}
