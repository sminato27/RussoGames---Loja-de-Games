import { useEffect, useState, useCallback } from 'react'
import styles from './ProductModal.module.css'
import { storeConfig } from '../data/products'

const BADGE_CLASS = {
  'Novo':      'badge--novo',
  'Hot':       'badge--hot',
  'Oferta':    'badge--oferta',
  'Exclusivo': 'badge--exclusivo',
}

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
<svg width="920" height="430" xmlns="http://www.w3.org/2000/svg">
  <rect width="920" height="430" fill="#0d1526"/>
  <text x="50%" y="50%" font-family="monospace" font-size="14" fill="#4a5568" text-anchor="middle" dy=".3em">Sem imagem</text>
</svg>
`)

export default function ProductModal({ product, onClose }) {
  const [imgError, setImgError] = useState(false)
  const [buying, setBuying] = useState(false)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleBuy = () => {
    if (!product.paymentUrl || product.paymentUrl === 'COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI') {
      alert('⚠️ Link de pagamento não configurado.\n\nEdite o arquivo src/data/products.js e insira a URL de pagamento no campo "paymentUrl".')
      return
    }
    setBuying(true)
    setTimeout(() => {
      window.open(product.paymentUrl, '_blank', 'noopener,noreferrer')
      setBuying(false)
    }, 300)
  }

  const hasDiscount = product.originalPrice && product.originalPrice !== product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.price.replace(/[^\d,]/g, '').replace(',', '.')) /
        parseFloat(product.originalPrice.replace(/[^\d,]/g, '').replace(',', '.'))) * 100)
    : null

  return (
    <div
      className={styles.backdrop}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes: ${product.title}`}
    >
      <div className={styles.modal}>
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Image banner */}
        <div className={styles.imageWrap}>
          <img
            src={imgError || !product.image ? PLACEHOLDER : product.image}
            alt={product.title}
            className={styles.image}
            onError={() => setImgError(true)}
          />
          <div className={styles.imageGradient} aria-hidden="true" />

          {/* Title overlay on image */}
          <div className={styles.imageTitleOverlay}>
            <div className={styles.imageBadges}>
              {product.badge && (
                <span className={`badge ${BADGE_CLASS[product.badge] || ''}`}>{product.badge}</span>
              )}
              {product.category && (
                <span className="platform-tag">{product.category}</span>
              )}
              {discountPercent && (
                <span className={styles.discountPill}>-{discountPercent}%</span>
              )}
            </div>
            <h2 className={styles.imageTitle}>{product.title}</h2>
            {product.subtitle && (
              <p className={styles.imageSubtitle}>{product.subtitle}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.mainContent}>
            {/* Description */}
            {product.description && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Sobre o Produto</h3>
                <div className={styles.description}>
                  {product.description.trim().split('\n\n').map((para, i) => (
                    <p key={i}>{para.trim()}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>O que está incluso</h3>
                <ul className={styles.features}>
                  {product.features.map((feat, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.featureCheck}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className={styles.disclaimer}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              <p>{storeConfig.disclaimer}</p>
            </div>
          </div>

          {/* Buy sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sideCard}>
              {/* Price */}
              <div className={styles.priceBlock}>
                {hasDiscount && (
                  <div className={styles.originalPrice}>
                    <span>De: {product.originalPrice}</span>
                    {discountPercent && <span className={styles.savePill}>Economize {discountPercent}%</span>}
                  </div>
                )}
                <div className={styles.price}>{product.price}</div>
              </div>

              {/* Buy button */}
              <button
                className={`${styles.buyBtn} ${buying ? styles.buying : ''}`}
                onClick={handleBuy}
                disabled={buying}
              >
                {buying ? (
                  <span className={styles.spinner} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                )}
                {buying ? 'Abrindo...' : 'Comprar Agora'}
              </button>

              {/* Support links */}
              {(storeConfig.whatsapp || storeConfig.telegram) && (
                <div className={styles.supportLinks}>
                  <p className={styles.supportLabel}>Dúvidas? Fale conosco:</p>
                  {storeConfig.whatsapp && (
                    <a
                      href={`https://wa.me/${storeConfig.whatsapp}?text=Olá! Tenho interesse em: ${encodeURIComponent(product.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.supportLink}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  )}
                  {storeConfig.telegram && (
                    <a
                      href={`https://t.me/${storeConfig.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.supportLink}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m9.78 18.65.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                      Telegram
                    </a>
                  )}
                </div>
              )}

              {/* Guarantees */}
              <ul className={styles.guarantees}>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Entrega imediata após o pagamento
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                  Suporte 24/7 disponível
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Conta licenciada e verificada
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
