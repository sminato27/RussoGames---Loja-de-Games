/**
 * ============================================================
 * inspect-api.js — Inspetor das APIs de Preços
 * ============================================================
 * Uso:  node scripts/test-selectors.js
 * ============================================================
 */

const PRODUCTS = [
  { id: 1,  title: 'Crimson Desert',           digiId: 5792408, appId: 3321460 },
  { id: 2,  title: 'Black Myth Wukong',         digiId: 4573385, appId: 2358720 },
  { id: 3,  title: 'Resident Evil Requiem',     digiId: 5725897, appId: 3764200 },
  { id: 7,  title: 'EA Sports FC 26',           digiId: 5431131, appId: 3405690 },
  { id: 10, title: "AC Shadows",                digiId: 5065337, appId: 3159330 },
  { id: 11, title: 'DOOM Dark Ages',            digiId: 5156821, appId: 3017860 },
]

const H = { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }

async function get(url) {
  const r = await fetch(url, { headers: H })
  console.log(`  Status: ${r.status}`)
  return r.ok ? r.json() : null
}

async function main() {
  console.log('🔍 RussoGames — Inspetor de APIs\n')

  // ── Digiseller batch ──────────────────────────────────────
  console.log('═'.repeat(55))
  console.log('📦 DIGISELLER — /api/products/list (batch)')
  const ids = PRODUCTS.map(p => p.digiId).join(',')
  const url = `https://api.digiseller.com/api/products/list?ids=${ids}&lang=en-US`
  console.log(`URL: ${url}`)
  const digi = await get(url)
  if (digi) {
    const items = Array.isArray(digi) ? digi : (digi.products ?? [])
    console.log(`\nTotal items na resposta: ${items.length}`)
    for (const item of items) {
      const p = PRODUCTS.find(x => x.digiId === item.id)
      console.log(`\n▶  ${p?.title ?? item.id}`)
      console.log(`   price_usd: ${item.price_usd}`)
      console.log(`   price_rub: ${item.price_rub}`)
      console.log(`   name:      ${item.name}`)
    }
    if (items.length === 0) {
      console.log('\n⚠  Array vazio. Resposta completa:')
      console.log(JSON.stringify(digi, null, 2).slice(0, 1000))
    }
  }

  // ── Digiseller individual (fallback) ──────────────────────
  console.log('\n\n' + '═'.repeat(55))
  console.log('📦 DIGISELLER — /api/products/{id}/data (individual)')
  for (const p of PRODUCTS.slice(0, 2)) {
    const u = `https://api.digiseller.com/api/products/${p.digiId}/data?currency=USD`
    console.log(`\n▶  ${p.title}: ${u}`)
    const d = await get(u)
    if (d) {
      const prod = d.product ?? d
      console.log(`   price:    ${prod.price}`)
      console.log(`   currency: ${prod.currency}`)
      console.log(`   prices:   ${JSON.stringify(prod.prices?.initial ?? '—')}`)
    }
  }

  // ── Steam batch ───────────────────────────────────────────
  console.log('\n\n' + '═'.repeat(55))
  console.log('🎮 STEAM — /api/appdetails (batch)')
  const appIds = PRODUCTS.map(p => p.appId).join(',')
  const su = `https://store.steampowered.com/api/appdetails?appids=${appIds}&filters=price_overview&cc=us`
  console.log(`URL: ${su}`)
  const steam = await get(su)
  if (steam) {
    for (const p of PRODUCTS) {
      const e = steam[p.appId]
      if (!e?.success) { console.log(`\n▶  ${p.title}: não encontrado`); continue }
      const po = e.data?.price_overview
      console.log(`\n▶  ${p.title}`)
      if (!po) { console.log('   sem price_overview'); continue }
      console.log(`   initial: ${po.initial} centavos = $${(po.initial/100).toFixed(2)}`)
      console.log(`   final:   ${po.final} centavos = $${(po.final/100).toFixed(2)}`)
    }
  }

  console.log('\n\n' + '='.repeat(55))
  console.log('✅ Inspeção concluída.')
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
