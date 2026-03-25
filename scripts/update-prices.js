/**
 * ============================================================
 * RussoGames — Atualizador Automático de Preços
 * ============================================================
 *
 * Fontes:
 *   price         → Digiseller API pública (sem autenticação)
 *                   Endpoint: /api/products/list?ids=...
 *   originalPrice → Steam Store API oficial
 *                   Endpoint: /api/appdetails?appids=...
 *
 * Uso local:
 *   cd scripts && node update-prices.js
 *
 * Em produção:
 *   GitHub Actions executa automaticamente a cada 6h.
 * ============================================================
 */

import fs   from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT        = path.resolve(__dirname, '..')
const PRICES_FILE = path.join(ROOT, 'public', 'prices.json')

// ─────────────────────────────────────────────────────────────
// 🗂️  CATÁLOGO — mantenha sincronizado com src/data/products.js
//
// digisellerProductId → o número id_d da paymentUrl
// steamAppId          → o número na URL da página Steam
// ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1,  title: 'Crimson Desert — Deluxe',           digisellerProductId: 5792408, steamAppId: 3321460 },
  { id: 2,  title: 'Black Myth: Wukong — Deluxe',       digisellerProductId: 4573385, steamAppId: 2358720 },
  { id: 3,  title: 'Resident Evil Requiem — Deluxe',    digisellerProductId: 5725897, steamAppId: 3764200 },
  { id: 4,  title: 'F1 25: Iconic',                     digisellerProductId: 5198250, steamAppId: 3059520 },
  { id: 7,  title: 'EA Sports FC 26',                   digisellerProductId: 5431131, steamAppId: 3405690 },
  { id: 10, title: "Assassin's Creed Shadows — Deluxe", digisellerProductId: 5065337, steamAppId: 3159330 },
  { id: 11, title: 'DOOM: The Dark Ages — Premium',     digisellerProductId: 5156821, steamAppId: 3017860 },
]

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept':     'application/json',
}
const TIMEOUT = 15_000

// ─────────────────────────────────────────────────────────────
// HTTP
// ─────────────────────────────────────────────────────────────
async function fetchJson(url, label) {
  const ctrl  = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT)
  try {
    const res = await fetch(url, { headers: HEADERS, signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    clearTimeout(timer)
    console.warn(`  ⚠  ${label ?? url}: ${err.message}`)
    return null
  }
}

async function loadExistingPrices() {
  try {
    return JSON.parse(await fs.readFile(PRICES_FILE, 'utf8'))
  } catch {
    return { version: 1, lastUpdated: null, products: {} }
  }
}

// ─────────────────────────────────────────────────────────────
// FONTE 1 — Digiseller API (price de venda)
//
// Endpoint público sem autenticação:
//   GET /api/products/list?ids={id1},{id2},...&lang=en-US
//
// Retorna array com campos:
//   id         → digisellerProductId
//   price_usd  → preço em USD (já convertido)
//   price_rub  → preço em RUB (moeda base do vendedor)
// ─────────────────────────────────────────────────────────────
async function fetchDigisellerPrices() {
  const result = new Map()

  const ids = PRODUCTS.map(p => p.digisellerProductId).join(',')
  const url = `https://api.digiseller.com/api/products/list?ids=${ids}&lang=en-US`

  console.log('\n📥 Buscando preços via Digiseller API (batch)...')
  console.log(`   URL: ${url}`)

  const data = await fetchJson(url, 'Digiseller /api/products/list')
  if (!data) return result

  // A resposta é um array de objetos
  const items = Array.isArray(data) ? data : (data.products ?? [])

  for (const item of items) {
    const digiId = item.id
    const product = PRODUCTS.find(p => p.digisellerProductId === digiId)
    if (!product) continue

    // price_usd é o campo direto em USD
    const rawUsd = item.price_usd ?? item.priceUsd ?? null
    if (rawUsd == null) {
      console.log(`  ⚠  ${product.title}: campo price_usd ausente na resposta`)
      continue
    }

    const price = parseFloat(rawUsd)
    if (isNaN(price) || price <= 0) {
      console.log(`  ⚠  ${product.title}: price_usd inválido (${rawUsd})`)
      continue
    }

    result.set(product.id, price.toFixed(2))
    console.log(`  ✓  ${product.title}: $${price.toFixed(2)}`)
  }

  return result
}

// ─────────────────────────────────────────────────────────────
// FONTE 2 — Steam Store API (originalPrice oficial)
//
// Endpoint: GET /api/appdetails?appids={id1},{id2},...&filters=price_overview&cc=us
// Retorna preço cheio em centavos (campo initial).
// ─────────────────────────────────────────────────────────────
async function fetchSteamPrices() {
  const result = new Map()

  const appIds = PRODUCTS.filter(p => p.steamAppId).map(p => p.steamAppId).join(',')
  const url = `https://store.steampowered.com/api/appdetails?appids=${appIds}&filters=price_overview&cc=us&l=english`

  console.log('\n📥 Buscando preços originais via Steam API (batch)...')

  const data = await fetchJson(url, 'Steam /api/appdetails')
  if (!data) return result

  for (const product of PRODUCTS.filter(p => p.steamAppId)) {
    const entry = data[product.steamAppId]

    if (!entry?.success) {
      console.log(`  ⚠  ${product.title}: appId ${product.steamAppId} não encontrado`)
      continue
    }

    const po = entry.data?.price_overview
    if (!po) {
      console.log(`  ℹ  ${product.title}: sem price_overview (free-to-play ou pre-release)`)
      continue
    }

    // initial = preço cheio em centavos, sem promoção
    if (po.initial > 0) {
      const price = (po.initial / 100).toFixed(2)
      result.set(product.id, price)
      console.log(`  ✓  ${product.title}: $${price} (Steam inicial)`)
    }
  }

  return result
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 RussoGames — Atualizador de Preços')
  console.log('='.repeat(50))

  const existing    = await loadExistingPrices()
  const salePrices  = await fetchDigisellerPrices()
  const steamPrices = await fetchSteamPrices()

  console.log('\n' + '='.repeat(50))
  console.log('📊 Aplicando preços...\n')

  const products = {}
  let changed = false

  for (const product of PRODUCTS) {
    const prev    = existing.products?.[product.id] ?? {}
    const newSale = salePrices.get(product.id)  ?? prev.price         ?? null
    const newOrig = steamPrices.get(product.id) ?? prev.originalPrice ?? null

    products[product.id] = { price: newSale, originalPrice: newOrig }

    if (prev.price !== newSale || prev.originalPrice !== newOrig) {
      changed = true
      console.log(`  📝 ${product.title}`)
      if (prev.price         !== newSale) console.log(`     venda:    $${prev.price ?? '–'} → $${newSale}`)
      if (prev.originalPrice !== newOrig) console.log(`     original: $${prev.originalPrice ?? '–'} → $${newOrig}`)
    } else {
      console.log(`  ✓  ${product.title} — sem mudança ($${newSale} / $${newOrig})`)
    }
  }

  await fs.writeFile(
    PRICES_FILE,
    JSON.stringify({ version: 1, lastUpdated: new Date().toISOString(), products }, null, 2) + '\n',
    'utf8'
  )

  console.log('\n' + '='.repeat(50))
  console.log(changed ? '✅ prices.json atualizado!' : '✅ Sem mudanças — prices.json mantido.')
  console.log(`📄 ${PRICES_FILE}`)

  if (salePrices.size === 0 && steamPrices.size === 0) {
    console.error('\n❌ Nenhum preço obtido. Verifique a conectividade.')
    process.exit(1)
  }
}

main().catch(err => { console.error('❌ Erro fatal:', err); process.exit(1) })
