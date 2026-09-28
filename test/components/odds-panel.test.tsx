import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OddsPanel } from '../../src/components/odds-panel.tsx'
import { makeAdvice } from '../mocks/advice.ts'

describe('OddsPanel', () => {
  it('shows the three probability rows formatted as percent and odds', () => {
    render(<OddsPanel result={makeAdvice({ fourFixedDump: 0.023, onlineLe250: 0.0117, onlineEq250: 0.0098 })} />)
    expect(screen.getByText('四属性满级（舍弃 ≤ 250）')).toBeInTheDocument()
    expect(screen.getByText('完美配线 ≤ 250（在线）')).toBeInTheDocument()
    expect(screen.getByText('精确 = 250（在线）')).toBeInTheDocument()
    expect(screen.getByText('2.30%')).toBeInTheDocument()
    expect(screen.getByText('约 1/43')).toBeInTheDocument()
  })

  it('renders certain and impossible at the extremes', () => {
    render(<OddsPanel result={makeAdvice({ fourFixedDump: 1, onlineLe250: 0, onlineEq250: 0 })} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('必然')).toBeInTheDocument()
    expect(screen.getAllByText('不可能')).toHaveLength(2)
  })
})
