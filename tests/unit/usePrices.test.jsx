import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePrices } from '../../src/hooks/usePrices'
import { defaultPricesPayload } from '../mocks/handlers'
import { server } from '../mocks/server'

const CACHE_KEY = 'russogames_prices_cache'

describe('usePrices', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('deve usar cache válido da sessão sem fazer fetch', async () => {
    const cacheData = {
      products: { 99: { price: '1.23', originalPrice: '2.34' } },
      lastUpdated: '2026-04-27T00:00:00.000Z',
    }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: cacheData, ts: Date.now() }))

    const fetchSpy = vi.spyOn(global, 'fetch')
    const { result } = renderHook(() => usePrices())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(result.current.prices).toEqual(cacheData.products)
    expect(result.current.lastUpdated).toBe(cacheData.lastUpdated)
    expect(result.current.error).toBeNull()
  })

  it('deve ignorar cache expirado e buscar preços atualizados', async () => {
    const cacheData = {
      products: { 55: { price: '8.88', originalPrice: '9.99' } },
      lastUpdated: '2026-04-27T00:00:00.000Z',
    }
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000)
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: cacheData, ts: tenMinutesAgo }))

    const fetchSpy = vi.spyOn(global, 'fetch')
    const { result } = renderHook(() => usePrices())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(result.current.prices).toEqual(defaultPricesPayload.products)
    expect(result.current.lastUpdated).toBe(defaultPricesPayload.lastUpdated)
    expect(result.current.error).toBeNull()
  })

  it('deve expor erro e manter fallback quando API falha', async () => {
    server.use(
      http.get('*/prices.json', () => HttpResponse.text('falha', { status: 500 }))
    )
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => usePrices())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.prices).toEqual({})
    expect(result.current.error).toBe('HTTP 500')
    expect(warnSpy).toHaveBeenCalledOnce()
  })
})