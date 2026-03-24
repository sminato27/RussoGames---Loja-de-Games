// =============================================================================
// 🎮 CATÁLOGO DE PRODUTOS — EDITE AQUI!
// =============================================================================
//
// Para ADICIONAR um novo produto, copie o bloco de exemplo abaixo e cole
// dentro do array `products`. Preencha todos os campos.
//
// Para REMOVER um produto, delete o bloco inteiro (de { até },)
//
// Campos obrigatórios: id, title, price, category, paymentUrl
// Campos opcionais:    subtitle, description, originalPrice, badge,
//                      image, features, tags
//
// =============================================================================
//
// ➡️  EXEMPLO DE COMO ADICIONAR UM PRODUTO:
//
//  {
//    id: 99,                          ← Número único (não repita!)
//    title: "Nome do Jogo",           ← Título exibido no card
//    subtitle: "STEAM • Offline",     ← Subtítulo pequeno abaixo do título
//    description: `Descrição completa do produto. Pode usar múltiplas linhas.
//    Descreva os benefícios, modo de ativação, etc.`,
//    price: "R$ 49,90",               ← Preço atual (exibido em destaque)
//    originalPrice: "R$ 299,00",      ← Preço original (riscado) - deixe "" se não quiser
//    category: "Steam",               ← "Steam" | "EA App" | "Xbox" | "Epic" | "Outro"
//    badge: "Novo",                   ← "Novo" | "Hot" | "Oferta" | "Exclusivo" | ""
//    image: "https://...",            ← URL da imagem de capa (460x215 px recomendado)
//    paymentUrl: "https://...",       ← 🔗 SEU LINK DE PAGAMENTO AQUI ←
//    features: [                      ← Lista de vantagens do produto
//      "Ativação sem programas extras",
//      "Modo offline",
//      "Suporte 24/7",
//    ],
//    tags: ["RPG", "Ação"],           ← Tags internas (opcional)
//  },
//
// =============================================================================

export const products = [
  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 1 — Lançamento em destaque
  // --------------------------------------------------------------------------
  {
    id: 1,
    title: "Crimson Desert — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `Crimson Desert é o épico RPG de ação e aventura em mundo aberto da Pearl Abyss. Explore um vasto continente repleto de histórias, combates intensos e gráficos impressionantes.

Ao adquirir, você recebe acesso à conta Steam com a Deluxe Edition completa, incluindo todos os conteúdos exclusivos e DLCs da edição especial.`,
    price: "$5.26",
    originalPrice: "$70",
    category: "Steam",
    badge: "Novo",
    // 💡 Dica: use imagens do CDN do Steam → https://cdn.akamai.steamstatic.com/steam/apps/SEU_APP_ID/header.jpg
    image: "https://cdn.akamai.steamstatic.com/steam/apps/3321460/header.jpg",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5792408&ai=1444941&_ow=0", // ← 🔗 SUBSTITUA PELO SEU LINK
    features: [
      "Ativação sem programas extras",
      "Inclui todos os DLCs da Deluxe Edition",
      "Modo offline garantido",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["RPG", "Mundo Aberto", "Ação"],
  },

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 2
  // --------------------------------------------------------------------------
  {
    id: 2,
    title: "Black Myth: Wukong — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `Uma obra-prima do action RPG inspirada no clássico chinês "A Jornada ao Oeste". Gráficos de tirar o fôlego com Unreal Engine 5, combate fluido e uma narrativa épica.

Edição Deluxe inclui conteúdos exclusivos, roupas especiais e itens adicionais.`,
    price: "$3.95",
    originalPrice: "$59.99",
    category: "Steam",
    badge: "Hot",
    image: "https://cdn.akamai.steamstatic.com/steam/apps/2358720/header.jpg",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=4573385&ai=1444941&_ow=0", // ← 🔗 SUBSTITUA PELO SEU LINK
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

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 3
  // --------------------------------------------------------------------------
  {
    id: 3,
    title: "Resident Evil Requiem — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `Uma nova era do terror de sobrevivência chega com Resident Evil Requiem, o mais recente e imersivo título da icônica série Resident Evil. 
    Vivencie o terror de sobrevivência com a analista do FBI Grace Ashcroft e mergulhe em ação eletrizante com o lendário agente Leon S. Kennedy.
     As jornadas de ambos e seus estilos de jogo únicos se entrelaçam em uma experiência emocionante e de tirar o fôlego que vai te arrepiar até a alma. `,
    price: "$3.95",
    originalPrice: "$69.99",
    category: "Steam",
    badge: "Hot",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3764200/ce5437442768e38eb575f205ab9397d0264017b0/header.jpg?t=1772587704",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5725897&ai=1444941&_ow=0", // ← 🔗 SUBSTITUA PELO SEU LINK
    features: [
      "Requiem para os mortos. Pesadelo para os vivos",
      "Premium Deluxe com todos os extras",
      "Modo offline",
      "Suporte 24/7",
      "Em 95% dos casos, se o acesso for perdido por negligência do comprador, nós garantimos a re-ativação",
    ],
    tags: ["Ação", "Terror", "Aventura"],
  },

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 4
  // --------------------------------------------------------------------------
//   {
//     id: 4,
//     title: "Cyberpunk 2077 — Phantom Liberty",
//     subtitle: "STEAM • Ativação Offline",
//     description: `O RPG futurista de mundo aberto definitivo, agora com a expansão Phantom Liberty incluída! Explore Night City em toda sua glória com patches de atualização completos.
//
// Inclui o jogo base + DLC Phantom Liberty + todas as atualizações.`,
//     price: "R$ 59,90",
//     originalPrice: "R$ 280,00",
//     category: "Steam",
//     badge: "Oferta",
//     image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
//     paymentUrl: "COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI", // ← 🔗 SUBSTITUA PELO SEU LINK
//     features: [
//       "Jogo base + Phantom Liberty",
//       "Mundo aberto imenso",
//       "Todas as atualizações incluídas",
//       "Modo offline",
//       "Suporte garantido",
//     ],
//     tags: ["RPG", "Mundo Aberto", "Sci-fi"],
//   },

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 5
  // --------------------------------------------------------------------------
//   {
//     id: 5,
//     title: "God of War Ragnarök — Deluxe",
//     subtitle: "STEAM • Ativação Offline",
//     description: `Kratos e Atreus enfrentam o Ragnarök neste épico sequel! Uma das maiores aventuras da geração, agora disponível para PC com gráficos impressionantes.
//
// Edição Deluxe com cosméticos exclusivos, artbook digital e trilha sonora.`,
//     price: "R$ 74,90",
//     originalPrice: "R$ 329,00",
//     category: "Steam",
//     badge: "",
//     image: "https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg",
//     paymentUrl: "COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI", // ← 🔗 SUBSTITUA PELO SEU LINK
//     features: [
//       "Exclusivo Sony no PC",
//       "Deluxe Edition completa",
//       "Gráficos otimizados para PC",
//       "Modo offline",
//       "Suporte 24/7",
//     ],
//     tags: ["Ação", "Aventura", "PlayStation"],
//   },

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 6
  // --------------------------------------------------------------------------
//   {
//     id: 6,
//     title: "Hogwarts Legacy — Deluxe Edition",
//     subtitle: "STEAM • Ativação Offline",
//     description: `Viaje ao mundo mágico de Harry Potter no século XIX! Explore Hogwarts, aprenda feitiços, domestique animais mágicos e descubra um segredo ancestral que ameaça o mundo bruxo.
//
// Deluxe Edition inclui DLC Onyx Hippogriff Mount e missões exclusivas.`,
//     price: "R$ 54,90",
//     originalPrice: "R$ 269,00",
//     category: "Steam",
//     badge: "Oferta",
//     image: "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
//     paymentUrl: "COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI", // ← 🔗 SUBSTITUA PELO SEU LINK
//     features: [
//       "Mundo de Harry Potter",
//       "Deluxe Edition com DLCs",
//       "Mundo aberto imersivo",
//       "Modo offline",
//       "Suporte garantido",
//     ],
//     tags: ["RPG", "Fantasia", "Mundo Aberto"],
//   },

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 7
  // --------------------------------------------------------------------------
  {
    id: 7,
    title: "EA Sports FC 26",
    subtitle: "EA App • Licença Offline",
    description: `A mais nova edição do simulador de futebol mais vendido do mundo! Modos carreira, Ultimate Team, clubes e muito mais com as últimas atualizações de jogadores e times.

Licença oficial offline com acesso completo a todos os modos de jogo.`,
    price: "$5.71",
    originalPrice: "$20.99",
    category: "EA App",
    badge: "Novo",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3405690/2d96aa1b06e453cd62dae9029d412f19e61932c3/header.jpg?t=1773426592",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5431131&ai=1444941&_ow=0", // ← 🔗 SUBSTITUA PELO SEU LINK
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

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 8
  // --------------------------------------------------------------------------
//   {
//     id: 8,
//     title: "Red Dead Redemption 2 — Ultimate",
//     subtitle: "STEAM • Ativação Offline",
//     description: `Uma das maiores obras do entretenimento moderno. Explore o Velho Oeste numa aventura épica com gráficos deslumbrantes e uma narrativa cinematográfica incomparável.
//
// Ultimate Edition inclui todos os DLCs, conteúdos extras e atualizações.`,
//     price: "R$ 49,90",
//     originalPrice: "R$ 219,00",
//     category: "Steam",
//     badge: "Oferta",
//     image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
//     paymentUrl: "COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI", // ← 🔗 SUBSTITUA PELO SEU LINK
//     features: [
//       "Ultimate Edition completa",
//       "Todos os DLCs incluídos",
//       "Mundo aberto imersivo",
//       "Modo offline",
//       "Suporte garantido",
//     ],
//     tags: ["Ação", "Aventura", "Mundo Aberto"],
//   },
//
//   // --------------------------------------------------------------------------
//   // 🔥 PRODUTO 9
//   // --------------------------------------------------------------------------
//   {
//     id: 9,
//     title: "Elden Ring — Shadow of the Erdtree",
//     subtitle: "STEAM • Ativação Offline",
//     description: `O jogo mais aclamado de 2022, agora com a expansão Shadow of the Erdtree! Uma experiência soulslike definitiva criada por Hidetaka Miyazaki e George R.R. Martin.
//
// Inclui jogo base + expansão completa.`,
//     price: "R$ 84,90",
//     originalPrice: "R$ 389,00",
//     category: "Steam",
//     badge: "",
//     image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
//     paymentUrl: "COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI", // ← 🔗 SUBSTITUA PELO SEU LINK
//     features: [
//       "Jogo base + Shadow of the Erdtree",
//       "GOTY 2022 + expansão",
//       "Soulslike épico",
//       "Modo offline",
//       "Suporte 24/7",
//     ],
//     tags: ["Soulslike", "RPG", "Ação"],
//   },

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 10
  // --------------------------------------------------------------------------
  {
    id: 10,
    title: "Assassin's Creed Shadows — Deluxe",
    subtitle: "STEAM • Ativação Offline",
    description: `A saga Assassin's Creed chega ao Japão feudal! Jogue como dois personagens distintos — o shinobi Naoe e o samurai Yasuke — em uma história épica de honra e vingança.

Deluxe Edition inclui missões extras, equipamentos exclusivos e pacotes de conteúdo.`,
    price: "$2.98",
    originalPrice: "$35.99",
    category: "Steam",
    badge: "Novo",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3159330/header.jpg?t=1774024749",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5065337&ai=1444941&_ow=0", // ← 🔗 SUBSTITUA PELO SEU LINK
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

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 11
  // --------------------------------------------------------------------------
  {
    id: 11,
    title: "DOOM: The Dark Ages — Premium",
    subtitle: "STEAM • Ativação Offline",
    description: `O Doom Slayer volta à Era das Trevas! Mais brutal, mais rápido e mais épico do que nunca. Uma experiência de FPS que redefine o gênero com combate visceral e ambientação medieval sombria.

Premium Edition com DLCs e conteúdos exclusivos.`,
    price: "$2.98",
    originalPrice: "$23.09",
    category: "Steam",
    badge: "Hot",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg?t=1768344167",
    paymentUrl: "https://www.oplata.info/asp2/pay_wm.asp?id_d=5156821&ai=1444941&_ow=0", // ← 🔗 SUBSTITUA PELO SEU LINK
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

  // --------------------------------------------------------------------------
  // 🔥 PRODUTO 12
  // --------------------------------------------------------------------------
//   {
//     id: 12,
//     title: "Stellar Blade — Complete Edition",
//     subtitle: "STEAM • Ativação Offline",
//     description: `A épica exclusividade PlayStation chega ao PC! Um action RPG com combate estiloso, narrativa intrigante e gráficos deslumbrantes. Jogue como Eve em sua missão de salvar a humanidade.
//
// Complete Edition com todos os DLCs e roupas exclusivas.`,
//     price: "R$ 69,90",
//     originalPrice: "R$ 319,00",
//     category: "Steam",
//     badge: "",
//     image: "https://cdn.akamai.steamstatic.com/steam/apps/3489100/header.jpg",
//     paymentUrl: "COLOQUE_SEU_LINK_DE_PAGAMENTO_AQUI", // ← 🔗 SUBSTITUA PELO SEU LINK
//     features: [
//       "Exclusivo Sony no PC",
//       "Complete Edition completa",
//       "Combate estiloso",
//       "Modo offline",
//       "Suporte garantido",
//     ],
//     tags: ["Ação", "RPG", "PlayStation"],
//   },

  // ==========================================================================
  // ➕ ADICIONE NOVOS PRODUTOS AQUI — copie o bloco acima e cole abaixo
  // ==========================================================================
];

// =============================================================================
// ⚙️  CONFIGURAÇÕES DA LOJA — Edite conforme necessário
// =============================================================================
export const storeConfig = {
  storeName: "RussoGames",           // Nome da sua loja
  storeTagline: "Ativações Premium • Preço Justo • Suporte Real",
  whatsapp: "",                     // Seu número WhatsApp (ex: "5511999999999") ou "" para desativar
  telegram: "",                     // Seu usuário Telegram (ex: "seu_usuario") ou "" para desativar
  discord: "https://discord.com/users/@sminato27",                      // Link do seu Discord ou "" para desativar
  supportEmail: "",                 // Email de suporte ou "" para desativar

  // Texto exibido abaixo do nome da loja no hero
  heroTitle: "Jogue Mais,\nPague Menos.",
  heroSubtitle: "Ativações legítimas para Steam, EA App e mais. Offline, rápido e com suporte real.",

  // Aviso exibido no rodapé e na página de produto
  disclaimer: "Vendemos acesso a contas licenciadas para ativação offline. Não há suporte online, conquistas ou vinculação à sua conta pessoal. Leia a descrição de cada produto antes de comprar.",
};
