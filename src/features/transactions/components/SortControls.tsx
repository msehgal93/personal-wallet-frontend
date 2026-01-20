import { Button } from '../../../shared/components/Button/Button'
import type { SortBy, SortOrder } from '../../../shared/types/common.types'

interface SortControlsProps {
  sortBy: SortBy
  sortOrder: SortOrder
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void
}

export function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      // Toggle order if same field
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field with default order
      onSortChange(field, 'desc')
    }
  }

  const SortButton = ({ field, label }: { field: SortBy; label: string }) => {
    const isActive = sortBy === field
    return (
      <Button
        variant={isActive ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => handleSort(field)}
        className="flex items-center gap-1"
      >
        {label}
        {isActive && (
          <span className="text-xs">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </Button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <SortButton field="date" label="Date" />
        <SortButton field="amount" label="Amount" />
      </div>
    </div>
  )
}
