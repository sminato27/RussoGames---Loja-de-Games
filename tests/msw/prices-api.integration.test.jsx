import { render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../../src/App'
import { server } from '../mocks/server'

describe('MSW API simulation - /prices.json', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('deve aplicar payload parcial e preservar fallback estático para o restante', async () => {
    server.use(
      http.get('*/prices.json', () => {
        return HttpResponse.json({
          version: 1,
          lastUpdated: '2026-04-27T20:00:00.000Z',
          products: {
            1: { price: '9.99', originalPrice: '99.99' },
          },
        })
      })
    )

    render(<App />)

    const crimsonTitle = await screen.findByText('Crimson Desert — Deluxe')
    const crimsonCard = crimsonTitle.closest('article')
    const wukongTitle = await screen.findByText('Black Myth: Wukong — Deluxe')
    const wukongCard = wukongTitle.closest('article')

    expect(crimsonCard).not.toBeNull()
    expect(wukongCard).not.toBeNull()
    expect(within(crimsonCard).getByText('$9.99')).toBeInTheDocument()
    expect(within(wukongCard).getByText('$3.95')).toBeInTheDocument()
  })

  it('deve manter preços estáticos quando a API retorna erro', async () => {
    server.use(
      http.get('*/prices.json', () => HttpResponse.text('erro', { status: 500 }))
    )
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<App />)

    expect(await screen.findByText('$5.26')).toBeInTheDocument()
    expect(warnSpy).toHaveBeenCalled()
  })
})