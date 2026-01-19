import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from '../shared/components/ErrorBoundary/ErrorBoundary'
import { router } from './router'

// Create a query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

interface ProvidersProps {
  children?: ReactNode
}

/**
 * Root providers wrapper
 * Includes React Query, Error Boundary, and Router
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          {children || <RouterProvider router={router} />}
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
