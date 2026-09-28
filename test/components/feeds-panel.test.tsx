import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeedsPanel } from '../../src/components/feeds-panel.tsx'
import { makeFeedsSummary } from '../mocks/advice.ts'

describe('FeedsPanel', () => {
  it('shows feeds available now and the lifetime by rank 50', () => {
    render(<FeedsPanel feeds={makeFeedsSummary()} />)
    expect(screen.getByText('当前 30 次 / 50 级共 50 次')).toBeInTheDocument()
  })

  it('reflects a different state', () => {
    render(<FeedsPanel feeds={makeFeedsSummary({ availableNow: 12, lifetime: 40 })} />)
    expect(screen.getByText('当前 12 次 / 50 级共 40 次')).toBeInTheDocument()
  })
})
