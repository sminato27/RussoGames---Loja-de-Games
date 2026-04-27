export function getCategories(products) {
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
  return ['Todos', ...cats]
}

export function formatPrice(raw) {
  if (!raw) return null
  const n = parseFloat(raw)
  return isNaN(n) ? null : `$${n.toFixed(2)}`
}

export function mergeWithDynamicPrices(staticProducts, prices) {
  return staticProducts.map(product => {
    const dynamic = prices[product.id]
    if (!dynamic) return product

    return {
      ...product,
      price: formatPrice(dynamic.price) ?? product.price,
      originalPrice: formatPrice(dynamic.originalPrice) ?? product.originalPrice,
    }
  })
}

export function filterProducts(products, search, activeCategory) {
  const q = search.toLowerCase().trim()

  return products.filter(product => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory
    const matchesSearch =
      !q ||
      product.title.toLowerCase().includes(q) ||
      (product.subtitle || '').toLowerCase().includes(q) ||
      (product.description || '').toLowerCase().includes(q) ||
      (product.tags || []).some(tag => tag.toLowerCase().includes(q))

    return matchesCategory && matchesSearch
  })
}