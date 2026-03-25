import { useState, useMemo } from 'react'
import { products } from './data/products'
import { usePrices } from './hooks/usePrices'
import Header from './components/Header'
import Hero from './components/Hero'
import FilterBar from './components/FilterBar'
import ProductGrid from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

// Derive unique categories from products data
function getCategories(products) {
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
  return ['Todos', ...cats]
}

/**
 * Formata um preço numérico em string de exibição.
 * Ex: "5.26" → "$5.26"
 */
function formatPrice(raw) {
  if (!raw) return null
  const n = parseFloat(raw)
  return isNaN(n) ? null : `$${n.toFixed(2)}`
}

/**
 * Mescla os preços dinâmicos (prices.json) nos produtos estáticos (products.js).
 * Se o prices.json não tiver um produto ou um campo, mantém o valor original.
 */
function mergeWithDynamicPrices(staticProducts, prices) {
  return staticProducts.map(product => {
    const dynamic = prices[product.id]
    if (!dynamic) return product

    return {
      ...product,
      price:         formatPrice(dynamic.price)         ?? product.price,
      originalPrice: formatPrice(dynamic.originalPrice) ?? product.originalPrice,
    }
  })
}

export default function App() {
  const [search, setSearch]           = useState('')
  const [activeCategory, setCategory] = useState('Todos')
  const [selectedProduct, setProduct] = useState(null)

  // Preços dinâmicos do prices.json (atualizado pelo GitHub Actions)
  const { prices } = usePrices()

  // Produtos com preços dinâmicos aplicados
  const mergedProducts = useMemo(
    () => mergeWithDynamicPrices(products, prices),
    [prices]
  )

  const categories = useMemo(() => getCategories(mergedProducts), [mergedProducts])

  const filtered = useMemo(() => {
    return mergedProducts.filter(p => {
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.subtitle || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory, mergedProducts])

  // When category changes, reset search
  const handleCategory = (cat) => {
    setCategory(cat)
    setSearch('')
  }

  // Quando o modal está aberto, atualiza o produto selecionado com os preços dinâmicos
  const resolvedSelectedProduct = useMemo(() => {
    if (!selectedProduct) return null
    return mergedProducts.find(p => p.id === selectedProduct.id) ?? selectedProduct
  }, [selectedProduct, mergedProducts])

  return (
    <>
      <Header />

      <main id="main">
        <Hero />

        <FilterBar
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={activeCategory}
          onCategory={handleCategory}
          count={filtered.length}
        />

        <ProductGrid products={filtered} onSelect={setProduct} />

        <HowItWorks />
      </main>

      <Footer />

      {resolvedSelectedProduct && (
        <ProductModal
          product={resolvedSelectedProduct}
          onClose={() => setProduct(null)}
        />
      )}
    </>
  )
}
