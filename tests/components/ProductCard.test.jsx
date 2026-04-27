import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from '../../src/components/ProductCard'

const product = {
  id: 10,
  title: "Assassin's Creed Shadows — Deluxe",
  subtitle: 'STEAM • Ativação Offline',
  category: 'Steam',
  badge: 'Novo',
  image: 'https://example.com/ac.jpg',
  price: '$3.11',
  originalPrice: '$69.99',
}

describe('ProductCard', () => {
  it('deve renderizar informações principais e desconto', () => {
    render(<ProductCard product={product} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Ver detalhes: Assassin's Creed Shadows — Deluxe/i })).toBeInTheDocument()
    expect(screen.getByText('Steam')).toBeInTheDocument()
    expect(screen.getByText("Assassin's Creed Shadows — Deluxe")).toBeInTheDocument()
    expect(screen.getByText('-96%')).toBeInTheDocument()
    expect(screen.getByText('$69.99')).toBeInTheDocument()
    expect(screen.getByText('$3.11')).toBeInTheDocument()
  })

  it('deve selecionar produto ao clicar no card, no teclado e no botão comprar', () => {
    const onSelect = vi.fn()
    render(<ProductCard product={product} onSelect={onSelect} />)

    const card = screen.getByRole('button', { name: /Ver detalhes:/i })
    fireEvent.click(card)
    fireEvent.keyDown(card, { key: 'Enter' })
    fireEvent.click(screen.getByRole('button', { name: /Comprar Assassin's Creed Shadows — Deluxe/i }))

    expect(onSelect).toHaveBeenCalledTimes(3)
    expect(onSelect).toHaveBeenCalledWith(product)
  })

  it('deve usar imagem placeholder quando houver erro no carregamento', () => {
    render(<ProductCard product={product} onSelect={vi.fn()} />)

    const image = screen.getByRole('img', { name: product.title })
    fireEvent.error(image)

    expect(image.getAttribute('src')).toContain('data:image/svg+xml')
  })
})