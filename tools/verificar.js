const fs = require('fs'), vm = require('vm');
const R = process.argv[2];
const ctx = { console, S: { flags: {} } }; vm.createContext(ctx);
for (const f of ['datos.js', 'mapas.js']) vm.runInContext(fs.readFileSync(R + '/js/' + f, 'utf8'), ctx, { filename: f });
vm.runInContext(fs.readFileSync(R + '/js/juego.js', 'utf8').match(/const CAMINABLE = .*;/)[0] + ';this.CAM=CAMINABLE;this.M=MAPAS;this.E=ESPECIES;', ctx);
const { M, E, CAM } = ctx;
let errores = 0; const err = (...a) => { errores++; console.log('ERROR', ...a); };
const edif = (m, x, y) => (m.edificios || []).find(e => x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h);
function pisable(m, x, y, npcsOk) {
  const g = m.grilla; if (y < 0 || x < 0 || y >= g.length || x >= g[0].length) return false;
  const e = edif(m, x, y);
  if (e && !(e.abre && x === e.x + e.puerta && y === e.y + e.h - 1)) return false;
  if (!CAM.has(g[y][x]) && !'XZOA~'.includes(g[y][x])) return false; // el agua (BALSA) y lo que rompe el PICO o corta el CORTE también se pasan
  if (!npcsOk && (m.npcs || []).some(n => n.x === x && n.y === y)) return false;
  return true;
}
for (const [id, m] of Object.entries(M)) {
  const g = m.grilla; const W = g[0].length;
  g.forEach((r, i) => { if (r.length !== W) err(id, 'fila', i, 'mide', r.length, 'en vez de', W); });
  for (const e of m.edificios || []) {
    if (e.x + e.w > W || e.y + e.h > g.length) err(id, 'edificio afuera', e.tipo);
    if (e.abre) {
      const dx = e.x + e.puerta, dy = e.y + e.h - 1;
      if (!CAM.has(g[dy][dx])) err(id, 'puerta no pisable', e.tipo);
      if (!(m.salidas || []).some(s => s.x === dx && s.y === dy)) err(id, 'puerta sin salida', e.tipo, dx, dy);
      if (!pisable(m, dx, dy + 1)) err(id, 'no se llega a la puerta', e.tipo);
    }
  }
  for (const s of m.salidas || []) {
    const d = M[s.a]; if (!d) { err(id, 'salida a mapa inexistente', s.a); continue; }
    if (!pisable(d, s.ax, s.ay)) err(id, '->', s.a, 'llega a baldosa no pisable', s.ax, s.ay, d.grilla[s.ay] && d.grilla[s.ay][s.ax]);
    if ((d.salidas || []).some(t => t.x === s.ax && t.y === s.ay)) err(id, '->', s.a, 'llega arriba de otra salida');
    if (!(d.salidas || []).some(t => t.a === id)) err(id, '->', s.a, 'no tiene vuelta');
    if (!CAM.has(g[s.y][s.x]) && g[s.y][s.x] !== 'm') err(id, 'salida en baldosa no pisable', s.x, s.y);
  }
  for (const n of m.npcs || []) if (!pisable(m, n.x, n.y, true)) err(id, 'npc en lugar no pisable', n.id, n.x, n.y, g[n.y] && g[n.y][n.x]);
  for (const [k] of Object.entries(m.carteles || {})) { const [x, y] = k.split(',').map(Number); if (g[y][x] !== 'S') err(id, 'cartel sin S', k); }
  for (let y = 0; y < g.length; y++) for (let x = 0; x < W; x++) if (g[y][x] === 'S' && !(m.carteles || {})[x + ',' + y]) err(id, 'S sin texto', x, y);
  if (m.encuentros) for (const [e] of m.encuentros.lista) if (!E[e]) err(id, 'especie inexistente', e);
  // Todas las salidas conectadas entre sí (BFS desde la primera)
  const sal = m.salidas || [];
  if (sal.length > 1) {
    const vis = new Set(); const q = [[sal[0].x, sal[0].y]]; vis.add(sal[0].x + ',' + sal[0].y);
    while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const k = (x+dx)+','+(y+dy); if (!vis.has(k) && pisable(m, x+dx, y+dy)) { vis.add(k); q.push([x+dx, y+dy]); } } }
    for (const s of sal) if (!vis.has(s.x + ',' + s.y)) err(id, 'salida aislada', s.a, s.x, s.y);
  }
}
// especies usadas en entrenadores
const txt = fs.readFileSync(R + '/js/mapas.js', 'utf8');
for (const m of txt.matchAll(/\['([a-z_]+)', \d+\]/g)) if (!E[m[1]]) err('especie de entrenador inexistente', m[1]);
// todos los mapas alcanzables desde el pueblo
const vis = new Set(['pueblo']); const q = ['pueblo'];
// `vuelos`: lugares a los que se llega en avión (hablando con el piloto)
while (q.length) { const a = q.shift(); for (const s of [...(M[a].salidas || []), ...(M[a].vuelos || []).map(v => ({ a: v }))]) if (!vis.has(s.a)) { vis.add(s.a); q.push(s.a); } }
for (const id of Object.keys(M)) if (!vis.has(id)) err('mapa inalcanzable', id);
console.log(Object.keys(M).length, 'mapas,', errores, 'errores');
