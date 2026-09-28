const SERVER_DATA = {
  name: "UPLALAND 2",
  subtitle: "Crónicas del Valle del Mantaro",
  tagline: "Servidor Oficial LifeSteal SMP • Comunidad Universitaria UPLA",
  location: "Valle del Mantaro • 3,250 m.s.n.m.",
  discordUrl: "https://discord.gg/nnxB9Z4AS",
  connection: {
    java: {
      ip: "UPLALAND_TWO.aternos.me:41031",
      port: "41031",
      version: "Purpur 1.21"
    },
    bedrock: {
      ip: "UPLALAND_TWO.aternos.me",
      port: "41031",
      version: "Geyser (Móvil / Consola / Win 10)"
    },
    backup: "boarfish.aternos.host:41031"
  },
  recipes: {
    heart: {
      name: "Corazón Extra Permanente",
      desc: "Añade +1 corazón permanente a tu salud (Máximo 20 corazones).",
      resultImg: "assets/items/heart.webp",
      resultAlt: "Corazón LifeSteal",
      slots: [
        { img: "assets/items/diamond.webp", name: "Diamante" },
        { img: "assets/items/netherite_ingot.webp", name: "Lingote de Netherite" },
        { img: "assets/items/diamond.webp", name: "Diamante" },

        { img: "assets/items/netherite_ingot.webp", name: "Lingote de Netherite" },
        { img: "assets/items/nether_star.gif", name: "Estrella del Nether" },
        { img: "assets/items/netherite_ingot.webp", name: "Lingote de Netherite" },

        { img: "assets/items/diamond.webp", name: "Diamante" },
        { img: "assets/items/netherite_ingot.webp", name: "Lingote de Netherite" },
        { img: "assets/items/diamond.webp", name: "Diamante" }
      ],
      materials: "4x Diamantes, 4x Netherite Ingot, 1x Estrella del Nether"
    },
    revive: {
      name: "Baliza de Resurrección",
      desc: "Permite revivir a cualquier jugador desterrado usando el comando /revive.",
      resultImg: "assets/items/beacon.webp",
      resultAlt: "Baliza de Revivir",
      slots: [
        { img: "assets/items/totem_of_undying.png", name: "Tótem de Inmortalidad" },
        { img: "assets/items/ender_eye.png", name: "Ojo de Ender" },
        { img: "assets/items/totem_of_undying.png", name: "Tótem de Inmortalidad" },

        { img: "assets/items/ender_eye.png", name: "Ojo de Ender" },
        { img: "assets/items/enchanted_golden_apple.gif", name: "Manzana Dorada Encantada" },
        { img: "assets/items/ender_eye.png", name: "Ojo de Ender" },

        { img: "assets/items/totem_of_undying.png", name: "Tótem de Inmortalidad" },
        { img: "assets/items/ender_eye.png", name: "Ojo de Ender" },
        { img: "assets/items/totem_of_undying.png", name: "Tótem de Inmortalidad" }
      ],
      materials: "4x Tótems de Inmortalidad, 4x Ojos de Ender, 1x Manzana Dorada"
    }
  },
  commands: [
    { cmd: "/register <pass> <pass>", desc: "Crea tu contraseña de acceso seguro al ingresar por primera vez.", category: "Seguridad" },
    { cmd: "/login <pass>", desc: "Inicia sesión para desbloquear tu personaje, movimiento e inventario.", category: "Seguridad" },
    { cmd: "/hearts", desc: "Muestra cuántos corazones te quedan en tu barra de salud.", category: "LifeSteal" },
    { cmd: "/hearts <jugador>", desc: "Consulta cuántos corazones le quedan a un aliado o enemigo.", category: "LifeSteal" },
    { cmd: "/lsz recipe", desc: "Abre la mesa de crafteo para corazones y el artefacto de resurrección.", category: "LifeSteal" },
    { cmd: "/withdrawheart <cant>", desc: "Extrae vida de tu barra y la vuelve un ítem físico para resguardo o comercio.", category: "LifeSteal" },
    { cmd: "/revive <jugador>", desc: "Resucita a un compañero desterrado (requiere el artefacto en mano).", category: "LifeSteal" },
    { cmd: "/graves list", desc: "Muestra las coordenadas (X, Y, Z) exactas de tus lápidas activas.", category: "Rol" },
    { cmd: "/ct", desc: "Verifica los segundos restantes del combate antifuga antes de desconectar.", category: "Combate" },
    { cmd: "/sit | /lay | /crawl", desc: "Animaciones para sentarse, recostarse o gatear en túneles de 1 bloque.", category: "Rol" },
    { cmd: "/skin <nombre_java>", desc: "Aplica la skin de cualquier cuenta prémium oficial de Minecraft.", category: "Rol" }
  ],
  rules: [
    {
      title: "Período de Gracia Inicial (45 Minutos)",
      detail: "Durante los primeros 45 minutos tras la apertura, el PvP y el robo de vidas permanecen desactivados para permitir talar recursos, equiparse con hierro y asegurar refugio."
    },
    {
      title: "Pacto de Sangre del Mantaro (LifeSteal)",
      detail: "Inicias con 10 corazones. Solo ganas o pierdes vidas permanentes en combates directos PvP. Las muertes ambientales generan lápida pero no reducen tu vida máxima. Límite acumulable: 20 corazones."
    },
    {
      title: "Fauna Salvaje de Altura (LevelledMobs)",
      detail: "Las criaturas de la cordillera tienen niveles progresivos: a mayor distancia del spawn o profundidad en minas, contarán con armaduras reforzadas y mayor daño crítico."
    },
    {
      title: "Identificación de Bedrock (Prefijo .)",
      detail: "Los participantes de celular o consola tienen un punto inicial en su nombre (ejemplo: .Usuario). Escribe obligatoriamente el punto al usar /hearts o /revive."
    },
    {
      title: "Auditoría en Tierras Comunales (CoreProtect)",
      detail: "Prohibida la destrucción masiva de bases ajenas con lava o dinamita sin una declaración de guerra previa. Cada bloque colocado o cofre abierto registra al autor de forma permanente."
    },
    {
      title: "Honor Universitario y Cero Trampas",
      detail: "Prohibido el uso de paquetes X-Ray, clientes modificados con ventajas o desconectarse durante combate PvP. La infracción conlleva expulsión permanente."
    }
  ],
  players: [
    // Organizador / Host
    { 
      name: "Jose_18_CM", 
      platform: "Java", 
      role: "Ing. Sistemas",
      isHost: true 
    },
    { 
      name: "T4tsumixd", 
      platform: "Java", 
      role: "Ing. Sistemas" 
    },
    { 
      name: "Juanito3891", 
      platform: "Java", 
      role: "Ing. Sistemas" 
    },
    { 
      name: "Peccavi", 
      platform: "Java", 
      role: "Ing. Sistemas" 
    },
    { 
      name: "gatitocv123123", 
      platform: "Java", 
      role: "Ing. Sistemas" 
    }
  ]
};