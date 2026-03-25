/**
 * ============================================================
 * RussoGames — Atualizador Automático de Preços
 * ============================================================
 *
 * Fontes:
 *   price         → Digiseller API (api.digiseller.com)
 *   originalPrice → Steam Store API oficial (store.steampowered.com)
 *
 * Uso local:
 *   cd scripts && npm install && node update-prices.js
 *
 * Em produção:
 *   GitHub Actions executa automaticamente a cada 6h.
 *   Ver: .github/workflows/update-prices.yml
 * ============================================================
 */

import fs   from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT        = path.resolve(__dirname, '..')
const PRICES_FILE = path.join(ROOT, 'public', 'prices.json')

// ─────────────────────────────────────────────────────────────
// 🗂️  CATÁLOGO DE PRODUTOS
//
// Mantenha sincronizado com src/data/products.js.
// Campos:
//   id                 → mesmo ID do products.js
//   digisellerProductId → valor do parâmetro id_d na paymentUrl
//   steamAppId         → ID numérico da página do jogo na Steam
// ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    title: 'Crimson Desert — Deluxe',
    digisellerProductId: 5792408,
    steamAppId: 3321460,
  },
  {
    id: 2,
    title: 'Black Myth: Wukong — Deluxe',
    digisellerProductId: 4573385,
    steamAppId: 2358720,
  },
  {
    id: 3,
    title: 'Resident Evil Requiem — Deluxe',
    digisellerProductId: 5725897,
    steamAppId: 3764200,
  },
  {
    id: 7,
    title: 'EA Sports FC 26',
    digisellerProductId: 5431131,
    steamAppId: 3405690,
  },
  {
    id: 10,
    title: "Assassin's Creed Shadows — Deluxe",
    digisellerProductId: 5065337,
    steamAppId: 3159330,
  },
  {
    id: 11,
    title: 'DOOM: The Dark Ages — Premium',
    digisellerProductId: 5156821,
    steamAppId: 3017860,
  },
]

// ─────────────────────────────────────────────────────────────
// ⚙️  CONFIGURAÇÃO
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  digiseller: {
    // API pública da Digiseller — não precisa de autenticação para leitura
    apiBase: 'https://api.digiseller.com/api',
    currency: 'USD',
  },
  steam: {
    apiBase: 'https://store.steampowered.com/api',
    countryCode: 'us',
    batchSize: 10,       // máximo seguro de appids por request
    batchDelay: 1000,    // ms entre batches
  },
  http: {
    timeout: 15000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
}

// ═══════════════════════════════════════════════════════════════
// UTILITÁRIOS HTTP
// ═══════════════════════════════════════════════════════════════

async function fetchJson(url, label = url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CONFIG.http.timeout)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': CONFIG.http.userAgent },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    clearTimeout(timer)
    console.warn(`  ⚠  ${label}: ${err.message}`)
    return null
  }
}

/** Formata centavos → "X.XX" */
function centsToPrice(cents) {
  return (cents / 100).toFixed(2)
}

/** Lê prices.json existente para usar como fallback */
async function loadExistingPrices() {
  try {
    const raw = await fs.readFile(PRICES_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { version: 1, lastUpdated: null, products: {} }
  }
}

// ═══════════════════════════════════════════════════════════════
// FONTE 1 — Digiseller API
// ═══════════════════════════════════════════════════════════════
//
// Endpoint: GET /api/products/{id}/content?currency=USD
// Retorna JSON com campo `price` (já em USD, valor float)
//
// Digiseller é a plataforma por trás do steamaccountpro.exaccess.com.
// Os IDs dos produtos estão nos parâmetros id_d das paymentUrls.
// ═══════════════════════════════════════════════════════════════

async function fetchDigisellerPrices() {
  const result = new Map()   // Map<productId, priceString>

  console.log('\n📥 Buscando preços de venda via Digiseller API...')

  for (const product of PRODUCTS) {
    if (!product.digisellerProductId) continue

    const url  = `${CONFIG.digiseller.apiBase}/products/${product.digisellerProductId}/content?currency=${CONFIG.digiseller.currency}`
    const data = await fetchJson(url, product.title)

    if (!data) continue

    // A API pode retornar o preço em vários campos dependendo da versão
    // Tentamos em ordem de prioridade
    const rawPrice =
      data?.product?.price  ??   // formato padrão
      data?.price           ??   // formato simplificado
      data?.info?.price     ??   // formato legado
      null

    if (rawPrice == null) {
      console.log(`  ⚠  ${product.title}: campo price não encontrado na resposta`)
      continue
    }

    const price = parseFloat(rawPrice)
    if (isNaN(price) || price <= 0) {
      console.log(`  ⚠  ${product.title}: preço inválido (${rawPrice})`)
      continue
    }

    const formatted = price.toFixed(2)
    result.set(product.id, formatted)
    console.log(`  ✓  ${product.title}: $${formatted}`)
  }

  return result
}

// ═══════════════════════════════════════════════════════════════
// FONTE 2 — Steam Store API (originalPrice)
// ═══════════════════════════════════════════════════════════════
//
// Endpoint: GET /api/appdetails?appids={id}&filters=price_overview&cc=us
// Retorna preço cheio em centavos (campo initial).
// API gratuita, sem autenticação necessária.
// ═══════════════════════════════════════════════════════════════

async function fetchSteamOriginalPrices() {
  const result = new Map()   // Map<productId, priceString>
  const withApp = PRODUCTS.filter(p => p.steamAppId)

  console.log('\n📥 Buscando preços originais via Steam Store API...')

  const { batchSize, batchDelay } = CONFIG.steam

  for (let i = 0; i < withApp.length; i += batchSize) {
    const batch  = withApp.slice(i, i + batchSize)
    const appIds = batch.map(p => p.steamAppId).join(',')

    const url  = `${CONFIG.steam.apiBase}/appdetails?appids=${appIds}&filters=price_overview&cc=${CONFIG.steam.countryCode}&l=english`
    const data = await fetchJson(url, 'Steam API batch')

    if (!data) continue

    for (const product of batch) {
      const entry = data[product.steamAppId]

      if (!entry?.success) {
        console.log(`  ⚠  App ${product.steamAppId} (${product.title}): não encontrado`)
        continue
      }

      const priceOverview = entry.data?.price_overview
      if (!priceOverview) {
        // Pode ser free-to-play ou jogo sem preço ainda
        console.log(`  ℹ  ${product.title}: sem price_overview (free / pre-release?)`)
        continue
      }

      // initial = preço cheio em centavos (sem promoção)
      const cents = priceOverview.initial
      if (cents > 0) {
        const formatted = centsToPrice(cents)
        result.set(product.id, formatted)
        console.log(`  ✓  ${product.title}: $${formatted} (Steam original)`)
      }
    }

    // Aguarda entre batches para respeitar rate limit
    if (i + batchSize < withApp.length) {
      await new Promise(r => setTimeout(r, batchDelay))
    }
  }

  return result
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('🚀 RussoGames — Atualizador de Preços')
  console.log('='.repeat(48))

  const existing    = await loadExistingPrices()
  const salePrices  = await fetchDigisellerPrices()
  const steamPrices = await fetchSteamOriginalPrices()

  console.log('\n' + '='.repeat(48))
  console.log('📊 Aplicando preços...\n')

  const products = {}
  let changed = false

  for (const product of PRODUCTS) {
    const prev         = existing.products?.[product.id] ?? {}
    const newPrice     = salePrices.get(product.id)  ?? prev.price         ?? null
    const newOrigPrice = steamPrices.get(product.id) ?? prev.originalPrice ?? null

    products[product.id] = {
      price:         newPrice,
      originalPrice: newOrigPrice,
    }

    // Detecta e exibe mudanças
    if (prev.price !== newPrice || prev.originalPrice !== newOrigPrice) {
      changed = true
      const priceChange  = prev.price         !== newPrice     ? ` $${prev.price ?? '–'} → $${newPrice}` : ''
      const origChange   = prev.originalPrice !== newOrigPrice ? ` $${prev.originalPrice ?? '–'} → $${newOrigPrice}` : ''
      console.log(`  📝 ${product.title}`)
      if (priceChange)  console.log(`     venda:    ${priceChange}`)
      if (origChange)   console.log(`     original: ${origChange}`)
    } else {
      console.log(`  ✓  ${product.title} — sem mudança ($${newPrice} / $${newOrigPrice})`)
    }
  }

  // Salva prices.json
  const output = {
    version:     1,
    lastUpdated: new Date().toISOString(),
    products,
  }

  await fs.writeFile(PRICES_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8')

  console.log('\n' + '='.repeat(48))
  if (changed) {
    console.log('✅ prices.json atualizado com novos preços!')
  } else {
    console.log('✅ Nenhuma mudança — prices.json mantido.')
  }
  console.log(`📄 ${PRICES_FILE}`)

  // Falha explícita se não buscou nada (útil para alertas no GitHub Actions)
  const totalFetched = salePrices.size + steamPrices.size
  if (totalFetched === 0) {
    console.error('\n❌ Nenhum preço obtido. Verifique a conectividade e os IDs dos produtos.')
    process.exit(1)
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
