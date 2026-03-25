/**
 * ============================================================
 * test-selectors.js — Diagnóstico de seletores HTML
 * ============================================================
 *
 * Use este script para descobrir os seletores corretos do site
 * antes de configurar o SCRAPER_CONFIG no update-prices.js.
 *
 * Uso:
 *   node scripts/test-selectors.js
 *
 * O script imprime o HTML simplificado dos elementos encontrados
 * para cada seletor, permitindo que você ajuste a configuração.
 * ============================================================
 */

import * as cheerio from 'cheerio'

const BASE_URL = 'https://steamaccountpro.exaccess.com'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
}

async function fetchPage(url) {
  console.log(`\nFetching: ${url}`)
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 15000)

  const res = await fetch(url, { headers: HEADERS, signal: controller.signal })
  console.log(`Status: ${res.status} ${res.statusText}`)
  return res.ok ? await res.text() : null
}

function analyzeHtml(html) {
  const $ = cheerio.load(html)

  // ── 1. JSON-LD ──────────────────────────────────────────
  console.log('\n' + '═'.repeat(50))
  console.log('1. BLOCOS JSON-LD ENCONTRADOS:')
  const ldBlocks = $('script[type="application/ld+json"]')
  console.log(`   ${ldBlocks.length} blocos encontrados`)
  ldBlocks.each((i, el) => {
    try {
      const data = JSON.parse($(el).html())
      console.log(`\n   Bloco ${i + 1}:`, JSON.stringify(data, null, 2).slice(0, 500))
    } catch {
      console.log(`   Bloco ${i + 1}: JSON inválido`)
    }
  })

  // ── 2. Seletores candidatos para cards ──────────────────
  console.log('\n' + '═'.repeat(50))
  console.log('2. SELETORES CANDIDATOS A CARDS DE PRODUTO:')

  const candidateSelectors = [
    'article', '.product', '.item', '.card',
    '[class*="product"]', '[class*="item"]', '[class*="card"]',
    '[class*="game"]', '[class*="offer"]', 'li[class]',
  ]

  for (const sel of candidateSelectors) {
    const count = $(sel).length
    if (count > 0) {
      console.log(`\n   Seletor "${sel}": ${count} elementos`)
      // Mostra o primeiro elemento de forma simplificada
      const first = $(sel).first()
      const text = first.text().replace(/\s+/g, ' ').trim().slice(0, 150)
      const classes = first.attr('class') || '(sem classe)'
      console.log(`   └─ classes: ${classes}`)
      console.log(`   └─ texto: "${text}"`)
    }
  }

  // ── 3. Seletores candidatos a preços ───────────────────
  console.log('\n' + '═'.repeat(50))
  console.log('3. SELETORES CANDIDATOS A PREÇOS (contêm "$"):')

  const allElements = $('*')
  const priceSet = new Set()
  allElements.each((_, el) => {
    const text = $(el).children().length === 0 ? $(el).text().trim() : ''
    if (text && /\$\d+(\.\d{2})?/.test(text)) {
      const cls = $(el).attr('class') || el.name
      priceSet.add(`${el.name}.${cls}: "${text}"`)
    }
  })
  ;[...priceSet].slice(0, 20).forEach(s => console.log(`   ${s}`))

  // ── 4. Estrutura geral ──────────────────────────────────
  console.log('\n' + '═'.repeat(50))
  console.log('4. ESTRUTURA DA PÁGINA (tags únicas com classes):')
  const tagMap = new Map()
  $('[class]').each((_, el) => {
    const tag = el.name
    const cls = $(el).attr('class').split(' ').filter(Boolean)
    cls.forEach(c => {
      if (c.length > 2) tagMap.set(`${tag}.${c}`, (tagMap.get(`${tag}.${c}`) || 0) + 1)
    })
  })
  ;[...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([k, v]) => console.log(`   ${k}: ${v}x`))
}

async function main() {
  console.log('🔍 RussoGames — Diagnóstico de Seletores')
  console.log('='.repeat(50))

  // Página inicial
  const html = await fetchPage(BASE_URL)
  if (!html) {
    console.error('\n❌ Não foi possível acessar o site.')
    console.log('\nPossíveis causas:')
    console.log('  • Site bloqueando IPs externos (use VPN ou proxy)')
    console.log('  • Site fora do ar')
    console.log('  • URL incorreta')
    process.exit(1)
  }

  analyzeHtml(html)

  // Tenta rotas alternativas de catálogo
  const altRoutes = ['/catalog', '/products', '/games', '/store', '/shop']
  for (const route of altRoutes) {
    const altHtml = await fetchPage(`${BASE_URL}${route}`)
    if (altHtml && altHtml.length > 1000) {
      console.log(`\n✓ Rota "${route}" existe — analisando...`)
      analyzeHtml(altHtml)
      break
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ Diagnóstico concluído!')
  console.log('\nCom base no output acima, atualize o SCRAPER_CONFIG em update-prices.js:')
  console.log('  cardSelector:  → tag/classe do container de cada produto')
  console.log('  titleSelector: → tag/classe do título dentro do card')
  console.log('  priceSelector: → tag/classe do preço dentro do card')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
