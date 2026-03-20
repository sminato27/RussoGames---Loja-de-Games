import styles from './HowItWorks.module.css'

const steps = [
  {
    number: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
    title: 'Escolha seu Jogo',
    desc: 'Navegue pelo catálogo, use os filtros por plataforma e encontre o jogo que quer jogar.',
  },
  {
    number: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Realize o Pagamento',
    desc: 'Clique em "Comprar Agora" e complete o pagamento de forma segura em nossa plataforma. Selecione "PIX" para garantir sua compra.',
  },
  {
    number: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'Receba as Credenciais',
    desc: 'Você recebe imediatamente os dados de acesso por e-mail junto das instruções de ativação.',
  },
  {
    number: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
    title: 'Ative e Jogue!',
    desc: 'Siga as instruções de ativação conforme o e-mail e o PDF em inglês lembrando de iniciar o jogo com a Steam em modo offline. Depois troque pra sua conta principal e jogue normalmente.',
  },
]

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works" aria-labelledby="how-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Simples e rápido</span>
          <h2 id="how-title" className={styles.title}>Como Funciona</h2>
          <p className={styles.subtitle}>
            Do pagamento ao jogo em poucos minutos. Sem complicação.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIconWrap}>
                {step.icon}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && (
                <div className={styles.connector} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
