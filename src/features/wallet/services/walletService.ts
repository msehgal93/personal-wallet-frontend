import api from '../../../shared/services/api/client'
import type { SetupWalletRequest, SetupWalletResponse, Wallet } from '../types/wallet.types'

export const walletService = {
  /**
   * Initialize a new wallet
   */
  setup: async (data: SetupWalletRequest): Promise<SetupWalletResponse> => {
    return api.post<SetupWalletResponse>('/wallet/setup', data)
  },

  /**
   * Get wallet by ID
   */
  getById: async (id: string): Promise<Wallet> => {
    return api.get<Wallet>(`/wallet/${id}`)
  },
}
