/* ========================================================
   UPLALAND II — Crónicas del Valle del Mantaro
   Lógica de Interacción, Shaders, Crafteo y Estado
======================================================== */

let currentHearts = 10;
let soundEnabled = true;
let currentCommandCategory = 'ALL';

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar íconos Lucide
  if (window.lucide) lucide.createIcons();

  // 2. Cargar IPs, enlaces y estados
  setupConnectionInfo();

  // 3. Renderizar HUD de corazones inicial (10 de salud base)
  renderPixelHearts(currentHearts);

  // 4. Renderizar receta por defecto (Corazón Extra)
  selectRecipe('heart');

  // 5. Cargar tablas, reglas y roster
  renderCommands();
  renderRules();
  renderPlayers();

  // 6. Sondeo de servidor en vivo (Aternos)
  checkServerStatus();

  // 7. Iniciar partículas etéreas del Hero
  initCinematicParticles();
});

/* ========================================================
   1. AUDIO FX NATIVO (MINECRAFT RETRO SYNTH - WEB AUDIO API)
======================================================== */
function playMinecraftPickupSound() {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Curva de tono ascendente idéntica al orbe de experiencia (XP)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Nota Re (D5)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // Nota La (A5)

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // Si el navegador bloquea audio antes de interacción, continúa sin error
  }
}

function toggleAudioFx() {
  soundEnabled = !soundEnabled;
  const icon = document.getElementById("sound-icon");
  if (icon) {
    if (soundEnabled) {
      icon.className = "w-4 h-4 text-mantaro-leaf";
      playMinecraftPickupSound();
    } else {
      icon.className = "w-4 h-4 text-slate-500";
    }
  }
}

/* ========================================================
   2. CONEXIÓN Y COPIADO CON NOTIFICACIÓN (TOAST)
======================================================== */
function setupConnectionInfo() {
  const ipJava = document.getElementById("ip-java");
  const ipBedrock = document.getElementById("ip-bedrock");
  const portBedrock = document.getElementById("port-bedrock");

  if (ipJava) ipJava.textContent = SERVER_DATA.connection.java.ip;
  if (ipBedrock) ipBedrock.textContent = SERVER_DATA.connection.bedrock.ip;
  if (portBedrock) portBedrock.textContent = SERVER_DATA.connection.bedrock.port;

  const btnDiscordHero = document.getElementById("btn-discord-hero");
  const btnDiscordNav = document.getElementById("btn-discord-nav");
  if (btnDiscordHero) btnDiscordHero.href = SERVER_DATA.discordUrl;
  if (btnDiscordNav) btnDiscordNav.href = SERVER_DATA.discordUrl;
}

function copyNotify(text, label) {
  playMinecraftPickupSound();

  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    if (toastMsg) toastMsg.textContent = `${label}: ${text}`;
    
    if (toast) {
      toast.classList.remove("-translate-y-24", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");

      setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("-translate-y-24", "opacity-0");
      }, 2600);
    }
  });
}

/* ========================================================
   3. SIMULADOR LIFESTEAL INTERACTIVO (CORAZONES DE 5 EN 5)
======================================================== */
function renderPixelHearts(count) {
  const container = document.getElementById("heart-container");
  const label = document.getElementById("heart-status-label");
  const sub = document.getElementById("heart-status-sub");
  if (!container) return;

  const heartSvg = `
    <svg class="w-6 h-6 heart-pulse filter drop-shadow-[0_0_3px_rgba(231,30,36,0.6)]" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 0H3V1H2V0ZM6 0H7V1H6V0ZM1 1H2V2H1V1ZM3 1H6V2H3V1ZM7 1H8V2H7V1ZM0 2H1V5H0V2ZM8 2H9V5H8V2ZM1 5H2V6H1V5ZM7 5H8V6H7V5ZM2 6H3V7H2V6ZM6 6H7V7H6V6ZM3 7H4V8H3V7ZM5 7H6V8H5V7ZM4 8H5V9H4V8Z" fill="#000000"/>
      <path d="M2 1H3V2H2V1ZM1 2H2V3H1V2Z" fill="#FFFFFF"/>
      <path d="M4 2H5V7H4V8H3V7H2V6H1V3H2V2H3V3H6V2H7V3H8V6H7V7H6V8H5V7H4V2Z" fill="#E71E24"/>
      <path d="M5 2H6V3H5V2ZM7 3H8V6H7V7H6V6H7V3ZM5 6H6V7H5V6ZM4 7H5V8H4V7Z" fill="#8B0000"/>
    </svg>
  `;

  if (count <= 0) {
    container.innerHTML = `<span class="font-mc text-rose-500 text-sm py-2">☠️ ¡HAS SIDO ELIMINADO!</span>`;
    if (label) label.textContent = "Salud: 0 Corazones (0 HP)";
    if (sub) sub.textContent = "Estado: Desterrado (Esperando /revive)";
    return;
  }

  let html = "";
  for (let i = 0; i < count; i++) {
    html += heartSvg;
  }
  container.innerHTML = html;

  if (label) label.textContent = `Salud: ${count} Corazones (${count * 2} HP)`;
  if (sub) {
    sub.textContent = count >= 20 
      ? "¡Límite Máximo de Vida Alcanzado!" 
      : "Estado: Activo y en combate";
  }
}

function adjustSimulatedHearts(delta) {
  playMinecraftPickupSound();
  currentHearts = Math.max(0, Math.min(20, currentHearts + delta));
  renderPixelHearts(currentHearts);
}

function resetSimulatedHearts() {
  playMinecraftPickupSound();
  currentHearts = 10;
  renderPixelHearts(currentHearts);
}

/* ========================================================
   4. MESA DE CRAFTEO 3x3 INTERACTIVA (CON IMÁGENES REALES)
======================================================== */
function selectRecipe(type) {
  playMinecraftPickupSound();
  const recipe = SERVER_DATA.recipes[type];
  if (!recipe) return;

  const btnHeart = document.getElementById("btn-recipe-heart");
  const btnRevive = document.getElementById("btn-recipe-revive");

  if (btnHeart && btnRevive) {
    if (type === 'heart') {
      btnHeart.className = "mc-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-mc";
      btnRevive.className = "mc-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-mc";
    } else {
      btnHeart.className = "mc-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-mc";
      btnRevive.className = "mc-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-mc";
    }
  }

  // Renderizar las 9 casillas de la mesa de crafteo
  const grid = document.getElementById("crafting-grid");
  if (grid) {
    grid.innerHTML = recipe.slots.map(slot => `
      <div class="mc-slot rounded group" title="${slot.name}">
        <img 
          src="${slot.img}" 
          alt="${slot.name}" 
          class="w-8 h-8 object-contain pixelated filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:scale-110 transition duration-150"
          onerror="this.style.opacity='0.2'"
        />
      </div>
    `).join("");
  }

  // Ranura del resultado de crafteo
  const resultSlot = document.getElementById("crafting-result-slot");
  if (resultSlot) {
    resultSlot.innerHTML = `
      <img 
        src="${recipe.resultImg}" 
        alt="${recipe.resultAlt}" 
        class="w-10 h-10 object-contain pixelated filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
        onerror="this.style.opacity='0.2'"
      />
    `;
  }

  const recipeName = document.getElementById("recipe-name");
  const recipeDesc = document.getElementById("recipe-desc");
  if (recipeName) recipeName.textContent = recipe.name;
  if (recipeDesc) recipeDesc.textContent = recipe.desc;
}

/* ========================================================
   5. COMANDOS (BÚSQUEDA Y FILTRADO POR CATEGORÍA)
======================================================== */
function setCommandCategory(cat) {
  playMinecraftPickupSound();
  currentCommandCategory = cat;

  document.querySelectorAll(".category-chip").forEach(btn => {
    if ((cat === 'ALL' && btn.textContent === 'Todos') || btn.textContent.includes(cat)) {
      btn.className = "category-chip active text-xs font-mono px-3 py-1 rounded-lg border border-upla-border bg-mantaro-forest text-white transition";
    } else {
      btn.className = "category-chip text-xs font-mono px-3 py-1 rounded-lg border border-upla-border bg-upla-card hover:bg-upla-border text-slate-300 transition";
    }
  });

  filterCommands();
}

function filterCommands() {
  const input = document.getElementById("command-search-input");
  const query = (input ? input.value : "").toLowerCase();
  const commandsBody = document.getElementById("commands-table-body");
  if (!commandsBody) return;

  const filtered = SERVER_DATA.commands.filter(item => {
    const matchesCategory = currentCommandCategory === 'ALL' || item.category === currentCommandCategory;
    const matchesQuery = item.cmd.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    commandsBody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-xs text-slate-500 font-mono">No se encontraron comandos coincidentes.</td></tr>`;
    return;
  }

  commandsBody.innerHTML = filtered.map(item => `
    <tr class="hover:bg-upla-border/30 transition">
      <td class="p-3.5 font-mono font-bold text-mantaro-leaf select-all">${item.cmd}</td>
      <td class="p-3.5 text-slate-300 text-xs md:text-sm">${item.desc}</td>
      <td class="p-3.5 hidden md:table-cell">
        <span class="bg-upla-night text-upla-cyan text-xs px-2.5 py-1 rounded-md border border-upla-border font-mono">${item.category}</span>
      </td>
    </tr>
  `).join("");
}

function renderCommands() {
  filterCommands();
}

/* ========================================================
   6. REGLAMENTO & ROSTER DE JUGADORES (CON INSIGNIA HOST)
======================================================== */
function renderRules() {
  const rulesContainer = document.getElementById("rules-container");
  if (!rulesContainer) return;

  rulesContainer.innerHTML = SERVER_DATA.rules.map(rule => `
    <div class="card-hover-fx bg-upla-card border border-upla-border rounded-xl p-4">
      <h3 class="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-mantaro-emerald"></span> ${rule.title}
      </h3>
      <p class="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">${rule.detail}</p>
    </div>
  `).join("");
}

function filterPlayers() {
  const input = document.getElementById("player-search-input");
  const query = (input ? input.value : "").toLowerCase();
  const playersGrid = document.getElementById("players-grid");
  if (!playersGrid) return;

  const filtered = SERVER_DATA.players.filter(p => 
    p.name.toLowerCase().includes(query) || p.role.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    playersGrid.innerHTML = `<div class="col-span-full p-6 text-center text-xs text-slate-500 font-mono">No se encontraron participantes registrados.</div>`;
    return;
  }

  playersGrid.innerHTML = filtered.map(p => {
    const cleanNick = p.name.startsWith(".") ? p.name.substring(1) : p.name;
    const avatarUrl = `https://minotar.net/helm/${cleanNick}/100.png`;
    const isHost = p.isHost;

    return `
      <div class="card-hover-fx bg-upla-card border ${isHost ? 'border-amber-500/60 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'border-upla-border'} rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group">
        ${isHost ? '<span class="absolute top-1.5 right-1.5 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mc">HOST</span>' : ''}
        
        <img 
          src="${avatarUrl}" 
          alt="${p.name}" 
          class="w-10 h-10 rounded-lg bg-upla-night border border-upla-border pixelated group-hover:scale-105 transition duration-150 shrink-0" 
          onerror="this.src='https://minotar.net/helm/MHF_Steve/100.png'"
        >
        <div class="overflow-hidden">
          <span class="block text-xs font-bold text-white truncate" title="${p.name}">${p.name}</span>
          <span class="text-[10px] text-mantaro-leaf font-mono block truncate">${p.role}</span>
          <span class="text-[9px] ${p.platform === 'Bedrock' ? 'text-upla-cyan' : 'text-slate-400'} uppercase font-mono font-semibold">
            ${p.platform}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function renderPlayers() {
  filterPlayers();
}

/* ========================================================
   7. ESTADO DEL SERVIDOR EN VIVO (API ATERNOS MCSRVSTAT)
======================================================== */
async function checkServerStatus() {
  const badge = document.getElementById("server-badge");
  const text = document.getElementById("server-status-text");

  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${SERVER_DATA.connection.java.ip}`);
    const data = await res.json();

    if (data.online) {
      if (badge) badge.className = "flex items-center space-x-2 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500 text-xs text-emerald-300";
      if (text) text.textContent = `ONLINE (${data.players.online}/${data.players.max})`;
    } else {
      if (badge) badge.className = "flex items-center space-x-2 bg-rose-950/80 px-3.5 py-1.5 rounded-full border border-rose-500 text-xs text-rose-300";
      if (text) text.textContent = "OFFLINE";
    }
  } catch (e) {
    if (text) text.textContent = "ATERNOS SLEEP";
  }
}

/* ========================================================
   8. MOTOR DE PARTÍCULAS ETÉREAS (DISTRIBUCIÓN 100% HORIZONTAL)
======================================================== */
function initCinematicParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w = window.innerWidth;
  let h = 800;

  function resize() {
    const parent = canvas.parentElement;
    w = canvas.width = parent ? parent.clientWidth : window.innerWidth;
    h = canvas.height = parent ? parent.clientHeight : window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      if (p.baseX > w) p.baseX = Math.random() * w;
    });
  });

  // Calibración inicial forzada
  resize();
  setTimeout(resize, 100);
  setTimeout(resize, 400);

  const colors = ['rgba(56, 189, 248, ', 'rgba(16, 185, 129, ', 'rgba(251, 191, 36, '];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      const currentWidth = w > 0 ? w : window.innerWidth;
      const currentHeight = h > 0 ? h : 800;

      // Distribución horizontal uniforme en toda la pantalla
      this.baseX = Math.random() * currentWidth;
      this.y = initial ? Math.random() * currentHeight : currentHeight + Math.random() * 20;
      this.size = Math.random() * 2.2 + 1.1;
      this.speedY = Math.random() * 0.45 + 0.22;
      
      // Oscilación sinusoidal (flotado orgánico que no se va a los lados)
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = Math.random() * 0.02 + 0.01;
      this.sway = Math.random() * 26 + 10;
      this.x = this.baseX + Math.sin(this.angle) * this.sway;

      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
      this.fadeSpeed = Math.random() * 0.002 + 0.001;
    }

    update() {
      this.y -= this.speedY;
      this.angle += this.angleSpeed;
      this.x = this.baseX + Math.sin(this.angle) * this.sway;
      this.alpha -= this.fadeSpeed;

      if (this.y < -15 || this.alpha <= 0 || this.x < -30 || this.x > w + 30) {
        this.reset(false);
      }
    }

    draw() {
      ctx.fillStyle = this.colorBase + this.alpha + ')';
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.colorBase + '0.75)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 45 partículas homogéneas por todo el paisaje
  for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
}