import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from '../src/app.tsx'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

describe('App', () => {
  it('renders the header and the three result panels', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: '完美陆行鸟顾问' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '喂食' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '胜率' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '建议' })).toBeInTheDocument()
  }, 20000)

  it('syncs the entered state into the URL', () => {
    render(<App />)
    fireEvent.change(screen.getByRole('spinbutton', { name: '等级' }), { target: { value: '30' } })
    expect(window.location.search).toContain('rank=30')
  }, 20000)

  it('records a feed on the attribute row', () => {
    render(<App />)
    fireEvent.change(screen.getByRole('spinbutton', { name: '等级' }), { target: { value: '30' } })
    fireEvent.click(screen.getByRole('button', { name: '给最高速度喂食' }))
    expect(screen.getByText('已喂 1 次')).toBeInTheDocument()
  }, 20000)

  it('resets to a fresh chocobo through the confirmation dialog', () => {
    render(<App />)
    const rankField = screen.getByRole('spinbutton', { name: '等级' })
    fireEvent.change(rankField, { target: { value: '30' } })
    expect(rankField).toHaveValue(30)
    fireEvent.click(screen.getByRole('button', { name: '重置' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: '重置' }))
    expect(screen.getByRole('spinbutton', { name: '等级' })).toHaveValue(1)
  }, 20000)
})
