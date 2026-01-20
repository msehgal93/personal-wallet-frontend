import { useLocalStorage } from '../shared/hooks/useLocalStorage'
import { WalletSetup } from '../features/wallet/components/WalletSetup'
import { WalletSummary } from '../features/wallet/components/WalletSummary'
import { TransactionForm } from '../features/wallet/components/TransactionForm'
import { Link } from 'react-router-dom'

const WALLET_ID_KEY = 'walletId'

const DashboardPage = () => {
  const [walletId] = useLocalStorage<string | null>(WALLET_ID_KEY, null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your wallet and transactions</p>
        </div>

        <div className="space-y-6">
          {!walletId ? (
            <WalletSetup />
          ) : (
            <>
              <WalletSummary />
              <TransactionForm />
              <div className="bg-white rounded-lg shadow p-6">
                <Link
                  to="/transactions"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Transactions →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
