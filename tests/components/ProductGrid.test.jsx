import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProductGrid from '../../src/components/ProductGrid'

const products = [
  {
    id: 1,
    title: 'Crimson Desert — Deluxe',
    subtitle: 'STEAM • Ativação Offline',
    category: 'Steam',
    price: '$3.97',
    originalPrice: '$69.99',
  },
]

describe('ProductGrid', () => {
  it('deve renderizar estado vazio quando não há produtos', () => {
    render(<ProductGrid products={[]} onSelect={vi.fn()} />)

    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument()
    expect(screen.getByText('Tente outra busca ou selecione uma categoria diferente.')).toBeInTheDocument()
  })

  it('deve renderizar cards e selecionar produto', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(<ProductGrid products={products} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /Ver detalhes: Crimson Desert — Deluxe/i }))
    expect(onSelect).toHaveBeenCalledWith(products[0])
  })
})