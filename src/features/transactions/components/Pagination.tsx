import { Button } from '../../../shared/components/Button/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              )
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            )
          })}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}
