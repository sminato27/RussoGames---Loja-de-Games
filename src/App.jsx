import { useState, useMemo } from 'react'
import { products } from './data/products'
import { usePrices } from './hooks/usePrices'
import { getCategories, mergeWithDynamicPrices, filterProducts } from './utils/catalog'
import Header from './components/Header'
import Hero from './components/Hero'
import FilterBar from './components/FilterBar'
import ProductGrid from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

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

  const filtered = useMemo(
    () => filterProducts(mergedProducts, search, activeCategory),
    [search, activeCategory, mergedProducts]
  )

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
