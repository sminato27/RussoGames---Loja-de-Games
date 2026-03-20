import { useState, useMemo } from 'react'
import { products } from './data/products'
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

export default function App() {
  const [search, setSearch]           = useState('')
  const [activeCategory, setCategory] = useState('Todos')
  const [selectedProduct, setProduct] = useState(null)

  const categories = useMemo(() => getCategories(products), [])

  const filtered = useMemo(() => {
    return products.filter(p => {
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
  }, [search, activeCategory])

  // When category changes, reset search
  const handleCategory = (cat) => {
    setCategory(cat)
    setSearch('')
  }

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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setProduct(null)}
        />
      )}
    </>
  )
}
