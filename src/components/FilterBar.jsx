import styles from './FilterBar.module.css'

const CATEGORY_ICONS = {
  'Todos':  '🎮',
  'Steam':  '🌊',
  'EA App': '⚽',
  'Xbox':   '🎯',
  'Epic':   '💠',
  'Outro':  '📦',
}

export default function FilterBar({ search, onSearch, categories, activeCategory, onCategory, count, sort, onSort }) {
  return (
    <section className={styles.wrapper} id="catalog">
      <div className={`container ${styles.inner}`}>
        {/* Header row */}
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Catálogo</h2>
            <span className={styles.count}>{count} {count === 1 ? 'produto' : 'produtos'}</span>
          </div>

          {/* Search */}
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              placeholder="Buscar jogo..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Buscar produto"
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => onSearch('')} aria-label="Limpar busca">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className={styles.categories} role="group" aria-label="Filtrar por plataforma">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onCategory(cat)}
              className={`${styles.catBtn} ${activeCategory === cat ? styles.catBtnActive : ''}`}
              aria-pressed={activeCategory === cat}
            >
              <span className={styles.catIcon}>{CATEGORY_ICONS[cat] || '🎮'}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
