import { vi } from 'vitest'

type Row = {
  id: string | number;
  name: string;
}

export const DataGrid = vi.fn(({ rows }: { rows: Row[] }) => (
  <div data-testid="mock-data-grid">
    {rows.map((row: Row) => (
      <div key={row.id} data-testid="grid-row">
        <span>{row.name}</span>
      </div>
    ))}
  </div>
))

export const GridColDef = vi.fn()