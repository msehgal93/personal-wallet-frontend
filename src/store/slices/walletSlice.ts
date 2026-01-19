import { create } from 'zustand'

interface Wallet {
  id: string
  balance: number
  name: string
  date: string
}

interface WalletState {
  wallet: Wallet | null
  isLoading: boolean
  error: string | null
  setWallet: (wallet: Wallet | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearWallet: () => void
}

/**
 * Wallet store using Zustand
 * This will be used in Phase 2 for wallet state management
 */
export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  isLoading: false,
  error: null,
  setWallet: (wallet) => set({ wallet, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearWallet: () => set({ wallet: null, error: null }),
}))
