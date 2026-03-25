# RussoGames 🎮

Loja de ativações Steam com atualização automática de preços.

---

## 🚀 Atualização Automática de Preços

Os preços são atualizados **a cada 6 horas** via GitHub Actions, sem intervenção manual.

| Campo | Fonte | Como funciona |
|-------|-------|---------------|
| `price` | Digiseller API | O site steamaccountpro usa a plataforma Digiseller. A API pública retorna o preço de venda pelo `id_d` de cada produto (presente na paymentUrl). |
| `originalPrice` | Steam Store API oficial | Endpoint `/api/appdetails` retorna o preço cheio em centavos, sem promoção. |

### Fluxo completo

```
GitHub Actions (cron a cada 6h)
  ↓
scripts/update-prices.js
  ├─ Digiseller API  (id_d de cada produto) → price
  └─ Steam Store API (steamAppId)           → originalPrice
  ↓
public/prices.json (commitado automaticamente se mudou)
  ↓
Vercel detecta push → redeploy em ~30s
  ↓
Frontend carrega os novos preços via usePrices hook
```

---

## ⚙️ Configuração inicial (faça uma vez)

### 1. Habilitar escrita no GitHub Actions

Settings → Actions → General → Workflow permissions:
> ✅ Read and write permissions

### 2. Testar localmente

```bash
cd scripts && npm install

# Inspeciona as APIs e imprime a resposta bruta de cada produto
node test-selectors.js

# Executa a atualização completa e grava public/prices.json
node update-prices.js
```

---

## ➕ Adicionar novo produto

### 1. Encontre os IDs necessários

**digisellerProductId:** olhe o `paymentUrl` do produto:
```
https://www.oplata.info/asp2/pay_wm.asp?id_d=5792408&...
                                              ^^^^^^^
                                              digisellerProductId
```

**steamAppId:** acesse a página do jogo em `store.steampowered.com` e copie o número da URL:
```
https://store.steampowered.com/app/3321460/Crimson_Desert/
                                   ^^^^^^^
                                   steamAppId
```

### 2. Adicione em `src/data/products.js`

```js
{
  id: 12,
  title: "Nome do Jogo",
  subtitle: "STEAM • Ativação Offline",
  description: `Descrição...`,
  price: "$0.00",                    // atualizado automaticamente
  originalPrice: "$0.00",            // atualizado automaticamente
  steamAppId: 123456,
  digisellerProductId: 9999999,
  category: "Steam",
  badge: "Novo",
  image: "https://cdn.akamai.steamstatic.com/steam/apps/123456/header.jpg",
  paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=9999999&ai=1444941&_ow=0",
  features: ["Feature 1", "Feature 2"],
  tags: ["RPG", "Ação"],
},
```

### 3. Adicione em `scripts/update-prices.js`

```js
const PRODUCTS = [
  // ... produtos existentes ...
  { id: 12, title: 'Nome do Jogo', digisellerProductId: 9999999, steamAppId: 123456 },
]
```

### 4. Adicione o fallback em `public/prices.json`

```json
"12": { "price": "0.00", "originalPrice": "0.00" }
```

5. Commit e push — o próximo ciclo do Actions preencherá os preços reais.

---

## 📁 Estrutura

```
├── .github/workflows/update-prices.yml  # Cron job (a cada 6h)
├── public/prices.json                   # Preços dinâmicos (gerado automaticamente)
├── scripts/
│   ├── update-prices.js                 # Scraper principal (Digiseller + Steam API)
│   ├── test-selectors.js                # Inspetor de APIs (debug)
│   └── package.json                     # Sem dependências externas
└── src/
    ├── data/products.js                 # Catálogo + fallback de preços
    ├── hooks/usePrices.js               # Hook React → carrega prices.json
    └── App.jsx                          # Mescla preços estáticos + dinâmicos
```

---

## ❓ FAQ

**Preços pararam de atualizar?**
1. Veja o log do Actions no GitHub
2. Rode `node scripts/test-selectors.js` — imprime a resposta bruta das APIs
3. Verifique se os `digisellerProductId` estão corretos nas paymentUrls

**O que acontece se a API falhar?**
O script preserva o preço anterior. O site nunca exibe "$0.00".

**Posso mudar a frequência de atualização?**
Edite o cron em `.github/workflows/update-prices.yml`.
Ex: `'0 */3 * * *'` = a cada 3 horas.

**O workflow precisa de alguma configuração de token?**
Não — usa o `GITHUB_TOKEN` automático. Só precisa que as permissões de escrita estejam habilitadas (passo 1 acima).
