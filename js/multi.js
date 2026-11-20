'use strict';
// ================= MULTIJUGADOR =================
// Dos jugadores se juntan en una SALA: el dueño elige un SIGNO de 5 tipos y una CLAVE de 10 números.
// El otro pone el mismo signo y la misma clave, el dueño confirma y juegan juntos: se ven en el mapa
// y, si están cerca, pueden PELEAR desde el menú.
// La comunicación usa Supabase Realtime (canales "broadcast"): no se guarda nada en una base de datos.

const MP_URL = 'https://hxtpgqpejzxcqkvpdjkq.supabase.co';
const MP_CLAVE_PUBLICA = 'sb_publishable_UBUYjcmb_rwEslro5IgR_g_xHJsNefD';
const MP_SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
const TIPOS_LISTA = Object.keys(COLOR_TIPO);

const MP = {
  id: Math.random().toString(36).slice(2, 10),
  cliente: null, canal: null, rol: null, // 'dueno' | 'invitado'
  signo: null, clave: null,
  otro: null,        // { id, nombre, mapa, x, y, dir, ult }
  cola: [],          // mensajes recibidos (para las peleas)
  eventos: [],       // cosas para atender en el mundo (pedidos, retos, desconexiones)
  ultPos: '', ultEnvio: 0, reloj: null,
};
function mpActivo() { return !!MP.canal; }
function mpConAmigo() { return !!(MP.canal && MP.otro && MP.otro.nombre); }
function miNombre() { return S.flags.nombreJugador || 'FELIPE'; }

// ---------- Conexión ----------
function cargarSDK() {
  if (window.supabase && window.supabase.createClient) return Promise.resolve();
  return new Promise((ok, mal) => {
    const s = document.createElement('script');
    s.src = MP_SDK; s.onload = ok; s.onerror = () => mal(new Error('sin internet'));
    document.head.appendChild(s);
  });
}
async function mpConectar(signo, clave, rol) {
  await cargarSDK();
  if (!MP.cliente) MP.cliente = window.supabase.createClient(MP_URL, MP_CLAVE_PUBLICA);
  const nombreCanal = 'cc-' + signo.map(t => TIPOS_LISTA.indexOf(t)).join('.') + '-' + clave;
  const canal = MP.cliente.channel(nombreCanal, { config: { broadcast: { self: false } } });
  canal.on('broadcast', { event: 'msg' }, ({ payload }) => mpRecibir(payload));
  const estado = await new Promise(res => {
    let listo = false;
    canal.subscribe(st => { if (!listo && (st === 'SUBSCRIBED' || st === 'CHANNEL_ERROR' || st === 'TIMED_OUT')) { listo = true; res(st); } });
    setTimeout(() => { if (!listo) { listo = true; res('TIMED_OUT'); } }, 12000);
  });
  if (estado !== 'SUBSCRIBED') { try { MP.cliente.removeChannel(canal); } catch (e) {} throw new Error('no se pudo conectar'); }
  Object.assign(MP, { canal, rol, signo, clave, otro: null, cola: [], eventos: [] });
  if (!MP.reloj) MP.reloj = setInterval(mpLatido, 400);
}
function mpEnviar(datos) {
  if (!MP.canal) return;
  MP.canal.send({ type: 'broadcast', event: 'msg', payload: { ...datos, de: MP.id, nombre: miNombre() } });
}
function mpSalir(avisar = true) {
  if (avisar && MP.otro) mpEnviar({ tipo: 'chau' });
  if (MP.canal) { try { MP.cliente.removeChannel(MP.canal); } catch (e) {} }
  Object.assign(MP, { canal: null, rol: null, otro: null, cola: [], eventos: [], signo: null, clave: null });
}
// Mensajes que llegan
function mpRecibir(m) {
  if (!m || m.de === MP.id) return;
  if (m.para && m.para !== MP.id) return;
  const esMiAmigo = MP.otro && MP.otro.id === m.de;
  if (esMiAmigo) MP.otro.ult = Date.now();
  switch (m.tipo) {
    case 'pedido':
      if (MP.rol !== 'dueno') return;
      if (MP.otro && !esMiAmigo) { mpEnviar({ tipo: 'respuesta', para: m.de, ok: false, lleno: true }); return; }
      if (!MP.eventos.some(e => e.tipo === 'pedido' && e.de === m.de) && !esMiAmigo) MP.eventos.push(m);
      return;
    case 'pos':
      if (esMiAmigo) Object.assign(MP.otro, { mapa: m.mapa, x: m.x, y: m.y, dir: m.dir, nombre: m.nombre });
      return;
    case 'reto':
      if (esMiAmigo) MP.eventos.push(m);
      return;
    case 'chau':
      if (esMiAmigo) { MP.otro = null; MP.eventos.push({ tipo: 'seFue', nombre: m.nombre }); MP.cola.push(m); }
      return;
    default:
      MP.cola.push(m); // respuestas, aceptaciones y todo lo de las peleas
  }
}
// Cada 0,4 s: mandar la posición y fijarse si el amigo sigue conectado
function mpLatido() {
  if (!MP.canal || !MP.otro) return;
  const pos = `${S.mapa},${S.x},${S.y},${S.dir}`;
  const ahora = Date.now();
  if (pos !== MP.ultPos || ahora - MP.ultEnvio > 3000) {
    mpEnviar({ tipo: 'pos', mapa: S.mapa, x: S.x, y: S.y, dir: S.dir });
    MP.ultPos = pos; MP.ultEnvio = ahora;
  }
  if (MP.otro.ult && ahora - MP.otro.ult > 20000) {
    const n = MP.otro.nombre; MP.otro = null;
    MP.eventos.push({ tipo: 'seFue', nombre: n, corte: true });
  }
}
// Espera un mensaje que cumpla la condición (máx. `seg` segundos)
async function mpEsperar(cond, seg) {
  const fin = Date.now() + seg * 1000;
  while (Date.now() < fin) {
    const i = MP.cola.findIndex(cond);
    if (i >= 0) return MP.cola.splice(i, 1)[0];
    if (MP.cola.some(m => m.tipo === 'chau')) return null;
    await new Promise(r => setTimeout(r, 50)); // reloj real: sigue andando aunque la pestaña esté de fondo
  }
  return null;
}

// ---------- Lo que pasa en el mundo (se atiende cuando Felipe está quieto) ----------
async function atenderMP() {
  const ev = MP.eventos.shift();
  if (!ev) return;
  if (ev.tipo === 'pedido') {
    const si = await siNo(`${ev.nombre} quiere entrar a tu partida. ¿Lo dejás entrar?`);
    mpEnviar({ tipo: 'respuesta', para: ev.de, ok: si });
    if (si) {
      MP.otro = { id: ev.de, nombre: ev.nombre, ult: Date.now() };
      MP.ultPos = '';
      await decir(`¡${ev.nombre} entró a tu partida! Si están cerca, pueden PELEAR desde el MENÚ.`);
    }
  } else if (ev.tipo === 'reto') {
    if (!S.equipo.some(m => m.ps > 0)) { mpEnviar({ tipo: 'retoResp', ok: false }); await decir(`${ev.nombre} te desafió, pero tus criaturas no tienen energía.`); return; }
    const si = await siNo(`¡${ev.nombre} te desafía a un duelo! ¿Aceptás?`);
    mpEnviar({ tipo: 'retoResp', ok: si, equipo: copiaEquipo() });
    if (si) await batallaPvP(ev.equipo, ev.nombre, ev.semilla);
  } else if (ev.tipo === 'seFue') {
    await decir(ev.corte ? `Se cortó la conexión con ${ev.nombre}.` : `${ev.nombre} se fue de la partida.`);
  }
}
function copiaEquipo() { return S.equipo.map(m => { const c = JSON.parse(JSON.stringify(m)); delete c.et; return c; }); }
function amigoCerca() {
  const o = MP.otro;
  return !!(o && o.mapa === S.mapa && Math.abs(o.x - S.x) + Math.abs(o.y - S.y) <= 3);
}

// ---------- Menú MULTIJUGADOR ----------
async function menuMultijugador() {
  if (!mpActivo()) {
    const r = await elegir(['CREAR SALA', 'UNIRSE A SALA', 'VOLVER'], { x: 116, y: 30, w: 120 });
    if (r === 0) await crearSala();
    else if (r === 1) await unirseSala();
    return;
  }
  const estado = MP.otro ? `Estás jugando con ${MP.otro.nombre}.` : 'Tu sala está abierta. Esperando a tu amigo...';
  await decir(`${estado} SIGNO: ${MP.signo.map(nombreTipo).join(' ')} · CLAVE: ${MP.clave}`, { mantener: true });
  const r = await elegir(['SEGUIR', 'SALIR DE LA SALA'], { x: 116, y: 60, w: 120 });
  ui.dialogo = null;
  if (r === 1) { mpSalir(); await decir('Saliste de la sala.'); }
}
async function pedirNombre() {
  if (S.flags.nombreJugador) return true;
  const n = await escribirTexto('Tu nombre de jugador:', 'FELIPE', 10);
  if (n === null) return false;
  S.flags.nombreJugador = n || 'FELIPE';
  return true;
}
async function crearSala() {
  if (!(await pedirNombre())) return;
  await decir('Elegí el SIGNO de tu sala: 5 tipos, en el orden que quieras.');
  const signo = await elegirSigno();
  if (!signo) return;
  await decir('Ahora inventá una CLAVE de 10 números.');
  const clave = await escribirClave();
  if (!clave) return;
  await decir('Abriendo la sala...', { mantener: true });
  try { await mpConectar(signo, clave, 'dueno'); }
  catch (e) { ui.dialogo = null; await decir('No se pudo abrir la sala. ¿Hay internet?'); return; }
  ui.dialogo = null;
  await decir(`¡Sala abierta! Pasale a tu amigo el SIGNO: ${signo.map(nombreTipo).join(' ')} y la CLAVE: ${clave}.`);
  await decir('Podés seguir jugando: cuando tu amigo quiera entrar, te vamos a preguntar si lo dejás.');
}
async function unirseSala() {
  if (!(await pedirNombre())) return;
  await decir('Poné el SIGNO de la sala de tu amigo (los 5 tipos, en orden).');
  const signo = await elegirSigno();
  if (!signo) return;
  await decir('Ahora la CLAVE de 10 números.');
  const clave = await escribirClave();
  if (!clave) return;
  await decir('Conectando...', { mantener: true });
  try { await mpConectar(signo, clave, 'invitado'); }
  catch (e) { ui.dialogo = null; await decir('No se pudo conectar. ¿Hay internet?'); return; }
  await decir('Esperando que el dueño de la sala te deje entrar...', { mantener: true });
  let resp = null;
  for (let i = 0; i < 20 && !resp; i++) { // ~60 segundos, repitiendo el pedido
    mpEnviar({ tipo: 'pedido' });
    resp = await mpEsperar(m => m.tipo === 'respuesta', 3);
  }
  ui.dialogo = null;
  if (!resp) { mpSalir(false); await decir('Nadie respondió. Revisá el SIGNO y la CLAVE, y que tu amigo tenga la sala abierta.'); return; }
  if (!resp.ok) { mpSalir(false); await decir(resp.lleno ? 'Esa sala ya tiene dos jugadores.' : `${resp.nombre} no te dejó entrar.`); return; }
  MP.otro = { id: resp.de, nombre: resp.nombre, ult: Date.now() };
  MP.ultPos = '';
  await decir(`¡Entraste a la partida de ${resp.nombre}! Si están cerca, pueden PELEAR desde el MENÚ.`);
}
async function retarAmigo() {
  if (!S.equipo.some(m => m.ps > 0)) { await decir('Tus criaturas no tienen energía para pelear.'); return; }
  const semilla = Math.floor(Math.random() * 2 ** 31);
  mpEnviar({ tipo: 'reto', equipo: copiaEquipo(), semilla });
  await decir(`Desafiaste a ${MP.otro.nombre}. Esperando su respuesta...`, { mantener: true });
  const r = await mpEsperar(m => m.tipo === 'retoResp', 40);
  ui.dialogo = null;
  if (!r) { await decir(`${MP.otro ? MP.otro.nombre : 'Tu amigo'} no respondió.`); return; }
  if (!r.ok) { await decir(`${r.nombre} no quiso pelear ahora.`); return; }
  await batallaPvP(r.equipo, r.nombre, semilla);
}

// ---------- Elegir SIGNO (5 tipos) y CLAVE (10 números) ----------
async function elegirSigno() {
  const st = { modo: 'signo', sel: [], idx: 0 };
  ui.selector = st;
  while (true) {
    await esperar(1);
    const n = TIPOS_LISTA.length + 2; // + BORRAR + LISTO
    if (pressed.right) st.idx = (st.idx + 1) % n;
    if (pressed.left) st.idx = (st.idx - 1 + n) % n;
    if (pressed.down) st.idx = Math.min(n - 1, st.idx + 3);
    if (pressed.up) st.idx = Math.max(0, st.idx - 3);
    if (pressed.b) { if (st.sel.length) st.sel.pop(); else { ui.selector = null; return null; } }
    if (pressed.a) {
      if (st.idx < TIPOS_LISTA.length) { if (st.sel.length < 5) st.sel.push(TIPOS_LISTA[st.idx]); if (st.sel.length === 5) st.idx = n - 1; }
      else if (st.idx === TIPOS_LISTA.length) st.sel.pop();
      else if (st.sel.length === 5) { ui.selector = null; return st.sel; }
    }
  }
}
async function escribirClave() {
  const st = { modo: 'clave', txt: '', idx: 0 };
  ui.selector = st;
  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'BORRAR', 'LISTO'];
  while (true) {
    await esperar(1);
    if (pressed.right) st.idx = (st.idx + 1) % 12;
    if (pressed.left) st.idx = (st.idx + 11) % 12;
    if (pressed.down) st.idx = Math.min(11, st.idx + 4);
    if (pressed.up) st.idx = Math.max(0, st.idx - 4);
    if (pressed.b) { if (st.txt) st.txt = st.txt.slice(0, -1); else { ui.selector = null; return null; } }
    if (pressed.a) {
      const k = teclas[st.idx];
      if (k === 'BORRAR') st.txt = st.txt.slice(0, -1);
      else if (k === 'LISTO') { if (st.txt.length === 10) { ui.selector = null; return st.txt; } }
      else if (st.txt.length < 10) { st.txt += k; if (st.txt.length === 10) st.idx = 11; }
    }
  }
}
function dibujarSelector() {
  const st = ui.selector;
  sc.fillStyle = '#5a4a8a'; sc.fillRect(0, 0, W, H);
  sc.fillStyle = '#6a5a9a'; for (let i = 0; i < W; i += 16) sc.fillRect(i, 0, 8, H);
  if (st.modo === 'signo') {
    caja(4, 4, 232, 30, 'info');
    txt('SIGNO DE LA SALA (5 TIPOS)', 120, 8, { t: 6, al: 'center' });
    for (let i = 0; i < 5; i++) {
      const x = 10 + i * 45, t = st.sel[i];
      if (t) { sc.fillStyle = COLOR_TIPO[t]; rectRed(sc, x, 18, 42, 12, 2); sc.fill(); txt(nombreTipo(t).slice(0, 7), x + 21, 21, { t: 5, c: '#fff', sombra: tono(COLOR_TIPO[t], 0.6), al: 'center' }); }
      else { sc.strokeStyle = '#a0a0a0'; sc.strokeRect(x + 0.5, 18.5, 41, 11); }
    }
    caja(4, 38, 232, 118, 'normal');
    TIPOS_LISTA.forEach((t, i) => {
      const x = 14 + (i % 3) * 74, y = 44 + Math.floor(i / 3) * 14;
      insigniaTipo(t, x + 6, y);
      if (i === st.idx) flecha(x - 2, y + 2, '#383838');
    });
    const ex = [['BORRAR', 18], ['LISTO', 18 + 74 * 2]];
    ex.forEach(([k, x], j) => {
      const i = TIPOS_LISTA.length + j, y = 44 + 6 * 14 + 2;
      sc.fillStyle = i === st.idx ? '#f8d030' : '#e8e8f0'; sc.fillRect(x, y, 56, 12);
      txt(k, x + 28, y + 3, { t: 5, al: 'center', sombra: null, c: k === 'LISTO' && st.sel.length < 5 ? '#a0a0a0' : '#383838' });
    });
    txt('A: elegir  B: borrar', 120, 146, { t: 5, al: 'center', sombra: null, c: '#606060' });
  } else {
    caja(4, 4, 232, 40, 'info');
    txt('CLAVE DE LA SALA (10 NÚMEROS)', 120, 9, { t: 6, al: 'center' });
    for (let i = 0; i < 10; i++) {
      const x = 22 + i * 20;
      sc.fillStyle = '#ffffff'; sc.fillRect(x, 22, 16, 16);
      txt(st.txt[i] || '', x + 8, 26, { t: 8, al: 'center' });
    }
    caja(4, 48, 232, 108, 'normal');
    const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'BORRAR', 'LISTO'];
    teclas.forEach((k, i) => {
      const x = 22 + (i % 4) * 52, y = 58 + Math.floor(i / 4) * 26;
      sc.fillStyle = i === st.idx ? '#f8d030' : '#e8e8f0'; sc.fillRect(x, y, 44, 20);
      txt(k, x + 22, y + (k.length > 1 ? 7 : 5), { t: k.length > 1 ? 5 : 8, al: 'center', sombra: null, c: k === 'LISTO' && st.txt.length < 10 ? '#a0a0a0' : '#383838' });
    });
    txt('A: escribir  B: borrar', 120, 142, { t: 5, al: 'center', sombra: null, c: '#606060' });
  }
}
// Cartelito arriba a la derecha cuando hay una sala
function dibujarEstadoMP() {
  if (!mpActivo() || S.escena !== 'mundo') return;
  const t = MP.otro ? `CON ${MP.otro.nombre}` : 'SALA ABIERTA';
  const w = t.length * 5 + 10;
  sc.fillStyle = 'rgba(30,20,60,0.7)'; sc.fillRect(W - w - 2, 2, w, 10);
  txt(t, W - 7, 4, { t: 5, al: 'right', c: '#f8d030', sombra: null });
}

// ---------- PELEA ENTRE JUGADORES ----------
// Los dos juegan la misma pelea a la vez: cada uno elige su acción, se la manda al otro y los dos
// resuelven el turno con la misma "semilla" de azar. Al final de cada turno el dueño de la sala manda
// cómo quedó todo y el invitado lo copia, así nunca se desincronizan.
function semillaAzar(a) {
  return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
async function batallaPvP(equipoRival, nombreRival, semilla) {
  const original = S.equipo;
  S.equipo = copiaEquipo().map(m => { curarCriatura(m); return m; });
  const rivales = equipoRival.map(m => { curarCriatura(m); delete m.et; return m; });
  const soyDueno = MP.rol === 'dueno';
  const pal = { ...PAL.felipe, id: 'amigo', gorra: '#e04040', remera: '#e04040' };
  const escenaPrevia = S.escena;
  MP.cola = MP.cola.filter(m => m.tipo === 'chau');
  await transicionBatalla();
  bt = {
    tipo: 'entrenador', pvp: true, ent: { nombre: nombreRival, pal }, equipoRival: rivales,
    rival: null, yo: null, rivalVis: false, yoVis: false, entVis: true,
    rDX: 0, rDY: 0, yDX: 0, yDY: 0, parp: { r: 0, y: 0 }, ps: { r: 0, y: 0 },
    menu: null, idxMenu: 0, idxMov: 0, bola: null, blanco: { r: 0, y: 0 }, rng: semillaAzar(semilla),
  };
  S.escena = 'batalla';
  // Primero siempre actúa el lado del dueño de la sala (en las dos pantallas igual)
  const enOrden = lista => lista.sort((a, c) => ((a[0] === 'yo') === soyDueno ? -1 : 1) - ((c[0] === 'yo') === soyDueno ? -1 : 1));
  const sacar = async ([lado, i]) => lado === 'yo' ? sacarPropio(S.equipo[i]) : sacarRival(rivales[i]);
  bt.entDX = 120;
  await fundido(0, 14);
  for (let i = 0; i < 20; i++) { bt.entDX = 120 * (1 - (i + 1) / 20); await esperar(1); }
  await decir(`¡Duelo contra ${nombreRival}!`);
  for (let i = 0; i < 12; i++) { bt.entDX = i * 10; await esperar(1); }
  bt.entVis = false;
  for (const e of enOrden([['yo', S.equipo.findIndex(m => m.ps > 0)], ['rival', rivales.findIndex(m => m.ps > 0)]])) await sacar(e);
  for (const m of enOrden([['yo', bt.yo], ['rival', bt.rival]]).map(e => e[1])) if (!m.et.entro) await alEntrar(m);

  let resultado = null, turno = 0;
  const corte = async () => { ui.dialogo = null; await decir(`Se cortó la conexión con ${nombreRival}.`); return 'corte'; };
  turnos:
  while (true) {
    turno++;
    let acc;
    while (true) {
      acc = await accionJugador();
      if (acc.t === 'obj') { await decir('En los duelos entre amigos no se usan objetos.'); continue; }
      if (acc.t === 'huir') { if (await siNo('¿Te rendís?')) { acc = { t: 'rendir' }; break; } continue; }
      break;
    }
    const mia = acc.t === 'mov' ? { t: 'mov', i: bt.yo.movs.indexOf(acc.mv) } : acc.t === 'cambio' ? { t: 'cambio', i: acc.idx } : { t: 'rendir' };
    mpEnviar({ tipo: 'accion', turno, ...mia });
    await decir(`Esperando a ${nombreRival}...`, { mantener: true });
    const suya = await mpEsperar(m => m.tipo === 'accion' && m.turno === turno, 180);
    ui.dialogo = null;
    if (!suya) { resultado = await corte(); break; }
    if (mia.t === 'rendir') { await decir('Te rendiste.'); resultado = 'pierde'; break; }
    if (suya.t === 'rendir') { await decir(`¡${nombreRival} se rindió!`); resultado = 'gana'; break; }
    // Cambios de criatura (antes que los ataques)
    const cambios = [];
    if (mia.t === 'cambio') cambios.push(['yo', mia.i]);
    if (suya.t === 'cambio') cambios.push(['rival', suya.i]);
    for (const [lado, i] of enOrden(cambios)) {
      if (lado === 'yo') { await decir(`¡Volvé, ${nombreDe(bt.yo)}!`, { auto: 40 }); await retirarPropio(); await sacarPropio(S.equipo[i]); }
      else { await decir(`¡${nombreRival} hace volver a ${nombreDe(bt.rival)}!`, { auto: 40 }); bt.rivalVis = false; await sacarRival(rivales[i]); }
    }
    // Ataques
    const orden = [];
    if (mia.t === 'mov') orden.push({ q: 'yo', mv: acc.mv });
    if (suya.t === 'mov') orden.push({ q: 'rival', mv: suya.i >= 0 ? bt.rival.movs[suya.i] : { id: 'forcejeo', pp: 1 } });
    if (orden.length === 2) {
      const pm = prioridad(bt.yo, orden[0].mv), pr = prioridad(bt.rival, orden[1].mv);
      const vy = velocidad(bt.yo), vr = velocidad(bt.rival);
      let primeroYo;
      if (pm !== pr) primeroYo = pm > pr;
      else if (vy !== vr) primeroYo = vy > vr;
      else { const primeroDueno = azar() < 0.5; primeroYo = soyDueno ? primeroDueno : !primeroDueno; }
      if (!primeroYo) orden.reverse();
    }
    for (const o of orden) {
      const at = o.q === 'yo' ? bt.yo : bt.rival, de = o.q === 'yo' ? bt.rival : bt.yo;
      if (at.ps <= 0 || de.ps <= 0) continue;
      await ejecutarMov(at, de, o.mv, o.q);
      if (de.ps <= 0) break;
    }
    await finDeTurno();
    if (!(await sincronizarPvP(turno, rivales, soyDueno))) { resultado = await corte(); break; }
    // Criaturas debilitadas
    const caeRival = bt.rival.ps <= 0, caeYo = bt.yo.ps <= 0;
    if (caeRival) await debilitar('r');
    if (caeYo) await debilitar('y');
    const meQuedan = S.equipo.some(m => m.ps > 0), leQuedan = rivales.some(m => m.ps > 0);
    if (!meQuedan || !leQuedan) { resultado = meQuedan ? 'gana' : leQuedan ? 'pierde' : 'empate'; break; }
    const entradas = [];
    if (caeYo) {
      await decir('¿Qué criatura vas a mandar?', { auto: 30 });
      let idx = -1;
      while (idx < 0 || S.equipo[idx].ps <= 0) {
        idx = await pantallaEquipo({ forzado: true, msg: 'Elegí quién sigue peleando.' });
        if (S.equipo[idx].ps <= 0) { await decir('¡Esa criatura no tiene energía!'); idx = -1; }
      }
      mpEnviar({ tipo: 'reemplazo', turno, i: idx });
      entradas.push(['yo', idx]);
    }
    if (caeRival) {
      await decir(`${nombreRival} está eligiendo quién sigue...`, { mantener: true });
      const r = await mpEsperar(m => m.tipo === 'reemplazo' && m.turno === turno, 120);
      ui.dialogo = null;
      if (!r) { resultado = await corte(); break turnos; }
      entradas.push(['rival', r.i]);
    }
    for (const e of enOrden(entradas)) await sacar(e);
  }

  if (resultado === 'gana') { bt.entVis = true; bt.entDX = 0; bt.rivalVis = false; await decir(`¡Le ganaste a ${nombreRival}!`); }
  else if (resultado === 'pierde') await decir(`¡${nombreRival} ganó el duelo! La próxima va a ser tuya.`);
  else if (resultado === 'empate') await decir('¡Empate! Las dos criaturas cayeron al mismo tiempo.');
  await fundido(1, 14);
  S.equipo = original; // las peleas entre amigos no gastan energía ni dan experiencia
  bt = null;
  ui.dialogo = null;
  S.escena = escenaPrevia === 'batalla' ? 'mundo' : escenaPrevia;
  await fundido(0, 14);
  return resultado;
}
// El dueño manda cómo quedó el turno y el invitado lo copia
async function sincronizarPvP(turno, rivales, soyDueno) {
  const foto = (eq, act) => ({ ps: eq.map(m => m.ps), act: eq.indexOf(act), et: { ...act.et } });
  if (soyDueno) {
    mpEnviar({ tipo: 'estado', turno, d: foto(S.equipo, bt.yo), i: foto(rivales, bt.rival), sol: bt.sol || 0, lluvia: bt.lluvia || 0, nieve: bt.nieve || 0 });
    return true;
  }
  const e = await mpEsperar(m => m.tipo === 'estado' && m.turno === turno, 60);
  if (!e) return false;
  const aplicar = (eq, f, lado) => {
    f.ps.forEach((ps, i) => { if (eq[i]) eq[i].ps = ps; });
    const act = eq[f.act];
    if (act) { if (lado === 'y') bt.yo = act; else bt.rival = act; act.et = { ...f.et }; bt.ps[lado] = act.ps; }
  };
  aplicar(S.equipo, e.i, 'y');
  aplicar(rivales, e.d, 'r');
  bt.sol = e.sol; bt.lluvia = e.lluvia; bt.nieve = e.nieve;
  return true;
}
