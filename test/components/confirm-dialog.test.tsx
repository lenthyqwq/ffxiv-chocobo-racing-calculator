import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from '../../src/components/confirm-dialog.tsx'

function renderDialog(overrides: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) {
  const props = {
    open: true,
    title: '重置陆行鸟？',
    message: '这将清除你当前的输入。',
    confirmLabel: '重置',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  }
  render(<ConfirmDialog {...props} />)
  return props
}

describe('ConfirmDialog', () => {
  it('shows the title, message, and buttons when open', () => {
    renderDialog()
    expect(screen.getByRole('heading', { name: '重置陆行鸟？' })).toBeInTheDocument()
    expect(screen.getByText('这将清除你当前的输入。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '重置' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument()
  })

  it('calls onConfirm and onCancel from the buttons', () => {
    const props = renderDialog()
    fireEvent.click(screen.getByRole('button', { name: '重置' }))
    expect(props.onConfirm).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: '取消' }))
    expect(props.onCancel).toHaveBeenCalledOnce()
  })
})
