import { describe, expect, it } from 'vitest'
import {
  filterProducts,
  formatPrice,
  getCategories,
  mergeWithDynamicPrices,
} from '../../src/utils/catalog'

const baseProducts = [
  {
    id: 1,
    title: 'Black Myth: Wukong — Deluxe',
    subtitle: 'STEAM • Ativação Offline',
    description: 'Action RPG solo com chefes desafiadores.',
    tags: ['RPG', 'Ação', 'Soulslike'],
    category: 'Steam',
    price: '$3.95',
    originalPrice: '$59.99',
  },
  {
    id: 2,
    title: 'EA Sports FC 26',
    subtitle: 'EA App • Licença Offline',
    description: 'Futebol competitivo com modo carreira.',
    tags: ['Esportes', 'Futebol'],
    category: 'EA App',
    price: '$5.71',
    originalPrice: '$20.99',
  },
]

describe('catalog utils', () => {
  it('deve derivar categorias únicas com "Todos" no início', () => {
    const categories = getCategories([
      { category: 'Steam' },
      { category: 'EA App' },
      { category: 'Steam' },
      { category: '' },
    ])

    expect(categories).toEqual(['Todos', 'Steam', 'EA App'])
  })

  it('deve formatar preço numérico e rejeitar entradas inválidas', () => {
    expect(formatPrice('3.1')).toBe('$3.10')
    expect(formatPrice('19')).toBe('$19.00')
    expect(formatPrice('')).toBeNull()
    expect(formatPrice(null)).toBeNull()
    expect(formatPrice('abc')).toBeNull()
  })

  it('deve mesclar preços dinâmicos sem perder fallback estático', () => {
    const merged = mergeWithDynamicPrices(baseProducts, {
      1: { price: '4.25', originalPrice: '69.99' },
      2: { price: 'invalid', originalPrice: '30' },
    })

    expect(merged[0].price).toBe('$4.25')
    expect(merged[0].originalPrice).toBe('$69.99')
    expect(merged[1].price).toBe('$5.71')
    expect(merged[1].originalPrice).toBe('$30.00')
  })

  it('deve filtrar por categoria e texto em título/subtítulo/descrição/tags', () => {
    expect(filterProducts(baseProducts, 'wukong', 'Todos')).toHaveLength(1)
    expect(filterProducts(baseProducts, 'futebol', 'EA App')).toHaveLength(1)
    expect(filterProducts(baseProducts, 'soulslike', 'Steam')).toHaveLength(1)
    expect(filterProducts(baseProducts, 'inexistente', 'Todos')).toHaveLength(0)
  })
})