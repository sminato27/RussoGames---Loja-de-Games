import { useState } from 'react'
import styles from './ProductCard.module.css'

const BADGE_CLASS = {
  'Novo':      'badge--novo',
  'Hot':       'badge--hot',
  'Oferta':    'badge--oferta',
  'Exclusivo': 'badge--exclusivo',
}

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
<svg width="460" height="215" xmlns="http://www.w3.org/2000/svg">
  <rect width="460" height="215" fill="#0d1526"/>
  <rect x="30%" y="35%" width="40%" height="30%" rx="4" fill="#1a2740"/>
  <text x="50%" y="58%" font-family="monospace" font-size="12" fill="#4a5568" text-anchor="middle">Sem imagem</text>
</svg>
`)

export default function ProductCard({ product, onSelect }) {
  const [imgError, setImgError] = useState(false)

  const hasDiscount = product.originalPrice && product.originalPrice !== product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.price.replace(/[^\d,]/g, '').replace(',', '.')) /
        parseFloat(product.originalPrice.replace(/[^\d,]/g, '').replace(',', '.'))) * 100)
    : null

  return (
    <article
      className={styles.card}
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(product)}
      aria-label={`Ver detalhes: ${product.title}`}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        <img
          src={imgError || !product.image ? PLACEHOLDER : product.image}
          alt={product.title}
          className={styles.image}
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Overlay badges */}
        <div className={styles.imageMeta}>
          {product.badge && (
            <span className={`badge ${BADGE_CLASS[product.badge] || ''} ${styles.badge}`}>
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className={`${styles.discountBadge}`}>-{discountPercent}%</span>
          )}
        </div>

        {/* Hover overlay */}
        <div className={styles.overlay} aria-hidden="true">
          <span className={styles.overlayBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Platform */}
        {product.category && (
          <span className="platform-tag">
            {product.category}
          </span>
        )}

        {/* Title */}
        <h3 className={styles.title} title={product.title}>
          {product.title}
        </h3>

        {/* Subtitle */}
        {product.subtitle && (
          <p className={styles.subtitle}>{product.subtitle}</p>
        )}

        {/* Footer: price + button */}
        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            {hasDiscount && (
              <span className={styles.originalPrice}>{product.originalPrice}</span>
            )}
            <span className={styles.price}>{product.price}</span>
          </div>

          <button
            className={styles.buyBtn}
            onClick={e => { e.stopPropagation(); onSelect(product) }}
            aria-label={`Comprar ${product.title}`}
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  )
}
