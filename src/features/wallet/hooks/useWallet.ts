import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { walletService } from '../services/walletService'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'
import { useWalletStore } from '../../../store/slices/walletSlice'
import type { Wallet } from '../types/wallet.types'

const WALLET_ID_KEY = 'walletId'

/**
 * Hook to fetch wallet data
 */
export function useWallet() {
  const [walletId] = useLocalStorage<string | null>(WALLET_ID_KEY, null)
  const { setWallet, setLoading, setError } = useWalletStore()

  const query = useQuery<Wallet>({
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
  })

  useEffect(() => {
    if (!walletId) {
      setWallet(null)
      setLoading(false)
      setError(null)
      return
    }

    if (query.status === 'pending') {
      setLoading(true)
      return
    }

    if (query.status === 'success') {
      setWallet(query.data)
      setLoading(false)
      setError(null)
      return
    }

    if (query.status === 'error') {
      const message = query.error instanceof Error ? query.error.message : 'Failed to fetch wallet'
      setError(message)
      setLoading(false)
    }
  }, [walletId, query.status, query.data, query.error, setError, setLoading, setWallet])

  return {
    ...query,
    walletId,
  }
}
