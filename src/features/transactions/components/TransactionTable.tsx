import { Transaction } from '../types/transaction.types'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters'

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <p className="text-gray-500">No transactions found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'CREDIT'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <span
                    className={
                      transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {transaction.type === 'CREDIT' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                  {formatCurrency(transaction.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
