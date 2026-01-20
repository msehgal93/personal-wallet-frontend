/**
 * Validate wallet name
 */
export function validateWalletName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Wallet name is required'
  }
  if (name.trim().length < 2) {
    return 'Wallet name must be at least 2 characters'
  }
  if (name.trim().length > 50) {
    return 'Wallet name must be less than 50 characters'
  }
  return null
}

/**
 * Validate balance amount
 */
export function validateBalance(balance: number | string): string | null {
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
  
  if (isNaN(numBalance)) {
    return 'Balance must be a valid number'
  }
  if (numBalance < 0) {
    return 'Balance cannot be negative'
  }
  if (numBalance > 1000000000) {
    return 'Balance is too large'
  }
  return null
}

/**
 * Validate transaction amount
 */
export function validateTransactionAmount(amount: number | string): string | null {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return 'Amount must be a valid number'
  }
  if (numAmount <= 0) {
    return 'Amount must be greater than 0'
  }
  if (numAmount > 1000000000) {
    return 'Amount is too large'
  }
  return null
}

/**
 * Validate transaction description
 */
export function validateDescription(description: string): string | null {
  if (!description || description.trim().length === 0) {
    return 'Description is required'
  }
  if (description.trim().length > 200) {
    return 'Description must be less than 200 characters'
  }
  return null
}
