import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../../src/App'

describe('App integration', () => {
  it('deve carregar catálogo e aplicar preço dinâmico vindo de /prices.json', async () => {
    render(<App />)

    const crimsonTitle = await screen.findByText('Crimson Desert — Deluxe')
    const crimsonCard = crimsonTitle.closest('article')

    expect(crimsonCard).not.toBeNull()
    expect(within(crimsonCard).getByText('$3.97')).toBeInTheDocument()
  })

  it('deve filtrar por busca e exibir estado vazio quando não houver correspondência', async () => {
    const user = userEvent.setup()
    render(<App />)

    const searchInput = await screen.findByRole('searchbox', { name: 'Buscar produto' })
    await user.type(searchInput, 'wukong')

    await waitFor(() => {
      expect(screen.getByText('Black Myth: Wukong — Deluxe')).toBeInTheDocument()
      expect(screen.queryByText('Crimson Desert — Deluxe')).not.toBeInTheDocument()
    })

    await user.clear(searchInput)
    await user.type(searchInput, 'produto-inexistente-123')

    expect(await screen.findByText('Nenhum produto encontrado')).toBeInTheDocument()
  })

  it('deve abrir modal ao selecionar card e fechar pelo botão', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('button', { name: /Comprar Black Myth: Wukong — Deluxe/i }))

    expect(await screen.findByRole('dialog', { name: /Detalhes: Black Myth: Wukong — Deluxe/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Detalhes: Black Myth: Wukong — Deluxe/i })).not.toBeInTheDocument()
    })
  })
})