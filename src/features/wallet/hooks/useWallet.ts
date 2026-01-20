import { useQuery } from '@tanstack/react-query'
import { walletService } from '../services/walletService'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'
import { useWalletStore } from '../../../store/slices/walletSlice'

const WALLET_ID_KEY = 'walletId'

/**
 * Hook to fetch wallet data
 */
export function useWallet() {
  const [walletId] = useLocalStorage<string | null>(WALLET_ID_KEY, null)
  const { setWallet, setLoading, setError } = useWalletStore()

  const query = useQuery({
    queryKey: ['wallet', walletId],
    queryFn: () => {
      if (!walletId) {
        throw new Error('No wallet ID found')
      }
      return walletService.getById(walletId)
    },
    enabled: !!walletId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    onSuccess: (data) => {
      setWallet(data)
      setLoading(false)
      setError(null)
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to fetch wallet')
      setLoading(false)
    },
  })

  return {
    ...query,
    walletId,
  }
}
