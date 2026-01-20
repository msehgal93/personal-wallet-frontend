import { useQuery } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import { convertToCSV, downloadCSV } from '../../../shared/utils/csv'

const DEFAULT_LIMIT = 10

type ExportRow = {
  date: string
  type: string
  amount: number
  balance: number
  description: string
}

/**
 * Hook to export all transactions as CSV
 */
export function useTransactionExport(walletId: string | null) {
  // Fetch pagination metadata (count) and first page (limit defaults to 10)
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', walletId, 'export'],
    queryFn: () => {
      if (!walletId) {
        throw new Error('Wallet ID is required')
      }
      return transactionService.getAll({
        walletId,
        sortBy: 'date',
        sortOrder: 'desc',
      })
    },
    enabled: !!walletId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const exportToCSV = async () => {
    if (!walletId) return

    const count = data?.pagination?.count
    const firstPage = data?.data ?? []

    if (firstPage.length === 0) return

    // If there are more than DEFAULT_LIMIT, refetch all in one call.
    // Backend returns only `data` when skip/limit are provided, which is fine.
    const allTransactions =
      count && count > DEFAULT_LIMIT
        ? (await transactionService.getAll({
            walletId,
            skip: 0,
            limit: count,
            sortBy: 'date',
            sortOrder: 'desc',
          })).data
        : firstPage

    const rows: ExportRow[] = allTransactions.map((t) => ({
      date: t.date,
      type: t.type,
      amount: t.amount,
      balance: t.balance,
      description: t.description,
    }))

    const headers: { key: keyof ExportRow; label: string }[] = [
      { key: 'date', label: 'Date' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'balance', label: 'Balance' },
      { key: 'description', label: 'Description' },
    ]

    const csvContent = convertToCSV(rows, headers)
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(csvContent, filename)
  }

  return {
    exportToCSV,
    isLoading,
    hasData: !!data?.data && data.data.length > 0,
  }
}
