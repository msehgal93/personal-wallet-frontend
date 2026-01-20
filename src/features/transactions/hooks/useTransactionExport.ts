import { useQuery } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import { convertToCSV, downloadCSV } from '../../../shared/utils/csv'
import type { Transaction } from '../types/transaction.types'

/**
 * Hook to export all transactions as CSV
 */
export function useTransactionExport(walletId: string | null) {
  // Fetch all transactions without pagination for export
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', walletId, 'export'],
    queryFn: () => {
      if (!walletId) {
        throw new Error('Wallet ID is required')
      }
      // Fetch a large number to get all transactions
      return transactionService.getAll({
        walletId,
        skip: 0,
        limit: 10000,
        sortBy: 'date',
        sortOrder: 'desc',
      })
    },
    enabled: !!walletId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const exportToCSV = () => {
    if (!data?.data || data.data.length === 0) {
      return
    }

    const headers: { key: keyof Transaction; label: string }[] = [
      { key: 'date', label: 'Date' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'balance', label: 'Balance' },
      { key: 'description', label: 'Description' },
    ]

    const csvContent = convertToCSV(data.data, headers)
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(csvContent, filename)
  }

  return {
    exportToCSV,
    isLoading,
    hasData: !!data?.data && data.data.length > 0,
  }
}
