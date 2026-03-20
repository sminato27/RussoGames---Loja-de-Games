import { storeConfig } from '../data/products'
import styles from './Hero.module.css'

export default function Hero() {
  const titleLines = storeConfig.heroTitle.split('\n')

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Decorative background elements */}
      <div className={styles.bgGlow1} aria-hidden="true" />
      <div className={styles.bgGlow2} aria-hidden="true" />
      <div className={styles.bgGrid}  aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Ativações Disponíveis Agora</span>
        </div>

        <h1 id="hero-title" className={styles.title}>
          {titleLines.map((line, i) => (
            <span key={i} className={styles.titleLine} style={{ animationDelay: `${i * 0.12}s` }}>
              {line}
            </span>
          ))}
        </h1>

        <p className={styles.subtitle}>{storeConfig.heroSubtitle}</p>

        <div className={styles.actions}>
          <a href="#catalog" className={`btn btn-primary ${styles.ctaMain}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Ver Catálogo Completo
          </a>
          {storeConfig.whatsapp && (
            <a href={`https://wa.me/${storeConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`btn btn-ghost ${styles.ctaSecondary}`}>
              Falar com Suporte
            </a>
          )}
        </div>

        {/* Stats strip */}
        <div className={styles.stats}>
          <Stat value="100%" label="Offline" icon="🔒" />
          <div className={styles.statDivider} />
          <Stat value="24/7"  label="Suporte" icon="💬" />
          <div className={styles.statDivider} />
          <Stat value="Rápido" label="Entrega Imediata" icon="⚡" />
          <div className={styles.statDivider} />
          <Stat value="Legal" label="Licença Oficial" icon="✅" />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label, icon }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
