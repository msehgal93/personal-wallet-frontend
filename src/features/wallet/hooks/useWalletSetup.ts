import { useMutation, useQueryClient } from '@tanstack/react-query'
import { walletService } from '../services/walletService'
import type { SetupWalletRequest, SetupWalletResponse } from '../types/wallet.types'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'
import { useWalletStore } from '../../../store/slices/walletSlice'
import { useUIStore } from '../../../store/slices/uiSlice'

const WALLET_ID_KEY = 'walletId'

/**
 * Hook for wallet setup mutation
 */
export function useWalletSetup() {
  const queryClient = useQueryClient()
  const [, setWalletId] = useLocalStorage<string | null>(WALLET_ID_KEY, null)
  const { setWallet, setLoading, setError } = useWalletStore()
  const { addToast } = useUIStore()

  return useMutation({
    mutationFn: (data: SetupWalletRequest) => walletService.setup(data),
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (data: SetupWalletResponse) => {
      // Save wallet ID to localStorage
      setWalletId(data.id)
      
      // Update wallet store
      setWallet({
        id: data.id,
        balance: data.balance,
        name: data.name,
        date: data.date,
      })
      
      // Invalidate and refetch wallet query
      queryClient.invalidateQueries({ queryKey: ['wallet', data.id] })
      
      setLoading(false)
      addToast({
        message: `Wallet "${data.name}" created successfully!`,
        type: 'success',
      })
    },
    onError: (error: Error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create wallet'
      setError(errorMessage)
      setLoading(false)
      addToast({
        message: errorMessage,
        type: 'error',
      })
    },
  })
}
