/**
 * usePrices — Hook de preços dinâmicos
 *
 * Busca /prices.json (gerado automaticamente pelo GitHub Actions) e
 * devolve os preços mais recentes para sobrescrever os valores padrão
 * do products.js.
 *
 * Estratégia de cache:
 *   - Primeiro render: usa preços do products.js (sem flash)
 *   - Após fetch: sobrescreve com preços dinâmicos
 *   - sessionStorage: evita refetch desnecessário na mesma sessão
 *     (revalida após CACHE_TTL_MS)
 *
 * Retorna:
 *   { prices, loading, lastUpdated, error }
 *
 *   prices: { [productId]: { price: string, originalPrice: string } }
 */

import { useState, useEffect } from 'react'

const PRICES_URL = '/prices.json'
const CACHE_KEY  = 'russogames_prices_cache'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutos

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL_MS) return null
    return data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // sessionStorage pode estar bloqueado (modo privado, iOS Safari, etc.) — ignora
  }
}

export function usePrices() {
  const [prices, setPrices]           = useState({})
  const [loading, setLoading]         = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError]             = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // 1. Tenta cache da sessão
      const cached = readCache()
      if (cached) {
        if (!cancelled) {
          setPrices(cached.products ?? {})
          setLastUpdated(cached.lastUpdated ?? null)
          setLoading(false)
        }
        return
      }

      // 2. Busca fresco
      try {
        const res = await fetch(`${PRICES_URL}?_=${Date.now()}`, {
          headers: { 'Cache-Control': 'no-cache' },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        writeCache(data)

        if (!cancelled) {
          setPrices(data.products ?? {})
          setLastUpdated(data.lastUpdated ?? null)
          setError(null)
        }
      } catch (err) {
        // Se o fetch falhar, mantém preços padrão do products.js (sem breaking)
        if (!cancelled) {
          setError(err.message)
          console.warn('[usePrices] Não foi possível carregar prices.json:', err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { prices, loading, lastUpdated, error }
}
