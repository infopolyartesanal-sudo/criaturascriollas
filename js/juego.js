'use strict';
// ================= CRIATURAS CRIOLLAS =================
const W = 240, H = 160, T = 16;
const DX = [0, 0, -1, 1], DY = [1, -1, 0, 0];
const FUENTE = '"Press Start 2P", monospace';
const CLAVE_GUARDADO = 'criaturas_criollas_v1';

const pantalla = document.getElementById('pantalla');
const sc = pantalla.getContext('2d');
const buf = nuevoCanvas(W, H);
const b = buf.getContext('2d');
const medidor = nuevoCanvas(8, 8).getContext('2d');
let ESC = 1;

// ---------- Estado ----------
const S = {
  escena: 'negro',
  mapa: 'casa', x: 4, y: 4, dir: 0,
  moviendo: false, prog: 0, pasoAlt: 0, giro: 0,
  equipo: [], caja: [], bolsa: {}, flags: {},
  ocupado: false,
};
const ui = { dialogo: null, menu: null, fundido: 0, flash: 0, vista: null, equipo: null, mochila: null };
let bt = null;
let tick = 0;
let TILES = null;
const EDIF = {};

// ---------- Pantalla ----------
function ajustar() {
  const ctrl = document.getElementById('controles');
  const ayuda = document.getElementById('ayuda');
  const extra = (ctrl.offsetHeight || 0) + (ayuda.offsetHeight || 0) + 48;
  const aw = window.innerWidth - 28, ah = window.innerHeight - extra;
  let s = Math.min(aw / W, ah / H);
  s = s >= 2 ? Math.floor(s) : Math.max(1, s);
  const dpr = window.devicePixelRatio || 1;
  pantalla.style.width = Math.floor(W * s) + 'px';
  pantalla.style.height = Math.floor(H * s) + 'px';
  pantalla.width = Math.round(W * s * dpr);
  pantalla.height = Math.round(H * s * dpr);
  ESC = pantalla.width / W;
}
window.addEventListener('resize', ajustar);

// ---------- Controles ----------
const held = {};
let cola = {}, pressed = {};
const TECLAS = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  KeyZ: 'a', Enter: ['start', 'a'], NumpadEnter: ['start', 'a'], Space: 'a', KeyX: 'b', Escape: 'b', Backspace: 'b', ShiftLeft: 'b', ShiftRight: 'b', KeyM: 'start', KeyC: 'start', Tab: 'start',
};
// Enter abre el MENÚ cuando Felipe camina, y en menús y carteles funciona como A
window.addEventListener('keydown', e => {
  const t = TECLAS[e.code]; if (!t) return;
  e.preventDefault();
  for (const k of [].concat(t)) { if (!held[k]) cola[k] = true; held[k] = true; }
});
window.addEventListener('keyup', e => { const t = TECLAS[e.code]; if (t) for (const k of [].concat(t)) held[k] = false; });
window.addEventListener('blur', () => { for (const k in held) held[k] = false; });
document.querySelectorAll('[data-k]').forEach(el => {
  const k = el.dataset.k;
  const abajo = e => { e.preventDefault(); if (!held[k]) cola[k] = true; held[k] = true; el.classList.add('on'); };
  const arriba = e => { e.preventDefault(); held[k] = false; el.classList.remove('on'); };
  el.addEventListener('pointerdown', abajo);
  el.addEventListener('pointerup', arriba);
  el.addEventListener('pointerleave', arriba);
  el.addEventListener('pointercancel', arriba);
  el.addEventListener('contextmenu', e => e.preventDefault());
});
pantalla.addEventListener('pointerdown', () => { window.focus(); cola.a = true; });
if (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) document.body.classList.add('tactil');

// ---------- Tiempo ----------
let esperas = [];
function esperar(n = 1) { return new Promise(r => esperas.push({ n, r })); }
async function esperarBoton() {
  while (true) { await esperar(1); if (pressed.a || pressed.b) return; }
}

// ---------- Texto y cajas ----------
function fuente(t) { return `${t}px ${FUENTE}`; }
function envolver(texto, ancho, t = 8) {
  medidor.font = fuente(t);
  const lineas = [];
  for (const parrafo of texto.split('\n')) {
    let act = '';
    for (const pal of parrafo.split(' ')) {
      const prueba = act ? act + ' ' + pal : pal;
      if (medidor.measureText(prueba).width > ancho && act) { lineas.push(act); act = pal; }
      else act = prueba;
    }
    lineas.push(act);
  }
  return lineas;
}
function txt(s, x, y, op = {}) {
  const t = op.t || 8, c = op.c || '#383838', sombra = op.sombra === undefined ? '#d0d0c8' : op.sombra;
  sc.font = fuente(t);
  sc.textBaseline = 'top';
  sc.textAlign = op.al || 'left';
  if (sombra) { sc.fillStyle = sombra; sc.fillText(s, x + 1, y + 1); }
  sc.fillStyle = c; sc.fillText(s, x, y);
  sc.textAlign = 'left';
}
function rectRed(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
}
function caja(x, y, w, h, estilo = 'normal') {
  const E = {
    normal: ['#506070', '#f8f8f8', '#a0c0e0'],
    batalla: ['#283848', '#304860', '#5878a0'],
    info: ['#404848', '#f8f8e0', '#c8c8a0'],
    menu: ['#506070', '#ffffff', '#d07040'],
  }[estilo];
  sc.fillStyle = E[0]; rectRed(sc, x, y, w, h, 4); sc.fill();
  sc.fillStyle = E[2]; rectRed(sc, x + 1.5, y + 1.5, w - 3, h - 3, 3); sc.fill();
  sc.fillStyle = E[1]; rectRed(sc, x + 3, y + 3, w - 6, h - 6, 2); sc.fill();
}
function flecha(x, y, c = '#383838') {
  sc.fillStyle = c; sc.beginPath(); sc.moveTo(x, y); sc.lineTo(x + 5, y + 3.5); sc.lineTo(x, y + 7); sc.closePath(); sc.fill();
}
function flechaAbajo(x, y, c) {
  sc.fillStyle = c; sc.beginPath(); sc.moveTo(x, y); sc.lineTo(x + 7, y); sc.lineTo(x + 3.5, y + 4.5); sc.closePath(); sc.fill();
}
function barra(x, y, w, frac, color) {
  sc.fillStyle = '#404848'; sc.fillRect(x - 1, y - 1, w + 2, 5);
  sc.fillStyle = '#506058'; sc.fillRect(x, y, w, 3);
  sc.fillStyle = color; sc.fillRect(x, y, Math.max(0, Math.round(w * Math.max(0, Math.min(1, frac)))), 3);
}
function colorPS(f) { return f > 0.5 ? '#58d080' : f > 0.2 ? '#f8c830' : '#f05030'; }
// Tipos chiquitos para la caja de batalla (achica la letra si no entran)
function tiposChicos(tipos, x, y, ancho) {
  let t = 5;
  const largo = tt => tipos.reduce((a, tp) => a + nombreTipo(tp).length * tt + 6, 0) + (tipos.length - 1) * 2;
  if (largo(t) > ancho) t = 4;
  for (const tp of tipos) {
    const n = nombreTipo(tp), w = n.length * t + 6;
    sc.fillStyle = COLOR_TIPO[tp]; rectRed(sc, x, y, w, 9, 2); sc.fill();
    txt(n, x + w / 2, y + (9 - t) / 2, { t, c: '#ffffff', sombra: tono(COLOR_TIPO[tp], 0.6), al: 'center' });
    x += w + 2;
  }
}
function insigniaTipo(tipo, x, y) {
  sc.fillStyle = COLOR_TIPO[tipo]; rectRed(sc, x, y, 56, 11, 2); sc.fill();
  txt(nombreTipo(tipo), x + 28, y + 2, { t: 6, c: '#ffffff', sombra: tono(COLOR_TIPO[tipo], 0.6), al: 'center' });
}

// ---------- Diálogo ----------
async function decir(texto, op = {}) {
  const enBatalla = S.escena === 'batalla';
  const lineas = envolver(texto, enBatalla ? 218 : 214, 8);
  for (let i = 0; i < lineas.length; i += 2) {
    const pag = lineas.slice(i, i + 2), total = pag.join('').length;
    const ultima = i + 2 >= lineas.length;
    ui.dialogo = { lineas: pag, n: 0, total, listo: false, auto: op.auto, mas: !ultima };
    let cuenta = 0;
    while (true) {
      await esperar(1);
      const d = ui.dialogo;
      if (d.n < total) {
        d.n = Math.min(total, d.n + (held.a || held.b ? 4 : 1.25));
        if ((pressed.a || pressed.b) && d.n > 2) d.n = total;
        if (d.n >= total) d.listo = true;
        continue;
      }
      d.listo = true;
      if (op.mantener && ultima) return;
      if (pressed.a || pressed.b) break;
      if (op.auto && ++cuenta >= op.auto) break;
    }
  }
  if (!op.mantener) ui.dialogo = null;
}
function dibujarDialogo() {
  const d = ui.dialogo; if (!d) return;
  const enBatalla = S.escena === 'batalla';
  if (enBatalla) caja(0, 112, W, 48, 'batalla'); else caja(2, 114, W - 4, 44, 'normal');
  let resto = Math.floor(d.n);
  for (let i = 0; i < d.lineas.length; i++) {
    const s = d.lineas[i].slice(0, Math.max(0, resto));
    resto -= d.lineas[i].length;
    if (enBatalla) txt(s, 11, 124 + i * 16, { c: '#ffffff', sombra: '#5a6a7a' });
    else txt(s, 12, 124 + i * 16);
  }
  if (d.listo && !d.auto && (tick >> 4) % 2 === 0) flechaAbajo(enBatalla ? 222 : 220, 146, enBatalla ? '#f8d030' : '#e05050');
}

// ---------- Menús ----------
async function elegir(opciones, op = {}) {
  const cols = op.columnas || 1;
  const m = { opciones, idx: op.inicial || 0, x: op.x ?? 160, y: op.y ?? 4, w: op.w ?? 76, cols };
  ui.menu = m;
  while (true) {
    await esperar(1);
    const n = opciones.length;
    if (pressed.up && m.idx - cols >= 0) m.idx -= cols;
    else if (pressed.down && m.idx + cols < n) m.idx += cols;
    else if (pressed.left && cols > 1 && m.idx % cols > 0) m.idx--;
    else if (pressed.right && cols > 1 && m.idx % cols < cols - 1 && m.idx + 1 < n) m.idx++;
    else if (pressed.up && cols === 1) m.idx = (m.idx - 1 + n) % n;
    else if (pressed.down && cols === 1) m.idx = (m.idx + 1) % n;
    if (pressed.a) { ui.menu = null; return m.idx; }
    if (pressed.b && op.cancelar !== false) { ui.menu = null; return -1; }
  }
}
function dibujarMenu() {
  const m = ui.menu; if (!m) return;
  const filas = Math.ceil(m.opciones.length / m.cols);
  const h = filas * 16 + 12;
  caja(m.x, m.y, m.w, h, 'normal');
  const cw = (m.w - 12) / m.cols;
  m.opciones.forEach((o, i) => {
    const cx = m.x + 16 + (i % m.cols) * cw, cy = m.y + 9 + Math.floor(i / m.cols) * 16;
    txt(o, cx, cy, { t: 7 });
    if (i === m.idx) flecha(cx - 9, cy, '#383838');
  });
}
async function siNo(pregunta) {
  await decir(pregunta, { mantener: true });
  const r = await elegir(['SÍ', 'NO'], { x: 180, y: 70, w: 56 });
  ui.dialogo = null;
  return r === 0;
}

// ---------- Fundidos ----------
async function fundido(hacia, cuadros = 12) {
  const desde = ui.fundido;
  for (let i = 1; i <= cuadros; i++) { ui.fundido = desde + (hacia - desde) * i / cuadros; await esperar(1); }
  ui.fundido = hacia;
}

// ---------- Guardado ----------
function guardar() {
  try {
    const datos = JSON.stringify({
      mapa: S.mapa, x: S.x, y: S.y, dir: S.dir, equipo: S.equipo, caja: S.caja, bolsa: S.bolsa, flags: S.flags, plata: S.plata,
    });
    localStorage.setItem(CLAVE_GUARDADO, datos);
    anotarHistoria(datos);
    return true;
  } catch (e) { return false; }
}
// ---------- VOLVER ATRÁS (pedido de Poly, 24/11/2026) ----------
// Cada vez que se guarda, si pasaron 4 minutos desde el último "recuerdo", se anota una copia de la partida.
// Se guardan los últimos 10 y desde el menú (VOLVER ATRÁS) se puede volver a cualquiera.
const CLAVE_HISTORIA = CLAVE_GUARDADO + '_historia', HISTORIA = { cada: 4 * 60 * 1000, max: 10 };
function leerHistoria() { try { return JSON.parse(localStorage.getItem(CLAVE_HISTORIA)) || []; } catch (e) { return []; } }
function anotarHistoria(datos, forzar) {
  try {
    const h = leerHistoria(), ahora = Date.now();
    if (!forzar && h.length && ahora - h[0].t < HISTORIA.cada) return;
    const m = MAPAS[S.mapa];
    h.unshift({ t: ahora, lugar: m ? m.nombre : S.mapa, insignias: S.flags.insignias || 0, nivel: Math.max(0, ...S.equipo.map(c => c.nivel)), datos });
    h.length = Math.min(h.length, HISTORIA.max);
    localStorage.setItem(CLAVE_HISTORIA, JSON.stringify(h));
  } catch (e) { /* si no entra, no pasa nada */ }
}
function haceCuanto(t) {
  const min = Math.round((Date.now() - t) / 60000);
  if (min < 1) return 'RECIÉN';
  if (min < 60) return `HACE ${min} MIN`;
  const hs = Math.round(min / 60);
  if (hs < 24) return `HACE ${hs} H`;
  const d = Math.round(hs / 24); return `HACE ${d} ${d === 1 ? 'DÍA' : 'DÍAS'}`;
}
async function volverAtras() {
  const h = leerHistoria();
  if (!h.length) { await decir('Todavía no hay momentos guardados para volver. ¡Se van anotando solos mientras jugás!'); return; }
  const filas = h.map(e => ({ txt: e.lugar, der: haceCuanto(e.t), sub: `${e.insignias} INSIGNIAS · NIVEL MÁS ALTO ${e.nivel}`, desc: 'La partida vuelve a como estaba en ese momento: lugar, equipo, mochila y plata.' }));
  const i = await listaScroll('¿A QUÉ MOMENTO QUERÉS VOLVER?', filas);
  if (i < 0) return;
  if (!await siNo(`¿Volvés a ${h[i].lugar} (${haceCuanto(h[i].t).toLowerCase()})? Lo de después se pierde... pero queda anotado por si te arrepentís.`)) return;
  // Antes de volver, se anota cómo está ahora (así se puede "deshacer el deshacer")
  const ahora = JSON.stringify({ mapa: S.mapa, x: S.x, y: S.y, dir: S.dir, equipo: S.equipo, caja: S.caja, bolsa: S.bolsa, flags: S.flags, plata: S.plata });
  anotarHistoria(ahora, true);
  const elegido = leerHistoria().find(e => e.t === h[i].t) || h[i];
  try { localStorage.setItem(CLAVE_GUARDADO, elegido.datos); } catch (e) { await decir('No se pudo volver atrás en este navegador.'); return; }
  await decir('¡Listo! El juego se reinicia en ese momento. Apretá CONTINUAR.');
  location.reload();
}
function hayPartida() { try { return !!localStorage.getItem(CLAVE_GUARDADO); } catch (e) { return false; } }
function cargar() {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE_GUARDADO));
    if (!d) return false;
    Object.assign(S, d);
    if (typeof S.plata !== 'number') S.plata = 3000; // partidas de antes de que existiera la plata
    if (!S.bolsa.mapa) S.bolsa.mapa = 1; // el MAPA lo tienen todos
    // La BICICLETA se gana con la 2ª insignia (ROCÍO); las partidas viejas la reciben si ya la tienen
    if (S.flags.insignia2) S.bolsa.bici = 1; else delete S.bolsa.bici;
    S.bici = false;
    // La BALSA (MAREA, 6ª insignia) y el PICO (CENIZA, 7ª): las partidas viejas los reciben si ya tienen la insignia
    if (S.flags.insignia6) S.bolsa.balsa = 1;
    if (S.flags.insignia7) S.bolsa.pico = 1;
    restaurarRocas();
    acomodarPosicion();
    return true;
  } catch (e) { return false; }
}
// Si el mapa cambió desde la última partida guardada, lleva a Felipe a un lugar seguro
function acomodarPosicion() {
  const m = MAPAS[S.mapa];
  const ok = m && m.grilla[S.y] && (CAMINABLE.has(m.grilla[S.y][S.x]) || (m.grilla[S.y][S.x] === '~' && S.bolsa.balsa)) &&
    !((m.edificios || []).some(e => S.x >= e.x && S.x < e.x + e.w && S.y >= e.y && S.y < e.y + e.h));
  if (ok) return;
  const c = S.flags && S.flags.centro;
  if (c && MAPAS[c.mapa]) { S.mapa = c.mapa; S.x = c.x; S.y = c.y; S.dir = c.dir; }
  else { S.mapa = 'casa'; S.x = 4; S.y = 4; S.dir = 1; }
}
function curarEquipo() { S.equipo.forEach(curarCriatura); }

// ================= MUNDO =================
function mapa() { return MAPAS[S.mapa]; }
// Felipe va en BALSA si está parado en el agua (o se está metiendo)
function enAgua(m = mapa()) {
  const aca = m.grilla[S.y] && m.grilla[S.y][S.x] === '~';
  const va = S.moviendo && S.prog >= 8 && m.grilla[S.y + DY[S.dir]] && m.grilla[S.y + DY[S.dir]][S.x + DX[S.dir]] === '~';
  return aca || va;
}
function npcsVisibles(m = mapa()) { return (m.npcs || []).filter(n => !n.visible || n.visible()); }
function npcPorId(id) { return npcsVisibles().find(n => n.id === id); }
function npcEn(x, y) { return npcsVisibles().find(n => n.x === x && n.y === y); }
function edificioEn(m, x, y) {
  return (m.edificios || []).find(e => x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h);
}
const CAMINABLE = new Set(['.', ',', '=', 'F', '_', 'm', 'r', 'h', 'v', 'q', ':', '-', 'u', 'w']);
function transitable(x, y) {
  const m = mapa();
  if (y < 0 || x < 0 || y >= m.grilla.length || x >= m.grilla[0].length) return false;
  const e = edificioEn(m, x, y);
  if (e) {
    const esPuerta = e.abre && x === e.x + e.puerta && y === e.y + e.h - 1;
    if (!esPuerta) return false;
  }
  const ch = m.grilla[y][x];
  if (!CAMINABLE.has(ch) && !(ch === '~' && S.bolsa.balsa)) return false;
  if (npcEn(x, y)) return false;
  if (typeof itemSueloEn === 'function' && itemSueloEn(m, x, y)) return false;
  return true;
}
// ---------- Rocas y bloques de hielo que se rompen con el PICO ----------
// Se guardan en S.flags.rocas = { mapa: ['x,y', ...] }; ROCAS_ORIG recuerda dónde estaban para empezar de nuevo
const ROMPIBLE = { X: '-', Z: 'w', O: ':', A: '.' }; // A: árbol raro (se corta con CORTE)
const ROCAS_ORIG = [];
for (const [id, m] of Object.entries(MAPAS)) m.grilla.forEach((f, y) => f.forEach((c, x) => { if (ROMPIBLE[c]) ROCAS_ORIG.push([id, x, y, c]); }));
function restaurarRocas() {
  for (const [id, x, y, c] of ROCAS_ORIG) MAPAS[id].grilla[y][x] = c;
  const r = (S.flags && S.flags.rocas) || {};
  for (const id in r) for (const k of r[id]) {
    const [x, y] = k.split(',').map(Number);
    const c = MAPAS[id] && MAPAS[id].grilla[y] && MAPAS[id].grilla[y][x];
    if (ROMPIBLE[c]) MAPAS[id].grilla[y][x] = ROMPIBLE[c];
  }
}
async function romperRoca(x, y, ch) {
  if (ch === 'A') { // ÁRBOL RARO: se corta con el CORTE que regala LUNA
    if (!S.bolsa.corte) { await decir('Un árbol RARO, retorcido y violeta, tapa el camino. Con un CORTE se podría cortar.'); return; }
    if (!(await siNo('Un árbol RARO tapa el camino. ¿Lo cortás con el CORTE?'))) return;
    for (let i = 0; i < 3; i++) { ui.flash = 1; await esperar(2); ui.flash = 0; await esperar(3); }
    mapa().grilla[y][x] = ROMPIBLE[ch];
    S.flags.rocas = S.flags.rocas || {};
    (S.flags.rocas[S.mapa] = S.flags.rocas[S.mapa] || []).push(x + ',' + y);
    await decir('¡ZAS! ¡Felipe cortó el árbol raro con el CORTE! Atrás aparece un camino escondido...');
    return;
  }
  const hielo = ch === 'Z';
  const que = hielo ? 'un bloque de HIELO' : 'una ROCA';
  if (!S.bolsa.pico) { await decir(`Hay ${que} con grietas que tapa el camino. Con un PICO se podría romper.`); return; }
  if (!(await siNo(`Hay ${que} con grietas. ¿La rompés con el PICO?`))) return;
  for (let i = 0; i < 2; i++) { ui.flash = 1; await esperar(3); ui.flash = 0; await esperar(3); }
  mapa().grilla[y][x] = ROMPIBLE[ch];
  S.flags.rocas = S.flags.rocas || {};
  (S.flags.rocas[S.mapa] = S.flags.rocas[S.mapa] || []).push(x + ',' + y);
  await decir(hielo ? '¡CRAC! ¡Felipe rompió el hielo con el PICO!' : '¡PUM! ¡Felipe rompió la roca con el PICO!');
}

function pasoMundo() {
  pasoSalvajes();
  if (S.moviendo) {
    S.prog += S.bici ? 8 : held.b ? 4 : 2;
    if (S.prog >= 16) {
      S.prog = 0; S.moviendo = false;
      S.x += DX[S.dir]; S.y += DY[S.dir];
      S.pasoAlt ^= 1;
      alPisar();
      // Anomalías de los templos (temblores, saltos espaciales, mareos)
      if (!S.ocupado && typeof anomaliaPaso === 'function') { const f = anomaliaPaso(); if (f) correr(f()); }
      if (!S.ocupado) { const f = pasoHuevos(); if (f) correr(f()); } // criadero y huevos
    }
    return;
  }
  if (MP.eventos.length) { correr(atenderMP()); return; }
  if (pressed.start) { correr(menuPrincipal()); return; }
  if (pressed.a) {
    const c = salvajeOcupa(S.x + DX[S.dir], S.y + DY[S.dir]);
    if (c && S.equipo.some(e => e.ps > 0)) { correr(pelearSalvajeVisible(c)); return; }
    interactuar(S.x + DX[S.dir], S.y + DY[S.dir]); return;
  }
  const d = held.up ? 1 : held.down ? 0 : held.left ? 2 : held.right ? 3 : -1;
  if (d < 0) { S.giro = 0; return; }
  if (S.dir !== d) { S.dir = d; S.giro = 6; return; }
  if (S.giro > 0) { S.giro--; return; }
  const choca = S.equipo.some(e => e.ps > 0) && salvajeOcupa(S.x + DX[d], S.y + DY[d]);
  if (choca) { correr(pelearSalvajeVisible(choca)); return; }
  if (transitable(S.x + DX[d], S.y + DY[d])) {
    if (S.bici && mapa().grilla[S.y + DY[d]][S.x + DX[d]] === '~') S.bici = false; // al agua se va en BALSA
    S.moviendo = true; S.prog = 0;
  }
}

async function correr(promesa) {
  S.ocupado = true;
  try { await promesa; } catch (e) { console.error(e); ui.dialogo = null; ui.menu = null; }
  S.ocupado = false;
}

async function pasoForzado(dir) {
  S.dir = dir;
  if (!transitable(S.x + DX[dir], S.y + DY[dir])) return;
  for (let p = 2; p <= 16; p += 2) { S.moviendo = true; S.prog = p; await esperar(1); }
  S.moviendo = false; S.prog = 0;
  S.x += DX[dir]; S.y += DY[dir]; S.pasoAlt ^= 1;
}

function alPisar() {
  const m = mapa();
  const sal = (m.salidas || []).find(s => s.x === S.x && s.y === S.y);
  if (sal) { correr(viajar(sal)); return; }
  for (const d of m.disparadores || []) {
    if (d.prueba(S.x, S.y)) { correr(d.accion()); return; }
  }
  // Los encuentros ya no son al azar: las criaturas se ven en el pasto alto (pasoSalvajes)
}

async function viajar(sal) {
  await fundido(1, 8);
  const antes = S.mapa;
  S.mapa = sal.a; S.x = sal.ax; S.y = sal.ay; S.dir = sal.dir;
  if (!MAPAS[sal.a].exterior) S.bici = false; // adentro se camina
  if (MAPAS[sal.a].exterior && !(MAPAS[antes] && MAPAS[antes].nombre === MAPAS[sal.a].nombre)) {
    S.cartelLugar = { t: 110, txt: MAPAS[sal.a].nombre };
  }
  await esperar(2);
  await fundido(0, 8);
}

async function interactuar(x, y) {
  const m = mapa();
  const n = npcEn(x, y);
  if (n) {
    n.dir = [1, 0, 3, 2][S.dir];
    await correr(n.hablar());
    return;
  }
  const it = itemSueloEn(m, x, y);
  if (it) { correr(juntarItem(it)); return; }
  const bol = (m.boleadoras || []).find(o => o.x === x && o.y === y);
  if (bol) { correr(mirarBoleadora(bol)); return; }
  if (y < 0 || y >= m.grilla.length || x < 0 || x >= m.grilla[0].length) return;
  const ch = m.grilla[y][x];
  if (ch === 'S' && m.carteles && m.carteles[x + ',' + y]) { correr(decir(m.carteles[x + ',' + y])); return; }
  if (ROMPIBLE[ch]) { correr(romperRoca(x, y, ch)); return; }
  if (ch === '~' && !S.bolsa.balsa && m.exterior) { correr(decir('El agua es muy profunda para cruzar caminando. Con una BALSA se podría.')); return; }
  if (m.objetos && m.objetos[ch]) { const o = m.objetos[ch]; correr(typeof o === 'function' ? o() : decir(o)); return; }
}

// ---------- Criaturas salvajes visibles en el pasto alto ----------
// En vez de aparecer de golpe, las criaturas se ven caminando por el pasto alto (y por el piso de las cuevas).
// Si Felipe se choca con una (o la mira y aprieta A), empieza la batalla.
let SALV = { mapa: null, lista: [], espera: 0 };
function esZonaSalvaje(m, x, y) {
  const ch = m.grilla[y] && m.grilla[y][x];
  return ch === ',' || ch === 'u' || (m.cueva && ch === ':');
}
function salvajeEn(x, y) { return SALV.lista.find(c => c.x === x && c.y === y); }
function maxSalvajes(m) {
  let n = 0;
  for (let y = 0; y < m.grilla.length; y++) for (let x = 0; x < m.grilla[y].length; x++) if (esZonaSalvaje(m, x, y)) n++;
  return n ? Math.max(2, Math.min(6, Math.round(n / 14))) : 0;
}
function lugarLibreSalvaje(m, x, y) {
  return esZonaSalvaje(m, x, y) && !salvajeEn(x, y) && !npcEn(x, y) && !edificioEn(m, x, y) &&
    !(x === S.x && y === S.y) && !(m.salidas || []).some(s => s.x === x && s.y === y);
}
function elegirEspecie(enc) {
  const total = enc.lista.reduce((a, e) => a + e[1], 0);
  let r = Math.random() * total, id = enc.lista[0][0];
  for (const [e, p] of enc.lista) { if ((r -= p) < 0) { id = e; break; } }
  const e = { id, nivel: enc.min + Math.floor(Math.random() * (enc.max - enc.min + 1)) };
  return typeof anomaliaEspecie === 'function' ? anomaliaEspecie(e) : e; // las anomalías de los templos cambian las criaturas
}
function aparecerSalvaje(m, lejos) {
  for (let intento = 0; intento < 40; intento++) {
    const y = Math.floor(Math.random() * m.grilla.length), x = Math.floor(Math.random() * m.grilla[0].length);
    if (!lugarLibreSalvaje(m, x, y)) continue;
    if (lejos && Math.abs(x - S.x) + Math.abs(y - S.y) < 4) continue;
    const e = elegirEspecie(m.encuentros);
    SALV.lista.push({ ...e, x, y, dir: 0, prog: 0, mov: false, quieto: 30 + Math.floor(Math.random() * 90), nace: 20 });
    return;
  }
}
function prepararSalvajes() {
  const m = mapa();
  if (SALV.mapa === S.mapa) return;
  SALV = { mapa: S.mapa, lista: [], espera: 0 };
  if (!m.encuentros) return;
  const max = maxSalvajes(m);
  for (let i = 0; i < max; i++) aparecerSalvaje(m, true);
}
function pasoSalvajes() {
  prepararSalvajes();
  const m = mapa();
  if (!m.encuentros) return;
  // Repone criaturas de a poco
  if (SALV.lista.length < maxSalvajes(m) && --SALV.espera <= 0) { aparecerSalvaje(m, true); SALV.espera = 180; }
  for (const c of SALV.lista) {
    if (c.nace > 0) c.nace--;
    if (c.mov) {
      c.prog += 1;
      if (c.prog >= 16) { c.mov = false; c.prog = 0; c.x += DX[c.dir]; c.y += DY[c.dir]; c.quieto = 40 + Math.floor(Math.random() * 100); }
      continue;
    }
    if (--c.quieto > 0) continue;
    const d = Math.floor(Math.random() * 4);
    c.dir = d;
    const nx = c.x + DX[d], ny = c.y + DY[d];
    // Se mueven solo por el pasto alto y no se meten donde está Felipe (ni a donde está yendo)
    const destinoFelipe = S.moviendo ? [S.x + DX[S.dir], S.y + DY[S.dir]] : [S.x, S.y];
    if (lugarLibreSalvaje(m, nx, ny) && !(nx === destinoFelipe[0] && ny === destinoFelipe[1]) &&
        !SALV.lista.some(o => o.mov && o.x + DX[o.dir] === nx && o.y + DY[o.dir] === ny)) {
      c.mov = true; c.prog = 0;
    } else c.quieto = 20 + Math.floor(Math.random() * 40);
  }
}
// Devuelve la criatura que está (o está llegando) a esa baldosa
function salvajeOcupa(x, y) {
  return SALV.lista.find(c => (c.x === x && c.y === y) || (c.mov && c.x + DX[c.dir] === x && c.y + DY[c.dir] === y));
}
async function pelearSalvajeVisible(c) {
  SALV.lista = SALV.lista.filter(o => o !== c);
  SALV.espera = 240;
  await batalla({ salvaje: [c.id, c.nivel] });
}
const _miniCriatura = {};
// El dibujo de UNA criatura (respeta si es SHINY)
function spriteDe(m, espalda) { return spriteCriatura(m.id, espalda, m.shiny); }
function miniCriatura(id) {
  if (_miniCriatura[id]) return _miniCriatura[id];
  const c = nuevoCanvas(20, 20), x = c.getContext('2d');
  x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
  x.drawImage(spriteCriatura(id), 0, 0, 20, 20);
  return (_miniCriatura[id] = c);
}

async function encuentroSalvaje() {
  const enc = mapa().encuentros;
  const total = enc.lista.reduce((a, e) => a + e[1], 0);
  let r = Math.random() * total, id = enc.lista[0][0];
  for (const [e, p] of enc.lista) { if ((r -= p) < 0) { id = e; break; } }
  const nivel = enc.min + Math.floor(Math.random() * (enc.max - enc.min + 1));
  const e = typeof anomaliaEspecie === 'function' ? anomaliaEspecie({ id, nivel }) : { id, nivel };
  await batalla({ salvaje: [e.id, e.nivel] });
}

// ---------- Menú principal ----------
async function menuPrincipal() {
  while (true) {
    const ops = [...(mpConAmigo() && amigoCerca() ? ['PELEAR'] : []), 'EQUIPO', 'MOCHILA', ...(S.bolsa.bici ? [S.bici ? 'BAJAR BICI' : 'BICICLETA'] : []), 'MULTIJUGADOR', 'GUARDAR', 'VOLVER ATRÁS', MUS.prendida ? 'MÚSICA: SÍ' : 'MÚSICA: NO', 'CERRAR'];
    const op = ops[await elegir(ops, { x: 140, y: 4, w: 96 })];
    if (op === 'PELEAR') { await retarAmigo(); return; }
    if (op === 'MULTIJUGADOR') { await menuMultijugador(); continue; }
    if (op === 'VOLVER ATRÁS') { await volverAtras(); continue; }
    if (op === 'BICICLETA' || op === 'BAJAR BICI') { await usarBici(); if (S.bici) return; continue; }
    const r = ['EQUIPO', 'MOCHILA', 'GUARDAR', 'MÚSICA: SÍ', 'MÚSICA: NO'].indexOf(op);
    if (r === 0) {
      if (!S.equipo.length) { await decir('Todavía no tenés criaturas.'); continue; }
      await pantallaEquipo({ modo: 'ver' });
    } else if (r === 1) {
      const obj = await pantallaMochila(false);
      if (obj) await usarObjetoMundo(obj);
    } else if (r === 2) {
      const ok = guardar();
      await decir(ok ? '¡La partida se guardó!' : 'No se pudo guardar la partida en este navegador.');
    } else if (r === 3 || r === 4) {
      musicaAlternar();
    } else return;
  }
}
async function usarPiedra(obj) {
  const o = OBJETOS[obj];
  if (!S.equipo.length) { await decir('No tenés criaturas.'); return; }
  const idx = await pantallaEquipo({ modo: 'usar', msg: `¿A quién le das la ${o.nombre}?` });
  if (idx < 0) return;
  const m = S.equipo[idx];
  const a = (ESPECIES[m.id].evoPiedra || {})[obj];
  if (!a) { await decir(`A ${nombreDe(m)} no le hace nada.`); return; }
  S.bolsa[obj]--;
  await decir(`¡Felipe le dio la ${o.nombre} a ${nombreDe(m)}!`);
  await evolucionar(m, a);
}

// ---------- Almacén (tienda) ----------
async function tienda() {
  await decir('ALMACENERO: ¡Buenas! ¿Venís a comprar o a vender?', { mantener: true });
  const que = await elegir(['COMPRAR', 'VENDER', 'CHAU'], { x: 156, y: 60, w: 80 });
  ui.dialogo = null;
  if (que === 1) { await vender(); return; }
  if (que !== 0) { await decir('ALMACENERO: ¡Chau, que te vaya bien!'); return; }
  await decir('ALMACENERO: ¿Qué vas a llevar?');
  ui.tienda = { idx: 0, cant: 0 };
  while (true) {
    await esperar(1);
    const t = ui.tienda, n = TIENDA.length + 1;
    if (t.cant > 0) {
      const obj = TIENDA[t.idx], precio = OBJETOS[obj].precio;
      const max = Math.max(1, Math.min(99, Math.floor(S.plata / precio)));
      if (pressed.up) t.cant = t.cant >= max ? 1 : t.cant + 1;
      if (pressed.down) t.cant = t.cant <= 1 ? max : t.cant - 1;
      if (pressed.right) t.cant = Math.min(max, t.cant + 10);
      if (pressed.left) t.cant = Math.max(1, t.cant - 10);
      if (pressed.b) t.cant = 0;
      else if (pressed.a) {
        const total = precio * t.cant, cant = t.cant;
        t.cant = 0;
        if (total > S.plata) { await decir('ALMACENERO: Uy, no te alcanza la plata. ¡Ganale a algún entrenador y volvé!'); continue; }
        S.plata -= total;
        S.bolsa[obj] = (S.bolsa[obj] || 0) + cant;
        await decir(`¡Felipe compró ${cant} ${OBJETOS[obj].nombre}! ALMACENERO: ¡Gracias, vuelva prontos!`);
        guardar();
      }
      continue;
    }
    if (pressed.up) t.idx = (t.idx - 1 + n) % n;
    if (pressed.down) t.idx = (t.idx + 1) % n;
    if (pressed.b || (pressed.a && t.idx === TIENDA.length)) break;
    if (pressed.a) {
      if (S.plata < OBJETOS[TIENDA[t.idx]].precio) { await decir('ALMACENERO: Uy, no te alcanza la plata para eso.'); continue; }
      t.cant = 1;
    }
  }
  ui.tienda = null;
  await decir('ALMACENERO: ¡Chau, que te vaya lindo!');
}
function plataTxt(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function dibujarTienda() {
  const t = ui.tienda;
  sc.fillStyle = '#5a9a6a'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#4e8c5e'; for (let i = 0; i < H; i += 12) sc.fillRect(0, i, W, 6);
  caja(4, 4, 84, 24, 'info'); txt('ALMACÉN', 14, 12, { t: 7 });
  caja(4, 32, 84, 24, 'info'); txt(plataTxt(S.plata), 80, 40, { t: 7, al: 'right' });
  sc.drawImage(spriteBoleadora(), 22, 62, 48, 48);
  caja(96, 4, 140, 108, 'normal');
  const items = [...TIENDA.map(k => [OBJETOS[k].nombre, plataTxt(OBJETOS[k].precio)]), ['SALIR', '']];
  // Se ven 6 renglones; si hay más, la lista se corre con las flechas
  const top = Math.max(0, Math.min(t.idx - 2, items.length - 6));
  items.slice(top, top + 6).forEach(([nm, c], k) => {
    const i = top + k, y = 13 + k * 15;
    txt(nm, 112, y, { t: nm.length > 13 ? 5 : nm.length > 9 ? 6 : 7 });
    if (c) txt(c, 228, y + 1, { t: 6, al: 'right', c: '#606060', sombra: null });
    if (i === t.idx) flecha(103, y);
  });
  if (top > 0) txt('▲', 230, 5, { t: 5, al: 'right', sombra: null, c: '#808080' });
  if (top + 6 < items.length) txt('▼', 230, 102, { t: 5, al: 'right', sombra: null, c: '#808080' });
  caja(4, 116, 232, 40, 'normal');
  const sel = TIENDA[t.idx];
  if (t.cant > 0) {
    const o = OBJETOS[sel];
    txt(`${o.nombre}  x${t.cant}`, 12, 124, { t: 7 });
    txt(`Total: ${plataTxt(o.precio * t.cant)}`, 12, 139, { t: 7, c: o.precio * t.cant > S.plata ? '#d03030' : '#383838' });
    txt('Flechas: cantidad', 228, 140, { t: 5, al: 'right', c: '#606060', sombra: null });
  } else {
    const d = sel ? OBJETOS[sel].desc + (S.bolsa[sel] ? ` (Tenés ${S.bolsa[sel]})` : '') : 'Salir del almacén.';
    envolver(d, 212, 7).slice(0, 2).forEach((l, i) => txt(l, 12, 126 + i * 13, { t: 7 }));
  }
}

async function usarObjetoMundo(obj) {
  const o = OBJETOS[obj];
  if (o.mapa) { await pantallaMapa(); return; }
  if (o.bici) { await usarBici(); return; }
  if (o.cuaderno) { await cuadernoPistas(); return; }
  if (o.huevo) { await mirarHuevos(); return; }
  if (o.dobleHab) { await usarDobleHab(); return; }
  if (o.copiarHab) { await usarCopiarHab(); return; }
  if (o.balsa) { await decir('Caminá hacia el agua y Felipe se sube a la BALSA solo.'); return; }
  if (o.pico) { await decir('Ponete enfrente de una roca o un bloque de hielo con grietas y apretá A.'); return; }
  if (o.piedra) { await usarPiedra(obj); return; }
  if (!o.cura) { await decir('Ahora no se puede usar eso.'); return; }
  if (!S.equipo.length) { await decir('No tenés criaturas.'); return; }
  const idx = await pantallaEquipo({ modo: 'usar', msg: `¿A quién le das el ${o.nombre}?` });
  if (idx < 0) return;
  const m = S.equipo[idx];
  if (m.ps <= 0) { await decir(`${nombreDe(m)} no tiene energía. Llevalo a descansar a tu casa.`); return; }
  if (m.ps >= m.psMax) { await decir('No va a tener ningún efecto.'); return; }
  const antes = m.ps;
  m.ps = Math.min(m.psMax, m.ps + o.cura);
  S.bolsa[obj]--;
  await decir(`${nombreDe(m)} recuperó ${m.ps - antes} PS.`);
}

// ---------- Pantalla de equipo ----------
async function pantallaEquipo(op) {
  ui.equipo = { idx: 0, msg: op.msg || (op.modo === 'ver' ? 'Tus criaturas.' : 'Elegí una criatura.') };
  while (true) {
    await esperar(1);
    const e = ui.equipo, n = S.equipo.length;
    if (pressed.up) e.idx = (e.idx - 1 + n) % n;
    if (pressed.down) e.idx = (e.idx + 1) % n;
    if (pressed.b && !op.forzado) { ui.equipo = null; return -1; }
    if (pressed.a) {
      if (op.modo === 'ver') {
        const m = S.equipo[e.idx];
        const ops = ['DATOS', 'MOVIMIENTOS', 'APODO', 'SUBIR', ...(m.dobleHab ? ['2ª HABILIDAD'] : []), 'SALIR'];
        const r = await elegir(ops, { x: 140, y: 50, w: 96 });
        if (ops[r] === '2ª HABILIDAD') { const guardaEq = ui.equipo; ui.equipo = null; await elegirHab2(m); ui.equipo = guardaEq; continue; }
        if (r === 0) { await verDatos(m); }
        else if (r === 1) { await menuMovimientos(m); }
        else if (r === 2) { await ponerApodo(m); }
        else if (r === 3 && e.idx > 0) {
          [S.equipo[e.idx - 1], S.equipo[e.idx]] = [S.equipo[e.idx], S.equipo[e.idx - 1]];
          e.idx--;
        }
        continue;
      }
      const idx = e.idx;
      ui.equipo = null;
      return idx;
    }
  }
}
// ---------- Movimientos: NIVEL (ya aprendidos, gratis) y TUTOR ----------
function preEvos(id) {
  const r = [];
  for (const [k, e] of Object.entries(ESPECIES)) {
    const viaNivel = e.evo && e.evo.a === id;
    const viaPiedra = e.evoPiedra && Object.values(e.evoPiedra).includes(id);
    if ((viaNivel || viaPiedra) && !r.includes(k)) r.push(k, ...preEvos(k));
  }
  return r;
}
// Los que ya aprendió por nivel (de su especie o de sus formas anteriores)
function movsNivel(m) {
  const ids = [];
  for (const sp of [m.id, ...preEvos(m.id)])
    for (const [nv, mv] of ESPECIES[sp].movs || []) if (nv <= m.nivel && MOVS[mv] && !ids.includes(mv)) ids.push(mv);
  return ids.map(id => ({ id }));
}
// Movimientos ESPECIALES: los que aprende una sola familia de criaturas (o ninguna). Esos no se enseñan por tipo.
function familia(id) { return [id, ...preEvos(id)].find(k => !preEvos(k).length) || id; }
let _famMov = null;
function familiasDeMov(mv) {
  if (!_famMov) {
    _famMov = {};
    for (const [id, e] of Object.entries(ESPECIES))
      for (const [, x] of e.movs || []) (_famMov[x] = _famMov[x] || new Set()).add(familia(id));
  }
  return _famMov[mv] ? _famMov[mv].size : 0;
}
// Lo que cobra el tutor: más caro cuanto más fuerte es el movimiento
function precioTutor(mv) { const M = MOVS[mv]; return 300 + (M.pot || 0) * 10; }
// Los que todavía no aprendió por nivel + los de sus tipos + los comunes + los extra de su especie
function movsTutor(m) {
  const ya = movsNivel(m).map(x => x.id), L = [];
  const poner = (mv, nv) => { if (MOVS[mv] && mv !== 'forcejeo' && !ya.includes(mv) && !L.some(x => x.id === mv)) L.push(nv ? { id: mv, nv } : { id: mv }); };
  for (const [nv, mv] of ESPECIES[m.id].movs || []) if (nv > m.nivel) poner(mv, nv);
  for (const mv of TUTOR[m.id] || []) poner(mv);
  const tipos = ESPECIES[m.id].tipos;
  for (const [mv, M] of Object.entries(MOVS)) if (tipos.includes(M.tipo) && familiasDeMov(mv) >= 2) poner(mv);
  for (const mv of TUTOR_COMUNES) poner(mv);
  return L;
}
async function menuMovimientos(m) {
  while (true) {
    const r = await elegir(['NIVEL', 'TUTOR', 'SALIR'], { x: 140, y: 76, w: 96 });
    if (r === 0) await listaMovimientos(m, 'nivel');
    else if (r === 1) await listaMovimientos(m, 'tutor');
    else return;
  }
}
async function listaMovimientos(m, modo) {
  const L = modo === 'nivel' ? movsNivel(m) : movsTutor(m);
  if (!L.length) {
    await decir(modo === 'nivel' ? `${nombreDe(m)} todavía no aprendió movimientos por nivel.`
                                 : `El tutor todavía no tiene movimientos para enseñarle a ${nombreDe(m)}.`);
    return;
  }
  const li = { m, modo, items: L, idx: 0, top: 0 };
  ui.equipo.lista = li;
  while (true) {
    await esperar(1);
    const n = li.items.length;
    if (pressed.up) li.idx = (li.idx - 1 + n) % n;
    if (pressed.down) li.idx = (li.idx + 1) % n;
    if (li.idx < li.top) li.top = li.idx;
    if (li.idx >= li.top + 6) li.top = li.idx - 5;
    if (pressed.b) break;
    if (pressed.a) {
      const mv = li.items[li.idx].id, M = MOVS[mv];
      if (m.movs.some(x => x.id === mv)) { await decir(`${nombreDe(m)} ya sabe ${M.nombre.toUpperCase()}.`); continue; }
      if (m.movs.length < 4 && modo !== 'tutor') {
        const si = await siNo(`¿Querés que ${nombreDe(m)} aprenda ${M.nombre.toUpperCase()}?`);
        if (!si) continue;
      }
      if (modo === 'tutor') {
        const precio = precioTutor(mv);
        if (S.plata < precio) { await decir(`TUTOR: Enseñar ${M.nombre.toUpperCase()} cuesta ${plataTxt(precio)}, y tenés ${plataTxt(S.plata)}. ¡Ganale a algún entrenador y volvé!`); continue; }
        if (!await siNo(`TUTOR: Te cobro ${plataTxt(precio)} por enseñarle ${M.nombre.toUpperCase()}. ¿Dale?`)) continue;
        const antes = m.movs.map(x => x.id).join();
        await decir(`El tutor le enseña ${M.nombre.toUpperCase()} a ${nombreDe(m)}...`);
        await aprender(m, mv);
        if (m.movs.some(x => x.id === mv) && m.movs.map(x => x.id).join() !== antes) {
          S.plata -= precio;
          await decir(`Pagaste ${plataTxt(precio)}. Te quedan ${plataTxt(S.plata)}.`);
        } else await decir('TUTOR: Bueno, no te cobro nada.');
        continue;
      }
      await aprender(m, mv);
    }
  }
  ui.equipo.lista = null;
}
function descMov(M) {
  const p = [];
  if (M.pot) p.push(`POT ${M.pot}`); 
  p.push(`PREC ${M.prec}`, `PP ${M.pp}`);
  let extra = '';
  if (M.ef === 'atk-') extra = 'Baja el ATAQUE del rival.';
  else if (M.ef === 'def-') extra = 'Baja la DEFENSA del rival.';
  else if (M.ef === 'def+') extra = 'Sube su DEFENSA.';
  else if (M.ef === 'atk++') extra = 'Sube mucho su ATAQUE.';
  else if (M.ef === 'cura') extra = 'Recupera la mitad de sus PS.';
  if (M.prio) extra = (extra ? extra + ' ' : '') + 'Ataca primero.';
  return [p.join('   '), extra];
}
function dibujarListaMovs(li) {
  const m = li.m;
  caja(4, 4, 232, 24, 'info');
  sc.imageSmoothingEnabled = false;
  sc.drawImage(spriteDe(m), 8, 6, 20, 20);
  txt(nombreDe(m), 32, 8, { t: 7 });
  txt('Nv' + m.nivel, 32, 17, { t: 6, sombra: null, c: '#606060' });
  txt(li.modo === 'nivel' ? 'NIVEL' : 'TUTOR', 228, 12, { t: 8, al: 'right', c: li.modo === 'nivel' ? '#2a6a2a' : '#a05020' });
  caja(4, 30, 232, 84, 'normal');
  li.items.slice(li.top, li.top + 6).forEach((it, k) => {
    const i = li.top + k, M = MOVS[it.id], y = 38 + k * 12;
    const sabe = m.movs.some(x => x.id === it.id);
    txt(M.nombre.toUpperCase(), 20, y, { t: 6, c: sabe ? '#2a7a2a' : '#383838' });
    sc.fillStyle = COLOR_TIPO[M.tipo]; sc.fillRect(118, y, 40, 8);
    txt(nombreTipo(M.tipo).slice(0, 6), 138, y + 1, { t: 5, c: '#fff', sombra: null, al: 'center' });
    const marca = sabe ? 'LO SABE' : (li.modo === 'tutor' ? plataTxt(precioTutor(it.id)) : (it.nv ? 'NV ' + it.nv : ''));
    txt(marca, 228, y + 1, { t: 5, al: 'right', sombra: null, c: sabe ? '#2a7a2a' : '#606060' });
    if (i === li.idx) flecha(11, y, '#383838');
  });
  if (li.top + 6 < li.items.length && (tick >> 4) % 2 === 0) flechaAbajo(116, 106, '#383838');
  if (!ui.dialogo) {
    caja(4, 116, 232, 40, 'normal');
    const [a, b2] = descMov(MOVS[li.items[li.idx].id]);
    txt(a, 12, 123, { t: 6 });
    if (b2) txt(b2, 12, 133, { t: 6 });
    txt(li.modo === 'nivel' ? 'A: ENSEÑAR (GRATIS)   B: VOLVER' : `A: APRENDER (TENÉS ${plataTxt(S.plata)})   B: VOLVER`, 12, 144, { t: 5, sombra: null, c: '#606060' });
  }
}
async function verDatos(m) {
  ui.equipo.datos = m;
  await esperarBoton();
  ui.equipo.datos = null;
}
function dibujarEquipo() {
  const e = ui.equipo;
  sc.fillStyle = '#4a7ab0'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#5a8ac0';
  for (let i = 0; i < W; i += 16) sc.fillRect(i, 0, 8, H);
  if (e.datos) { dibujarDatos(e.datos); return; }
  if (e.lista) { dibujarListaMovs(e.lista); return; }
  S.equipo.forEach((m, i) => {
    const y = 4 + i * 22, sel = i === e.idx;
    caja(6, y, 228, 21, sel ? 'menu' : 'info');
    sc.imageSmoothingEnabled = false;
    sc.drawImage(spriteDe(m), 10, y + 1, 20, 20);
    txt(nombreDe(m), 34, y + 5, { t: nombreDe(m).length > 12 ? 6 : 7 });
    txt('Nv' + m.nivel, 34, y + 13, { t: 6, sombra: null, c: '#606060' });
    const f = m.ps / m.psMax;
    txt('PS', 128, y + 7, { t: 6, c: '#e09000', sombra: null });
    barra(142, y + 8, 50, f, colorPS(f));
    txt(`${m.ps}/${m.psMax}`, 228, y + 13, { t: 6, al: 'right', sombra: null });
    if (m.ps <= 0) txt('DEB', 228, y + 4, { t: 6, al: 'right', c: '#d03030', sombra: null });
  });
  const yMsg = 4 + S.equipo.length * 22 + 2;
  if (yMsg < 140 && !ui.dialogo) { caja(6, Math.max(yMsg, 136), 228, 20, 'normal'); txt(e.msg, 14, Math.max(yMsg, 136) + 7, { t: 6 }); }
}
function dibujarDatos(m) {
  const esp = ESPECIES[m.id], h = habDe(m);
  caja(4, 4, 232, 152, 'info');
  sc.fillStyle = '#d8e8f8'; sc.fillRect(12, 12, 72, 72);
  sc.drawImage(spriteDe(m), 16, 16, 64, 64);
  txt(nombreDe(m), 92, 12, { t: 8 });
  txt('Nivel ' + m.nivel, 92, 24, { t: 7 });
  if (m.shiny) txt('★ SHINY', 228, 24, { t: 6, al: 'right', c: '#e0a000', sombra: null });
  esp.tipos.forEach((t, i) => insigniaTipo(t, 92 + i * 60, 34));
  txt(`PS  ${m.ps}/${m.psMax}`, 92, 50, { t: 6 });
  txt(`ATQ ${m.atk}   DEF ${m.def}`, 92, 60, { t: 6 });
  txt(`VEL ${m.vel}`, 92, 70, { t: 6 });
  txt(`EXP para subir: ${expPara(m.nivel + 1) - m.exp}`, 92, 80, { t: 5, sombra: null, c: '#606060' });
  // Habilidad
  sc.fillStyle = '#e8dcb0'; rectRed(sc, 10, 89, 220, 26, 3); sc.fill();
  txt('HABILIDAD:', 15, 93, { t: 6, c: '#a05020', sombra: null });
  txt(h.nombre.toUpperCase(), 80, 93, { t: 6, c: '#203048', sombra: null });
  if (esHabOculta(m)) txt('OCULTA', 224, 94, { t: 5, c: '#a040a0', sombra: null, al: 'right' });
  if (m.hab2 && HABILIDADES[m.hab2]) { // DOBLE HABILIDAD: las dos, una por renglón
    txt('+ ' + HABILIDADES[m.hab2].nombre.toUpperCase(), 80, 101, { t: 6, c: '#6030a0', sombra: null });
    envolver(h.desc, 208, 4).slice(0, 1).forEach(l => txt(l, 15, 109, { t: 4, sombra: null, c: '#383838' }));
  } else
  envolver(h.desc, 208, 5).slice(0, 2).forEach((l, i) => txt(l, 15, 102 + i * 7, { t: 5, sombra: null, c: '#383838' }));
  m.movs.forEach((mv, i) => {
    const M = MOVS[mv.id];
    const y = 119 + i * 9;
    txt(M.nombre.toUpperCase(), 14, y, { t: 6 });
    txt(`PP ${mv.pp}/${M.pp}`, 120, y, { t: 6 });
    sc.fillStyle = COLOR_TIPO[M.tipo]; sc.fillRect(190, y, 38, 8);
    txt(nombreTipo(M.tipo).slice(0, 6), 209, y + 1, { t: 5, c: '#fff', sombra: null, al: 'center' });
  });
}

// ---------- Apodos: teclado en pantalla ----------
const TECLADO = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '.', '!',
  '1', '2', '3', '4', '5', 'ESP', 'BORRAR', 'LISTO',
];
const MAX_APODO = 10;
async function ponerApodo(m, sinCancelar) {
  const especie = ESPECIES[m.id].nombre.toUpperCase();
  const texto = await escribirTexto(`Apodo para ${especie}:`, m.apodo || '', MAX_APODO, m.id, sinCancelar);
  if (texto === null) return;
  const nuevo = texto.trim();
  if (!nuevo || nuevo === especie) { delete m.apodo; await decir(`Le dejaste su nombre: ${especie}.`); }
  else { m.apodo = nuevo; await decir(`¡Ahora se llama ${nuevo}!`); }
}
// Teclado en pantalla. Devuelve el texto, o null si se canceló.
async function escribirTexto(titulo, inicial, max, sprite, sinCancelar) {
  const te = { titulo, sprite, max, texto: inicial || '', idx: 0 };
  ui.teclado = te;
  while (true) {
    await esperar(1);
    const n = TECLADO.length, col = te.idx < 30 ? te.idx % 10 : te.idx - 30;
    if (pressed.right) te.idx = (te.idx + 1) % n;
    if (pressed.left) te.idx = (te.idx - 1 + n) % n;
    if (pressed.down) te.idx = te.idx < 20 ? te.idx + 10 : te.idx < 30 ? 30 + Math.min(col, 7) : col;
    if (pressed.up) te.idx = te.idx >= 30 ? 20 + col : te.idx >= 10 ? te.idx - 10 : 30 + Math.min(col, 7);
    if (pressed.b) { if (te.texto) te.texto = te.texto.slice(0, -1); else if (!sinCancelar) { ui.teclado = null; return null; } }
    if (pressed.start && !pressed.a) te.idx = TECLADO.indexOf('LISTO');
    if (pressed.a) {
      const k = TECLADO[te.idx];
      if (k === 'LISTO') break;
      if (k === 'BORRAR') te.texto = te.texto.slice(0, -1);
      else if (te.texto.length < te.max) te.texto += k === 'ESP' ? ' ' : k;
    }
  }
  ui.teclado = null;
  return te.texto.trim();
}
function dibujarTeclado() {
  const te = ui.teclado;
  sc.fillStyle = '#e8a050'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#d89040'; for (let i = 0; i < H; i += 12) sc.fillRect(0, i, W, 6);
  caja(4, 4, 232, 42, 'info');
  sc.imageSmoothingEnabled = false;
  if (te.sprite) sc.drawImage(spriteCriatura(te.sprite), 8, 6, 36, 36);
  else sc.drawImage(spriteChar(PAL.felipe, 0, 0), 12, 8, 32, 32);
  txt(te.titulo, 48, 10, { t: 6, sombra: null, c: '#606060' });
  sc.fillStyle = '#ffffff'; sc.fillRect(48, 22, 150, 16);
  txt(te.texto + ((tick >> 4) % 2 === 0 && te.texto.length < te.max ? '_' : ''), 52, 26, { t: 8 });
  txt(`${te.texto.length}/${te.max}`, 230, 30, { t: 5, al: 'right', sombra: null, c: '#606060' });
  caja(4, 50, 232, 106, 'normal');
  TECLADO.forEach((k, i) => {
    let x, y, w;
    if (i < 30) { x = 14 + (i % 10) * 22; y = 58 + Math.floor(i / 10) * 18; w = 18; }
    else { const j = i - 30; const anchos = [16, 16, 16, 16, 16, 26, 40, 36]; x = 14; for (let q = 0; q < j; q++) x += anchos[q] + 4; y = 112; w = anchos[j]; }
    const sel = i === te.idx;
    sc.fillStyle = sel ? '#f8d030' : '#e8e8f0'; sc.fillRect(x, y, w, 14);
    txt(k, x + w / 2, y + 4, { t: k.length > 1 ? 5 : 7, al: 'center', sombra: null });
  });
  txt('A: escribir   B: borrar   M: listo', 120, 140, { t: 5, al: 'center', sombra: null, c: '#606060' });
}

// ---------- Bicicleta ----------
async function usarBici() {
  if (S.bici) { S.bici = false; await decir('Felipe se bajó de la BICICLETA.'); return; }
  if (!mapa().exterior) { await decir('¡Adentro no se puede andar en bici! Usala afuera.'); return; }
  S.bici = true;
  await decir('¡Felipe se subió a la BICICLETA! ¡A pedalear!');
}

// ---------- Objeto MAPA: la Argentina con todos los lugares ----------
// Contorno simplificado (longitud, latitud)
const ARG_CONTORNO = [[-66, -21.8], [-64.3, -22], [-62.8, -22], [-61, -23.5], [-58.5, -24.8], [-57.6, -25.3], [-58.6, -27.3], [-56, -27.3], [-54.6, -25.6], [-53.7, -26.3], [-53.8, -27.2], [-55.7, -28.2], [-57.6, -30.2], [-58.2, -32.5], [-58.4, -34], [-57.2, -35.3], [-56.7, -36.4], [-57.5, -38.2], [-59, -38.8], [-62.3, -38.8], [-62.1, -40.6], [-65.1, -41], [-64.9, -42.2], [-63.6, -42.7], [-65.3, -43.3], [-67.5, -46], [-65.8, -47.8], [-68, -50.1], [-69.1, -51.6], [-68.4, -52.4], [-71.9, -52], [-72.3, -51], [-73.3, -50], [-72.6, -48], [-71.8, -46.5], [-71.6, -44], [-71.8, -42], [-71.4, -40], [-70.9, -37.5], [-70.1, -35], [-69.8, -33], [-70, -30], [-68.7, -27.5], [-68.5, -25], [-67, -23], [-66.9, -22.1]];
const ARG_FUEGO = [[-68.6, -52.6], [-68.6, -54.9], [-66.5, -55], [-65.2, -54.7], [-66.9, -53.6], [-68.3, -52.7]];
// Dónde queda cada lugar del juego (los interiores usan el lugar al que salen)
const LUGAR_GEO = {
  pueblo: [-60.5, -36.5], pampa: [-62, -34.2], serrana: [-64.5, -31.4], sierras: [-65.4, -31.2], travesia: [-66.8, -30.9], vallefertil: [-67.8, -30.5],
  talampaya: [-67.7, -29.6], calchaqui: [-66.2, -26.2], tafi: [-65.7, -26.9], ruta4: [-64.9, -24.4], calilegua: [-64.7, -23.8],
  ruta5: [-65.4, -23.2], tilcara: [-65.4, -23.6], ruta6: [-65.9, -23.5], susques: [-66.4, -23.4],
  chaco: [-61.5, -25.6], ruta2: [-57.2, -28.6], villa: [-58.8, -27.6], ruta3: [-55.6, -27], minas: [-54.8, -26.4], puerto: [-54.6, -25.9],
  caldenal: [-64.5, -37], estepa: [-69.5, -40], bariloche: [-71.3, -41.1],
  ruta13: [-71.4, -41.6], elbolson: [-71.5, -42], ruta14: [-70.3, -41.6], jacobacci: [-69.5, -41.3], ruta15: [-68, -41.3], somuncura: [-66.9, -41.2],
  ruta16: [-64.6, -42.4], madryn: [-65.1, -42.8], ruta17: [-67, -47.3], gallegos: [-69.2, -51.6], ruta18: [-68.6, -53.1], ushuaia: [-68.3, -54.7],
  catamarca: [-65.8, -28.5], ruta19: [-66.5, -27.9], belen: [-67, -27.6], ruta20: [-67.3, -27.5], fiambala: [-67.6, -27.7], ruta21: [-68, -27.4], ojos: [-68.5, -27.1],
  quebrada: [-64.75, -31.65], quilmes: [-65.95, -26.45], mocona: [-53.9, -27.15], nahuel: [-71.55, -40.95], glaciar: [-73.05, -50.5], pomez: [-67.45, -26.6],
  ruta22: [-68.9, -28.5], rodeo: [-69.15, -30.2], ruta23: [-69.4, -31.5], uspallata: [-69.35, -32.6], ruta24: [-69.6, -32.75], plaza: [-69.88, -32.65],
};
if (typeof LUGAR_GEO_EXTRA !== 'undefined') Object.assign(LUGAR_GEO, LUGAR_GEO_EXTRA);
const GIMNASIOS_GEO = [['vallefertil', 1], ['tafi', 2], ['puerto', 3], ['bariloche', 4], ['somuncura', 5], ['ushuaia', 6], ['ojos', 7], ['plaza', 8]];
function lugarExterior(id) {
  let m = id, n = 0;
  while (MAPAS[m] && !MAPAS[m].exterior && n++ < 4) m = (MAPAS[m].salidas[0] || {}).a;
  return LUGAR_GEO[m] ? m : 'pueblo';
}
function geoAPantalla([lon, lat]) { return [10 + (lon + 74) * 3.44, 6 + (-21.5 - lat) * 4.35]; }
async function pantallaMapa() {
  ui.mapaArg = { lugar: lugarExterior(S.mapa) };
  await esperarBoton();
  ui.mapaArg = null;
}
function dibujarMapaArg() {
  const u = ui.mapaArg;
  sc.fillStyle = '#4a8ac8'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#5a9ad8'; for (let i = 0; i < H; i += 10) sc.fillRect(0, i, W, 3);
  const pintar = (pts, color) => {
    sc.beginPath();
    pts.forEach((p, i) => { const [x, y] = geoAPantalla(p); i ? sc.lineTo(x, y) : sc.moveTo(x, y); });
    sc.closePath(); sc.fillStyle = color; sc.fill();
    sc.strokeStyle = '#3a5a2a'; sc.lineWidth = 1; sc.stroke();
  };
  pintar(ARG_CONTORNO, '#a8d878');
  pintar(ARG_FUEGO, '#a8d878');
  const [mx, my] = geoAPantalla([-59.5, -51.7]);
  sc.fillStyle = '#a8d878'; sc.beginPath(); sc.ellipse(mx, my, 5, 2, 0, 0, Math.PI * 2); sc.fill(); sc.stroke();
  // Lugares
  for (const [id, p] of Object.entries(LUGAR_GEO)) {
    const [x, y] = geoAPantalla(p);
    const pueblo = !id.startsWith('ruta') && !['pampa', 'sierras', 'travesia', 'talampaya', 'calchaqui', 'chaco', 'minas', 'caldenal', 'estepa'].includes(id);
    sc.fillStyle = pueblo ? '#f8f0d0' : '#6a8a4a';
    sc.fillRect(Math.round(x) - 1, Math.round(y) - 1, pueblo ? 3 : 2, pueblo ? 3 : 2);
  }
  // Gimnasios: estrella dorada si ya tenés la insignia
  for (const [id, n] of GIMNASIOS_GEO) {
    const [x, y] = geoAPantalla(LUGAR_GEO[id]);
    const ok = S.flags['insignia' + n];
    sc.fillStyle = ok ? '#f8d030' : '#c03030';
    sc.beginPath(); sc.arc(x, y, 2.5, 0, Math.PI * 2); sc.fill();
  }
  // Felipe (titila)
  const [fx, fy] = geoAPantalla(LUGAR_GEO[u.lugar]);
  if ((tick >> 4) % 2 === 0) { sc.strokeStyle = '#ffffff'; sc.lineWidth = 2; sc.beginPath(); sc.arc(fx, fy, 5, 0, Math.PI * 2); sc.stroke(); }
  sc.fillStyle = '#f03030'; sc.fillRect(Math.round(fx) - 2, Math.round(fy) - 2, 4, 4);
  // Panel
  caja(100, 4, 136, 30, 'info');
  txt('MAPA DE LA ARGENTINA', 168, 8, { t: 6, al: 'center' });
  txt('Estás en:', 106, 20, { t: 5, sombra: null, c: '#606060' });
  const nom = MAPAS[u.lugar].nombre;
  envolver(nom, 124, 5).slice(0, 2).forEach((l, i) => txt(l, 106, 27 + i * 7, { t: 5, sombra: null }));
  caja(100, 40, 136, 58, 'normal');
  txt('INSIGNIAS', 168, 46, { t: 6, al: 'center' });
  for (let i = 1; i <= 8; i++) {
    const x = 112 + ((i - 1) % 4) * 30, y = 62 + Math.floor((i - 1) / 4) * 18;
    sc.fillStyle = S.flags['insignia' + i] ? '#f8d030' : '#c8c8c8';
    sc.beginPath(); sc.arc(x, y, 6, 0, Math.PI * 2); sc.fill();
    txt(String(i), x, y - 3, { t: 5, al: 'center', sombra: null, c: S.flags['insignia' + i] ? '#a04020' : '#808080' });
  }
  caja(100, 104, 136, 52, 'normal');
  sc.fillStyle = '#f03030'; sc.fillRect(108, 113, 4, 4); txt('Vos estás acá', 118, 112, { t: 5, sombra: null });
  sc.fillStyle = '#c03030'; sc.beginPath(); sc.arc(110, 125, 2.5, 0, Math.PI * 2); sc.fill(); txt('Gimnasio', 118, 122, { t: 5, sombra: null });
  sc.fillStyle = '#f8d030'; sc.beginPath(); sc.arc(110, 135, 2.5, 0, Math.PI * 2); sc.fill(); txt('Gimnasio ganado', 118, 132, { t: 5, sombra: null });
  txt('B: cerrar', 168, 145, { t: 5, al: 'center', sombra: null, c: '#606060' });
}

// ---------- Mochila ----------
async function pantallaMochila(enBatalla, vender) {
  const lista = () => Object.keys(OBJETOS).filter(k => (S.bolsa[k] || 0) > 0);
  ui.mochila = { idx: 0, vender: !!vender };
  while (true) {
    await esperar(1);
    const L = lista(), n = L.length + 1, mo = ui.mochila;
    mo.lista = L;
    if (pressed.up) mo.idx = (mo.idx - 1 + n) % n;
    if (pressed.down) mo.idx = (mo.idx + 1) % n;
    if (pressed.b) { ui.mochila = null; return null; }
    if (pressed.a) {
      ui.mochila = null;
      return mo.idx < L.length ? L[mo.idx] : null;
    }
  }
}
function dibujarMochila() {
  const mo = ui.mochila, L = mo.lista || [];
  sc.fillStyle = '#e0a050'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#d09040'; for (let i = 0; i < H; i += 12) sc.fillRect(0, i, W, 6);
  caja(4, 4, 84, 24, 'info'); txt('MOCHILA', 14, 12, { t: 7 });
  caja(4, 32, 84, 24, 'info'); txt(plataTxt(S.plata || 0), 80, 40, { t: 7, al: 'right' });
  sc.drawImage(spriteBoleadora(), 22, 62, 48, 48);
  caja(96, 4, 140, 108, 'normal');
  const items = [...L.map(k => [OBJETOS[k].nombre, 'x' + S.bolsa[k]]), ['CERRAR', '']];
  // Se ven 6 renglones; si hay más, la lista se corre con las flechas
  const top = Math.max(0, Math.min(mo.idx - 2, items.length - 6));
  items.slice(top, top + 6).forEach(([nm, c], k) => {
    const i = top + k, y = 14 + k * 16;
    txt(nm, 112, y, { t: nm.length > 13 ? 5 : nm.length > 10 ? 6 : 7 });
    if (c) txt(c, 228, y, { t: 7, al: 'right' });
    if (i === mo.idx) flecha(103, y);
  });
  if (top > 0) txt('▲', 230, 5, { t: 5, al: 'right', sombra: null, c: '#808080' });
  if (top + 6 < items.length) txt('▼', 230, 102, { t: 5, al: 'right', sombra: null, c: '#808080' });
  caja(4, 116, 232, 40, 'normal');
  const sel = L[mo.idx];
  let d = sel ? OBJETOS[sel].desc : 'Cerrar la mochila.';
  if (mo.vender && sel) d = precioVenta(sel) ? `Te lo compran a ${plataTxt(precioVenta(sel))} cada uno.` : '¡Esto no se vende! Es muy importante para el viaje.';
  envolver(d, 212, 7).forEach((l, i) => txt(l, 12, 126 + i * 13, { t: 7 }));
}

// ---------- Dibujo del mundo ----------
function dibujarPersonaje(pal, dir, frame, x, y) {
  b.drawImage(spriteChar(pal, dir, frame), Math.round(x), Math.round(y));
}
const PAL_AMIGO = { ...PAL.felipe, id: 'amigo', gorra: '#e04040', remera: '#e04040', raya: '#ffffff' };
function dibujarBici(dir, x, y) {
  x = Math.round(x); y = Math.round(y);
  b.strokeStyle = '#202020'; b.lineWidth = 1.5;
  b.fillStyle = '#d83030';
  if (dir === 2 || dir === 3) { // de costado: dos ruedas
    b.beginPath(); b.arc(x + 3, y + 13, 3, 0, Math.PI * 2); b.stroke();
    b.beginPath(); b.arc(x + 13, y + 13, 3, 0, Math.PI * 2); b.stroke();
    b.fillRect(x + 3, y + 10, 10, 2); b.fillRect(x + 7, y + 7, 2, 5);
    b.fillStyle = '#404040'; b.fillRect(dir === 2 ? x + 1 : x + 12, y + 6, 3, 1.5);
  } else { // de frente o de espaldas: una rueda y el manubrio
    b.fillStyle = '#202020'; b.fillRect(x + 7, y + 10, 2, 7);
    b.fillStyle = '#d83030'; b.fillRect(x + 7, y + 8, 2, 3);
    b.fillStyle = '#404040'; b.fillRect(x + 3, y + (dir === 0 ? 9 : 7), 10, 1.5);
  }
}
function dibujarMundo() {
  const m = mapa();
  const mw = m.grilla[0].length, mh = m.grilla.length;
  const ox = S.moviendo ? DX[S.dir] * S.prog : 0, oy = S.moviendo ? DY[S.dir] * S.prog : 0;
  const ppx = S.x * T + ox, ppy = S.y * T + oy;
  const cx = mw * T <= W ? Math.floor((mw * T - W) / 2) : Math.max(0, Math.min(mw * T - W, ppx - 112));
  const cy = mh * T <= H ? Math.floor((mh * T - H) / 2) : Math.max(0, Math.min(mh * T - H, ppy - 72));
  b.fillStyle = '#000'; b.fillRect(0, 0, W, H);
  const x0 = Math.max(0, Math.floor(cx / T)), y0 = Math.max(0, Math.floor(cy / T));
  const x1 = Math.min(mw - 1, Math.floor((cx + W) / T)), y1 = Math.min(mh - 1, Math.floor((cy + H) / T));
  const agua = (tick >> 5) % 2;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    let ch = m.grilla[y][x];
    const img = ch === '~' ? TILES['~' + agua] : TILES[ch] || TILES['.'];
    b.drawImage(img, x * T - cx, y * T - cy);
  }
  for (const e of m.edificios || []) {
    const k = e.tipo + e.w + 'x' + e.h + e.puerta;
    if (!EDIF[k]) EDIF[k] = crearEdificio(e.tipo, e.w, e.h, e.puerta);
    b.drawImage(EDIF[k], e.x * T - cx, e.y * T - cy);
  }
  for (const it of m.itemsSuelo || []) if (!S.flags['item_' + it.id] && it.x !== undefined) b.drawImage(spriteBoleadora(), it.x * T - cx, it.y * T - cy - 3 + (((tick + it.x * 9) >> 5) % 2 ? -1 : 0));
  for (const bo of m.boleadoras || []) {
    if (S.flags.inicial === bo.id || S.flags.inicialTomi === bo.id) continue;
    b.drawImage(spriteBoleadora(), bo.x * T - cx, bo.y * T - cy - 3);
  }
  const entes = npcsVisibles().map(n => ({ y: n.y * T, x: n.x * T, pal: n.pal, dir: n.dir, f: 0, tx: n.x, ty: n.y, criatura: n.criatura }));
  let frame = 0;
  if (S.moviendo && !S.bici) frame = S.prog < 10 ? 1 + S.pasoAlt : 0;
  entes.push({ y: ppy, x: ppx, pal: PAL.felipe, dir: S.dir, f: frame, yo: true, tx: S.x, ty: S.y });
  if (mpConAmigo() && MP.otro.mapa === S.mapa && MP.otro.x !== undefined) entes.push({ y: MP.otro.y * T, x: MP.otro.x * T, pal: PAL_AMIGO, dir: MP.otro.dir || 0, f: 0, tx: MP.otro.x, ty: MP.otro.y });
  prepararSalvajes();
  if (ui.raid) { dibujarRaidAbajo(cx, cy); entes.push(...seguidoresRaid()); } // pelea en el mapa contra REGIOHM
  for (const c of SALV.lista) {
    const px = c.x * T + (c.mov ? DX[c.dir] * c.prog : 0), py = c.y * T + (c.mov ? DY[c.dir] * c.prog : 0);
    entes.push({ y: py, x: px, salvaje: c, tx: c.mov && c.prog >= 8 ? c.x + DX[c.dir] : c.x, ty: c.mov && c.prog >= 8 ? c.y + DY[c.dir] : c.y });
  }
  entes.sort((a, c) => a.y - c.y);
  for (const e of entes) {
    if (e.criatura) { // una criatura parada en el mapa (REGIOHM en la cumbre): grande y respirando
      const img = spriteCriatura(e.criatura), tam = 40, resp = ((tick >> 4) % 2) ? 1 : 0;
      b.drawImage(img, Math.round(e.x - cx + 8 - tam / 2), Math.round(e.y - cy + 14 - tam) + resp, tam, tam - resp);
      continue;
    }
    if (e.salvaje) {
      const c = e.salvaje;
      const salto = c.mov ? -Math.abs(Math.sin(c.prog / 16 * Math.PI)) * 3 : ((tick + c.x * 7) >> 4) % 2 ? -1 : 0;
      const img = miniCriatura(c.id);
      b.save();
      if (c.nace > 0) b.globalAlpha = 1 - c.nace / 20;
      if (c.dir === 3) { b.translate(Math.round(e.x - cx) + 18, 0); b.scale(-1, 1); b.drawImage(img, 0, Math.round(e.y - cy - 6 + salto)); }
      else b.drawImage(img, Math.round(e.x - cx - 2), Math.round(e.y - cy - 6 + salto));
      b.restore();
      const ch = m.grilla[e.ty] && m.grilla[e.ty][e.tx];
      if (ch === ',' || ch === 'u') b.drawImage(TILES[ch], 0, 9, 16, 7, e.x - cx, e.y - cy + 9, 16, 7);
      continue;
    }
    const bob = e.yo && frame ? -1 : 0;
    if (e.yo && S.bici) { dibujarBici(e.dir, e.x - cx, e.y - cy); dibujarPersonaje(e.pal, e.dir, 0, e.x - cx, e.y - cy - 6); continue; }
    if (e.yo && enAgua(m)) {
      const ola = ((tick >> 3) % 2) ? 1 : 0, bx = Math.round(e.x - cx), by = Math.round(e.y - cy) + ola;
      b.fillStyle = '#5a3a1a'; b.fillRect(bx, by + 8, 16, 7);
      b.fillStyle = '#9a6a3a'; b.fillRect(bx + 1, by + 8, 14, 2); b.fillRect(bx + 1, by + 11, 14, 2);
      b.fillStyle = '#c8945a'; b.fillRect(bx + 1, by + 8, 14, 1); b.fillRect(bx + 1, by + 11, 14, 1);
      b.fillStyle = '#e8f4ff'; b.fillRect(bx - 1, by + 14, 3, 1); b.fillRect(bx + 14, by + 14, 3, 1);
      dibujarPersonaje(e.pal, e.dir, 0, e.x - cx, e.y - cy - 4 + ola);
      continue;
    }
    dibujarPersonaje(e.pal, e.dir, e.f, e.x - cx, e.y - cy - 3 + bob);
    const enPasto = m.grilla[e.ty] && (m.grilla[e.ty][e.tx] === ',' || m.grilla[e.ty][e.tx] === 'u') && !(e.yo && S.moviendo && S.prog < 8);
    if (enPasto) b.drawImage(TILES[m.grilla[e.ty][e.tx]], 0, 9, 16, 7, e.x - cx, e.y - cy + 9, 16, 7);
  }
  // Lugares oscuros (Gimnasio 5): solo se ve un círculo alrededor de Felipe
  if (m.oscuro) {
    const fx = ppx - cx + 8, fy = ppy - cy + 6;
    const muy = m.oscuro === 2; // El Monte Cerrado: todavía menos luz
    const gr = b.createRadialGradient(fx, fy, muy ? 8 : 18, fx, fy, muy ? 40 : 70);
    gr.addColorStop(0, muy ? 'rgba(4,10,4,0)' : 'rgba(12,4,28,0)'); gr.addColorStop(1, muy ? 'rgba(4,10,4,0.97)' : 'rgba(12,4,28,0.88)');
    b.fillStyle = gr; b.fillRect(0, 0, W, H);
  }
  if (ui.raid) dibujarRaidArriba(cx, cy);
  // Nombre del lugar al entrar
  if (S.cartelLugar && S.cartelLugar.t > 0) S.cartelLugar.t--;
}

// ================= TÍTULO E INTRO =================
function dibujarFondoCampo(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 110);
  g.addColorStop(0, '#5ab0f0'); g.addColorStop(1, '#c8e8ff');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffe890'; ctx.beginPath(); ctx.arc(196, 34, 14, 0, 7); ctx.fill();
  ctx.fillStyle = '#f8f0a0'; ctx.beginPath(); ctx.arc(196, 34, 10, 0, 7); ctx.fill();
  ctx.fillStyle = '#8a8ab8';
  ctx.beginPath(); ctx.moveTo(0, 100);
  const picos = [[20, 70], [44, 86], [70, 56], [96, 80], [124, 50], [150, 78], [178, 62], [206, 84], [240, 66], [240, 100]];
  for (const [x, y] of picos) ctx.lineTo(x, y);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  for (const [x, y] of [[70, 56], [124, 50], [178, 62]]) { ctx.beginPath(); ctx.moveTo(x - 7, y + 8); ctx.lineTo(x, y); ctx.lineTo(x + 7, y + 8); ctx.fill(); }
  ctx.fillStyle = '#88d070'; ctx.fillRect(0, 98, W, 62);
  ctx.fillStyle = '#70b858'; for (let i = 0; i < W; i += 12) ctx.fillRect(i + ((i / 12) % 2) * 5, 104 + (i % 7), 3, 1);
}
function dibujarTitulo() {
  dibujarFondoCampo(b);
  const s = Math.sin(tick / 20) * 2;
  b.drawImage(spriteCriatura('ramoa'), 14, 96 + s, 64, 64);
  b.drawImage(spriteCriatura('flamartija'), 88, 92 - s, 64, 64);
  b.drawImage(spriteCriatura('ajolodo'), 162, 96 + s, 64, 64);
}
function uiTitulo() {
  txt('CRIATURAS', 120, 14, { t: 18, c: '#f8d030', sombra: '#a04020', al: 'center' });
  txt('CRIOLLAS', 120, 38, { t: 18, c: '#6cb4ee', sombra: '#1a3a6a', al: 'center' });
  txt('Una aventura por la Argentina', 120, 62, { t: 6, c: '#203048', sombra: '#ffffff', al: 'center' });
  txt('VERSIÓN CLANES Y REGIOHM · 23/11', 236, 152, { t: 5, c: '#ffffff', sombra: '#203048', al: 'right' });
  if (!ui.menu && (tick >> 5) % 2 === 0) txt('APRETÁ A PARA EMPEZAR', 120, 84, { t: 7, c: '#ffffff', sombra: '#203048', al: 'center' });
}
function dibujarIntro() {
  b.fillStyle = '#304860'; b.fillRect(0, 0, W, H);
  b.fillStyle = '#3a5a78'; for (let i = 0; i < H; i += 8) b.fillRect(0, i, W, 4);
  b.drawImage(spriteChar(PAL.ceibo, 0, 0), 88, 24, 64, 64);
}

async function pantallaTitulo() {
  S.escena = 'titulo';
  await fundido(0, 20);
  while (true) { await esperar(1); if (S.escena !== 'titulo') return; if (pressed.a || pressed.start) break; }
  const opciones = hayPartida() ? ['CONTINUAR', 'NUEVA PARTIDA'] : ['NUEVA PARTIDA'];
  let r = await elegir(opciones, { x: 64, y: 82, w: 112, cancelar: false });
  if (opciones[r] === 'NUEVA PARTIDA' && hayPartida()) {
    const seguro = await siNoTitulo();
    if (!seguro) return pantallaTitulo();
  }
  await fundido(1, 16);
  if (opciones[r] === 'CONTINUAR' && cargar()) {
    S.escena = 'mundo';
    await fundido(0, 16);
  } else {
    await nuevaPartida();
  }
}
async function siNoTitulo() {
  return siNo('Si empezás una partida nueva se borra la anterior. ¿Seguro?');
}
async function nuevaPartida() {
  Object.assign(S, { mapa: 'casa', x: 4, y: 4, dir: 0, equipo: [], caja: [], bolsa: { mapa: 1 }, flags: {}, plata: 3000, bici: false });
  restaurarRocas();
  S.escena = 'intro';
  await fundido(0, 16);
  await decir('¡Hola! ¡Bienvenido al mundo de las CRIATURAS CRIOLLAS!');
  await decir('Me llamo CEIBO, como la flor. Pero todos me dicen la PROFE.');
  await decir('En nuestra tierra viven criaturas increíbles: en la selva, en la Puna, en los ríos, en el mar y en las montañas.');
  await decir('Algunas personas las cuidan, otras las estudian... ¡y otras entrenan con ellas para competir en los GIMNASIOS!');
  await decir('Vos sos FELIPE, ¿no? ¡Tu aventura está por empezar! ¡Vamos!');
  await fundido(1, 16);
  S.escena = 'mundo';
  S.ocupado = true; // que el jugador no camine ni hable mientras charla mamá
  await fundido(0, 16);
  await decir('MAMÁ: ¡Felipe! ¿Ya te levantaste? Vení, que te quiero contar algo.');
  const tactil = document.body.classList.contains('tactil');
  await decir(tactil
    ? 'CONSEJO: Caminá con las FLECHAS de abajo. Para hablar con alguien, ponete enfrente y tocá el botón A.'
    : 'CONSEJO: Caminá con las FLECHAS del teclado. Para hablar con alguien, ponete enfrente y apretá Z. Con Enter abrís el MENÚ.');
  S.ocupado = false;
}

// ================= BATALLA =================
// Azar de la batalla: en los duelos entre amigos usa la semilla compartida
function azar() { return bt && bt.rng ? bt.rng() : Math.random(); }
function mult(etapa) { return etapa >= 0 ? (2 + etapa) / 2 : 2 / (2 - etapa); }
function calcularDanio(at, de, mv) {
  const L = at.nivel;
  const a = at.atk * mult(at.et.atk), d = de.def * mult(de.et.def);
  let base = Math.floor(Math.floor(Math.floor(2 * L / 5 + 2) * mv.pot * a / d) / 50) + 2;
  const ha = habDe(at), hd = habDe(de);
  const stab = tiposDe(at).includes(mv.tipo) ? (tieneEf(ha, 'adaptable') ? 2 : 1.5) : 1;
  let ef = eficacia(mv.tipo, tiposDe(de));
  if (ef === 0 && tieneEf(ha, 'audaz') && ['NORMAL', 'LUCHA'].includes(mv.tipo)) ef = eficacia(mv.tipo, tiposDe(de).filter(t => t !== 'FANTASMA'));
  const critico = !tieneEf(hd, 'sinCritico') && !tieneEf(hd, 'capaGlaciar') && azar() < (tieneEf(ha, 'critico') || mv.critAlto ? 1 / 5 : 1 / 16);
  const azarDanio = 0.85 + azar() * 0.15;
  if (ef === 0) return { danio: 0, ef, critico: false };
  let extra = 1;
  if (tieneEf(ha, 'fuerza')) extra *= 1.25;
  if (tieneEf(ha, 'garra')) extra *= 1.3;
  if (tieneEf(ha, 'poderSolar') && bt.sol > 0) extra *= 1.5;
  if (tieneEf(hd, 'maestroFuego')) extra *= ef > 1 ? 0.7 : 0.5; // muy eficaces -30%, el resto -50%
  if (tieneEf(ha, 'cromolente') && ef < 1) extra *= 2;
  if (tieneEf(ha, 'apuro') && mv.tipo === ha.tipo && at.ps <= at.psMax / 3) extra *= 1.5;
  if (tieneEf(ha, 'humedal') && (mv.tipo === 'AGUA' || mv.tipo === 'PLANTA')) extra *= 1.3;
  if (tieneEf(ha, 'crisol') && (mv.tipo === 'FUEGO' || mv.tipo === 'ROCA')) extra *= 1.3;
  if (bt.sol > 0 && ['FUEGO', 'TIERRA', 'ROCA'].includes(mv.tipo)) extra *= 1.3;
  if (bt.lluvia > 0 && mv.tipo === 'AGUA') extra *= 1.3;
  if (bt.lluvia > 0 && mv.tipo === 'FUEGO') extra *= 0.7;
  if (tieneEf(hd, 'filtro') && ef > 1) extra *= 0.75;
  if (tieneEf(hd, 'animaGlacial') && de.ps === de.psMax) extra *= 0.5;
  if (tieneEf(ha, 'sobrecarga')) extra *= 1.3;
  if (tieneEf(ha, 'punoFerreo') && mv.punio) extra *= 1.3;
  if (tieneEf(ha, 'pielHelada') && mv.tipo === 'HIELO') extra *= 1.3;
  if (tieneEf(hd, 'pielHelada')) extra *= 0.85;
  if (bt.nieve > 0 && mv.tipo === 'HIELO') extra *= 1.3;
  if (tieneEf(ha, 'filoRecio') && mv.corta) extra *= 1.5;
  if (tieneEf(ha, 'templado') && mv.tipo === 'ACERO') extra *= 1.5;
  if (tieneEf(ha, 'cabezaRoca') && mv.tipo === 'ROCA') extra *= 1.2;
  if (tieneEf(hd, 'ignifugo') && mv.tipo === 'FUEGO') extra *= 0.5;
  if (tieneEf(hd, 'capaGlaciar') && (mv.tipo === 'FUEGO' || mv.tipo === 'PLANTA')) extra *= 0.5;
  if (tieneEf(hd, 'ilusion') && !de.et.golpeado) extra *= 0.5;
  return { danio: Math.max(1, Math.floor(base * stab * ef * (critico ? 1.5 : 1) * azarDanio * extra)), ef, critico };
}
function nombreBatalla(m) {
  if (m === bt.yo) return nombreDe(m);
  return nombreDe(m) + (bt.tipo === 'salvaje' ? ' salvaje' : ' enemigo');
}

async function transicionBatalla() {
  for (let i = 0; i < 3; i++) { ui.flash = 1; await esperar(4); ui.flash = 0; await esperar(4); }
  await fundido(1, 14);
}

async function batalla(op) {
  const escenaPrevia = S.escena;
  await transicionBatalla();
  const ent = op.entrenador;
  // Un entrenador puede forzar la habilidad de una criatura: ['id', nivel, { hab: 'sequia' }]
  const equipoRival = ent ? ent.equipo.map(([id, l, extra]) => { const c = crearCriatura(id, l); if (extra && extra.hab) c.habForzada = extra.hab; return c; }) : [crearCriatura(op.salvaje[0], op.salvaje[1])];
  // Contra TODO el equipo junto, el jefe tiene seis veces más vida
  if (op.todos) { const r = equipoRival[0]; r.psMax *= 6; r.ps = r.psMax; }
  bt = {
    tipo: ent ? 'entrenador' : 'salvaje', ent, equipoRival,
    rival: null, yo: null, rivalVis: false, yoVis: false, entVis: !!ent,
    rDX: 0, rDY: 0, yDX: 0, yDY: 0, parp: { r: 0, y: 0 }, ps: { r: 0, y: 0 },
    menu: null, idxMenu: 0, idxMov: 0, bola: null, blanco: { r: 0, y: 0 },
    sinCaptura: !!op.sinCaptura,
    todos: !!op.todos, turno: 0, // todos: pelea de TODO el equipo junto (REGIOHM)
  };
  S.escena = 'batalla';
  let resultado = null;
  if (ent) {
    bt.entDX = 120;
    await fundido(0, 14);
    for (let i = 0; i < 20; i++) { bt.entDX = 120 * (1 - (i + 1) / 20); await esperar(1); }
    await decir(`¡${ent.nombre} te desafía a un duelo!`);
    for (let i = 0; i < 12; i++) { bt.entDX = i * 10; await esperar(1); }
    bt.entVis = false;
    await sacarRival(equipoRival[0]);
  } else {
    bt.rival = equipoRival[0]; bt.rival.et = { atk: 0, def: 0, vel: 0 }; bt.ps.r = bt.rival.ps;
    bt.rivalVis = true; bt.rDX = 140;
    await fundido(0, 14);
    for (let i = 0; i < 24; i++) { bt.rDX = 140 * (1 - (i + 1) / 24); await esperar(1); }
    await decir(`¡Apareció un ${nombreDe(bt.rival)} salvaje!`);
  }
  await sacarPropio(S.equipo.find(m => m.ps > 0));

  turnos:
  while (true) {
    const acc = await accionJugador();
    if (acc.t === 'huir') {
      if (bt.tipo === 'entrenador') { await decir('¡No podés escaparte de un duelo con un entrenador!'); continue; }
      const chance = bt.yo.vel >= bt.rival.vel ? 1 : 0.5 + bt.yo.vel / bt.rival.vel * 0.4;
      if (Math.random() < chance) { await decir('¡Escapaste sin problemas!'); resultado = 'huir'; break; }
      await decir('¡No pudiste escapar!');
    }
    if (acc.t === 'obj') {
      const r = await usarObjetoBatalla(acc.obj);
      if (r === 'atrapado') { resultado = 'atrapado'; break; }
      if (r === 'nada') continue;
    }
    if (acc.t === 'cambio') {
      await decir(`¡Volvé, ${nombreDe(bt.yo)}!`, { auto: 40 });
      await retirarPropio();
      await sacarPropio(S.equipo[acc.idx]);
    }
    const movRival = elegirMovRival();
    let orden = [{ q: 'rival', mv: movRival }];
    if (acc.t === 'mov') {
      const mio = { q: 'yo', mv: acc.mv };
      const pm = prioridad(bt.yo, acc.mv), pr = prioridad(bt.rival, movRival);
      const vy = velocidad(bt.yo), vr = velocidad(bt.rival);
      const primeroYo = pm !== pr ? pm > pr : vy !== vr ? vy > vr : Math.random() < 0.5;
      orden = primeroYo ? [mio, orden[0]] : [orden[0], mio];
    }
    for (const o of orden) {
      const at = o.q === 'yo' ? bt.yo : bt.rival, de = o.q === 'yo' ? bt.rival : bt.yo;
      if (at.ps <= 0 || de.ps <= 0) continue;
      await ejecutarMov(at, de, o.mv, o.q);
      if (de.ps <= 0) break;
    }
    if (bt.todos) await turnoDeTodos();
    await finDeTurno();
    if (bt.rival.ps <= 0) {
      await debilitar('r');
      await darExp();
      const sig = bt.equipoRival.find(m => m.ps > 0);
      if (sig) {
        await decir(`¡${bt.ent.nombre} va a sacar a ${nombreDe(sig)}!`);
        await sacarRival(sig);
      } else { resultado = 'gana'; break turnos; }
    }
    if (bt.yo.ps <= 0) {
      await debilitar('y');
      if (!S.equipo.some(m => m.ps > 0)) { resultado = 'pierde'; break; }
      if (bt.todos) { await sacarPropio(S.equipo.find(m => m.ps > 0)); continue; } // todo el equipo ya está peleando: pasa adelante la que sigue
      await decir('¿Qué criatura vas a mandar?', { auto: 30 });
      let idx = -1;
      while (idx < 0 || S.equipo[idx].ps <= 0) {
        idx = await pantallaEquipo({ forzado: true, msg: 'Elegí quién sigue peleando.' });
        if (S.equipo[idx].ps <= 0) { await decir('¡Esa criatura no tiene energía!'); idx = -1; }
      }
      await sacarPropio(S.equipo[idx]);
    }
  }

  if (resultado === 'gana' && bt.ent) {
    bt.entVis = true; bt.entDX = 0; bt.rivalVis = false;
    await decir(`¡Le ganaste a ${bt.ent.nombre}!`);
    const nivelMax = Math.max(...bt.equipoRival.map(m => m.nivel));
    const premio = nivelMax * (bt.ent.nombre.startsWith('LÍDER') ? 200 : bt.ent.nombre === 'TOMI' ? 120 : 60);
    S.plata = (S.plata || 0) + premio;
    await decir(`¡Felipe ganó ${plataTxt(premio)} de premio!`);
  }
  if (resultado === 'pierde') {
    if (bt.ent && bt.ent.sinDerrota) {
      await decir('¡Tus criaturas no pueden seguir!');
    } else {
      await decir('¡A Felipe no le quedan criaturas con energía!');
      await decir('Felipe volvió corriendo a casa...');
    }
  }
  await fundido(1, 14);
  for (const m of S.equipo) delete m.et;
  bt = null;
  ui.dialogo = null;
  if (resultado === 'pierde' && !(op.entrenador && op.entrenador.sinDerrota)) {
    const c = S.flags.centro;
    if (c && MAPAS[c.mapa]) { S.mapa = c.mapa; S.x = c.x; S.y = c.y; S.dir = c.dir; }
    else { S.mapa = 'casa'; S.x = 4; S.y = 4; S.dir = 1; }
    curarEquipo();
    S.escena = 'mundo';
    await fundido(0, 14);
    if (S.mapa.startsWith('centro')) await decir('ENFERMERA ROSA: ¡Ay, Felipe! En el CEMIC las curamos y ya están como nuevas.');
    else await decir('MAMÁ: ¡Ay, Felipe! Descansen un poquito. Ya están como nuevas.');
    guardar();
    return resultado;
  }
  S.escena = escenaPrevia === 'batalla' ? 'mundo' : escenaPrevia;
  await fundido(0, 14);
  await revisarEvoluciones();
  return resultado;
}

async function sacarRival(m) {
  bt.rival = m; m.et = { atk: 0, def: 0, vel: 0 }; bt.ps.r = m.ps;
  bt.rivalVis = true; bt.rDX = 0; bt.rDY = 0; bt.blanco.r = 8;
  for (let i = 0; i < 8; i++) { bt.blanco.r = 8 - i; await esperar(2); }
  bt.blanco.r = 0;
  await decir(`¡${bt.ent.nombre} sacó a ${nombreDe(m)}!`, { auto: 50 });
  await alEntrar(m);
}
async function sacarPropio(m) {
  bt.yo = m; m.et = { atk: 0, def: 0, vel: 0 }; bt.ps.y = m.ps;
  bt.idxMov = 0;
  bt.yoVis = true; bt.yDX = -90; bt.yDY = 0;
  for (let i = 0; i < 14; i++) { bt.yDX = -90 * (1 - (i + 1) / 14); await esperar(1); }
  await decir(`¡Adelante, ${nombreDe(m)}!`, { auto: 40 });
  await alEntrar(m);
  // La primera criatura rival entra antes que la nuestra: su habilidad se activa ahora
  if (bt.rival && !bt.rival.et.entro) await alEntrar(bt.rival);
}
async function retirarPropio() {
  for (let i = 0; i < 10; i++) { bt.yDX = -9 * (i + 1); await esperar(1); }
  bt.yoVis = false;
}
async function debilitar(lado) {
  const m = lado === 'r' ? bt.rival : bt.yo;
  for (let i = 0; i < 16; i++) { if (lado === 'r') bt.rDY = (i + 1) * 4; else bt.yDY = (i + 1) * 4; await esperar(1); }
  if (lado === 'r') bt.rivalVis = false; else bt.yoVis = false;
  await decir(`¡${nombreBatalla(m)} se debilitó!`);
  if (tieneEf(habDe(m), 'legado')) {
    bt.escudo = bt.escudo || {}; bt.escudo[lado] = true;
    await decir(`¡${habDe(m).nombre}! Dejó un escudo de hielo para el que entre después.`, { auto: 60 });
  }
  if (lado === 'r') bt.rDY = 0; else bt.yDY = 0;
}

async function accionJugador() {
  while (true) {
    bt.menu = { texto: `¿Qué hará ${nombreDe(bt.yo)}?` };
    const r = await menuBatalla();
    if (r === 0) {
      const mv = await menuMovs();
      if (mv) return { t: 'mov', mv };
    } else if (r === 1) {
      bt.menu = null;
      const obj = await pantallaMochila(true);
      if (obj) return { t: 'obj', obj };
    } else if (r === 2) {
      bt.menu = null;
      const idx = await pantallaEquipo({ msg: '¿A quién mandás a pelear?' });
      if (idx < 0) continue;
      if (S.equipo[idx] === bt.yo) { await decir(`¡${nombreDe(bt.yo)} ya está peleando!`); continue; }
      if (S.equipo[idx].ps <= 0) { await decir('¡Esa criatura no tiene energía para pelear!'); continue; }
      return { t: 'cambio', idx };
    } else if (r === 3) {
      bt.menu = null;
      return { t: 'huir' };
    }
  }
}
async function menuBatalla() {
  bt.menu.modo = 'principal';
  while (true) {
    await esperar(1);
    let i = bt.idxMenu;
    if (pressed.left && i % 2 === 1) i--;
    if (pressed.right && i % 2 === 0) i++;
    if (pressed.up && i >= 2) i -= 2;
    if (pressed.down && i < 2) i += 2;
    bt.idxMenu = i;
    if (pressed.a) return i;
  }
}
async function menuMovs() {
  bt.menu.modo = 'movs';
  const sinPP = bt.yo.movs.every(m => m.pp <= 0);
  while (true) {
    await esperar(1);
    const n = bt.yo.movs.length;
    let i = bt.idxMov;
    if (pressed.left && i % 2 === 1) i--;
    if (pressed.right && i % 2 === 0 && i + 1 < n) i++;
    if (pressed.up && i >= 2) i -= 2;
    if (pressed.down && i + 2 < n) i += 2;
    bt.idxMov = i;
    if (pressed.b) { bt.menu.modo = 'principal'; return null; }
    if (pressed.a) {
      if (sinPP) { bt.menu = null; await decir(`¡A ${nombreDe(bt.yo)} no le quedan PP!`); return { id: 'forcejeo', pp: 1 }; }
      const mv = bt.yo.movs[i];
      if (mv.pp <= 0) {
        bt.menu = null;
        await decir('¡No quedan PP para ese movimiento!');
        bt.menu = { texto: `¿Qué hará ${nombreDe(bt.yo)}?`, modo: 'movs' };
        continue;
      }
      bt.menu = null;
      return mv;
    }
  }
}
// ---------- Pelea de TODO el equipo junto (contra REGIOHM) ----------
// Después de la criatura que elegiste, atacan TODAS las demás que tengan energía (cada una elige su mejor ataque).
// REGIOHM, cada dos turnos, suelta un rugido que lastima a todo el equipo.
function mejorMovContra(m, de) {
  const op = m.movs.filter(x => x.pp > 0 && MOVS[x.id].pot);
  if (!op.length) return { id: 'forcejeo', pp: 1 };
  let mejor = op[0], val = -1;
  for (const x of op) {
    const M = MOVS[x.id];
    const v = M.pot * eficacia(M.tipo, tiposDe(de)) * (tiposDe(m).includes(M.tipo) ? 1.5 : 1) * (M.prec / 100);
    if (v > val) { val = v; mejor = x; }
  }
  return mejor;
}
async function turnoDeTodos() {
  bt.turno++;
  const principal = bt.yo, psPrincipal = bt.ps.y;
  for (const m of S.equipo) {
    if (m === principal || m.ps <= 0 || bt.rival.ps <= 0) continue;
    if (!m.et) m.et = { atk: 0, def: 0, vel: 0 };
    bt.yo = m; bt.ps.y = m.ps;
    await ejecutarMov(m, bt.rival, mejorMovContra(m, bt.rival), 'yo');
  }
  bt.yo = principal; bt.ps.y = principal.ps;
  if (bt.rival.ps <= 0 || bt.turno % 2) return;
  await decir(`¡${nombreBatalla(bt.rival)} soltó un RUGIDO que sacude a todo tu equipo!`, { auto: 45 });
  bt.parp.y = 12;
  for (const m of S.equipo) {
    if (m.ps <= 0) continue;
    m.ps = Math.max(0, m.ps - Math.ceil(m.psMax * 0.12));
    if (m === principal) await animarPS(m);
    if (m.ps <= 0 && m !== principal) await decir(`¡${nombreDe(m)} se quedó sin energía!`, { auto: 40 });
  }
}
function elegirMovRival() {
  const r = bt.rival, op = r.movs.filter(m => m.pp > 0);
  if (!op.length) return { id: 'forcejeo', pp: 1 };
  if (bt.tipo === 'salvaje' || Math.random() < 0.3) return op[Math.floor(Math.random() * op.length)];
  let mejor = op[0], val = -1;
  for (const m of op) {
    const M = MOVS[m.id];
    const v = M.pot ? M.pot * eficacia(M.tipo, tiposDe(bt.yo)) * (tiposDe(r).includes(M.tipo) ? 1.5 : 1) : 20;
    if (v > val) { val = v; mejor = m; }
  }
  return mejor;
}

async function animarPS(m) {
  const lado = m === bt.yo ? 'y' : 'r';
  const paso = Math.max(0.25, m.psMax / 48);
  while (Math.abs(bt.ps[lado] - m.ps) > 0.01) {
    const d = m.ps - bt.ps[lado];
    bt.ps[lado] += Math.sign(d) * Math.min(Math.abs(d), paso);
    await esperar(1);
  }
  bt.ps[lado] = m.ps;
}
async function ejecutarMov(at, de, slot, quien) {
  const M = MOVS[slot.id];
  if (slot.id !== 'forcejeo') slot.pp--;
  await decir(`¡${nombreBatalla(at)} usó ${M.nombre.toUpperCase()}!`, { auto: 34 });
  const dir = quien === 'yo' ? 1 : -1;
  for (let i = 0; i < 6; i++) {
    const v = [3, 6, 9, 9, 5, 2][i] * dir;
    if (quien === 'yo') bt.yDX = v; else bt.rDX = v;
    await esperar(1);
  }
  bt.yDX = 0; bt.rDX = 0;
  if (!(M.lluviaSegura && bt.lluvia > 0) && !(M.nieveSegura && bt.nieve > 0) && azar() * 100 >= M.prec) { await decir('¡Pero falló!', { auto: 40 }); return; }
  if (M.pot && tieneEf(habDe(de), 'maestroFuego') && ['PLANTA', 'ACERO', 'BICHO', 'HIELO'].includes(M.tipo)) {
    await anunciarHab(de);
    await decir(`¡El escudo de fuego frenó el ataque de ${nombreTipo(M.tipo)}!`, { auto: 50 });
    return;
  }
  const ladoDe = quien === 'yo' ? 'r' : 'y';
  if (M.pot) {
    const hd = habDe(de);
    if (tieneEf(hd, 'absorbeFuego') && M.tipo === 'FUEGO') {
      await anunciarHab(de);
      if (de.ps < de.psMax) { de.ps = Math.min(de.psMax, de.ps + Math.ceil(de.psMax / 4)); await animarPS(de); }
      await decir(`¡El fuego no lastima a ${nombreBatalla(de)}, lo cura!`, { auto: 50 });
      return;
    }
    if (tieneEf(hd, 'intangible') && M.tipo === 'TIERRA') {
      await anunciarHab(de);
      await decir(`¡${nombreBatalla(de)} flota y el ataque no lo toca!`, { auto: 45 });
      return;
    }
    // ANTIBALAS (Ombuastión): no le hacen nada los ataques que tiran algo (bolas, bombas, semillas, piedras, burbujas)
    if (tieneEf(hd, 'antibalas') && M.pot && /bomba|bola|semill|piedra|pedrada|burbuj|granizo|disparo|dardo|gema|bala/i.test(M.nombre + ' ' + slot.id)) {
      await anunciarHab(de);
      await decir(`¡${nombreBatalla(de)} es ANTIBALAS! El ataque rebotó y no le hizo nada.`, { auto: 50 });
      return;
    }
    if (tieneEf(hd, 'toxicoAbsorbente') && M.tipo === 'ELECTRICO') {
      await anunciarHab(de);
      await decir(`¡El veneno que cubre a ${nombreBatalla(de)} NEUTRALIZÓ la electricidad!`, { auto: 50 });
      return;
    }
    if (tieneEf(hd, 'electromotor') && M.tipo === 'ELECTRICO') {
      await anunciarHab(de);
      await decir(`¡${nombreBatalla(de)} absorbió la electricidad!`, { auto: 40 });
      await cambiarEtapa(de, 'vel', 1);
      return;
    }
    if (tieneEf(hd, 'terruno') && M.tipo === 'TIERRA') {
      await anunciarHab(de);
      if (de.ps < de.psMax) { de.ps = Math.min(de.psMax, de.ps + Math.ceil(de.psMax / 4)); await animarPS(de); }
      await decir(`¡${nombreBatalla(de)} absorbió el barro y se curó!`, { auto: 50 });
      return;
    }
    if (tieneEf(hd, 'colector') && M.tipo === 'AGUA') {
      await anunciarHab(de);
      await decir(`¡${nombreBatalla(de)} absorbió el agua!`, { auto: 40 });
      await cambiarEtapa(de, 'atk', 1, true);
      return;
    }
    const r = calcularDanio(at, de, M);
    if (r.ef === 0) { await decir(`No afecta a ${nombreBatalla(de)}...`, { auto: 50 }); return; }
    bt.parp[ladoDe] = 16;
    await esperar(16);
    const lleno = de.ps === de.psMax;
    let aguanto = false;
    if (tieneEf(hd, 'robustez') && lleno && r.danio >= de.ps) { r.danio = de.ps - 1; aguanto = true; }
    de.ps = Math.max(0, de.ps - r.danio);
    de.et.golpeado = true;
    await animarPS(de);
    if (aguanto) { await anunciarHab(de); await decir(`¡${nombreBatalla(de)} aguantó el golpe!`, { auto: 40 }); }
    if (r.critico) await decir('¡Golpe crítico!', { auto: 40 });
    if (r.ef > 1) await decir('¡Es muy eficaz!', { auto: 40 });
    else if (r.ef < 1) await decir('No es muy eficaz...', { auto: 40 });
    if (tieneEf(hd, 'maestroFuego') && r.danio > 0) await decir('¡Maestro de Fuego! El escudo de llamas achicó el golpe.', { auto: 40 });
    await despuesDelGolpe(at, de, M, r.danio);
    if (slot.id === 'forcejeo' && !tieneEf(habDe(at), 'cabezaRoca')) {
      at.ps = Math.max(0, at.ps - Math.max(1, Math.floor(at.psMax / 4)));
      await animarPS(at);
      await decir(`¡${nombreBatalla(at)} también se lastimó!`, { auto: 40 });
    }
    return;
  }
  if (M.ef === 'cura') {
    if (at.ps >= at.psMax) { await decir(`¡${nombreBatalla(at)} ya tiene toda su energía!`, { auto: 50 }); return; }
    at.ps = Math.min(at.psMax, at.ps + Math.ceil(at.psMax / 2));
    await animarPS(at);
    await decir(`¡${nombreBatalla(at)} se tomó unos mates y recuperó energía!`, { auto: 50 });
    return;
  }
  const [stat, signo] = [M.ef.slice(0, 3), M.ef[3]];
  let objetivo = signo === '+' ? at : de;
  if (signo === '-' && tieneEf(habDe(de), 'espejo') && !tieneEf(habDe(at), 'espejo')) {
    await anunciarHab(de);
    await decir(`¡${nombreBatalla(de)} se lo devolvió!`, { auto: 40 });
    objetivo = at;
  }
  if (signo === '-' && ['cuerpoPuro', 'animaGlacial', 'toxicoAbsorbente'].some(e => tieneEf(habDe(objetivo), e))) {
    await anunciarHab(objetivo);
    await decir(`¡A ${nombreBatalla(objetivo)} no le pueden bajar nada!`, { auto: 50 });
    return;
  }
  const nombreStat = stat === 'atk' ? 'ATAQUE' : 'DEFENSA';
  const cuanto = M.ef.length > 4 ? 2 : 1;
  const nuevo = Math.max(-6, Math.min(6, objetivo.et[stat] + (signo === '+' ? cuanto : -cuanto)));
  if (nuevo === objetivo.et[stat]) { await decir(`¡${nombreStat} de ${nombreBatalla(objetivo)} no puede cambiar más!`, { auto: 50 }); return; }
  if (nuevo < -6 || nuevo > 6) { await decir(`¡${nombreStat} de ${nombreBatalla(objetivo)} no puede cambiar más!`, { auto: 50 }); return; }
  objetivo.et[stat] = nuevo;
  bt.parp[objetivo === bt.yo ? 'y' : 'r'] = 10;
  await esperar(10);
  await decir(`¡${signo === '+' ? 'Subió' : 'Bajó'}${cuanto > 1 ? ' mucho' : ''} ${stat === 'atk' ? 'el' : 'la'} ${nombreStat} de ${nombreBatalla(objetivo)}!`, { auto: 50 });
  if (signo === '-' && objetivo !== at) await competitivo(objetivo);
}
async function competitivo(m) {
  if (!tieneEf(habDe(m), 'competitivo') || m.ps <= 0) return;
  await anunciarHab(m);
  await cambiarEtapa(m, 'atk', 2);
}

// ---------- Habilidades en batalla ----------
function velocidad(m) { return m.vel * mult(m.et.vel || 0); }
function prioridad(m, slot) {
  const M = MOVS[slot.id];
  let p = M.prio || 0;
  if (tieneEf(habDe(m), 'alas') && M.tipo === 'VOLADOR' && m.ps === m.psMax) p += 1;
  return p;
}
async function anunciarHab(m) {
  bt.parp[m === bt.yo ? 'y' : 'r'] = 8;
  const nombre = m._anuncio || habDe(m).nombre; delete m._anuncio;
  await decir(`¡${nombre} de ${nombreBatalla(m)}!`, { auto: 40 });
}
async function cambiarEtapa(m, stat, n, callado) {
  const nombres = { atk: 'ATAQUE', def: 'DEFENSA', vel: 'VELOCIDAD' };
  const nuevo = Math.max(-6, Math.min(6, (m.et[stat] || 0) + n));
  if (nuevo === (m.et[stat] || 0)) return;
  m.et[stat] = nuevo;
  await decir(`¡${n > 0 ? 'Subió' : 'Bajó'}${Math.abs(n) > 1 ? ' mucho' : ''} ${stat === 'atk' ? 'el' : 'la'} ${nombres[stat]} de ${nombreBatalla(m)}!`, { auto: 45 });
}
async function alEntrar(m) {
  if (!bt || m.et.entro) return;
  m.et.entro = true;
  const h = habDe(m), otro = m === bt.yo ? bt.rival : bt.yo;
  const lado = m === bt.yo ? 'y' : 'r';
  if (bt.escudo && bt.escudo[lado]) {
    bt.escudo[lado] = false;
    await decir(`¡El escudo de hielo protege a ${nombreBatalla(m)}!`, { auto: 45 });
    await cambiarEtapa(m, 'def', 2);
  }
  if (tieneEf(h, 'intimidacion')) {
    if (!otro || otro.ps <= 0) { m.et.entro = false; return; } // se activa cuando haya rival
    await anunciarHab(m);
    if (['cuerpoPuro', 'animaGlacial', 'toxicoAbsorbente'].some(e => tieneEf(habDe(otro), e))) await decir(`¡Pero a ${nombreBatalla(otro)} no le pueden bajar nada!`, { auto: 45 });
    else { await cambiarEtapa(otro, 'atk', -1); await competitivo(otro); }
  } else if (tieneEf(h, 'espadaRuinosa')) {
    if (!otro || otro.ps <= 0) { m.et.entro = false; return; }
    await anunciarHab(m);
    if (['cuerpoPuro', 'animaGlacial', 'toxicoAbsorbente'].some(e => tieneEf(habDe(otro), e))) await decir(`¡Pero a ${nombreBatalla(otro)} no le pueden bajar nada!`, { auto: 45 });
    else { await cambiarEtapa(otro, 'def', -1); await competitivo(otro); }
  } else if (tieneEf(h, 'veloz')) {
    await anunciarHab(m); await cambiarEtapa(m, 'vel', 1);
  } else if (tieneEf(h, 'nevada')) {
    await anunciarHab(m);
    bt.nieve = 5; bt.sol = 0; bt.lluvia = 0;
    await decir('¡Se desató una tormenta de nieve! Los ataques de Hielo pegan más.', { auto: 60 });
  } else if (tieneEf(h, 'acoso')) {
    if (!otro || otro.ps <= 0) { m.et.entro = false; return; }
    await anunciarHab(m);
    if (['cuerpoPuro', 'animaGlacial', 'toxicoAbsorbente'].some(e => tieneEf(habDe(otro), e))) await decir(`¡Pero a ${nombreBatalla(otro)} no le pueden bajar nada!`, { auto: 45 });
    else { await cambiarEtapa(otro, 'vel', -1); await competitivo(otro); }
  } else if (tieneEf(h, 'llovizna')) {
    await anunciarHab(m);
    bt.lluvia = 5; bt.sol = 0; bt.nieve = 0;
    await decir('¡Se largó a llover! Los ataques de Agua pegan más y los de Fuego, menos.', { auto: 60 });
  } else if (tieneEf(h, 'sequia')) {
    await anunciarHab(m);
    bt.sol = 5; bt.lluvia = 0; bt.nieve = 0;
    await decir('¡Salió un sol que raja la tierra! Los ataques de Fuego, Tierra y Roca pegan más.', { auto: 60 });
  } else if (tieneEf(h, 'humedal')) {
    await anunciarHab(m);
    await decir('¡El campo se inundó como un humedal del Litoral!', { auto: 50 });
  }
}
async function despuesDelGolpe(at, de, M, danio = 0) {
  const ha = habDe(at), hd = habDe(de);
  if (tieneEf(ha, 'colectorAlmas') && at.ps > 0 && at.ps < at.psMax && danio > 0) {
    await anunciarHab(at);
    at.ps = Math.min(at.psMax, at.ps + Math.max(1, Math.floor(danio / 4)));
    await animarPS(at);
    await decir(`${nombreBatalla(at)} le robó energía a ${nombreBatalla(de)}.`, { auto: 40 });
  }
  if (tieneEf(ha, 'maldicion') && M.muerde && at.ps > 0 && at.ps < at.psMax && danio > 0) {
    await anunciarHab(at);
    at.ps = Math.min(at.psMax, at.ps + Math.max(1, Math.floor(danio / 2)));
    await animarPS(at);
    await decir(`${nombreBatalla(at)} recuperó PS con su mordida.`, { auto: 40 });
  }
  // TOQUE TÓXICO / TÓXICO ABSORBENTE (habilidad oculta de la familia de Ajolodo, idea de Felipe):
  // al pegar, 30% de envenenar. El envenenado pierde 1/10 de su vida al final de cada turno.
  if (['toqueToxico', 'toxicoAbsorbente'].some(e => tieneEf(ha, e)) && de.ps > 0 && danio > 0 && de.et && !de.et.veneno && Math.random() < 0.3) {
    const inmune = tiposDe(de).includes('VENENO') || tiposDe(de).includes('ACERO') || tieneEf(habDe(de), 'toxicoAbsorbente') || tieneEf(habDe(de), 'curaNatural');
    if (!inmune) { await anunciarHab(at); de.et.veneno = true; await decir(`¡${nombreBatalla(de)} quedó ENVENENADO!`, { auto: 45 }); }
  }
  if (de.ps > 0) {
    if (tieneEf(hd, 'hervor') && (M.tipo === 'FUEGO' || M.tipo === 'AGUA')) { await anunciarHab(de); await cambiarEtapa(de, 'vel', 2); }
    if (tieneEf(hd, 'cobardia') && ['BICHO', 'FANTASMA', 'SINIESTRO'].includes(M.tipo)) { await anunciarHab(de); await cambiarEtapa(de, 'vel', 1); }
    if (tieneEf(hd, 'impasible') && danio > 0 && eficacia(M.tipo, tiposDe(de)) > 1) { await anunciarHab(de); await cambiarEtapa(de, 'vel', 1); }
  }
  if (tieneEf(hd, 'geotermica') && de.ps <= 0 && at.ps > 0) {
    await anunciarHab(de);
    await decir(`¡${nombreBatalla(de)} explotó como un volcán y se llevó a ${nombreBatalla(at)}!`, { auto: 50 });
    at.ps = 0;
    await animarPS(at);
  }
  if (tieneEf(ha, 'sobrecarga') && at.ps > 0 && danio > 0) {
    await anunciarHab(at);
    at.ps = Math.max(0, at.ps - Math.max(1, Math.floor(at.psMax / 10)));
    await animarPS(at);
  }
  if (tieneEf(hd, 'justiciero') && de.ps > 0 && M.tipo === 'SINIESTRO') { await anunciarHab(de); await cambiarEtapa(de, 'atk', 1); }
  if (tieneEf(ha, 'furiaAndina') && de.ps <= 0 && at.ps > 0) { await anunciarHab(at); await cambiarEtapa(at, 'atk', 1); }
  if (tieneEf(ha, 'obrero') && at.ps > 0 && (at.et.atk || 0) < 6) { await anunciarHab(at); await cambiarEtapa(at, 'atk', 1); }
  if (tieneEf(hd, 'contacto') && at.ps > 0) {
    await anunciarHab(de);
    at.ps = Math.max(0, at.ps - Math.max(1, Math.floor(at.psMax / 8)));
    await animarPS(at);
    await decir(`¡${nombreBatalla(at)} se lastimó al tocarlo!`, { auto: 40 });
  }
}
async function finDeTurno() {
  if (bt.sol > 0 && --bt.sol === 0) await decir('El sol fuerte se fue.', { auto: 45 });
  if (bt.lluvia > 0 && --bt.lluvia === 0) await decir('Dejó de llover.', { auto: 45 });
  if (bt.nieve > 0 && --bt.nieve === 0) await decir('Paró de nevar.', { auto: 45 });
  for (const m of [bt.yo, bt.rival]) {
    if (!m || m.ps <= 0) continue;
    const h = habDe(m);
    if (tieneEf(h, 'regenera') && m.ps < m.psMax) {
      m.ps = Math.min(m.psMax, m.ps + Math.max(1, Math.floor(m.psMax / 16)));
      await animarPS(m);
      await decir(`¡${h.nombre}! ${nombreBatalla(m)} recuperó un poco de PS.`, { auto: 40 });
    }
    if (tieneEf(h, 'poderSolar') && bt.sol > 0) {
      m.ps = Math.max(0, m.ps - Math.max(1, Math.floor(m.psMax / 8)));
      await animarPS(m);
      await decir(`¡${h.nombre}! El sol fuerte le quita PS a ${nombreBatalla(m)}.`, { auto: 45 });
    }
    if (tieneEf(h, 'animaGlacial') && (m.et.vel || 0) < 6) { await anunciarHab(m); await cambiarEtapa(m, 'vel', 1); }
    if (tieneEf(h, 'impulso') && (m.et.vel || 0) < 6) { await anunciarHab(m); await cambiarEtapa(m, 'vel', 1); }
    if (tieneEf(h, 'corona')) await coronaInfinito(m);
    if (m.et && m.et.veneno && m.ps > 0) {
      m.ps = Math.max(0, m.ps - Math.max(1, Math.ceil(m.psMax / 10)));
      await animarPS(m);
      await decir(`¡El VENENO lastima a ${nombreBatalla(m)}!`, { auto: 40 });
    }
  }
}
// REGIOHM (diapositiva 197): al final de cada turno las seis gemas giran, cambia su segundo tipo y borra las mejoras del rival
const CORONA_TIPOS = ['NORMAL', 'HADA', 'SINIESTRO', 'LUCHA', 'ELECTRICO', 'ACERO'];
async function coronaInfinito(m) {
  const actual = tiposDe(m)[1];
  const opciones = CORONA_TIPOS.filter(t => t !== actual);
  const nuevo = opciones[Math.floor(Math.random() * opciones.length)];
  m.et.tipos = ['PSIQUICO', nuevo];
  await anunciarHab(m);
  await decir(`¡Las seis gemas giraron! ${nombreBatalla(m)} ahora es de tipo PSÍQUICO/${nombreTipo(nuevo)}.`, { auto: 60 });
  const otro = m === bt.yo ? bt.rival : bt.yo;
  if (otro && otro.ps > 0 && otro.et && ['atk', 'def', 'vel'].some(k => (otro.et[k] || 0) > 0)) {
    for (const k of ['atk', 'def', 'vel']) if ((otro.et[k] || 0) > 0) otro.et[k] = 0;
    await decir(`¡El destello del portal le borró las mejoras a ${nombreBatalla(otro)}!`, { auto: 50 });
  }
}

// EXP (pedido de Felipe): con unas DOS batallas contra entrenadores la criatura sube un nivel;
// las de salvajes dan poco más que antes. Las demás criaturas del equipo que no estén
// debilitadas se llevan la mitad (como un Repartir EXP).
const MULT_EXP_ENTRENADOR = 1.6, MULT_EXP_SALVAJE = 1.2, REPARTO_EXP = 0.5;
async function darExp() {
  const f = bt.rival, m = bt.yo;
  if (!m || m.ps <= 0) return;
  const gana = Math.max(1, Math.floor(ESPECIES[f.id].exp * f.nivel / 7 * (bt.tipo === 'entrenador' ? 1.5 * MULT_EXP_ENTRENADOR : MULT_EXP_SALVAJE)));
  await sumarExp(m, gana, true);
  const resto = (S.equipo || []).filter(c => c !== m && c.ps > 0 && c.nivel < 100);
  if (resto.length) {
    const parte = Math.max(1, Math.floor(gana * REPARTO_EXP));
    await decir(`¡El resto del equipo ganó ${parte} puntos de experiencia!`);
    for (const c of resto) await sumarExp(c, parte, false);
  }
}
async function sumarExp(m, gana, peleando) {
  m.exp += gana;
  if (peleando) await decir(`¡${nombreDe(m)} ganó ${gana} puntos de experiencia!`);
  while (m.nivel < 100 && m.exp >= expPara(m.nivel + 1)) {
    const antes = m.psMax;
    m.nivel++;
    recalcular(m);
    m.ps += m.psMax - antes;
    if (peleando) bt.ps.y = m.ps;
    await decir(`¡${nombreDe(m)} subió al nivel ${m.nivel}!`);
    for (const [nv, mv] of ESPECIES[m.id].movs) if (nv === m.nivel) await aprender(m, mv);
  }
}
async function aprender(m, mvId) {
  if (m.movs.some(x => x.id === mvId)) return;
  const M = MOVS[mvId];
  if (m.movs.length < 4) {
    m.movs.push({ id: mvId, pp: M.pp });
    await decir(`¡${nombreDe(m)} aprendió ${M.nombre.toUpperCase()}!`);
    return;
  }
  await decir(`${nombreDe(m)} quiere aprender ${M.nombre.toUpperCase()}, pero ya sabe 4 movimientos.`);
  const si = await siNo(`¿Querés que olvide uno para aprender ${M.nombre.toUpperCase()}?`);
  if (!si) { await decir(`${nombreDe(m)} no aprendió ${M.nombre.toUpperCase()}.`); return; }
  await decir('¿Cuál tiene que olvidar?', { mantener: true });
  const idx = await elegir([...m.movs.map(x => MOVS[x.id].nombre.toUpperCase()), 'NINGUNO'], { x: 130, y: 20, w: 106 });
  ui.dialogo = null;
  if (idx < 0 || idx === 4) { await decir(`${nombreDe(m)} no aprendió ${M.nombre.toUpperCase()}.`); return; }
  const viejo = MOVS[m.movs[idx].id].nombre.toUpperCase();
  m.movs[idx] = { id: mvId, pp: M.pp };
  await decir(`1, 2 y... ¡Listo! ${nombreDe(m)} olvidó ${viejo} y aprendió ${M.nombre.toUpperCase()}!`);
}

async function usarObjetoBatalla(obj) {
  const o = OBJETOS[obj];
  if (obj === 'boleadora') {
    if (bt.tipo === 'entrenador') { await decir('¡No se puede atrapar la criatura de otro entrenador!'); return 'nada'; }
    if (bt.sinCaptura) { await decir('¡REGIOHM es demasiado poderoso! La BOLEADORA ni lo toca. Hay que ganarle.'); return 'nada'; }
    return await tirarBoleadora();
  }
  if (o.cura) {
    const m = bt.yo;
    if (m.ps >= m.psMax) { await decir('No va a tener ningún efecto.'); return 'nada'; }
    S.bolsa[obj]--;
    await decir(`¡Felipe usó un ${o.nombre}!`, { auto: 30 });
    m.ps = Math.min(m.psMax, m.ps + o.cura);
    await animarPS(m);
    await decir(`${nombreDe(m)} recuperó energía.`, { auto: 40 });
    return 'usado';
  }
  await decir('¡Ahora no se puede usar eso!');
  return 'nada';
}
async function tirarBoleadora() {
  S.bolsa.boleadora--;
  await decir('¡Felipe revoleó una BOLEADORA!', { auto: 24 });
  const f = bt.rival;
  const a = ((3 * f.psMax - 2 * f.ps) * ESPECIES[f.id].captura) / (3 * f.psMax);
  const p = Math.min(1, a / 255 + (f.nivel < 6 ? 0.1 : 0));
  const q = Math.pow(p, 1 / 3);
  let sacudidas = 0;
  while (sacudidas < 3 && Math.random() < q) sacudidas++;
  const exito = sacudidas === 3;
  // vuelo
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    bt.bola = { x: 50 + (176 - 50) * t, y: 100 - Math.sin(t * Math.PI) * 70 + (34 - 100) * t, ang: i * 0.6 };
    await esperar(1);
  }
  bt.blanco.r = 8; await esperar(6);
  bt.rivalVis = false; bt.blanco.r = 0;
  for (let i = 0; i <= 10; i++) { bt.bola = { x: 176, y: 34 + i * 2.4, ang: 0 }; await esperar(1); }
  for (let s = 0; s < Math.min(sacudidas, 3); s++) {
    await esperar(16);
    for (let i = 0; i < 12; i++) { bt.bola.ang = Math.sin(i / 12 * Math.PI * 2) * 0.5; await esperar(1); }
    bt.bola.ang = 0;
  }
  await esperar(14);
  if (exito) {
    await decir(`¡Bien! ¡Atrapaste a ${nombreDe(f)}!`);
    delete f.et;
    if (await siNo(`¿Querés ponerle un apodo a ${nombreDe(f)}?`)) await ponerApodo(f, true);
    if (S.equipo.length < 6) S.equipo.push(f);
    else { S.caja.push(f); await decir(`${nombreDe(f)} fue enviado a la compu de la Profe Ceibo.`); }
    S.flags.atrapados = (S.flags.atrapados || 0) + 1;
    bt.bola = null;
    return 'atrapado';
  }
  bt.bola = null; bt.rivalVis = true; bt.blanco.r = 8;
  for (let i = 0; i < 8; i++) { bt.blanco.r = 8 - i; await esperar(1); }
  bt.blanco.r = 0;
  await decir(['¡Oh, no! ¡Se soltó!', '¡Uy! ¡Casi lo tenías!', '¡Noooo! ¡Por muy poquito!'][Math.min(sacudidas, 2)]);
  return 'fallo';
}

// ---------- Evolución ----------
async function revisarEvoluciones() {
  for (const m of S.equipo) {
    const evo = ESPECIES[m.id].evo;
    if (!evo || m.nivel < evo.nivel) continue;
    // Algunas evolucionan distinto si son hembra (Sparknight → Lumisprite); se sortea una sola vez
    if (evo.hembra && m.hembra === undefined) m.hembra = Math.random() < 0.5;
    await evolucionar(m, evo.hembra && m.hembra ? evo.hembra : evo.a);
  }
}
async function evolucionar(m, nuevoId) {
  const previa = S.escena;
  await fundido(1, 10);
  S.escena = 'evo';
  ui.evo = { de: m.id, a: nuevoId, fase: 0, shiny: m.shiny };
  await fundido(0, 10);
  await decir(`¿Qué? ¡${nombreDe(m)} está evolucionando!`);
  for (let i = 0; i < 150; i++) { ui.evo.fase = i; await esperar(1); }
  ui.evo.fase = 999;
  const viejo = nombreDe(m);
  const antes = m.psMax;
  m.id = nuevoId;
  recalcular(m);
  m.ps += m.psMax - antes;
  await decir(`¡Felicitaciones! ¡${viejo} evolucionó en ${ESPECIES[nuevoId].nombre.toUpperCase()}!`);
  await fundido(1, 10);
  ui.evo = null;
  S.escena = previa;
  await fundido(0, 10);
  guardar();
}
function dibujarEvo() {
  b.fillStyle = '#203040'; b.fillRect(0, 0, W, H);
  const e = ui.evo; if (!e) return;
  const f = e.fase;
  let id = e.de, blanco = false;
  if (f >= 999) id = e.a;
  else if (f > 30) { blanco = true; const per = Math.max(4, 24 - Math.floor(f / 7)); id = Math.floor(f / per) % 2 ? e.a : e.de; }
  const sp = spriteCriatura(id, false, e.shiny);
  b.drawImage(blanco ? silueta(sp) : sp, 88, 30, 64, 64);
}

// ---------- Dibujo de batalla ----------
function elipse(ctx, x, y, rx, ry, c1, c2) {
  ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
  ctx.fillStyle = c1; ctx.beginPath(); ctx.ellipse(x, y - 1, rx - 3, ry - 2, 0, 0, 7); ctx.fill();
}
// Animación de "respirar" en la batalla (0 a 2 píxeles)
function respiro(fase) { return Math.round((Math.sin(tick / 14 + fase) + 1)); }
function dibujarBatalla() {
  const g = b.createLinearGradient(0, 0, 0, 112);
  if (bt.sol > 0) { g.addColorStop(0, '#ffd890'); g.addColorStop(1, '#f0d890'); }
  else if (bt.lluvia > 0) { g.addColorStop(0, '#a8b8c8'); g.addColorStop(1, '#b8d0d8'); }
  else if (bt.nieve > 0) { g.addColorStop(0, '#e8f0f8'); g.addColorStop(1, '#d0e4f0'); }
  else { g.addColorStop(0, '#f8f0c8'); g.addColorStop(1, '#d8f0b0'); }
  b.fillStyle = g; b.fillRect(0, 0, W, H);
  b.fillStyle = '#c8e8a0'; b.fillRect(0, 60, W, 52);
  elipse(b, 176, 64, 48, 11, '#a0d080', '#70a858');
  elipse(b, 64, 112, 60, 13, '#a0d080', '#70a858');
  if (bt.entVis && bt.ent) b.drawImage(spriteChar(bt.ent.pal, 0, 0), 152 + (bt.entDX || 0), 8, 48, 48);
  if (bt.rival && bt.rivalVis && !(bt.parp.r > 0 && (bt.parp.r-- >> 1) % 2)) {
    const sp = spriteDe(bt.rival);
    b.save(); b.beginPath(); b.rect(0, 0, W, 66); b.clip();
    const rr = respiro(0); // respiran: se estiran un poquito para arriba y vuelven
    b.drawImage(bt.blanco.r > 0 ? silueta(sp) : sp, 144 + bt.rDX - rr / 2, 2 + bt.rDY - rr, 64 + rr, 64 + rr);
    b.restore();
  }
  if (bt.todos && bt.yoVis) { // el resto del equipo, chiquito, peleando al lado
    S.equipo.filter(m => m !== bt.yo).forEach((m, i) => {
      b.globalAlpha = m.ps > 0 ? 1 : 0.3;
      b.drawImage(spriteDe(m), 4 + i * 17, 33, 16, 16);
      b.globalAlpha = 1;
    });
  }
  if (bt.yo && bt.yoVis && !(bt.parp.y > 0 && (bt.parp.y-- >> 1) % 2)) {
    b.save(); b.beginPath(); b.rect(0, 0, W, 112); b.clip();
    const ry = respiro(2.2);
    b.drawImage(spriteDe(bt.yo, true), 30 + bt.yDX - ry / 2, 50 + bt.yDY - ry, 64 + ry, 64 + ry);
    b.restore();
  }
  if (bt.bola) {
    b.save(); b.translate(bt.bola.x, bt.bola.y); b.rotate(bt.bola.ang);
    b.drawImage(spriteBoleadora(), -8, -8); b.restore();
  }
}
function cajaInfo(m, x, y, w, h, mio) {
  caja(x, y, w, h, 'info');
  const nv = 'Nv' + m.nivel, nom = nombreDe(m);
  const tn = nom.length * 7 + nv.length * 7 + 18 <= w ? 7 : nom.length * 6 + nv.length * 6 + 16 <= w ? 6 : 5;
  txt(nom, x + 7, y + 6 + (7 - tn), { t: tn });
  txt(nv, x + w - 7, y + 6 + (7 - Math.max(tn, 6)), { t: Math.max(tn, 6), al: 'right' });
  const ps = mio ? bt.ps.y : bt.ps.r;
  const f = ps / m.psMax;
  txt('PS', x + 9, y + 17, { t: 6, c: '#e09000', sombra: null });
  barra(x + 25, y + 18, w - 34, f, colorPS(f));
  tiposChicos(tiposDe(m), x + 8, mio ? y + 34 : y + 25, w - 16);
  if (mio) {
    txt(`${Math.ceil(ps)}/${m.psMax}`, x + w - 8, y + 24, { t: 7, al: 'right' });
    const fe = (m.exp - expPara(m.nivel)) / (expPara(m.nivel + 1) - expPara(m.nivel));
    sc.fillStyle = '#404848'; sc.fillRect(x + 8, y + h - 6, w - 16, 3);
    sc.fillStyle = '#40a8f8'; sc.fillRect(x + 8, y + h - 6, Math.round((w - 16) * Math.max(0, Math.min(1, fe))), 3);
  }
}
function uiBatalla() {
  if (!bt) return;
  if (bt.rival && bt.rivalVis) cajaInfo(bt.rival, 8, 8, 108, 40, false);
  if (bt.yo && bt.yoVis) cajaInfo(bt.yo, 124, 62, 112, 50, true);
  caja(0, 112, W, 48, 'batalla');
  const mn = bt.menu;
  if (!mn || ui.dialogo || ui.equipo || ui.mochila) return;
  if (mn.modo === 'principal') {
    envolver(mn.texto, 98, 8).slice(0, 2).forEach((l, i) => txt(l, 11, 124 + i * 16, { c: '#ffffff', sombra: '#5a6a7a' }));
    caja(112, 112, 128, 48, 'normal');
    ['LUCHAR', 'MOCHILA', 'EQUIPO', 'HUIR'].forEach((o, i) => {
      const x = 128 + (i % 2) * 58, y = 124 + Math.floor(i / 2) * 16;
      txt(o, x, y, { t: 7 });
      if (i === bt.idxMenu) flecha(x - 9, y);
    });
  } else if (mn.modo === 'movs') {
    caja(0, 112, 160, 48, 'normal');
    caja(156, 112, 84, 48, 'normal');
    bt.yo.movs.forEach((mv, i) => {
      const x = 16 + (i % 2) * 72, y = 124 + Math.floor(i / 2) * 16;
      txt(MOVS[mv.id].nombre.toUpperCase(), x, y, { t: 7 });
      if (i === bt.idxMov) flecha(x - 9, y);
    });
    const sel = bt.yo.movs[bt.idxMov];
    if (sel) {
      const M = MOVS[sel.id];
      txt('PP', 166, 123, { t: 7 });
      txt(`${sel.pp}/${M.pp}`, 230, 123, { t: 7, al: 'right', c: sel.pp === 0 ? '#d03030' : '#383838' });
      insigniaTipo(M.tipo, 170, 138);
    }
  }
}
function dibujarVista() {
  const v = ui.vista;
  caja(80, 10, 80, 80, 'info');
  sc.fillStyle = '#d8e8f8'; sc.fillRect(86, 16, 68, 68);
  sc.drawImage(spriteCriatura(v.id), 88, 18, 64, 64);
}

// ================= BUCLE PRINCIPAL =================
function paso() {
  pressed = cola; cola = {};
  tick++;
  musicaTick();
  const ws = esperas; esperas = [];
  for (const w of ws) { if (--w.n <= 0) w.r(); else esperas.push(w); }
  if (S.escena === 'mundo' && !S.ocupado) pasoMundo();
}
function dibujar() {
  b.imageSmoothingEnabled = false;
  // Anomalías: color raro de la pantalla y temblores
  const fil = S.escena === 'mundo' && typeof filtroAnomalia === 'function' ? filtroAnomalia() : '';
  if (pantalla.style.filter !== fil) pantalla.style.filter = fil;
  const tem = ui.temblor ? `translateX(${ui.temblor}px)` : '';
  if (pantalla.style.transform !== tem) pantalla.style.transform = tem;
  if (S.escena === 'titulo') dibujarTitulo();
  else if (S.escena === 'intro') dibujarIntro();
  else if (S.escena === 'mundo') dibujarMundo();
  else if (S.escena === 'batalla' && bt) dibujarBatalla();
  else if (S.escena === 'evo') dibujarEvo();
  else { b.fillStyle = '#000'; b.fillRect(0, 0, W, H); }
  if (ui.flash) { b.fillStyle = '#ffffff'; b.fillRect(0, 0, W, H); }
  sc.setTransform(1, 0, 0, 1, 0, 0);
  sc.imageSmoothingEnabled = false;
  sc.drawImage(buf, 0, 0, pantalla.width, pantalla.height);
  sc.setTransform(ESC, 0, 0, ESC, 0, 0);
  sc.imageSmoothingEnabled = false;
  if (S.escena === 'titulo') uiTitulo();
  if (S.escena === 'batalla') uiBatalla();
  if (S.escena === 'mundo' && ui.raid) textosRaid();
  if (S.escena === 'mundo' && S.cartelLugar && S.cartelLugar.t > 0 && !ui.dialogo) {
    caja(4, 4, 150, 22, 'normal');
    txt(S.cartelLugar.txt, 12, 11, { t: 7 });
  }
  if (ui.vista) dibujarVista();
  if (ui.equipo) dibujarEquipo();
  if (ui.compu) dibujarCompu();
  if (ui.lista) dibujarLista();
  if (ui.mochila) dibujarMochila();
  if (ui.mapaArg) dibujarMapaArg();
  if (ui.teclado) dibujarTeclado();
  if (ui.selector) dibujarSelector();
  dibujarEstadoMP();
  if (ui.tienda) dibujarTienda();
  dibujarDialogo();
  dibujarMenu();
  if (ui.destello > 0) { sc.fillStyle = `rgba(255,255,255,${ui.destello})`; sc.fillRect(0, 0, W, H); }
  if (ui.fundido > 0) { sc.fillStyle = `rgba(0,0,0,${ui.fundido})`; sc.fillRect(0, 0, W, H); }
}
let ultimo = performance.now(), acumulado = 0;
function bucle(ahora) {
  acumulado += ahora - ultimo; ultimo = ahora;
  if (acumulado > 100) acumulado = 16.7;
  if (acumulado >= 16.6) { acumulado -= 16.6; paso(); }
  dibujar();
  requestAnimationFrame(bucle);
}

// Partida que llega desde la dirección vieja (criaturascriollas.netlify.app) en el enlace: #partida=...
function importarPartidaDelEnlace() {
  try {
    const h = location.hash;
    if (!h.startsWith('#partida=')) return;
    const datos = decodeURIComponent(h.slice(9));
    JSON.parse(datos); // que sea una partida de verdad
    if (!hayPartida()) localStorage.setItem(CLAVE_GUARDADO, datos);
    history.replaceState(null, '', location.pathname + location.search);
  } catch (e) { /* enlace roto: se ignora */ }
}
async function iniciar() {
  importarPartidaDelEnlace();
  ajustar();
  TILES = crearTiles();
  ui.fundido = 1;
  try {
    if (document.fonts && document.fonts.load) {
      await Promise.race([document.fonts.load('8px "Press Start 2P"'), new Promise(r => setTimeout(r, 2500))]);
    }
  } catch (e) { /* sin fuente: usa monospace */ }
  await precargarDibujos();
  ajustar();
  requestAnimationFrame(bucle);
  pantallaTitulo();
}
iniciar();


// =====================================================================================
// ===== PELEA EN EL MAPA CONTRA REGIOHM (pedido de Poly, 24/11/2026) =====
// =====================================================================================
// No es una batalla por turnos: Felipe camina por la cumbre con TODO su equipo atrás (como si los sacara a pasear).
// Con A atacan TODAS juntas (cada una con su mejor movimiento) si REGIOHM está cerca.
// REGIOHM se mueve y lanza ataques: las baldosas se ponen ROJAS un ratito antes del golpe. ¡Hay que esquivarlas!
const RAID = { alcance: 4, espera: 80, jefeCada: 105, aviso: 50, golpe: 0.2, vidaJefe: 14 };
function danioRaid(m, de, M) {
  const base = ((2 * m.nivel / 5 + 2) * M.pot * (m.atk / Math.max(1, de.def)) / 50 + 2);
  const stab = tiposDe(m).includes(M.tipo) ? 1.5 : 1;
  return Math.max(1, Math.floor(base * stab * eficacia(M.tipo, tiposDe(de)) * (0.85 + Math.random() * 0.15)));
}
async function peleaMapaRegiohm(npc) {
  const jefe = crearCriatura('regiohm', 90);
  jefe.psMax *= RAID.vidaJefe; jefe.ps = jefe.psMax;
  const inicio = { x: npc.x, y: npc.y };
  const R = ui.raid = { jefe, npc, P: [], golpes: [], rayos: [], textos: [], cd: 0, tJefe: 60, tMover: 40, patron: 0, msg: '', msgT: 0 };
  const vivos = () => S.equipo.filter(m => m.ps > 0);
  for (let i = 0; i < 8; i++) R.P.push({ x: S.x, y: S.y });
  const decirRapido = (t, n = 90) => { R.msg = t; R.msgT = n; };
  const posDe = i => R.P[Math.min(i + 1, R.P.length - 1)]; // la criatura i camina atrás de Felipe
  decirRapido('Flechas: caminar · A: ¡TODO EL EQUIPO ATACA! · Esquivá lo ROJO', 220);
  let resultado = null;
  while (!resultado) {
    await esperar(1);
    // --- Felipe camina y el equipo lo sigue ---
    if (!S.moviendo) {
      const d = held.up ? 1 : held.down ? 0 : held.left ? 2 : held.right ? 3 : -1;
      if (d >= 0) {
        S.dir = d;
        const nx = S.x + DX[d], ny = S.y + DY[d];
        if (transitable(nx, ny) && !(nx === npc.x && ny === npc.y)) { S.moviendo = true; S.prog = 0; }
      }
    } else {
      S.prog += held.b ? 4 : 2;
      if (S.prog >= 16) {
        S.prog = 0; S.moviendo = false; S.pasoAlt ^= 1;
        S.x += DX[S.dir]; S.y += DY[S.dir];
        R.P.unshift({ x: S.x, y: S.y }); R.P.length = 8;
      }
    }
    // --- El equipo ataca ---
    if (R.cd > 0) R.cd--;
    if (pressed.a && R.cd === 0) {
      R.cd = RAID.espera;
      let total = 0, lejos = 0;
      vivos().forEach((m, i) => {
        const p = i === 0 ? { x: S.x, y: S.y } : posDe(i - 1);
        if (Math.abs(p.x - npc.x) + Math.abs(p.y - npc.y) > RAID.alcance) { lejos++; return; }
        const slot = mejorMovContra(m, jefe), M = MOVS[slot.id];
        const d = danioRaid(m, jefe, M);
        total += d;
        R.rayos.push({ x0: p.x, y0: p.y, t: 14 + i * 3, color: COLOR_TIPO[M.tipo] || '#ffffff', nombre: M.nombre });
      });
      if (total) {
        jefe.ps = Math.max(0, jefe.ps - total);
        R.textos.push({ x: npc.x, y: npc.y - 2, t: 50, txt: '-' + total });
        decirRapido(lejos ? `¡Atacaron juntas! (${lejos} quedaron muy lejos)` : '¡TODO EL EQUIPO ATACÓ JUNTO!', 70);
      } else decirRapido('¡Están muy lejos! Acercate a REGIOHM.', 70);
      if (jefe.ps <= 0) { resultado = 'gana'; break; }
    }
    // --- REGIOHM se acerca ---
    if (--R.tMover <= 0) {
      R.tMover = 70;
      const opciones = [0, 1, 2, 3].map(d => ({ x: npc.x + DX[d], y: npc.y + DY[d] }))
        .filter(p => transitable(p.x, p.y) && !(p.x === S.x && p.y === S.y) && Math.abs(p.x - inicio.x) + Math.abs(p.y - inicio.y) <= 5);
      opciones.sort((a, c) => (Math.abs(a.x - S.x) + Math.abs(a.y - S.y)) - (Math.abs(c.x - S.x) + Math.abs(c.y - S.y)));
      const lejos = Math.abs(npc.x - S.x) + Math.abs(npc.y - S.y);
      if (opciones.length && lejos > 2) { npc.x = opciones[0].x; npc.y = opciones[0].y; }
    }
    // --- REGIOHM ataca: primero avisa (rojo) y después pega ---
    if (--R.tJefe <= 0) {
      R.tJefe = RAID.jefeCada;
      const zona = [];
      const p = R.patron++ % 3;
      const g = mapa().grilla;
      if (p === 0) { // ONDA: un anillo alrededor de REGIOHM
        for (let y = npc.y - 3; y <= npc.y + 3; y++) for (let x = npc.x - 3; x <= npc.x + 3; x++) { const dd = Math.abs(x - npc.x) + Math.abs(y - npc.y); if (dd >= 1 && dd <= 3) zona.push([x, y]); }
        decirRapido('¡REGIOHM junta energía a su alrededor!', 50);
      } else if (p === 1) { // RAYO: toda la fila y la columna de Felipe
        for (let x = 0; x < g[0].length; x++) zona.push([x, S.y]);
        for (let y = 0; y < g.length; y++) zona.push([S.x, y]);
        decirRapido('¡REGIOHM apunta un RAYO de las seis gemas!', 50);
      } else { // LLUVIA DE GEMAS: piedras que caen cerca del equipo
        for (let i = 0; i < 10; i++) { const c = R.P[Math.floor(Math.random() * R.P.length)]; zona.push([c.x + Math.floor(Math.random() * 5) - 2, c.y + Math.floor(Math.random() * 5) - 2]); }
        decirRapido('¡Caen GEMAS del cielo!', 50);
      }
      R.golpes.push({ zona: zona.filter(([x, y]) => g[y] && g[y][x] && g[y][x] !== 'N'), t: RAID.aviso });
    }
    for (const gl of R.golpes) {
      if (--gl.t !== 0) continue;
      gl.impacto = 10;
      const dentro = (x, y) => gl.zona.some(([a, c]) => a === x && c === y);
      const lastimados = [];
      vivos().forEach((m, i) => {
        const p = i === 0 ? { x: S.x, y: S.y } : posDe(i - 1);
        if (!dentro(p.x, p.y)) return;
        m.ps = Math.max(0, m.ps - Math.ceil(m.psMax * RAID.golpe));
        lastimados.push(m.ps > 0 ? nombreDe(m) : nombreDe(m) + ' (¡sin energía!)');
      });
      if (lastimados.length) { decirRapido('¡Le pegó a ' + lastimados.join(', ') + '!', 80); ui.flash = 1; setTimeout(() => { ui.flash = 0; }, 60); }
      if (!vivos().length) resultado = 'pierde';
    }
    R.golpes = R.golpes.filter(gl => gl.t > 0 || (gl.impacto && gl.impacto-- > 0));
    R.rayos = R.rayos.filter(r => --r.t > 0);
    R.textos = R.textos.filter(t => --t.t > 0);
    if (R.msgT > 0) R.msgT--;
  }
  S.moviendo = false; S.prog = 0;
  ui.raid = null;
  if (resultado === 'pierde') {
    await decir('¡A tus criaturas no les queda energía! REGIOHM es demasiado poderoso...');
    await decir('Felipe y su equipo bajaron un poco a descansar. ¡Probá de nuevo cuando quieras!');
    curarEquipo();
    npc.x = inicio.x; npc.y = inicio.y;
    S.x = 11; S.y = 15; S.dir = 1;
  }
  return resultado;
}
// Lo que se dibuja de la pelea arriba del mapa
function dibujarRaidAbajo(cx, cy) { // las baldosas de aviso (debajo de las criaturas)
  const R = ui.raid;
  for (const gl of R.golpes) for (const [x, y] of gl.zona) {
    if (gl.t > 0) { b.fillStyle = (tick >> 2) % 2 ? 'rgba(230,30,40,0.55)' : 'rgba(230,30,40,0.3)'; }
    else b.fillStyle = 'rgba(255,240,255,0.85)';
    b.fillRect(x * T - cx + 1, y * T - cy + 1, T - 2, T - 2);
  }
}
function seguidoresRaid() { // el equipo caminando atrás de Felipe, como criaturas del mapa
  const R = ui.raid, out = [];
  S.equipo.filter(m => m.ps > 0).forEach((m, i) => {
    const a = R.P[Math.min(i + 1, R.P.length - 1)], d = R.P[i];
    let dir = d.x > a.x ? 3 : d.x < a.x ? 2 : d.y > a.y ? 0 : 1;
    const mov = S.moviendo && (a.x !== d.x || a.y !== d.y);
    out.push({ x: a.x * T + (mov ? (d.x - a.x) * S.prog : 0), y: a.y * T + (mov ? (d.y - a.y) * S.prog : 0), tx: a.x, ty: a.y,
      salvaje: { id: m.id, x: a.x, y: a.y, dir, mov, prog: S.prog, nace: 0 } });
  });
  return out;
}
function dibujarRaidArriba(cx, cy) {
  const R = ui.raid, npc = R.npc;
  // rayos de los ataques del equipo
  for (const r of R.rayos) {
    const t = 1 - r.t / 20;
    const x = r.x0 * T + 8 + (npc.x * T + 8 - r.x0 * T - 8) * Math.min(1, t * 1.6), y = r.y0 * T + 4 + (npc.y * T - 4 - r.y0 * T - 4) * Math.min(1, t * 1.6);
    b.fillStyle = r.color; b.beginPath(); b.arc(x - cx, y - cy, 3, 0, Math.PI * 2); b.fill();
    b.fillStyle = '#ffffff'; b.fillRect(x - cx - 1, y - cy - 1, 2, 2);
  }
  R.cam = { cx, cy };
  // barra de vida de REGIOHM
  b.fillStyle = 'rgba(20,10,30,0.85)'; b.fillRect(4, 3, W - 8, 15);
  b.fillStyle = '#402040'; b.fillRect(84, 7, W - 92, 6);
  const f = R.jefe.ps / R.jefe.psMax;
  b.fillStyle = f > 0.5 ? '#c050f0' : f > 0.2 ? '#f0a030' : '#f03030'; b.fillRect(84, 7, Math.ceil((W - 92) * f), 6);
  // el equipo, abajo
  b.fillStyle = 'rgba(20,10,30,0.8)'; b.fillRect(4, H - 30, W - 8, 27);
  S.equipo.forEach((m, i) => {
    const x = 8 + i * 38;
    b.globalAlpha = m.ps > 0 ? 1 : 0.3;
    b.drawImage(miniCriatura(m.id), x, H - 30, 18, 18);
    b.globalAlpha = 1;
    b.fillStyle = '#303030'; b.fillRect(x + 19, H - 22, 15, 4);
    const fm = m.ps / m.psMax;
    b.fillStyle = fm > 0.5 ? '#40d060' : fm > 0.2 ? '#f0c030' : '#f04040'; b.fillRect(x + 19, H - 22, Math.ceil(15 * fm), 4);
  });
  // carga del ataque
  b.fillStyle = '#303030'; b.fillRect(8, H - 9, W - 80, 3);
  b.fillStyle = R.cd ? '#8080a0' : '#f8e040'; b.fillRect(8, H - 9, Math.ceil((W - 80) * (1 - R.cd / RAID.espera)), 3);
  if (R.msgT > 0) { b.fillStyle = 'rgba(255,255,255,0.92)'; b.fillRect(4, 20, W - 8, 13); }
}
function textosRaid() { // los textos van en la capa de arriba (más nítidos)
  const R = ui.raid, cam = R.cam || { cx: 0, cy: 0 };
  txt('REGIOHM  Nv90', 8, 6, { t: 6, c: '#f8e8ff', sombra: null });
  for (const t of R.textos) txt(t.txt, t.x * T - cam.cx + 8, t.y * T - cam.cy - (50 - t.t) / 3, { t: 8, al: 'center', c: '#fff0a0', sombra: '#402040' });
  if (R.msgT > 0) txt(R.msg, W / 2, 23, { t: 6, al: 'center', sombra: null, c: '#302040' });
  txt(R.cd ? 'cargando...' : '¡A: ATACAR!', W - 8, H - 11, { t: 5, al: 'right', sombra: null, c: R.cd ? '#a0a0c0' : '#f8e040' });
}

// =====================================================================================
// ===== COMPU DE LOS CEMIC y CRIADERO DE HUEVOS (pedido de Poly, 24/11/2026) =====
// =====================================================================================
// COMPU: en cada CEMIC está la compu de la Profe Ceibo. Ahí se guardan las criaturas que no van en el equipo
// (S.caja: ahí ya caían las atrapadas con el equipo lleno). Se puede dejar, llevar y cambiar.
async function compu() {
  await decir('Prendiste la COMPU de la PROFE CEIBO. ¡Bip, bip!');
  while (true) {
    await decir('¿Qué querés hacer?', { mantener: true });
    const r = await elegir([`VER LA CAJA (${S.caja.length})`, 'DEJAR UNA CRIATURA', 'APAGAR'], { x: 112, y: 46, w: 124 });
    ui.dialogo = null;
    if (r < 0 || r === 2) { await decir('Apagaste la compu.'); guardar(); return; }
    if (r === 1) {
      if (S.equipo.length <= 1) { await decir('¡No podés quedarte sin criaturas en el equipo!'); continue; }
      const i = await pantallaEquipo({ msg: '¿Cuál querés dejar en la compu?' });
      if (i < 0) continue;
      const m = S.equipo.splice(i, 1)[0];
      curarCriatura(m); S.caja.push(m);
      await decir(`${nombreDe(m)} quedó guardado en la compu. ¡Ahí descansa tranquilo!`);
      continue;
    }
    if (!S.caja.length) { await decir('La caja está vacía. Cuando atrapes criaturas con el equipo lleno, aparecen acá.'); continue; }
    const j = await listaCaja();
    if (j < 0) continue;
    const m = S.caja[j];
    await decir(`${nombreDe(m)} (Nv${m.nivel}). ¿Qué hacés?`, { mantener: true });
    const o = await elegir(['LLEVAR AL EQUIPO', 'CAMBIAR', 'DATOS', 'VOLVER'], { x: 120, y: 40, w: 116 });
    ui.dialogo = null;
    if (o === 0) {
      if (S.equipo.length >= 6) { await decir('Tu equipo ya tiene 6. Usá CAMBIAR para dejar una en su lugar.'); continue; }
      S.equipo.push(S.caja.splice(j, 1)[0]);
      await decir(`¡${nombreDe(m)} se sumó al equipo!`);
    } else if (o === 1) {
      const i = await pantallaEquipo({ msg: `¿Cuál cambiás por ${nombreDe(m)}?` });
      if (i < 0) continue;
      const sale = S.equipo[i];
      curarCriatura(sale);
      S.equipo[i] = m; S.caja[j] = sale;
      await decir(`${nombreDe(m)} entró al equipo y ${nombreDe(sale)} se quedó en la compu.`);
    } else if (o === 2) {
      ui.equipo = { idx: 0, msg: '' };
      await verDatos(m);
      ui.equipo = null;
    }
  }
}
// Lista de la caja (se mueve con arriba/abajo si hay muchas)
async function listaCaja() {
  ui.compu = { idx: 0, top: 0 };
  while (true) {
    await esperar(1);
    const c = ui.compu, n = S.caja.length;
    if (pressed.up) c.idx = (c.idx - 1 + n) % n;
    if (pressed.down) c.idx = (c.idx + 1) % n;
    if (c.idx < c.top) c.top = c.idx;
    if (c.idx >= c.top + 6) c.top = c.idx - 5;
    if (pressed.b) { ui.compu = null; return -1; }
    if (pressed.a) { const i = c.idx; ui.compu = null; return i; }
  }
}
function dibujarCompu() {
  const c = ui.compu;
  sc.fillStyle = '#2a6a5a'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#327a68'; for (let i = 0; i < W; i += 16) sc.fillRect(i, 0, 8, H);
  caja(4, 2, 232, 16, 'info');
  txt(`CAJA DE LA COMPU  (${S.caja.length})`, 12, 6, { t: 7 });
  S.caja.slice(c.top, c.top + 6).forEach((m, k) => {
    const i = c.top + k, y = 21 + k * 22, sel = i === c.idx;
    caja(6, y, 228, 21, sel ? 'menu' : 'info');
    sc.imageSmoothingEnabled = false;
    sc.drawImage(spriteDe(m), 10, y + 1, 20, 20);
    txt(nombreDe(m), 34, y + 5, { t: nombreDe(m).length > 12 ? 6 : 7 });
    txt('Nv' + m.nivel, 34, y + 13, { t: 6, sombra: null, c: '#606060' });
    ESPECIES[m.id].tipos.forEach((t, j) => txt(t, 150 + j * 42, y + 8, { t: 5, sombra: null, c: COLOR_TIPO[t] || '#404040' }));
  });
  if (c.top > 0) txt('▲', 228, 20, { t: 6, al: 'right', c: '#ffffff', sombra: null });
  if (c.top + 6 < S.caja.length) txt('▼', 228, 152, { t: 6, al: 'right', c: '#ffffff', sombra: null });
}

// CRIADERO: la CRIADORA MIRTA (en cada CEMIC) cuida dos criaturas. Mientras Felipe camina, a veces aparece un HUEVO.
// Los huevos se llevan en la MOCHILA y nacen después de caminar un rato. Nace la primera forma de una de las dos.
// shiny: 1 de cada 5 huevos. oculta: desde el 4º huevo de la misma pareja, la mitad nace con la HABILIDAD OCULTA.
// tope: si los niveles de los padres suman 20 o menos, el bebé nace con la SUMA; si suman más, nace al nivel del padre más alto.
const CRIADERO = { pasosHuevo: 180, pasosNacer: 250, maxHuevos: 6, shiny: 0.2, huevosParaOculta: 3, oculta: 0.5, tope: 20 };
function nivelDelHuevo(cria) {
  const suma = cria.reduce((t, m) => t + m.nivel, 0);
  return suma <= CRIADERO.tope ? suma : Math.max(...cria.map(m => m.nivel));
}
function criadero() { return S.flags.criadero || (S.flags.criadero = { cria: [], pasos: 0, listo: false }); }
function huevos() { return S.flags.huevos || (S.flags.huevos = []); }
function sincronizarHuevos() { if (huevos().length) S.bolsa.huevo = huevos().length; else delete S.bolsa.huevo; }
const esLegendario = id => ESPECIES[id].captura <= 25;
async function hablarCriadora() {
  const cr = criadero();
  await decir('CRIADORA MIRTA: ¡Hola! Yo cuido criaturas en el CRIADERO. A veces, cuando dos se llevan bien... ¡aparece un HUEVO!');
  await regaloHuevoMirta();
  if (cr.listo) {
    if (huevos().length >= CRIADERO.maxHuevos) await decir('¡Apareció un HUEVO! Pero ya llevás muchos en la mochila. Hacé nacer alguno y volvé.');
    else {
      const padre = cr.cria[Math.floor(Math.random() * cr.cria.length)];
      cr.puestos = (cr.puestos || 0) + 1;
      const oculta = cr.puestos > CRIADERO.huevosParaOculta && Math.random() < CRIADERO.oculta;
      huevos().push({ id: familia(padre.id), pasos: CRIADERO.pasosNacer, nivel: nivelDelHuevo(cr.cria), oculta });
      cr.listo = false; cr.pasos = 0; sincronizarHuevos();
      await decir('¡Mirá! ¡Tus criaturas encontraron un HUEVO! Tomalo, cuidalo mucho.');
      await decir('¡Felipe guardó el HUEVO en la MOCHILA! Va a nacer después de caminar un buen rato.');
      guardar();
    }
  }
  await estadoCriadero();
  while (true) {
    const nombres = cr.cria.map(nombreDe).join(' y ');
    await decir(cr.cria.length ? `Ahora cuido a ${nombres}. ¿Qué hacemos?` : '¿Querés dejarme alguna criatura?', { mantener: true });
    const r = await elegir(['DEJAR UNA', 'RETIRAR', '¿CÓMO FUNCIONA?', 'CHAU', '¿HAY HUEVO?'], { x: 124, y: 36, w: 112 });
    ui.dialogo = null;
    if (r === 4) { await estadoCriadero(); continue; }
    if (r < 0 || r === 3) { await decir('CRIADORA MIRTA: ¡Chau! ¡Caminá mucho que así aparecen los huevos!'); guardar(); return; }
    if (r === 2) {
      await decir('Me dejás DOS criaturas. Mientras vos caminás por ahí, ellas juegan juntas y a veces aparece un HUEVO.');
      await decir('Cuando haya uno, venís a cualquier CEMIC y me hablás. El huevo nace después de caminar un rato.');
      await decir('Nace la primera forma de una de las dos. ¡Los legendarios no ponen huevos!');
      await decir('El bebé nace al nivel de los padres: si suman 20 o menos, los niveles se SUMAN (uno de 13 y otro de 5: ¡nace al 18!).');
      await decir('Si suman más de 20, nace al nivel del padre más alto.');
      await decir('A veces nace SHINY, de otro color. Y cuando la misma pareja ya puso 3 huevos, ¡puede salir uno con su HABILIDAD OCULTA!');
      continue;
    }
    if (r === 0) {
      if (cr.cria.length >= 2) { await decir('Ya cuido a dos. ¡No me entran más!'); continue; }
      if (S.equipo.length <= 1) { await decir('¡No podés quedarte sin criaturas en el equipo!'); continue; }
      const i = await pantallaEquipo({ msg: '¿Cuál dejás en el criadero?' });
      if (i < 0) continue;
      if (esLegendario(S.equipo[i].id)) { await decir(`${nombreDe(S.equipo[i])} es una criatura legendaria. Esas no ponen huevos.`); continue; }
      const m = S.equipo.splice(i, 1)[0];
      curarCriatura(m); cr.cria.push(m);
      await decir(`¡Dejaste a ${nombreDe(m)} en el criadero!` + (cr.cria.length === 1 ? ' Falta una más para que aparezcan huevos.' : ' ¡A caminar!'));
      continue;
    }
    if (!cr.cria.length) { await decir('No estoy cuidando a ninguna.'); continue; }
    const j = cr.cria.length === 1 ? 0 : await elegir([...cr.cria.map(nombreDe), 'NINGUNA'], { x: 124, y: 50, w: 112 });
    if (j < 0 || j >= cr.cria.length) continue;
    const m = cr.cria.splice(j, 1)[0];
    if (S.equipo.length < 6) { S.equipo.push(m); await decir(`¡${nombreDe(m)} volvió al equipo!`); }
    else { S.caja.push(m); await decir(`Tu equipo está lleno: ${nombreDe(m)} fue a la compu.`); }
    if (cr.cria.length < 2) { cr.pasos = 0; cr.listo = false; cr.puestos = 0; } // pareja nueva: el contador de huevos vuelve a cero
  }
}
// Lo que cuenta la criadora: si ya hay huevo o cuánto falta
async function estadoCriadero() {
  const cr = criadero();
  if (cr.cria.length < 2) { await decir(cr.cria.length ? 'Para que aparezca un huevo me tenés que dejar una criatura más.' : 'Ahora no estoy cuidando a ninguna criatura.'); return; }
  const puestos = cr.puestos || 0;
  if (puestos) await decir(`Esta pareja ya puso ${puestos} ${puestos === 1 ? 'huevo' : 'huevos'}.` + (puestos >= CRIADERO.huevosParaOculta ? ' ¡Ahora puede salir uno con HABILIDAD OCULTA!' : ` Cuando pongan ${CRIADERO.huevosParaOculta}, puede empezar a salir alguno con HABILIDAD OCULTA.`));
  if (cr.listo) { await decir(`¡YA PUSIERON UN HUEVO! Te lo estoy guardando. Va a nacer al nivel ${nivelDelHuevo(cr.cria)}.`); return; }
  const falta = CRIADERO.pasosHuevo - cr.pasos;
  const como = falta > 120 ? 'Recién empiezan a conocerse. Todavía falta muchísimo.' : falta > 60 ? 'Ya se están haciendo amigas. Falta bastante.' : falta > 20 ? 'Juegan todo el tiempo juntas... ¡ya falta poco!' : '¡Están por poner un huevo!';
  await decir(`${como} (Faltan unos ${falta} pasos.)`);
}
// Cada paso: cuenta para el criadero y para los huevos
function pasoHuevos() {
  const cr = S.flags.criadero;
  if (cr && cr.cria.length === 2 && !cr.listo && ++cr.pasos >= CRIADERO.pasosHuevo) cr.listo = true;
  const hs = S.flags.huevos;
  if (!hs || !hs.length) return null;
  for (const h of hs) if (h.pasos > 0) h.pasos--;
  const i = hs.findIndex(h => h.pasos <= 0);
  if (i < 0) return null;
  return async () => {
    const h = hs.splice(i, 1)[0]; sincronizarHuevos();
    S.flags.yaNacioHuevo = true;
    // Cada huevo del criadero que nace (no los especiales) = Mirta tiene un HUEVO ESPECIAL más
    if (!h.regalo) { if (S.flags.especiales === undefined) S.flags.especiales = 0; S.flags.especiales++; }
    await decir('¿Eh? ¡El HUEVO se está moviendo!');
    for (let k = 0; k < 2; k++) { ui.flash = 1; await esperar(4); ui.flash = 0; await esperar(6); }
    const m = crearCriatura(h.id, h.nivel || 5);
    if (Math.random() < CRIADERO.shiny) m.shiny = true;
    // La HABILIDAD OCULTA sale en los huevos que la traen (desde el 4º de la misma pareja) y SIEMPRE en el HUEVO ESPECIAL de Mirta
    if ((h.oculta || h.regalo) && ESPECIES[h.id].habOculta) m.habSlot = 'o';
    else if (m.habSlot === 'o') m.habSlot = Math.floor(Math.random() * ESPECIES[h.id].habs.length);
    await decir(`¡Nació un ${ESPECIES[h.id].nombre.toUpperCase()}!`);
    await decir(`¡Nació en el NIVEL ${m.nivel}!`);
    if (m.shiny) { for (let k = 0; k < 3; k++) { ui.flash = 1; await esperar(2); ui.flash = 0; await esperar(3); } await decir('¡¡WOW!! ¡Es SHINY: tiene un color distinto a todos los demás! ★'); }
    if (esHabOculta(m)) await decir(`¡Y nació con su HABILIDAD OCULTA: ${habDe(m).nombre.toUpperCase()}!`);
    if (S.equipo.length < 6) { S.equipo.push(m); await decir('¡Se sumó a tu equipo!'); }
    else { S.caja.push(m); await decir('Tu equipo está lleno: lo mandaste a la compu de la Profe Ceibo.'); }
    if (await siNo('¿Le querés poner un apodo?')) await ponerApodo(m, true);
    guardar();
  };
}
async function mirarHuevos() {
  const hs = huevos();
  if (!hs.length) { await decir('No tenés huevos.'); return; }
  for (const h of hs) {
    const f = h.pasos > CRIADERO.pasosNacer * 0.66 ? 'Todavía falta muchísimo para que nazca.' : h.pasos > CRIADERO.pasosNacer * 0.33 ? 'A veces se mueve un poquito. Falta bastante.' : h.pasos > 20 ? '¡Se escuchan ruiditos adentro! Ya falta poco.' : '¡Está por nacer!';
    await decir(`HUEVO: ${f} (Faltan unos ${h.pasos} pasos.)`);
  }
}

// =====================================================================================
// ===== DOBLE HABILIDAD (pedido de Poly, 24/11/2026) =====
// =====================================================================================
// Objeto que se usa una vez en una criatura: desde ahí puede tener DOS habilidades activas a la vez.
// La segunda se elige (y se puede cambiar) desde EQUIPO → 2ª HABILIDAD. Precios:
//  - Si la criatura tiene su HABILIDAD OCULTA: sus otras habilidades son GRATIS.
//  - Si no la tiene: sus habilidades normales cuestan $1.000 y la oculta $2.000.
//  - Habilidades de OTRAS criaturas: $2.500 (un poco más que la oculta).
const PRECIO_HAB = { propia: 1000, oculta: 2000, ajena: 2500 };
const HABS_PROHIBIDAS = ['corona']; // la Corona del Infinito es solo de REGIOHM
function opcionesHab2(m) {
  const e = ESPECIES[m.id], actual = habClave(m), conOculta = esHabOculta(m), L = [];
  const propias = [...e.habs, ...(e.habOculta ? [e.habOculta] : [])];
  for (const k of propias) {
    if (k === actual || L.some(x => x.k === k)) continue;
    L.push({ k, precio: conOculta ? 0 : (k === e.habOculta ? PRECIO_HAB.oculta : PRECIO_HAB.propia), tipo: k === e.habOculta ? 'OCULTA' : 'PROPIA' });
  }
  const usadas = new Set();
  // Solo habilidades de criaturas comunes: las que tienen únicamente los LEGENDARIOS no se pueden (pedido de Poly)
  for (const [id, es] of Object.entries(ESPECIES)) if (!esLegendario(id)) for (const k of [...es.habs, ...(es.habOculta ? [es.habOculta] : [])]) usadas.add(k);
  [...usadas].filter(k => HABILIDADES[k] && k !== actual && !HABS_PROHIBIDAS.includes(k) && !L.some(x => x.k === k))
    .sort((a, b) => HABILIDADES[a].nombre.localeCompare(HABILIDADES[b].nombre))
    .forEach(k => L.push({ k, precio: PRECIO_HAB.ajena, tipo: 'DE OTRA' }));
  return L;
}
async function usarDobleHab() {
  if (!S.equipo.length) { await decir('No tenés criaturas.'); return; }
  const i = await pantallaEquipo({ msg: '¿A cuál le das la DOBLE HABILIDAD?' });
  if (i < 0) return;
  const m = S.equipo[i];
  if (m.dobleHab) { await decir(`${nombreDe(m)} ya puede tener dos habilidades. Elegí la segunda desde EQUIPO → 2ª HABILIDAD.`); return; }
  if (!await siNo(`¿Usás la DOBLE HABILIDAD en ${nombreDe(m)}? Se gasta el objeto.`)) return;
  S.bolsa.dobleHab--; if (S.bolsa.dobleHab <= 0) delete S.bolsa.dobleHab;
  m.dobleHab = true;
  for (let k = 0; k < 2; k++) { ui.flash = 1; await esperar(3); ui.flash = 0; await esperar(4); }
  await decir(`¡${nombreDe(m)} ahora puede tener DOS HABILIDADES a la vez!`);
  await elegirHab2(m);
  guardar();
}
async function elegirHab2(m) {
  const L = opcionesHab2(m);
  if (esHabOculta(m)) await decir(`Como ${nombreDe(m)} tiene su HABILIDAD OCULTA, sus otras habilidades le salen GRATIS.`);
  const filas = L.map(o => ({ txt: HABILIDADES[o.k].nombre.toUpperCase(), der: o.precio ? plataTxt(o.precio) : 'GRATIS', sub: o.tipo, desc: HABILIDADES[o.k].desc, actual: m.hab2 === o.k }));
  const j = await listaScroll(`2ª HABILIDAD DE ${nombreDe(m)}`, filas);
  if (j < 0) return;
  const o = L[j];
  if (m.hab2 === o.k) { await decir(`${nombreDe(m)} ya tiene ${HABILIDADES[o.k].nombre.toUpperCase()}.`); return; }
  if (o.precio && (S.plata || 0) < o.precio) { await decir(`Cuesta ${plataTxt(o.precio)} y tenés ${plataTxt(S.plata || 0)}. ¡Ganá algunas batallas y volvé!`); return; }
  if (!await siNo(`¿${nombreDe(m)} aprende ${HABILIDADES[o.k].nombre.toUpperCase()}${o.precio ? ' por ' + plataTxt(o.precio) : ' gratis'}?`)) return;
  if (o.precio) S.plata -= o.precio;
  m.hab2 = o.k;
  await decir(`¡${nombreDe(m)} ahora tiene ${habDe(m).nombre.toUpperCase()} y ${HABILIDADES[o.k].nombre.toUpperCase()}!`);
  guardar();
}
// Lista larga con flechas (se usa para elegir habilidades)
async function listaScroll(titulo, filas) {
  ui.lista = { titulo, filas, idx: 0, top: 0 };
  while (true) {
    await esperar(1);
    const c = ui.lista, n = filas.length;
    if (pressed.up) c.idx = (c.idx - 1 + n) % n;
    if (pressed.down) c.idx = (c.idx + 1) % n;
    if (pressed.left) c.idx = Math.max(0, c.idx - 5);
    if (pressed.right) c.idx = Math.min(n - 1, c.idx + 5);
    if (c.idx < c.top) c.top = c.idx;
    if (c.idx >= c.top + 5) c.top = c.idx - 4;
    if (pressed.b) { ui.lista = null; return -1; }
    if (pressed.a) { const i = c.idx; ui.lista = null; return i; }
  }
}
function dibujarLista() {
  const c = ui.lista;
  sc.fillStyle = '#5a3a7a'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#664488'; for (let i = 0; i < W; i += 16) sc.fillRect(i, 0, 8, H);
  caja(4, 2, 232, 16, 'info');
  txt(c.titulo, 10, 6, { t: c.titulo.length > 30 ? 5 : 6 });
  c.filas.slice(c.top, c.top + 5).forEach((f, k) => {
    const i = c.top + k, y = 20 + k * 19, sel = i === c.idx;
    caja(6, y, 228, 18, sel ? 'menu' : 'info');
    txt(f.txt + (f.actual ? ' ✓' : ''), 12, y + 3, { t: 6 });
    txt(f.sub, 12, y + 11, { t: 4, sombra: null, c: f.sub === 'OCULTA' ? '#a040a0' : '#707070' });
    txt(f.der, 228, y + 6, { t: 6, al: 'right', sombra: null, c: f.der === 'GRATIS' ? '#208040' : '#404040' });
  });
  const f = c.filas[c.idx];
  caja(4, 116, 232, 40, 'normal');
  envolver(f.desc, 214, 6).slice(0, 3).forEach((l, i) => txt(l, 12, 122 + i * 10, { t: 6, sombra: null }));
  txt(`${c.idx + 1}/${c.filas.length}`, 230, 148, { t: 4, al: 'right', sombra: null, c: '#808080' });
}

// ---------- Boleadoras con objetos tiradas en el piso ----------
// Se ubican una sola vez al cargar. Si un objeto no tiene lugar fijo, se busca uno "a trasmano":
// una baldosa caminable lejos de la entrada que, tapada, no corta ningún camino.
const PISO_ITEM = new Set(['.', ',', '-', ':', 'w', 'u', '_', 'v', 'F']);
function ubicarItemsSuelo() {
  for (const it of ITEMS_SUELO) {
    const m = MAPAS[it.mapa]; if (!m) continue;
    (m.itemsSuelo = m.itemsSuelo || []).push(it);
    if (it.x !== undefined) continue;
    const g = m.grilla, H = g.length, W = g[0].length;
    const ocupado = new Set([...(m.npcs || []).map(n => n.x + ',' + n.y), ...(m.salidas || []).map(s => s.x + ',' + s.y),
      ...Object.keys(m.carteles || {}), ...m.itemsSuelo.filter(o => o.x !== undefined).map(o => o.x + ',' + o.y)]);
    const pisable = (x, y, tapado) => x >= 0 && y >= 0 && x < W && y < H && CAMINABLE.has(g[y][x]) && !edificioEn(m, x, y) &&
      !(m.npcs || []).some(n => n.x === x && n.y === y) && tapado !== x + ',' + y;
    const bfs = (tapado) => {
      const s0 = m.salidas[0]; const ini = [s0.x, s0.y], dist = new Map([[ini.join(','), 0]]), q = [ini];
      while (q.length) { const [x, y] = q.shift(); for (let d = 0; d < 4; d++) { const nx = x + DX[d], ny = y + DY[d], k = nx + ',' + ny; if (!dist.has(k) && pisable(nx, ny, tapado)) { dist.set(k, dist.get(x + ',' + y) + 1); q.push([nx, ny]); } } }
      return dist;
    };
    if (!m.salidas || !m.salidas.length) continue;
    const base = bfs(null), total = base.size;
    const cand = [...base.entries()].filter(([k]) => { const [x, y] = k.split(',').map(Number); return PISO_ITEM.has(g[y][x]) && !ocupado.has(k) && !m.salidas.some(s => Math.abs(s.x - x) + Math.abs(s.y - y) < 3); })
      .sort((a, b) => b[1] - a[1]);
    for (const [k] of cand.slice(0, 40)) {
      if (bfs(k).size === total - 1) { [it.x, it.y] = k.split(',').map(Number); break; }
    }
  }
}
ubicarItemsSuelo();
function itemSueloEn(m, x, y) { return (m.itemsSuelo || []).find(o => o.x === x && o.y === y && !S.flags['item_' + o.id]); }
async function juntarItem(it) {
  S.flags['item_' + it.id] = true;
  S.bolsa[it.obj] = (S.bolsa[it.obj] || 0) + it.n;
  const nom = OBJETOS[it.obj].nombre;
  await decir(`¡Felipe encontró una BOLEADORA tirada en el piso! Adentro había...`);
  await decir(`¡${it.n > 1 ? it.n + ' ' : ''}${nom}!` + (it.obj === 'dobleHab' ? ' ¡Es rarísima! Hay solo dos en toda la Argentina.' : ''));
  guardar();
}

// ---------- COPIAR HABILIDAD (pedido de Poly, 24/11/2026) ----------
// Se elige una criatura del equipo, se copia su habilidad y se le pone a otra EN LUGAR de la que tenía (m.habForzada).
// Se gasta el objeto. Las habilidades exclusivas de los legendarios no se pueden copiar.
function habExclusivaLegendaria(k) {
  for (const [id, es] of Object.entries(ESPECIES)) if (!esLegendario(id) && [...es.habs, es.habOculta].includes(k)) return false;
  return true;
}
async function usarCopiarHab() {
  if (S.equipo.length < 2) { await decir('Necesitás al menos dos criaturas en el equipo: una para copiar y otra para recibir.'); return; }
  const i = await pantallaEquipo({ msg: '¿De cuál criatura COPIÁS la habilidad?' });
  if (i < 0) return;
  const de = S.equipo[i], h = habDe(de);
  let k = h.claves[0];
  if (h.claves.length > 1) {
    await decir(`${nombreDe(de)} tiene dos habilidades. ¿Cuál copiás?`, { mantener: true });
    const r = await elegir(h.claves.map(c => HABILIDADES[c].nombre.toUpperCase()), { x: 120, y: 60, w: 116 });
    ui.dialogo = null;
    if (r < 0) return;
    k = h.claves[r];
  }
  if (habExclusivaLegendaria(k)) { await decir(`${HABILIDADES[k].nombre.toUpperCase()} es de una criatura LEGENDARIA. ¡Esa no se puede copiar!`); return; }
  const j = await pantallaEquipo({ msg: `¿A cuál le ponés ${HABILIDADES[k].nombre.toUpperCase()}?` });
  if (j < 0) return;
  const a = S.equipo[j];
  if (a === de) { await decir('¡Tiene que ser otra criatura!'); return; }
  if (habClave(a) === k) { await decir(`${nombreDe(a)} ya tiene ${HABILIDADES[k].nombre.toUpperCase()}.`); return; }
  if (!await siNo(`${nombreDe(a)} cambia ${habDe(a).nombre.toUpperCase()} por ${HABILIDADES[k].nombre.toUpperCase()}. ¿Seguro? Se gasta el objeto.`)) return;
  S.bolsa.copiarHab--; if (S.bolsa.copiarHab <= 0) delete S.bolsa.copiarHab;
  for (let n = 0; n < 2; n++) { ui.flash = 1; await esperar(3); ui.flash = 0; await esperar(4); }
  a.habForzada = k;
  if (a.hab2 === k) delete a.hab2; // si era su 2ª habilidad, ahora es la principal
  await decir(`¡${nombreDe(a)} copió ${HABILIDADES[k].nombre.toUpperCase()} de ${nombreDe(de)}!`);
  guardar();
}

// ---------- VENDER en el almacén (pedido de Poly, 24/11/2026) ----------
// Te compran los objetos a la mitad de lo que cuestan. Los HUEVOS valen $500.
// Si vendés el HUEVO ESPECIAL de la criadora Mirta, ella te lo vuelve a dar.
// Lo importante para el viaje (mapa, bici, balsa, pico, corte, cuaderno) no se vende.
const VENTA_ESPECIAL = { huevo: 500, dobleHab: 5000 };
function precioVenta(k) {
  if (VENTA_ESPECIAL[k]) return VENTA_ESPECIAL[k];
  return Math.floor((OBJETOS[k].precio || 0) / 2);
}
async function vender() {
  while (true) {
    await decir('ALMACENERO: A ver, ¿qué me querés vender?', { auto: 1 });
    const k = await pantallaMochila(false, true);
    if (!k) { await decir('ALMACENERO: ¡Cuando quieras! Acá estamos.'); guardar(); return; }
    const pv = precioVenta(k), nom = OBJETOS[k].nombre;
    if (!pv) { await decir(`ALMACENERO: ¿El ${nom}? ¡Ni loco! Eso lo vas a necesitar para el viaje.`); continue; }
    if (k === 'huevo') { await venderHuevo(); continue; }
    if (k === 'dobleHab' && !await siNo('¡Ojo! Hay solo DOS DOBLE HABILIDAD en todo el juego. ¿Seguro que la vendés?')) continue;
    let cant = 1;
    if (S.bolsa[k] > 1) {
      const ops = [1, 5, 10].filter(n => n < S.bolsa[k]).map(n => String(n)).concat(['TODOS (' + S.bolsa[k] + ')']);
      await decir(`¿Cuántos ${nom} vendés? Te pago ${plataTxt(pv)} cada uno.`, { mantener: true });
      const r = await elegir(ops, { x: 150, y: 40, w: 86 });
      ui.dialogo = null;
      if (r < 0) continue;
      cant = r === ops.length - 1 ? S.bolsa[k] : Number(ops[r]);
    } else if (!await siNo(`¿Vendés ${nom} por ${plataTxt(pv)}?`)) continue;
    S.bolsa[k] -= cant; if (S.bolsa[k] <= 0) delete S.bolsa[k];
    S.plata = (S.plata || 0) + pv * cant;
    await decir(`¡Vendiste ${cant} ${nom} y ganaste ${plataTxt(pv * cant)}!`);
  }
}
async function venderHuevo() {
  const hs = huevos();
  if (!hs.length) return;
  let i = 0;
  if (hs.length > 1) {
    const ops = hs.map((h, n) => (h.regalo ? 'ESPECIAL ' : 'HUEVO ') + (n + 1) + (h.pasos > CRIADERO.pasosNacer * 0.5 ? ' (NUEVO)' : ' (CASI)'));
    await decir('¿Cuál huevo vendés?', { mantener: true });
    i = await elegir([...ops, 'NINGUNO'], { x: 130, y: 30, w: 106 });
    ui.dialogo = null;
    if (i < 0 || i >= hs.length) return;
  }
  const h = hs[i];
  if (!await siNo(`¿Vendés ${h.regalo ? 'el HUEVO ESPECIAL' : 'este HUEVO'} por ${plataTxt(VENTA_ESPECIAL.huevo)}?`)) return;
  hs.splice(i, 1); sincronizarHuevos();
  S.plata = (S.plata || 0) + VENTA_ESPECIAL.huevo;
  await decir(`¡Vendiste el huevo y ganaste ${plataTxt(VENTA_ESPECIAL.huevo)}!`);
  if (h.regalo) { S.flags.especiales = (S.flags.especiales || 0) + 1; await decir('ALMACENERO: Dicen que la CRIADORA MIRTA tiene otro huevo especial como este... ¡andá a verla!'); }
}
