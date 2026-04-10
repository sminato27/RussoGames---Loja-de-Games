# 🎮 RussoGames - Sua Loja de Jogos com Preços Sempre Atualizados!

Bem-vindo ao **RussoGames**, uma loja online moderna e automatizada para ativações de jogos Steam e EA App! Aqui você encontra os melhores preços para jogos incríveis como *Crimson Desert*, *Black Myth: Wukong* e muito mais, com ativação offline garantida e suporte 24/7.

![RussoGames Banner](https://img.shields.io/badge/Status-Ativo-brightgreen) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)

## ✨ O Que Torna Este Projeto Especial?

- **Preços Automáticos**: Atualização a cada 6 horas via GitHub Actions – sem intervenção manual!
- **Interface Moderna**: Desenvolvida com React e Vite para uma experiência rápida e responsiva.
- **Catálogo Dinâmico**: Fácil de expandir com novos jogos.
- **Integração com APIs**: Usa APIs oficiais da Steam e Digiseller para preços precisos.
- **Deploy Automático**: Hospedado na Vercel, com reimplantações instantâneas após atualizações.

## 🚀 Como Funciona?

O RussoGames combina dados estáticos de produtos com preços dinâmicos atualizados automaticamente. Veja o fluxo mágico:

1. **GitHub Actions** roda a cada 6 horas (cron job).
2. O script `update-prices.js` consulta:
   - **Digiseller API** para o preço de venda atual.
   - **Steam Store API** para o preço original oficial.
3. Os preços são salvos em `public/prices.json` e commitados automaticamente.
4. A Vercel detecta o push e reimplanta o site em ~30 segundos.
5. O frontend carrega os preços via o hook `usePrices` e exibe no site.

### Diagrama do Fluxo
```
GitHub Actions (⏰ a cada 6h)
    ↓
Scripts de Atualização
    ├─ Digiseller API → Preço de Venda
    └─ Steam API → Preço Original
    ↓
prices.json Atualizado
    ↓
Vercel Redeploy
    ↓
Site com Preços Frescos! 🎉
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + Vite (para builds rápidos)
- **APIs**: Steam Store API, Digiseller API
- **Automação**: GitHub Actions para CI/CD
- **Deploy**: Vercel (redeploy automático)
- **Scripts**: Node.js puro (sem dependências extras)

## 📦 Instalação e Execução

Quer rodar o projeto localmente? É super simples!

### Pré-requisitos
- Node.js (versão 18+)
- Git

### Passos
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/sminato27/RussoGames---Loja-de-Games.git
   cd RussoGames---Loja-de-Games
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Rode o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Abra no navegador**: Acesse `http://localhost:5173` e veja a magia acontecer!

### Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build localmente

## 🏗️ Estrutura do Projeto

Entenda como o código está organizado:

```
RussoGames/
├── public/
│   └── prices.json          # Preços dinâmicos (atualizados automaticamente)
├── scripts/
│   ├── update-prices.js     # Script de atualização de preços
│   ├── test-selectors.js    # Ferramenta de debug para APIs
│   └── package.json         # Configuração dos scripts
├── src/
│   ├── components/          # Componentes React (Header, ProductCard, etc.)
│   ├── data/
│   │   └── products.js      # Catálogo de produtos
│   ├── hooks/
│   │   └── usePrices.js     # Hook para carregar preços dinâmicos
│   ├── App.jsx              # Componente principal
│   └── main.jsx             # Ponto de entrada
├── .github/workflows/       # GitHub Actions para automação
├── package.json             # Dependências do frontend
└── vite.config.js           # Configuração do Vite
```

## ➕ Como Adicionar um Novo Jogo

Quer expandir o catálogo? Siga estes passos:

### 1. Encontre os IDs Necessários
- **digisellerProductId**: Olhe a URL de pagamento do produto (o número após `id_d=`).
- **steamAppId**: O número na URL da página do jogo na Steam (ex: `store.steampowered.com/app/3321460/`).

### 2. Adicione no Catálogo (`src/data/products.js`)
```javascript
{
  id: 12,
  title: "Nome do Jogo",
  subtitle: "STEAM • Ativação Offline",
  description: `Descrição incrível do jogo...`,
  price: "$0.00",              // Atualizado automaticamente
  originalPrice: "$0.00",      // Atualizado automaticamente
  steamAppId: 123456,
  digisellerProductId: 9999999,
  category: "Steam",
  badge: "Novo",
  image: "https://cdn.akamai.steamstatic.com/steam/apps/123456/header.jpg",
  paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=9999999&ai=1444941&_ow=0",
  features: ["Ativação offline", "Suporte 24/7"],
  tags: ["RPG", "Ação"],
}
```

### 3. Atualize o Script de Preços (`scripts/update-prices.js`)
Adicione na lista `PRODUCTS`:
```javascript
{ id: 12, title: 'Nome do Jogo', digisellerProductId: 9999999, steamAppId: 123456 }
```

### 4. Configure GitHub Actions (Uma Vez)
Para que a automação funcione:
- Vá para Settings → Actions → General → Workflow permissions
- Marque "Read and write permissions"

### 5. Teste Localmente
```bash
cd scripts
npm install
node test-selectors.js  # Testa as APIs
node update-prices.js   # Atualiza preços
```

## ❓ Perguntas Frequentes (FAQ)

**Os preços são realmente atualizados automaticamente?**  
Sim! A cada 6 horas, o GitHub Actions roda os scripts e atualiza o `prices.json`.

**E se a API estiver indisponível?**  
O site mantém os preços anteriores – nunca mostra "$0.00".

**Posso alterar a frequência de atualização?**  
Claro! Edite o cron em `.github/workflows/update-prices.yml`. Ex: `'0 */3 * * *'` para cada 3 horas.

**Como adicionar mais plataformas além da Steam?**  
Basta adicionar novas categorias em `products.js` e ajustar os scripts para novas APIs.

## 🤝 Contribuição

Adoraria sua ajuda! Para contribuir:
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é open-source sob a licença MIT. Sinta-se à vontade para usar e modificar!

---

Feito com ❤️ para gamers que amam bons preços. Divirta-se comprando! 🎮🚀
