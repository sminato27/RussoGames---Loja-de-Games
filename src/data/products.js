// =============================================================================
// 🎮 CATÁLOGO DE PRODUTOS — EDITE AQUI!
// =============================================================================
//
// Campos obrigatórios: id, title, price, category, paymentUrl
// Campos opcionais:    subtitle, description, originalPrice, badge,
//                      image, features, tags,
//                      steamAppId, digisellerProductId
//
// ─────────────────────────────────────────────────────────────────────────────
// 💡 digisellerProductId: número id_d presente na paymentUrl de cada produto
//    Ex: paymentUrl="...?id_d=5792408..." → digisellerProductId: 5792408
//    Usado pelo script para buscar o price (preço de venda) via Digiseller API.
//
// 💡 steamAppId: ID numérico do jogo na Steam (ex: 3321460 para Crimson Desert)
//    Encontre em: store.steampowered.com — o número na URL /app/XXXXX/
//    Usado para buscar o originalPrice (preço cheio oficial) via Steam API.
//
// 💡 price / originalPrice: atualizados AUTOMATICAMENTE pelo GitHub Actions.
//    Script: scripts/update-prices.js — roda a cada 6h e commita prices.json.
//    Os valores abaixo são apenas fallback se a atualização falhar.
// =============================================================================

export const products = [
  {
    id: 1,
    title: "Crimson Desert — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `Crimson Desert é o épico RPG de ação e aventura em mundo aberto da Pearl Abyss. Explore um vasto continente repleto de histórias, combates intensos e gráficos impressionantes.\n\nAo adquirir, você recebe acesso à conta Steam com a Deluxe Edition completa, incluindo todos os conteúdos exclusivos e DLCs da edição especial.`,
    price: "$5.26",
    originalPrice: "$70.00",
    steamAppId: 3321460,
    digisellerProductId: 5792408,
    category: "Steam",
    badge: "Novo",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/3321460/header.jpg",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5792408&ai=1444941&_ow=0",
    features: [
      "Ativação sem programas extras",
      "Inclui todos os DLCs da Deluxe Edition",
      "Modo offline garantido",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["RPG", "Mundo Aberto", "Ação"],
  },
  {
    id: 2,
    title: "Black Myth: Wukong — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `Uma obra-prima do action RPG inspirada no clássico chinês "A Jornada ao Oeste". Gráficos de tirar o fôlego com Unreal Engine 5, combate fluido e uma narrativa épica.\n\nEdição Deluxe inclui conteúdos exclusivos, roupas especiais e itens adicionais.`,
    price: "$3.95",
    originalPrice: "$59.99",
    steamAppId: 2358720,
    digisellerProductId: 4573385,
    category: "Steam",
    badge: "Hot",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/2358720/header.jpg",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=4573385&ai=1444941&_ow=0",
    features: [
      "Action RPG épico solo",
      "Gráficos em Unreal Engine 5",
      "Deluxe Edition completa",
      "Modo offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["RPG", "Ação", "Soulslike"],
  },
  {
    id: 3,
    title: "Resident Evil Requiem — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `Uma nova era do terror de sobrevivência chega com Resident Evil Requiem, o mais recente e imersivo título da icônica série Resident Evil.\n\nVivencie o terror de sobrevivência com a analista do FBI Grace Ashcroft e mergulhe em ação eletrizante com o lendário agente Leon S. Kennedy.`,
    price: "$3.95",
    originalPrice: "$69.99",
    steamAppId: 3764200,
    digisellerProductId: 5725897,
    category: "Steam",
    badge: "Hot",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3764200/ce5437442768e38eb575f205ab9397d0264017b0/header.jpg?t=1772587704",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5725897&ai=1444941&_ow=0",
    features: [
      "Requiem para os mortos. Pesadelo para os vivos",
      "Premium Deluxe com todos os extras",
      "Modo offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["Ação", "Terror", "Aventura"],
  },
  {
    id: 7,
    title: "EA Sports FC 26",
    subtitle: "EA App • Licença Offline",
    description: `A mais nova edição do simulador de futebol mais vendido do mundo! Modos carreira, Ultimate Team, clubes e muito mais com as últimas atualizações de jogadores e times.\n\nLicença oficial offline com acesso completo a todos os modos de jogo.`,
    price: "$5.71",
    originalPrice: "$20.99",
    steamAppId: 3405690,
    digisellerProductId: 5431131,
    category: "EA App",
    badge: "Novo",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/2d96aa1b06e453cd62dae9029d412f19e61932c3/header.jpg?t=1773426592",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5431131&ai=1444941&_ow=0",
    features: [
      "Futebol oficial com licenças",
      "Ultimate Team completo",
      "Modo carreira atualizado",
      "Licença EA App offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["Esportes", "Futebol", "Simulador"],
  },
  {
    id: 10,
    title: "Assassin's Creed Shadows — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `A saga Assassin's Creed chega ao Japão feudal! Jogue como dois personagens distintos — o shinobi Naoe e o samurai Yasuke — em uma história épica de honra e vingança.\n\nDeluxe Edition inclui missões extras, equipamentos exclusivos e pacotes de conteúdo.`,
    price: "$2.98",
    originalPrice: "$35.99",
    steamAppId: 3159330,
    digisellerProductId: 5065337,
    category: "Steam",
    badge: "Novo",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3159330/header.jpg?t=1774024749",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5065337&ai=1444941&_ow=0",
    features: [
      "Japão feudal em mundo aberto",
      "Dois personagens jogáveis",
      "Deluxe Edition completa",
      "Modo offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["Ação", "Mundo Aberto", "Stealth"],
  },
  {
    id: 11,
    title: "DOOM: The Dark Ages — Premium",
    subtitle: "STEAM • Ativação Offline",
    description: `O Doom Slayer volta à Era das Trevas! Mais brutal, mais rápido e mais épico do que nunca. Uma experiência de FPS que redefine o gênero com combate visceral e ambientação medieval sombria.\n\nPremium Edition com DLCs e conteúdos exclusivos.`,
    price: "$2.98",
    originalPrice: "$23.09",
    steamAppId: 3017860,
    digisellerProductId: 5156821,
    category: "Steam",
    badge: "Hot",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg?t=1768344167",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5156821&ai=1444941&_ow=0",
    features: [
      "FPS brutal e épico",
      "Premium Edition com DLCs",
      "Combate visceral",
      "Modo offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["FPS", "Ação", "Shooter"],
  },
  {
    id: 5,
    title: "PRAGMATA - Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `Acompanhe Hugh, membro de uma arruinada equipe de investigação, e Diana, um androide, enquanto exploram uma instalação lunar controlada por uma IA rebelde e tentam voltar à Terra.`,
    price: "$2.98",
    originalPrice: "$23.09",
    steamAppId: 3357650,
    digisellerProductId: 5830635,
    category: "Steam",
    badge: "Novo",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3357650/e32e168b25ed68a0cf6264c220c07e96c2abfb56/header.jpg?t=1777005719",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5830635&ai=1444941&_ow=0",
    features: [
      "Ação e aventura com elementos de ficção científica",
      "Deluxe Edition",
      "Combate frenético",
      "Modo offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["Aventura", "Ação", "Shooter"],
  },
  {
    id: 4,
    title: "F1 25: Iconic",
    subtitle: "STEAM • Ativação Offline",
    description: `Deixe sua marca no mundo do automobilismo no F1® 25, o jogo oficial do 2025 FIA Formula One World Championship™, que traz o modo Minha Equipe reformulado, o terceiro e emocionante capítulo de Ponto de Frenagem e muito mais!`,
    price: "$2.98",
    originalPrice: "$23.09",
    steamAppId: 3059520,
    digisellerProductId: 5198250,
    category: "Steam",
    badge: "Hot",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3059520/37f833ca5bd3d5c3eec2b411131f3e00f580bbe7/header.jpg?t=1772707224",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5198250&ai=1444941&_ow=0",
    features: [
      "Uma nova era da Formula One",
      "Pacote Iconic do Lewis Hamilton",
      "Pilotos ídolos da F3",
      "Modo offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["Corrida", "Simulação", "Esportes"],
  },

  // ➕ ADICIONE NOVOS PRODUTOS AQUI
];

// =============================================================================
// ⚙️  CONFIGURAÇÕES DA LOJA
// =============================================================================
export const storeConfig = {
  storeName: "RussoGames",
  storeTagline: "Ativações Premium • Preço Justo • Suporte Real",
  whatsapp: "",
  telegram: "",
  discord: "https://discord.com/users/@sminato27",
  supportEmail: "",
  heroTitle: "Jogue Mais,\nPague Menos.",
  heroSubtitle: "Ativações legítimas para Steam, EA App e mais. Offline, rápido e com suporte real.",
  disclaimer: "Vendemos acesso a contas licenciadas para ativação offline. Não há suporte online, conquistas ou vinculação à sua conta pessoal. Leia a descrição de cada produto antes de comprar.",
};
