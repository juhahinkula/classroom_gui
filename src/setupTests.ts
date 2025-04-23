import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-router
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn()
}))