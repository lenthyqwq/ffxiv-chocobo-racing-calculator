import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdvicePanel } from '../../src/components/advice-panel.tsx'
import { makeAdvice } from '../mocks/advice.ts'

describe('AdvicePanel', () => {
  it('shows the status label and headline', () => {
    render(<AdvicePanel result={makeAdvice({ status: 'viable', headline: '继续比赛。' })} />)
    expect(screen.getByText('可行')).toBeInTheDocument()
    expect(screen.getByText('继续比赛。')).toBeInTheDocument()
  })

  it('renders the per-target checklist when present', () => {
    render(
      <AdvicePanel
        result={makeAdvice({
          segment: 'late',
          targetAdvice: [
            { index: 0, action: 'lock-now', label: '立即锁定，喂到 500' },
            { index: 4, action: 'wait-window', label: '等待 ÷15 窗口' },
          ],
        })}
      />,
    )
    expect(screen.getByText('最高速度')).toBeInTheDocument()
    expect(screen.getByText('立即锁定，喂到 500')).toBeInTheDocument()
    expect(screen.getByText('适应力')).toBeInTheDocument()
    expect(screen.getByText('等待 ÷15 窗口')).toBeInTheDocument()
  })

  it('warns when the perfect lineup is unreachable', () => {
    render(<AdvicePanel result={makeAdvice({ perfectReachable: false })} />)
    expect(screen.getByText(/完美配线已无法达成/)).toBeInTheDocument()
  })

  it('shows the doomed status', () => {
    render(<AdvicePanel result={makeAdvice({ status: 'doomed', headline: '已无法回头。' })} />)
    expect(screen.getByText('无望')).toBeInTheDocument()
  })
})
