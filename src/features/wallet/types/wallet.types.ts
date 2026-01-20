// Wallet feature types
// Will be implemented in Phase 2

export interface Wallet {
  id: string
  balance: number
  name: string
  date: string
}

export interface SetupWalletRequest {
  name: string
  balance: number
}

export interface SetupWalletResponse {
  id: string
  balance: number
  transactionId: string
  name: string
  date: string
}
