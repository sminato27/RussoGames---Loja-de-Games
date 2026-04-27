import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ProductModal from '../../src/components/ProductModal'

const product = {
  id: 4,
  title: 'F1 25: Iconic',
  subtitle: 'STEAM • Ativação Offline',
  description: 'Descrição principal.\n\nSegundo parágrafo.',
  features: ['Modo offline', 'Suporte 24/7'],
  category: 'Steam',
  badge: 'Hot',
  image: 'https://example.com/f1.jpg',
  price: '$3.11',
  originalPrice: '$59.99',
  paymentUrl: 'https://example.com/pay',
}

describe('ProductModal', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('deve travar o scroll da página enquanto o modal estiver aberto', () => {
    const { unmount } = render(<ProductModal product={product} onClose={vi.fn()} />)

    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('deve fechar no botão, no backdrop e com tecla Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { rerender } = render(<ProductModal product={product} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(<ProductModal product={product} onClose={onClose} />)
    fireEvent.click(screen.getByRole('dialog', { name: /Detalhes: F1 25: Iconic/i }))
    expect(onClose).toHaveBeenCalledTimes(2)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('deve abrir link de pagamento ao clicar em comprar', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<ProductModal product={product} onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Comprar Agora' }))
    expect(screen.getByRole('button', { name: 'Abrindo...' })).toBeDisabled()

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith('https://example.com/pay', '_blank', 'noopener,noreferrer')
    })

    expect(screen.getByRole('button', { name: 'Comprar Agora' })).toBeEnabled()
  })

  it('deve alertar quando o link de pagamento não está configurado', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(
      <ProductModal
        product={{ ...product, paymentUrl: 'COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI' }}
        onClose={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Comprar Agora' }))

    expect(alertSpy).toHaveBeenCalledOnce()
    expect(openSpy).not.toHaveBeenCalled()
  })
})