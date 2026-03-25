/**
 * ============================================================
 * inspect-api.js — Inspetor da Digiseller API
 * ============================================================
 *
 * Usa para debugar quando um preço não está sendo encontrado.
 * Imprime a resposta bruta da API para cada produto.
 *
 * Uso:
 *   node scripts/test-selectors.js
 * ============================================================
 */

const PRODUCTS = [
  { id: 1,  title: 'Crimson Desert — Deluxe',          digisellerProductId: 5792408, steamAppId: 3321460 },
  { id: 2,  title: 'Black Myth: Wukong — Deluxe',      digisellerProductId: 4573385, steamAppId: 2358720 },
  { id: 3,  title: 'Resident Evil Requiem — Deluxe',   digisellerProductId: 5725897, steamAppId: 3764200 },
  { id: 7,  title: 'EA Sports FC 26',                  digisellerProductId: 5431131, steamAppId: 3405690 },
  { id: 10, title: "Assassin's Creed Shadows — Deluxe",digisellerProductId: 5065337, steamAppId: 3159330 },
  { id: 11, title: 'DOOM: The Dark Ages — Premium',    digisellerProductId: 5156821, steamAppId: 3017860 },
]

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: HEADERS })
  console.log(`  Status: ${res.status}`)
  if (!res.ok) return null
  return res.json()
}

async function inspectDigiseller() {
  console.log('\n' + '═'.repeat(55))
  console.log('🔍 DIGISELLER API — Resposta bruta por produto')
  console.log('═'.repeat(55))

  for (const p of PRODUCTS) {
    console.log(`\n▶  ${p.title} (id_d=${p.digisellerProductId})`)
    const url  = `https://api.digiseller.com/api/products/${p.digisellerProductId}/content?currency=USD`
    console.log(`   URL: ${url}`)
    const data = await fetchJson(url)
    if (data) {
      console.log('   Resposta:')
      console.log(JSON.stringify(data, null, 2).split('\n').map(l => '   ' + l).join('\n').slice(0, 800))
    } else {
      console.log('   ❌ Sem resposta')
    }
  }
}

async function inspectSteam() {
  console.log('\n\n' + '═'.repeat(55))
  console.log('🔍 STEAM API — Resposta bruta por produto')
  console.log('═'.repeat(55))

  const appIds = PRODUCTS.filter(p => p.steamAppId).map(p => p.steamAppId).join(',')
  const url = `https://store.steampowered.com/api/appdetails?appids=${appIds}&filters=price_overview&cc=us&l=english`
  console.log(`\nURL: ${url}`)
  const data = await fetchJson(url)

  if (!data) {
    console.log('❌ Sem resposta da Steam API')
    return
  }

  for (const p of PRODUCTS) {
    if (!p.steamAppId) continue
    const entry = data[p.steamAppId]
    console.log(`\n▶  ${p.title} (appId=${p.steamAppId})`)
    if (!entry?.success) {
      console.log('   ❌ success=false')
      continue
    }
    const po = entry.data?.price_overview
    if (!po) {
      console.log('   ℹ  price_overview ausente (free-to-play ou pre-release)')
      continue
    }
    console.log(`   initial (centavos): ${po.initial}  →  $${(po.initial / 100).toFixed(2)}`)
    console.log(`   final  (centavos):  ${po.final}    →  $${(po.final / 100).toFixed(2)}`)
    console.log(`   currency: ${po.currency}`)
  }
}

async function main() {
  console.log('🔍 RussoGames — Inspetor de APIs de Preços')
  console.log('='.repeat(55))
  await inspectDigiseller()
  await inspectSteam()
  console.log('\n\n' + '='.repeat(55))
  console.log('✅ Inspeção concluída.')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
