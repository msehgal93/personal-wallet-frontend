import { Link } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner/LoadingSpinner'
import { Button } from '../../../shared/components/Button/Button'

export function WalletSummary() {
  const { data: wallet, isLoading, error } = useWallet()

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !wallet) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load wallet information</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Wallet Summary</h2>
        <Link to="/transactions">
          <Button variant="secondary" size="sm">
            View Transactions
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Wallet Name</p>
          <p className="text-lg font-medium text-gray-900">{wallet.name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(wallet.balance)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Created On</p>
          <p className="text-sm text-gray-700">{formatDate(wallet.date)}</p>
        </div>
      </div>
    </div>
  )
}
