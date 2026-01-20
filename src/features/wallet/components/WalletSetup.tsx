import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useWalletSetup } from '../hooks/useWalletSetup'
import { Button } from '../../../shared/components/Button/Button'
import { Input } from '../../../shared/components/Input/Input'

const walletSetupSchema = z.object({
  name: z.string().min(2, 'Wallet name must be at least 2 characters').max(50, 'Wallet name must be less than 50 characters'),
  balance: z.coerce.number().min(0, 'Balance cannot be negative').optional().default(0),
})

type WalletSetupFormData = z.infer<typeof walletSetupSchema>

export function WalletSetup() {
  const { mutate: setupWallet, isPending } = useWalletSetup()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WalletSetupFormData>({
    resolver: zodResolver(walletSetupSchema),
    defaultValues: {
      name: '',
      balance: 0,
    },
  })

  const onSubmit = (data: WalletSetupFormData) => {
    setupWallet({
      name: data.name.trim(),
      balance: data.balance || 0,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Initialize Wallet</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Wallet Name"
          placeholder="Enter wallet name"
          {...register('name')}
          error={errors.name?.message}
          autoFocus
        />
        <Input
          label="Initial Balance (Optional)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('balance')}
          error={errors.balance?.message}
        />
        <Button type="submit" isLoading={isPending} className="w-full">
          Create Wallet
        </Button>
      </form>
    </div>
  )
}
