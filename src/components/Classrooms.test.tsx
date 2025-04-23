import { describe, it, vi, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchClassrooms } from '../api'
import Classrooms from './Classrooms'
import { Classroom } from '../types'

vi.mock('../api')

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows }: { rows: Classroom[] }) => (
    <div data-testid="mock-data-grid">
      {rows.map((row: Classroom) => (
        <div key={row.id} data-testid="grid-row">
          <span>{row.name}</span>
          <button data-testid="assignments-button" onClick={() => navigate(`/assignments/${row.id}`)}>
            Assignments
          </button>
        </div>
      ))}
    </div>
  ),
  GridColDef: vi.fn(),
}))

const navigate = vi.fn()
vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useNavigate: () => navigate
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderClassrooms = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Classrooms />
    </QueryClientProvider>
  )
}

describe('Classrooms Component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    queryClient.clear()
  })

  it('shows loading state initially', () => {
    renderClassrooms()
    expect(screen.getByText('Loading classrooms...')).toBeInTheDocument()
  })

  it('shows error message when API call fails', async () => {
    const mockError = new Error('Failed to fetch')
    vi.mocked(fetchClassrooms).mockRejectedValueOnce(mockError)

    renderClassrooms()

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    })
  })

  it('displays no classrooms message when data is empty', async () => {
    vi.mocked(fetchClassrooms).mockResolvedValueOnce([])

    renderClassrooms()

    await waitFor(() => {
      expect(screen.getByText('No classrooms found.')).toBeInTheDocument()
    })
  })

  it('renders classrooms data in grid', async () => {
    const mockClassrooms = [
      { id: '1', name: 'Test Class 1', archived: false, url: 'https://github.com/test1' },
      { id: '2', name: 'Test Class 2', archived: true, url: 'https://github.com/test2' }
    ]
    vi.mocked(fetchClassrooms).mockResolvedValueOnce(mockClassrooms)

    renderClassrooms()

    await waitFor(() => {
      const gridRows = screen.getAllByTestId('grid-row')
      expect(gridRows).toHaveLength(2)
      expect(screen.getByText('Test Class 1')).toBeInTheDocument()
      expect(screen.getByText('Test Class 2')).toBeInTheDocument()
    })
  })

  it('navigates to assignments page when clicking assignments button', async () => {
    const mockClassrooms = [
      { id: '1', name: 'Test Class', archived: false, url: 'https://github.com/test' }
    ]
    vi.mocked(fetchClassrooms).mockResolvedValueOnce(mockClassrooms)

    renderClassrooms()

    await waitFor(() => {
      expect(screen.getByText('Test Class')).toBeInTheDocument()
    })

    const assignmentsButton = screen.getByTestId('assignments-button')
    await userEvent.click(assignmentsButton)

    expect(navigate).toHaveBeenCalledWith('/assignments/1')
  })
})