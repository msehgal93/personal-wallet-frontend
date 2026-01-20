import { useSearchParams, Link } from 'react-router-dom'
import { useLocalStorage } from '../shared/hooks/useLocalStorage'
import { useTransactions } from '../features/transactions/hooks/useTransactions'
import { useTransactionsMeta } from '../features/transactions/hooks/useTransactionsMeta'
import { useTransactionExport } from '../features/transactions/hooks/useTransactionExport'
import { TransactionTable } from '../features/transactions/components/TransactionTable'
import { Pagination } from '../features/transactions/components/Pagination'
import { SortControls } from '../features/transactions/components/SortControls'
import { Button } from '../shared/components/Button/Button'
import type { SortBy, SortOrder } from '../shared/types/common.types'

const WALLET_ID_KEY = 'walletId'
const DEFAULT_LIMIT = 10

const TransactionsPage = () => {
  const [walletId] = useLocalStorage<string | null>(WALLET_ID_KEY, null)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get pagination and sort params from URL
  const page = parseInt(searchParams.get('page') || '1', 10)
  const sortBy = (searchParams.get('sortBy') || 'date') as SortBy
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder

  const {
    data: transactionsResponse,
    isLoading,
    error,
  } = useTransactions(walletId, page, DEFAULT_LIMIT, sortBy, sortOrder)
  const { data: metaData } = useTransactionsMeta(walletId, sortBy, sortOrder)
  const { exportToCSV, isLoading: isExporting } = useTransactionExport(walletId)

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('page', newPage.toString())
      return newParams
    })
  }

  const handleSortChange = (newSortBy: SortBy, newSortOrder: SortOrder) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('sortBy', newSortBy)
      newParams.set('sortOrder', newSortOrder)
      newParams.set('page', '1') // Reset to first page on sort change
      return newParams
    })
  }

  if (!walletId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No Wallet Found</h2>
            <p className="text-gray-600 mb-4">Please create a wallet first to view transactions.</p>
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const transactions = transactionsResponse?.data ?? []
  const totalCount = metaData?.pagination?.count
  const totalPages = totalCount ? Math.max(1, Math.ceil(totalCount / DEFAULT_LIMIT)) : 1

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="mt-2 text-gray-600">View and manage your transaction history</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={exportToCSV}
              disabled={isExporting || transactions.length === 0}
            >
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Link to="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              {error instanceof Error ? error.message : 'Failed to load transactions'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <SortControls sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
          
          <TransactionTable transactions={transactions} isLoading={isLoading} />
          
          {!isLoading && transactions.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionsPage
