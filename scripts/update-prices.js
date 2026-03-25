/**
 * ============================================================
 * RussoGames — Atualizador Automático de Preços
 * ============================================================
 *
 * Fontes:
 *   price         → steamaccountpro.exaccess.com  (preço de venda)
 *   originalPrice → Steam Store API oficial        (preço cheio Steam)
 *
 * Uso:
 *   node scripts/update-prices.js
 *
 * Rode localmente para testar. Em produção o GitHub Actions executa
 * automaticamente a cada 6 horas (ver .github/workflows/update-prices.yml).
 * ============================================================
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PRICES_FILE = path.join(ROOT, 'public', 'prices.json')

// ─────────────────────────────────────────────────────────────
// ⚙️  CONFIGURAÇÃO DO SCRAPER — ajuste caso o site mude
//
// Como descobrir os seletores:
//   1. Abra https://steamaccountpro.exaccess.com no Chrome
//   2. Clique com o botão direito num card de produto → Inspecionar
//   3. Copie o seletor CSS do container do card, do título e do preço
// ─────────────────────────────────────────────────────────────
const SCRAPER_CONFIG = {
  baseUrl: 'https://steamaccountpro.exaccess.com',

  // Seletores CSS do card de produto na listagem
  // Adicione variantes separadas por vírgula se o site tiver múltiplos layouts
  cardSelector: '.product, .product-item, .item, article, [class*="product"], [class*="item"]',
  titleSelector: 'h1, h2, h3, h4, .title, .name, [class*="title"], [class*="name"]',
  priceSelector: '.price, .cost, .amount, [class*="price"], [class*="cost"]',

  // Headers para parecer um browser real
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
  },

  // Timeout em ms
  timeout: 15000,

  // Score mínimo de similaridade para aceitar um match de título (0–1)
  // 0.5 = 50% das palavras precisam coincidir
  minSimilarity: 0.5,
}

// ─────────────────────────────────────────────────────────────
// Produtos cadastrados (espelho de src/data/products.js)
// Mantido aqui para evitar importar ESM do React no Node.
// Quando adicionar produto novo lá, adicione aqui também.
// ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1,  title: 'Crimson Desert',               steamAppId: 3321460 },
  { id: 2,  title: 'Black Myth Wukong',             steamAppId: 2358720 },
  { id: 3,  title: 'Resident Evil Requiem',         steamAppId: 3764200 },
  { id: 7,  title: 'EA Sports FC 26',               steamAppId: 3405690 },
  { id: 10, title: "Assassin's Creed Shadows",      steamAppId: 3159330 },
  { id: 11, title: 'DOOM The Dark Ages',            steamAppId: 3017860 },
]

// ═══════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════

/** Normaliza string para comparação: minúsculas, sem pontuação, sem artigos */
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')   // remove pontuação
    .replace(/\b(the|a|an|de|do|da|o|a)\b/g, '') // remove artigos
    .replace(/\s+/g, ' ')
    .trim()
}

/** Calcula similaridade entre dois títulos (Jaccard de palavras) */
function similarity(a, b) {
  const setA = new Set(normalize(a).split(' ').filter(Boolean))
  const setB = new Set(normalize(b).split(' ').filter(Boolean))
  if (setA.size === 0 || setB.size === 0) return 0
  const intersection = [...setA].filter(w => setB.has(w)).length
  const union = new Set([...setA, ...setB]).size
  return intersection / union
}

/** Extrai primeiro número decimal de uma string de preço */
function parsePrice(raw) {
  if (!raw) return null
  // Captura padrões como $4.94, 4,94, USD 4.94, etc.
  const m = raw.replace(',', '.').match(/(\d+\.\d{1,2})/)
  if (!m) return null
  const n = parseFloat(m[1])
  return isNaN(n) || n <= 0 ? null : n.toFixed(2)
}

/** Faz fetch com timeout e retorna texto ou null */
async function fetchText(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SCRAPER_CONFIG.timeout)
  try {
    const res = await fetch(url, {
      headers: SCRAPER_CONFIG.headers,
      signal: controller.signal,
      ...options,
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } catch (err) {
    clearTimeout(timer)
    console.warn(`  ⚠ fetch(${url}) falhou: ${err.message}`)
    return null
  }
}

/** Lê prices.json existente (fallback caso scraping falhe) */
async function loadExistingPrices() {
  try {
    const raw = await fs.readFile(PRICES_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { version: 1, lastUpdated: null, products: {} }
  }
}

// ═══════════════════════════════════════════════════════════════
// FONTE 1 — steamaccountpro.exaccess.com
// ═══════════════════════════════════════════════════════════════

/**
 * Tenta extrair preços do steamaccountpro via múltiplas estratégias.
 * Retorna Map<productId, priceString>
 */
async function fetchSteamAccountProPrices() {
  const result = new Map()

  console.log('\n📥 Buscando preços em steamaccountpro.exaccess.com...')

  // Estratégia 1: JSON-LD (schema.org/Product) — a mais confiável
  const homeHtml = await fetchText(SCRAPER_CONFIG.baseUrl)
  if (homeHtml) {
    const ldPrices = extractFromJsonLd(homeHtml)
    ldPrices.forEach((v, k) => result.set(k, v))
    console.log(`  ✓ JSON-LD: ${ldPrices.size} produtos encontrados`)
  }

  // Estratégia 2: Scraping de HTML com cheerio
  // Tenta página principal + página /catalog ou /products (padrões comuns)
  const pagesToTry = [
    SCRAPER_CONFIG.baseUrl,
    `${SCRAPER_CONFIG.baseUrl}/catalog`,
    `${SCRAPER_CONFIG.baseUrl}/products`,
    `${SCRAPER_CONFIG.baseUrl}/store`,
    `${SCRAPER_CONFIG.baseUrl}/shop`,
    `${SCRAPER_CONFIG.baseUrl}/games`,
  ]

  for (const url of pagesToTry) {
    if (result.size >= PRODUCTS.length) break
    const html = url === SCRAPER_CONFIG.baseUrl ? homeHtml : await fetchText(url)
    if (!html) continue

    const scraped = scrapeHtmlCards(html)
    scraped.forEach((v, k) => {
      if (!result.has(k)) result.set(k, v)
    })
    if (scraped.size > 0) {
      console.log(`  ✓ HTML scrape (${url}): ${scraped.size} produtos encontrados`)
    }
  }

  // Estratégia 3: Busca individual por título de cada produto não encontrado
  for (const product of PRODUCTS) {
    if (result.has(product.id)) continue

    const searchUrl = `${SCRAPER_CONFIG.baseUrl}/search?q=${encodeURIComponent(product.title)}`
    const html = await fetchText(searchUrl)
    if (!html) continue

    const scraped = scrapeHtmlCards(html, [product])
    scraped.forEach((v, k) => result.set(k, v))
    if (scraped.has(product.id)) {
      console.log(`  ✓ Busca individual "${product.title}": $${result.get(product.id)}`)
    }
  }

  return result
}

/** Extrai preços de blocos JSON-LD (schema.org) */
function extractFromJsonLd(html) {
  const result = new Map()
  const $ = cheerio.load(html)

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html())
      const items = Array.isArray(data) ? data : [data]

      for (const item of items) {
        const type = item['@type'] || ''
        if (!['Product', 'Offer', 'ItemList'].includes(type)) continue

        // ItemList contém lista de produtos
        if (type === 'ItemList' && item.itemListElement) {
          for (const entry of item.itemListElement) {
            matchAndStore(entry.item || entry, result)
          }
        } else {
          matchAndStore(item, result)
        }
      }
    } catch {
      // JSON inválido — ignora
    }
  })

  return result
}

/** Tenta fazer match de um objeto JSON-LD com nossos produtos */
function matchAndStore(item, result) {
  const name = item.name || item.title || ''
  const offerPrice =
    item?.offers?.price ||
    item?.offers?.[0]?.price ||
    item?.price ||
    null

  if (!name || !offerPrice) return

  const price = parsePrice(String(offerPrice))
  if (!price) return

  // Encontra o produto mais similar
  let bestId = null, bestScore = 0
  for (const p of PRODUCTS) {
    const score = similarity(p.title, name)
    if (score > bestScore) { bestScore = score; bestId = p.id }
  }

  if (bestId && bestScore >= SCRAPER_CONFIG.minSimilarity) {
    result.set(bestId, price)
  }
}

/** Scraping tradicional de cards HTML */
function scrapeHtmlCards(html, productSubset = PRODUCTS) {
  const result = new Map()
  const $ = cheerio.load(html)

  // Coleta todos os pares (título, preço) da página
  const candidates = []

  $(SCRAPER_CONFIG.cardSelector).each((_, el) => {
    const titleEl = $(el).find(SCRAPER_CONFIG.titleSelector).first()
    const priceEl = $(el).find(SCRAPER_CONFIG.priceSelector).first()
    const title = titleEl.text().trim()
    const priceRaw = priceEl.text().trim()
    if (title && priceRaw) {
      candidates.push({ title, price: parsePrice(priceRaw) })
    }
  })

  // Faz fuzzy match entre candidatos e nossos produtos
  for (const product of productSubset) {
    let bestCandidate = null, bestScore = 0
    for (const c of candidates) {
      if (!c.price) continue
      const score = similarity(product.title, c.title)
      if (score > bestScore) { bestScore = score; bestCandidate = c }
    }
    if (bestCandidate && bestScore >= SCRAPER_CONFIG.minSimilarity) {
      result.set(product.id, bestCandidate.price)
    }
  }

  return result
}

// ═══════════════════════════════════════════════════════════════
// FONTE 2 — Steam Store API (originalPrice)
// ═══════════════════════════════════════════════════════════════

/**
 * Busca preço cheio do jogo na Steam via API oficial.
 * Retorna Map<productId, priceString>
 */
async function fetchSteamOriginalPrices() {
  const result = new Map()
  const productsWithApp = PRODUCTS.filter(p => p.steamAppId)

  console.log('\n📥 Buscando preços originais via Steam API...')

  // Agrupa em lotes de 10 (limite seguro da API)
  const BATCH_SIZE = 10
  for (let i = 0; i < productsWithApp.length; i += BATCH_SIZE) {
    const batch = productsWithApp.slice(i, i + BATCH_SIZE)
    const appIds = batch.map(p => p.steamAppId).join(',')

    const url = `https://store.steampowered.com/api/appdetails?appids=${appIds}&filters=price_overview&cc=us&l=english`
    const text = await fetchText(url)
    if (!text) continue

    try {
      const data = JSON.parse(text)
      for (const product of batch) {
        const entry = data[product.steamAppId]
        if (!entry?.success) {
          console.log(`  ⚠ App ${product.steamAppId} (${product.title}): não encontrado na Steam API`)
          continue
        }

        const priceData = entry.data?.price_overview
        if (!priceData) {
          // Jogo grátis ou sem preço
          console.log(`  ℹ ${product.title}: sem preço na Steam (pode ser free-to-play ou pre-release)`)
          continue
        }

        // initial = preço cheio em centavos (sem desconto)
        const cents = priceData.initial
        if (cents > 0) {
          const price = (cents / 100).toFixed(2)
          result.set(product.id, price)
          console.log(`  ✓ ${product.title}: $${price} (original Steam)`)
        }
      }
    } catch (err) {
      console.warn(`  ⚠ Erro ao parsear resposta da Steam API: ${err.message}`)
    }

    // Pausa entre batches para não sobrecarregar a API
    if (i + BATCH_SIZE < productsWithApp.length) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  return result
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('🚀 RussoGames — Atualizador de Preços')
  console.log('='.repeat(45))

  // Carrega preços existentes como fallback
  const existing = await loadExistingPrices()

  // Busca preços de venda (steamaccountpro)
  const salePrices = await fetchSteamAccountProPrices()

  // Busca preços originais (Steam API)
  const steamPrices = await fetchSteamOriginalPrices()

  // Monta o objeto final de preços
  const products = {}
  let changed = false

  for (const product of PRODUCTS) {
    const prev = existing.products?.[product.id] ?? {}

    const newPrice = salePrices.get(product.id) ?? prev.price ?? null
    const newOriginalPrice = steamPrices.get(product.id) ?? prev.originalPrice ?? null

    products[product.id] = {
      price: newPrice,
      originalPrice: newOriginalPrice,
    }

    // Detecta mudanças
    if (prev.price !== newPrice || prev.originalPrice !== newOriginalPrice) {
      changed = true
      console.log(`\n📝 ${product.title} (id=${product.id})`)
      if (prev.price !== newPrice) {
        console.log(`   price:         $${prev.price ?? '–'} → $${newPrice ?? '–'}`)
      }
      if (prev.originalPrice !== newOriginalPrice) {
        console.log(`   originalPrice: $${prev.originalPrice ?? '–'} → $${newOriginalPrice ?? '–'}`)
      }
    }
  }

  // Salva prices.json
  const output = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    products,
  }

  await fs.writeFile(PRICES_FILE, JSON.stringify(output, null, 2), 'utf8')

  console.log('\n' + '='.repeat(45))
  if (changed) {
    console.log('✅ prices.json atualizado com sucesso!')
  } else {
    console.log('✅ Nenhuma mudança detectada — prices.json mantido.')
  }
  console.log(`📄 Arquivo: ${PRICES_FILE}`)

  // Resumo final
  console.log('\n📊 Resumo de preços:')
  for (const product of PRODUCTS) {
    const p = products[product.id]
    const saleTag = salePrices.has(product.id) ? '✓' : '✗'
    const steamTag = steamPrices.has(product.id) ? '✓' : '✗'
    console.log(
      `  [sale:${saleTag} steam:${steamTag}] ${product.title.padEnd(30)} ` +
      `venda=$${p.price ?? 'N/A'} original=$${p.originalPrice ?? 'N/A'}`
    )
  }

  // Exit code 1 se nenhum preço foi obtido (CI pode alertar)
  const totalFetched = salePrices.size + steamPrices.size
  if (totalFetched === 0) {
    console.error('\n❌ Nenhum preço obtido de nenhuma fonte. Verifique os seletores e a disponibilidade dos sites.')
    process.exit(1)
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
