// Transaction feature types
// Will be implemented in Phase 2

export type TransactionType = 'CREDIT' | 'DEBIT'

export interface Transaction {
  id: string
  walletId: string
  amount: number
  balance: number
  description: string
  date: string
  type: TransactionType
}

export interface CreateTransactionRequest {
  amount: number
  description: string
}

export interface CreateTransactionResponse {
  balance: number
  amount: number
  description: string
  transactionId: string
  walletId: string
  type: TransactionType
}

export interface TransactionsQueryParams {
  walletId: string
  skip?: number
  limit?: number
  sortBy?: 'date' | 'amount'
  sortOrder?: 'asc' | 'desc'
}

export interface TransactionsResponse {
  data: Transaction[]
  pagination: {
    skip: number
    limit: number
  }
}
