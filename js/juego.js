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
  KeyZ: 'a', Enter: 'a', Space: 'a', KeyX: 'b', Escape: 'b', Backspace: 'b', ShiftLeft: 'b', ShiftRight: 'b', KeyM: 'start', KeyC: 'start', Tab: 'start',
};
window.addEventListener('keydown', e => {
  const k = TECLAS[e.code]; if (!k) return;
  e.preventDefault();
  if (!held[k]) cola[k] = true;
  held[k] = true;
});
window.addEventListener('keyup', e => { const k = TECLAS[e.code]; if (k) held[k] = false; });
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
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({
      mapa: S.mapa, x: S.x, y: S.y, dir: S.dir, equipo: S.equipo, caja: S.caja, bolsa: S.bolsa, flags: S.flags,
    }));
    return true;
  } catch (e) { return false; }
}
function hayPartida() { try { return !!localStorage.getItem(CLAVE_GUARDADO); } catch (e) { return false; } }
function cargar() {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE_GUARDADO));
    if (!d) return false;
    Object.assign(S, d);
    acomodarPosicion();
    return true;
  } catch (e) { return false; }
}
// Si el mapa cambió desde la última partida guardada, lleva a Felipe a un lugar seguro
function acomodarPosicion() {
  const m = MAPAS[S.mapa];
  const ok = m && m.grilla[S.y] && CAMINABLE.has(m.grilla[S.y][S.x]) &&
    !((m.edificios || []).some(e => S.x >= e.x && S.x < e.x + e.w && S.y >= e.y && S.y < e.y + e.h));
  if (ok) return;
  const c = S.flags && S.flags.centro;
  if (c && MAPAS[c.mapa]) { S.mapa = c.mapa; S.x = c.x; S.y = c.y; S.dir = c.dir; }
  else { S.mapa = 'casa'; S.x = 4; S.y = 4; S.dir = 1; }
}
function curarEquipo() { S.equipo.forEach(curarCriatura); }

// ================= MUNDO =================
function mapa() { return MAPAS[S.mapa]; }
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
  if (!CAMINABLE.has(m.grilla[y][x])) return false;
  if (npcEn(x, y)) return false;
  return true;
}

function pasoMundo() {
  pasoSalvajes();
  if (S.moviendo) {
    S.prog += held.b ? 4 : 2;
    if (S.prog >= 16) {
      S.prog = 0; S.moviendo = false;
      S.x += DX[S.dir]; S.y += DY[S.dir];
      S.pasoAlt ^= 1;
      alPisar();
    }
    return;
  }
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
  if (transitable(S.x + DX[d], S.y + DY[d])) { S.moviendo = true; S.prog = 0; }
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
  const bol = (m.boleadoras || []).find(o => o.x === x && o.y === y);
  if (bol) { correr(mirarBoleadora(bol)); return; }
  if (y < 0 || y >= m.grilla.length || x < 0 || x >= m.grilla[0].length) return;
  const ch = m.grilla[y][x];
  if (ch === 'S' && m.carteles && m.carteles[x + ',' + y]) { correr(decir(m.carteles[x + ',' + y])); return; }
  if (m.objetos && m.objetos[ch]) { correr(decir(m.objetos[ch])); return; }
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
  return { id, nivel: enc.min + Math.floor(Math.random() * (enc.max - enc.min + 1)) };
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
  await batalla({ salvaje: [id, nivel] });
}

// ---------- Menú principal ----------
async function menuPrincipal() {
  while (true) {
    const r = await elegir(['EQUIPO', 'MOCHILA', 'GUARDAR', 'CERRAR'], { x: 156, y: 4, w: 80 });
    if (r === 0) {
      if (!S.equipo.length) { await decir('Todavía no tenés criaturas.'); continue; }
      await pantallaEquipo({ modo: 'ver' });
    } else if (r === 1) {
      const obj = await pantallaMochila(false);
      if (obj) await usarObjetoMundo(obj);
    } else if (r === 2) {
      const ok = guardar();
      await decir(ok ? '¡La partida se guardó!' : 'No se pudo guardar la partida en este navegador.');
    } else return;
  }
}
async function usarObjetoMundo(obj) {
  const o = OBJETOS[obj];
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
        const r = await elegir(['DATOS', 'SUBIR', 'SALIR'], { x: 156, y: 92, w: 80 });
        if (r === 0) { await verDatos(m); }
        else if (r === 1 && e.idx > 0) {
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
  S.equipo.forEach((m, i) => {
    const y = 4 + i * 22, sel = i === e.idx;
    caja(6, y, 228, 21, sel ? 'menu' : 'info');
    sc.imageSmoothingEnabled = false;
    sc.drawImage(spriteCriatura(m.id), 10, y + 1, 20, 20);
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
  const esp = ESPECIES[m.id];
  caja(4, 4, 232, 152, 'info');
  sc.fillStyle = '#d8e8f8'; sc.fillRect(12, 12, 72, 72);
  sc.drawImage(spriteCriatura(m.id), 16, 16, 64, 64);
  txt(nombreDe(m), 92, 14, { t: 8 });
  txt('Nivel ' + m.nivel, 92, 28, { t: 7 });
  esp.tipos.forEach((t, i) => insigniaTipo(t, 92 + i * 60, 40));
  txt(`PS  ${m.ps}/${m.psMax}`, 92, 58, { t: 6 });
  txt(`ATQ ${m.atk}   DEF ${m.def}`, 92, 68, { t: 6 });
  txt(`VEL ${m.vel}`, 92, 78, { t: 6 });
  const falta = expPara(m.nivel + 1) - m.exp;
  txt(`EXP para subir: ${falta}`, 14, 92, { t: 6 });
  m.movs.forEach((mv, i) => {
    const M = MOVS[mv.id];
    const y = 104 + i * 12;
    txt(M.nombre.toUpperCase(), 14, y, { t: 6 });
    txt(`PP ${mv.pp}/${M.pp}`, 120, y, { t: 6 });
    sc.fillStyle = COLOR_TIPO[M.tipo]; sc.fillRect(190, y, 38, 8);
    txt(nombreTipo(M.tipo).slice(0, 6), 209, y + 1, { t: 5, c: '#fff', sombra: null, al: 'center' });
  });
}

// ---------- Mochila ----------
async function pantallaMochila(enBatalla) {
  const lista = () => Object.keys(OBJETOS).filter(k => (S.bolsa[k] || 0) > 0);
  ui.mochila = { idx: 0 };
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
  sc.drawImage(spriteBoleadora(), 32, 44, 48, 48);
  caja(96, 4, 140, 108, 'normal');
  const items = [...L.map(k => [OBJETOS[k].nombre, 'x' + S.bolsa[k]]), ['CERRAR', '']];
  items.forEach(([nm, c], i) => {
    const y = 14 + i * 16;
    txt(nm, 112, y, { t: 7 });
    if (c) txt(c, 228, y, { t: 7, al: 'right' });
    if (i === mo.idx) flecha(103, y);
  });
  caja(4, 116, 232, 40, 'normal');
  const sel = L[mo.idx];
  const d = sel ? OBJETOS[sel].desc : 'Cerrar la mochila.';
  envolver(d, 212, 7).forEach((l, i) => txt(l, 12, 126 + i * 13, { t: 7 }));
}

// ---------- Dibujo del mundo ----------
function dibujarPersonaje(pal, dir, frame, x, y) {
  b.drawImage(spriteChar(pal, dir, frame), Math.round(x), Math.round(y));
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
  for (const bo of m.boleadoras || []) {
    if (S.flags.inicial === bo.id || S.flags.inicialTomi === bo.id) continue;
    b.drawImage(spriteBoleadora(), bo.x * T - cx, bo.y * T - cy - 3);
  }
  const entes = npcsVisibles().map(n => ({ y: n.y * T, x: n.x * T, pal: n.pal, dir: n.dir, f: 0, tx: n.x, ty: n.y }));
  let frame = 0;
  if (S.moviendo) frame = S.prog < 10 ? 1 + S.pasoAlt : 0;
  entes.push({ y: ppy, x: ppx, pal: PAL.felipe, dir: S.dir, f: frame, yo: true, tx: S.x, ty: S.y });
  prepararSalvajes();
  for (const c of SALV.lista) {
    const px = c.x * T + (c.mov ? DX[c.dir] * c.prog : 0), py = c.y * T + (c.mov ? DY[c.dir] * c.prog : 0);
    entes.push({ y: py, x: px, salvaje: c, tx: c.mov && c.prog >= 8 ? c.x + DX[c.dir] : c.x, ty: c.mov && c.prog >= 8 ? c.y + DY[c.dir] : c.y });
  }
  entes.sort((a, c) => a.y - c.y);
  for (const e of entes) {
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
    dibujarPersonaje(e.pal, e.dir, e.f, e.x - cx, e.y - cy - 3 + bob);
    const enPasto = m.grilla[e.ty] && (m.grilla[e.ty][e.tx] === ',' || m.grilla[e.ty][e.tx] === 'u') && !(e.yo && S.moviendo && S.prog < 8);
    if (enPasto) b.drawImage(TILES[m.grilla[e.ty][e.tx]], 0, 9, 16, 7, e.x - cx, e.y - cy + 9, 16, 7);
  }
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
  Object.assign(S, { mapa: 'casa', x: 4, y: 4, dir: 0, equipo: [], caja: [], bolsa: {}, flags: {} });
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
    : 'CONSEJO: Caminá con las FLECHAS del teclado. Para hablar con alguien, ponete enfrente y apretá Z o Enter.');
  S.ocupado = false;
}

// ================= BATALLA =================
function mult(etapa) { return etapa >= 0 ? (2 + etapa) / 2 : 2 / (2 - etapa); }
function calcularDanio(at, de, mv) {
  const L = at.nivel;
  const a = at.atk * mult(at.et.atk), d = de.def * mult(de.et.def);
  let base = Math.floor(Math.floor(Math.floor(2 * L / 5 + 2) * mv.pot * a / d) / 50) + 2;
  const stab = tiposDe(at).includes(mv.tipo) ? 1.5 : 1;
  const ef = eficacia(mv.tipo, tiposDe(de));
  const critico = Math.random() < 1 / 16;
  const azar = 0.85 + Math.random() * 0.15;
  if (ef === 0) return { danio: 0, ef, critico: false };
  return { danio: Math.max(1, Math.floor(base * stab * ef * (critico ? 1.5 : 1) * azar)), ef, critico };
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
  const equipoRival = ent ? ent.equipo.map(([id, l]) => crearCriatura(id, l)) : [crearCriatura(op.salvaje[0], op.salvaje[1])];
  bt = {
    tipo: ent ? 'entrenador' : 'salvaje', ent, equipoRival,
    rival: null, yo: null, rivalVis: false, yoVis: false, entVis: !!ent,
    rDX: 0, rDY: 0, yDX: 0, yDY: 0, parp: { r: 0, y: 0 }, ps: { r: 0, y: 0 },
    menu: null, idxMenu: 0, idxMov: 0, bola: null, blanco: { r: 0, y: 0 },
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
    bt.rival = equipoRival[0]; bt.rival.et = { atk: 0, def: 0 }; bt.ps.r = bt.rival.ps;
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
      const pm = MOVS[acc.mv.id].prio || 0, pr = MOVS[movRival.id].prio || 0;
      const primeroYo = pm !== pr ? pm > pr : bt.yo.vel !== bt.rival.vel ? bt.yo.vel > bt.rival.vel : Math.random() < 0.5;
      orden = primeroYo ? [mio, orden[0]] : [orden[0], mio];
    }
    for (const o of orden) {
      const at = o.q === 'yo' ? bt.yo : bt.rival, de = o.q === 'yo' ? bt.rival : bt.yo;
      if (at.ps <= 0 || de.ps <= 0) continue;
      await ejecutarMov(at, de, o.mv, o.q);
      if (de.ps <= 0) break;
    }
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
  bt.rival = m; m.et = { atk: 0, def: 0 }; bt.ps.r = m.ps;
  bt.rivalVis = true; bt.rDX = 0; bt.rDY = 0; bt.blanco.r = 8;
  for (let i = 0; i < 8; i++) { bt.blanco.r = 8 - i; await esperar(2); }
  bt.blanco.r = 0;
  await decir(`¡${bt.ent.nombre} sacó a ${nombreDe(m)}!`, { auto: 50 });
}
async function sacarPropio(m) {
  bt.yo = m; m.et = { atk: 0, def: 0 }; bt.ps.y = m.ps;
  bt.idxMov = 0;
  bt.yoVis = true; bt.yDX = -90; bt.yDY = 0;
  for (let i = 0; i < 14; i++) { bt.yDX = -90 * (1 - (i + 1) / 14); await esperar(1); }
  await decir(`¡Adelante, ${nombreDe(m)}!`, { auto: 40 });
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
  if (Math.random() * 100 >= M.prec) { await decir('¡Pero falló!', { auto: 40 }); return; }
  const ladoDe = quien === 'yo' ? 'r' : 'y';
  if (M.pot) {
    const r = calcularDanio(at, de, M);
    if (r.ef === 0) { await decir(`No afecta a ${nombreBatalla(de)}...`, { auto: 50 }); return; }
    bt.parp[ladoDe] = 16;
    await esperar(16);
    de.ps = Math.max(0, de.ps - r.danio);
    await animarPS(de);
    if (r.critico) await decir('¡Golpe crítico!', { auto: 40 });
    if (r.ef > 1) await decir('¡Es muy eficaz!', { auto: 40 });
    else if (r.ef < 1) await decir('No es muy eficaz...', { auto: 40 });
    if (slot.id === 'forcejeo') {
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
  const objetivo = signo === '+' ? at : de;
  const nombreStat = stat === 'atk' ? 'ATAQUE' : 'DEFENSA';
  const nuevo = objetivo.et[stat] + (signo === '+' ? 1 : -1);
  if (nuevo < -6 || nuevo > 6) { await decir(`¡${nombreStat} de ${nombreBatalla(objetivo)} no puede cambiar más!`, { auto: 50 }); return; }
  objetivo.et[stat] = nuevo;
  bt.parp[objetivo === bt.yo ? 'y' : 'r'] = 10;
  await esperar(10);
  await decir(`¡${signo === '+' ? 'Subió' : 'Bajó'} el ${nombreStat} de ${nombreBatalla(objetivo)}!`, { auto: 50 });
}

async function darExp() {
  const f = bt.rival, m = bt.yo;
  if (!m || m.ps <= 0) return;
  const gana = Math.max(1, Math.floor(ESPECIES[f.id].exp * f.nivel / 7 * (bt.tipo === 'entrenador' ? 1.5 : 1)));
  m.exp += gana;
  await decir(`¡${nombreDe(m)} ganó ${gana} puntos de experiencia!`);
  while (m.nivel < 100 && m.exp >= expPara(m.nivel + 1)) {
    const antes = m.psMax;
    m.nivel++;
    recalcular(m);
    m.ps += m.psMax - antes;
    bt.ps.y = m.ps;
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
    if (evo && m.nivel >= evo.nivel) await evolucionar(m, evo.a);
  }
}
async function evolucionar(m, nuevoId) {
  const previa = S.escena;
  await fundido(1, 10);
  S.escena = 'evo';
  ui.evo = { de: m.id, a: nuevoId, fase: 0 };
  await fundido(0, 10);
  await decir(`¿Qué? ¡${nombreDe(m)} está evolucionando!`);
  for (let i = 0; i < 150; i++) { ui.evo.fase = i; await esperar(1); }
  ui.evo.fase = 999;
  const viejo = nombreDe(m);
  const antes = m.psMax;
  m.id = nuevoId;
  recalcular(m);
  m.ps += m.psMax - antes;
  await decir(`¡Felicitaciones! ¡${viejo} evolucionó en ${nombreDe(m)}!`);
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
  const sp = spriteCriatura(id);
  b.drawImage(blanco ? silueta(sp) : sp, 88, 30, 64, 64);
}

// ---------- Dibujo de batalla ----------
function elipse(ctx, x, y, rx, ry, c1, c2) {
  ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
  ctx.fillStyle = c1; ctx.beginPath(); ctx.ellipse(x, y - 1, rx - 3, ry - 2, 0, 0, 7); ctx.fill();
}
function dibujarBatalla() {
  const g = b.createLinearGradient(0, 0, 0, 112);
  g.addColorStop(0, '#f8f0c8'); g.addColorStop(1, '#d8f0b0');
  b.fillStyle = g; b.fillRect(0, 0, W, H);
  b.fillStyle = '#c8e8a0'; b.fillRect(0, 60, W, 52);
  elipse(b, 176, 64, 48, 11, '#a0d080', '#70a858');
  elipse(b, 64, 112, 60, 13, '#a0d080', '#70a858');
  if (bt.entVis && bt.ent) b.drawImage(spriteChar(bt.ent.pal, 0, 0), 152 + (bt.entDX || 0), 8, 48, 48);
  if (bt.rival && bt.rivalVis && !(bt.parp.r > 0 && (bt.parp.r-- >> 1) % 2)) {
    const sp = spriteCriatura(bt.rival.id);
    b.save(); b.beginPath(); b.rect(0, 0, W, 66); b.clip();
    b.drawImage(bt.blanco.r > 0 ? silueta(sp) : sp, 144 + bt.rDX, 2 + bt.rDY, 64, 64);
    b.restore();
  }
  if (bt.yo && bt.yoVis && !(bt.parp.y > 0 && (bt.parp.y-- >> 1) % 2)) {
    b.save(); b.beginPath(); b.rect(0, 0, W, 112); b.clip();
    b.drawImage(spriteCriatura(bt.yo.id, true), 30 + bt.yDX, 50 + bt.yDY, 64, 64);
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
  const ws = esperas; esperas = [];
  for (const w of ws) { if (--w.n <= 0) w.r(); else esperas.push(w); }
  if (S.escena === 'mundo' && !S.ocupado) pasoMundo();
}
function dibujar() {
  b.imageSmoothingEnabled = false;
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
  if (S.escena === 'mundo' && S.cartelLugar && S.cartelLugar.t > 0 && !ui.dialogo) {
    caja(4, 4, 150, 22, 'normal');
    txt(S.cartelLugar.txt, 12, 11, { t: 7 });
  }
  if (ui.vista) dibujarVista();
  if (ui.equipo) dibujarEquipo();
  if (ui.mochila) dibujarMochila();
  dibujarDialogo();
  dibujarMenu();
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

async function iniciar() {
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

