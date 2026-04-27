import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FilterBar from '../../src/components/FilterBar'

function renderFilterBar(props = {}) {
  const onSearch = vi.fn()
  const onCategory = vi.fn()

  render(
    <FilterBar
      search=""
      onSearch={onSearch}
      categories={['Todos', 'Steam', 'EA App']}
      activeCategory="Todos"
      onCategory={onCategory}
      count={8}
      {...props}
    />
  )

  return { onSearch, onCategory }
}

describe('FilterBar', () => {
  it('deve renderizar contagem, busca e categorias', () => {
    renderFilterBar()

    expect(document.getElementById('catalog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Catálogo' })).toBeInTheDocument()
    expect(screen.getByText(/8\s*produtos/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Todos/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('deve disparar onSearch e limpar busca ao clicar no botão de limpar', async () => {
    const user = userEvent.setup()
    const { onSearch } = renderFilterBar({ search: 'doom' })

    await user.type(screen.getByRole('searchbox', { name: 'Buscar produto' }), ' x')
    expect(onSearch).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))
    expect(onSearch).toHaveBeenCalledWith('')
  })

  it('deve disparar onCategory ao selecionar categoria', async () => {
    const user = userEvent.setup()
    const { onCategory } = renderFilterBar({ activeCategory: 'Steam' })

    expect(screen.getByRole('button', { name: /Steam/i })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: /EA App/i }))

    expect(onCategory).toHaveBeenCalledWith('EA App')
  })
})