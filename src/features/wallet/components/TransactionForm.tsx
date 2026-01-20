import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransaction } from '../../transactions/hooks/useTransaction'
import { useWallet } from '../hooks/useWallet'
import { Button } from '../../../shared/components/Button/Button'
import { Input } from '../../../shared/components/Input/Input'
import { Toggle } from '../../../shared/components/Toggle/Toggle'

const transactionSchema = z.object({
  amount: z.coerce.number().min(0.0001, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export function TransactionForm() {
  const { data: wallet } = useWallet()
  const { mutate: createTransaction, isPending } = useTransaction()
  const [transactionType, setTransactionType] = useState<'CREDIT' | 'DEBIT'>('CREDIT')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  })

  const onSubmit = (data: TransactionFormData) => {
    if (!wallet?.id) return

    // The backend determines CREDIT/DEBIT based on amount sign:
    // Positive amount = CREDIT, Negative amount = DEBIT
    const amount = transactionType === 'DEBIT' ? -Math.abs(data.amount) : Math.abs(data.amount)
    
    createTransaction(
      {
        walletId: wallet.id,
        data: {
          amount,
          description: data.description.trim(),
        },
      },
      {
        onSuccess: () => {
          reset()
        },
      }
    )
  }

  if (!wallet) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">New Transaction</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Toggle
            labelLeft="DEBIT"
            labelRight="CREDIT"
            checked={transactionType === 'CREDIT'}
            onChange={(e) => setTransactionType(e.target.checked ? 'CREDIT' : 'DEBIT')}
          />
        </div>
        
        <Input
          label="Amount"
          type="number"
          step="any"
          placeholder="0.0000"
          {...register('amount')}
          error={errors.amount?.message}
        />
        
        <Input
          label="Description"
          placeholder="Enter transaction description"
          {...register('description')}
          error={errors.description?.message}
        />
        
        <Button type="submit" isLoading={isPending} className="w-full">
          {transactionType === 'CREDIT' ? 'Credit' : 'Debit'} Amount
        </Button>
      </form>
    </div>
  )
}
