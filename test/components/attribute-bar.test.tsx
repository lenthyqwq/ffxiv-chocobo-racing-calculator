import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AttributeBar } from '../../src/components/attribute-bar.tsx'

const noop = () => {}

function renderBar(props: Partial<Parameters<typeof AttributeBar>[0]> = {}) {
  return render(
    <AttributeBar
      name="持久力"
      value={485}
      isDump={false}
      feeds={0}
      canFeedUp
      onSetValue={noop}
      onNudge={noop}
      onFeedUp={noop}
      onFeedDown={noop}
      {...props}
    />,
  )
}

describe('AttributeBar', () => {
  it('shows a target on a divisible-by-15 window', () => {
    renderBar({ value: 485 })
    expect(screen.getByText('持久力')).toBeInTheDocument()
    expect(screen.getByText('还差 15')).toBeInTheDocument()
    expect(screen.getByText('÷15 ✓')).toBeInTheDocument()
  })

  it('marks a target off the window', () => {
    renderBar({ value: 490 })
    expect(screen.getByText('÷15 ✗')).toBeInTheDocument()
  })

  it('shows maxed at the cap', () => {
    renderBar({ value: 500 })
    expect(screen.getByText('已满')).toBeInTheDocument()
  })

  it('renders the dump against its 250 reference, flags going over, and hides the feed control', () => {
    renderBar({ name: '加速度', value: 300, isDump: true })
    expect(screen.getByText('加速度（舍弃）')).toBeInTheDocument()
    expect(screen.getByText('300 / 250')).toBeInTheDocument()
    expect(screen.getByText('超出 50')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '给加速度喂食' })).not.toBeInTheDocument()
  })

  it('calls onNudge from the growth steppers and onSetValue from the field', () => {
    const onNudge = vi.fn()
    const onSetValue = vi.fn()
    renderBar({ value: 200, onNudge, onSetValue })
    fireEvent.click(screen.getByRole('button', { name: '+15' }))
    expect(onNudge).toHaveBeenCalledWith(15)
    fireEvent.click(screen.getByRole('button', { name: '-5' }))
    expect(onNudge).toHaveBeenCalledWith(-5)
    fireEvent.change(screen.getByRole('spinbutton', { name: '持久力数值' }), { target: { value: '300' } })
    expect(onSetValue).toHaveBeenCalledWith(300)
  })

  it('feeds and unfeeds through the feed control', () => {
    const onFeedUp = vi.fn()
    const onFeedDown = vi.fn()
    renderBar({ value: 200, feeds: 2, onFeedUp, onFeedDown })
    expect(screen.getByText('已喂 2 次')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '给持久力喂食' }))
    expect(onFeedUp).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: '从持久力移除一次喂食' }))
    expect(onFeedDown).toHaveBeenCalledOnce()
  })

  it('disables feed + when not allowed and feed - at zero feeds', () => {
    renderBar({ value: 200, feeds: 0, canFeedUp: false })
    expect(screen.getByRole('button', { name: '给持久力喂食' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '从持久力移除一次喂食' })).toBeDisabled()
  })
})
