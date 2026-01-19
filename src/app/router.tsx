import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/transactions',
    element: <TransactionsPage />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
