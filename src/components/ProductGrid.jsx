import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'

export default function ProductGrid({ products, onSelect }) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔍</span>
        <h3 className={styles.emptyTitle}>Nenhum produto encontrado</h3>
        <p className={styles.emptyText}>Tente outra busca ou selecione uma categoria diferente.</p>
      </div>
    )
  }

  return (
    <section className={styles.wrapper}>
      <div className={`container ${styles.grid}`}>
        {products.map((product, i) => (
          <div
            key={product.id}
            className={styles.item}
            style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
          >
            <ProductCard product={product} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </section>
  )
}
