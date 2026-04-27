import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from '../../src/components/Footer'
import Header from '../../src/components/Header'
import Hero from '../../src/components/Hero'
import HowItWorks from '../../src/components/HowItWorks'

describe('Componentes estáticos principais', () => {
  it('Header deve renderizar navegação e CTA para catálogo', () => {
    render(<Header />)

    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '#catalog')
    expect(screen.getByRole('link', { name: 'Ver Jogos' })).toHaveAttribute('href', '#catalog')
  })

  it('Hero deve renderizar título e CTA principal', () => {
    render(<Hero />)

    expect(screen.getByRole('heading', { name: /Jogue Mais,/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver Catálogo Completo/i })).toHaveAttribute('href', '#catalog')
    expect(screen.getByText('Ativações Disponíveis Agora')).toBeInTheDocument()
  })

  it('HowItWorks deve renderizar os 4 passos da jornada', () => {
    render(<HowItWorks />)

    expect(screen.getByRole('heading', { name: 'Como Funciona' })).toBeInTheDocument()
    expect(screen.getByText('Escolha seu Jogo')).toBeInTheDocument()
    expect(screen.getByText('Realize o Pagamento')).toBeInTheDocument()
    expect(screen.getByText('Receba as Credenciais')).toBeInTheDocument()
    expect(screen.getByText('Ative e Jogue!')).toBeInTheDocument()
  })

  it('Footer deve renderizar disclaimer e fallback de suporte', () => {
    render(<Footer />)

    expect(screen.getByLabelText('Rodapé')).toBeInTheDocument()
    expect(screen.getByText('Link do suporte no e-mail da compra.')).toBeInTheDocument()
    expect(screen.getByText(/Steam, EA App e demais marcas são propriedade/i)).toBeInTheDocument()
  })
})