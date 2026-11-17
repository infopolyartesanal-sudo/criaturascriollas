'use strict';
// ===== Motor de pixel-art: dibuja sprites a partir de figuras simples =====

function hexRgb(h) {
  h = h.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
const _cacheTono = {};
// f < 1 oscurece, f > 1 aclara
function tono(h, f) {
  const k = h + f;
  if (_cacheTono[k]) return _cacheTono[k];
  const [r, g, b] = hexRgb(h);
  let out;
  if (f < 1) out = rgbHex(r * f, g * f, b * f);
  else out = rgbHex(r + (255 - r) * (f - 1), g + (255 - g) * (f - 1), b + (255 - b) * (f - 1));
  _cacheTono[k] = out;
  return out;
}
function nuevoCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
function enPoligono(x, y, pts) {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) dentro = !dentro;
  }
  return dentro;
}
// Línea de puntos (Bresenham) como lista de primitivas 'd'
function linea(x0, y0, x1, y1, c) {
  const out = [];
  let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx + dy;
  while (true) {
    out.push(['d', x0, y0, c]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return out;
}

// Primitivas:
//  ['e', cx, cy, rx, ry, color, flags]  elipse (con sombreado automático)
//  ['r', x, y, w, h, color, flags]      rectángulo
//  ['p', [[x,y],...], color, flags]     polígono
//  ['d', x, y, color, flags]            punto
// flags: 'c' = solo pinta sobre lo ya pintado, 's' = sin sombreado
function rasterizar(tam, prims, op = {}) {
  const sombra = op.sombra !== false, borde = op.borde !== false;
  const g = new Array(tam * tam).fill(null);
  for (const p of prims) {
    const t = p[0];
    const flag = (t === 'p' ? p[3] : t === 'd' ? p[4] : p[6]) || '';
    const clip = flag.includes('c'), sinSombra = flag.includes('s');
    for (let py = 0; py < tam; py++) {
      for (let px = 0; px < tam; px++) {
        const x = px + 0.5, y = py + 0.5, i = py * tam + px;
        let col = null;
        if (t === 'e') {
          const nx = (x - p[1]) / p[3], ny = (y - p[2]) / p[4];
          if (nx * nx + ny * ny <= 1) {
            col = p[5];
            if (sombra && !sinSombra) {
              if (ny > 0.5 || nx > 0.72) col = tono(col, 0.8);
              else if (ny < -0.45 && nx < 0) col = tono(col, 1.2);
            }
          }
        } else if (t === 'r') {
          if (x >= p[1] && x < p[1] + p[3] && y >= p[2] && y < p[2] + p[4]) col = p[5];
        } else if (t === 'p') {
          if (enPoligono(x, y, p[1])) col = p[2];
        } else if (t === 'd') {
          if (px === p[1] && py === p[2]) col = p[3];
        }
        if (col === null) continue;
        if (clip && !g[i]) continue;
        g[i] = col;
      }
    }
  }
  let out = g;
  if (borde) {
    out = g.slice();
    for (let py = 0; py < tam; py++) {
      for (let px = 0; px < tam; px++) {
        const i = py * tam + px;
        if (g[i]) continue;
        let n = null;
        if (px > 0 && g[i - 1]) n = g[i - 1];
        else if (px < tam - 1 && g[i + 1]) n = g[i + 1];
        else if (py > 0 && g[i - tam]) n = g[i - tam];
        else if (py < tam - 1 && g[i + tam]) n = g[i + tam];
        if (n) out[i] = tono(n, 0.32);
      }
    }
  }
  const c = nuevoCanvas(tam, tam), ctx = c.getContext('2d'), img = ctx.createImageData(tam, tam);
  for (let i = 0; i < out.length; i++) {
    if (!out[i]) continue;
    const [r, gg, bb] = hexRgb(out[i]);
    img.data[i * 4] = r; img.data[i * 4 + 1] = gg; img.data[i * 4 + 2] = bb; img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
function espejar(c) {
  const m = nuevoCanvas(c.width, c.height), x = m.getContext('2d');
  x.translate(c.width, 0); x.scale(-1, 1); x.drawImage(c, 0, 0);
  return m;
}
// Versión en blanco (para destellos de evolución / captura)
function silueta(c, color = '#ffffff') {
  const m = nuevoCanvas(c.width, c.height), x = m.getContext('2d');
  x.drawImage(c, 0, 0);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  return m;
}

// ===== Personajes humanos (16x16) =====
// dir: 0 abajo, 1 arriba, 2 izquierda, 3 derecha · frame: 0 parado, 1 y 2 caminando
const _cacheChar = {};
function spriteChar(pal, dir, frame) {
  const clave = pal.id + '_' + dir + '_' + frame;
  if (_cacheChar[clave]) return _cacheChar[clave];
  if (dir === 3) {
    const c = espejar(spriteChar(pal, 2, frame));
    _cacheChar[clave] = c;
    return c;
  }
  const P = [];
  const OJO = '#202020';
  if (dir === 0 || dir === 1) {
    if (pal.peloLargo) P.push(['r', 3.5, 4, 9, dir === 1 ? 7 : 6, pal.pelo]);
    P.push(['r', 4, 9, 8, pal.guardapolvo ? 5 : 4, pal.remera]);
    if (pal.raya) P.push(['r', 6, 9, 1, 4, pal.raya, 'c'], ['r', 9, 9, 1, 4, pal.raya, 'c']);
    P.push(['r', 3, 9, 1, 3, pal.piel], ['r', 12, 9, 1, 3, pal.piel]);
    if (frame === 0) P.push(['r', 5, 13, 2, 2, pal.pant], ['r', 9, 13, 2, 2, pal.pant]);
    else if (frame === 1) P.push(['r', 5, 13, 2, 2, pal.pant], ['r', 9, 13, 2, 1, pal.pant]);
    else P.push(['r', 5, 13, 2, 1, pal.pant], ['r', 9, 13, 2, 2, pal.pant]);
    P.push(['e', 8, 5.5, 4, 4, pal.piel]);
    if (dir === 1) P.push(['e', 8, 5, 4.3, 4.2, pal.pelo]);
    if (pal.gorra) {
      P.push(['e', 8, 3.2, 4.5, 2.6, pal.gorra]);
      if (dir === 0) P.push(['r', 4, 4.5, 8, 1, tono(pal.gorra, 0.72)], ['r', 4, 5.5, 1, 1.5, pal.pelo], ['r', 11, 5.5, 1, 1.5, pal.pelo]);
    } else if (pal.boina) {
      P.push(['e', 8, 2.8, 4.7, 2.2, pal.boina]);
      if (dir === 0) P.push(['r', 4, 4, 1, 2, pal.pelo], ['r', 11, 4, 1, 2, pal.pelo]);
    } else if (pal.sombrero) {
      P.push(['r', 2, 3.5, 12, 1.2, pal.sombrero], ['e', 8, 2.6, 3.6, 2, pal.sombrero]);
    } else if (dir === 0) {
      P.push(['e', 8, 3.5, 4.4, 2.6, pal.pelo]);
    }
    if (dir === 0) {
      P.push(['r', 6, 6, 1, 2, OJO], ['r', 9, 6, 1, 2, OJO]);
      if (pal.barba) P.push(['r', 5, 8, 6, 1.5, pal.barba]);
    }
  } else {
    if (pal.peloLargo) P.push(['r', 8, 4, 4.5, 6, pal.pelo]);
    P.push(['r', 5, 9, 6, pal.guardapolvo ? 5 : 4, pal.remera]);
    if (pal.raya) P.push(['r', 8, 9, 1, 4, pal.raya, 'c']);
    if (frame === 0) P.push(['r', 6, 13, 2, 2, pal.pant], ['r', 8, 13, 2, 2, pal.pant]);
    else if (frame === 1) P.push(['r', 5, 13, 2, 2, pal.pant], ['r', 9, 13, 2, 2, pal.pant]);
    else P.push(['r', 6, 13, 2, 2, pal.pant], ['r', 9, 13, 2, 1, pal.pant]);
    P.push(['r', 7.5, 9.5, 2, 3, pal.piel]);
    P.push(['e', 8, 5.5, 4, 4, pal.piel]);
    if (pal.gorra) {
      P.push(['e', 8.5, 3.2, 4.4, 2.6, pal.gorra], ['r', 3, 4.5, 5, 1, tono(pal.gorra, 0.72)], ['r', 10, 4.5, 2.5, 4, pal.pelo]);
    } else if (pal.boina) {
      P.push(['e', 8.5, 2.8, 4.6, 2.2, pal.boina], ['r', 10, 4, 2.5, 3, pal.pelo]);
    } else if (pal.sombrero) {
      P.push(['r', 2, 3.5, 12, 1.2, pal.sombrero], ['e', 8, 2.6, 3.6, 2, pal.sombrero], ['r', 10, 4.5, 2.5, 3, pal.pelo]);
    } else {
      P.push(['e', 9, 3.5, 4.2, 2.6, pal.pelo], ['r', 10, 4, 2.5, 4, pal.pelo]);
    }
    P.push(['r', 5, 6, 1, 2, OJO]);
    if (pal.barba) P.push(['r', 4, 8, 4, 1.5, pal.barba]);
  }
  const c = rasterizar(16, P, { sombra: false });
  _cacheChar[clave] = c;
  return c;
}

// ===== Criaturas =====
// Dibujos de Felipe pasados a pixel-art (img/ -> js/imagenes.js).
// Si una especie tiene dibujo se usa ese; si no, el sprite hecho con figuras.
const _dibujos = {};
function precargarDibujos() {
  const lista = typeof IMAGENES === 'undefined' ? [] : Object.entries(IMAGENES);
  return Promise.all(lista.map(([id, src]) => new Promise(listo => {
    const im = new Image();
    im.onload = () => {
      const c = nuevoCanvas(im.width, im.height);
      c.getContext('2d').drawImage(im, 0, 0);
      _dibujos[id] = c;
      listo();
    };
    im.onerror = listo;
    im.src = src;
  })));
}
const _cacheCriatura = {};
function spriteCriatura(id, espalda) {
  const clave = id + (espalda ? '_b' : '');
  if (_cacheCriatura[clave]) return _cacheCriatura[clave];
  let c;
  if (_dibujos[id]) {
    c = espalda ? (_dibujos[id + '_espalda'] || espejar(_dibujos[id])) : _dibujos[id];
    _cacheCriatura[clave] = c;
    return c;
  }
  c = rasterizar(32, ESPECIES[id].sprite);
  if (espalda) c = espejar(c);
  _cacheCriatura[clave] = c;
  return c;
}

// ===== Boleadora (la "pokebola" criolla) =====
let _boleadora = null;
function spriteBoleadora() {
  if (_boleadora) return _boleadora;
  const P = [
    ...linea(8, 5, 4, 11, '#5a3a1a'),
    ...linea(8, 5, 12, 11, '#5a3a1a'),
    ['e', 8, 4.5, 2.7, 2.7, '#c08850'],
    ['e', 4, 11.5, 2.7, 2.7, '#c08850'],
    ['e', 12, 11.5, 2.7, 2.7, '#c08850'],
    ['r', 5, 4, 6, 1, '#6cb4ee', 'c'],
    ['r', 1, 11, 6, 1, '#6cb4ee', 'c'],
    ['r', 9, 11, 6, 1, '#6cb4ee', 'c'],
  ];
  _boleadora = rasterizar(16, P);
  return _boleadora;
}

// ===== Baldosas del mapa (16x16) =====
function crearTiles() {
  const t = {};
  const mk = fn => { const c = nuevoCanvas(16, 16), x = c.getContext('2d'); fn(x); return c; };
  const R = (x, a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
  const pasto = x => {
    R(x, 0, 0, 16, 16, '#88d070');
    for (const [a, b] of [[2, 3], [10, 1], [6, 9], [12, 11], [1, 13], [13, 6]]) {
      R(x, a, b, 1, 1, '#68b050'); R(x, a + 2, b, 1, 1, '#68b050'); R(x, a + 1, b + 1, 1, 1, '#68b050');
    }
  };
  const piso = x => {
    R(x, 0, 0, 16, 16, '#ecd29a');
    for (const y of [3, 7, 11, 15]) R(x, 0, y, 16, 1, '#d4b070');
    R(x, 4, 0, 1, 3, '#d4b070'); R(x, 12, 4, 1, 3, '#d4b070'); R(x, 7, 8, 1, 3, '#d4b070'); R(x, 14, 12, 1, 3, '#d4b070');
  };
  const sobre = (x, prims) => x.drawImage(rasterizar(16, prims), 0, 0);

  t['.'] = mk(pasto);
  t[','] = mk(x => {
    R(x, 0, 0, 16, 16, '#58a848');
    for (let k = 0; k < 4; k++) {
      const bx = (k % 2) * 8, by = (k >> 1) * 8;
      R(x, bx, by + 7, 8, 1, '#3a8038');
      for (const [o, hh] of [[1, 5], [3, 7], [5, 6]]) {
        R(x, bx + o, by + 7 - hh, 1, hh, '#3a8038');
        R(x, bx + o + 1, by + 8 - hh, 1, hh - 1, '#70c058');
        R(x, bx + o, by + 7 - hh, 1, 1, '#98e078');
      }
    }
  });
  t['='] = mk(x => {
    R(x, 0, 0, 16, 16, '#e8d8a0');
    for (const [a, b] of [[3, 2], [11, 5], [6, 12], [13, 13], [1, 8], [8, 7]]) R(x, a, b, 1, 1, '#d0bc80');
  });
  for (let f = 0; f < 2; f++) {
    t['~' + f] = mk(x => {
      R(x, 0, 0, 16, 16, '#4898e0');
      R(x, 0, 0, 16, 1, '#3a80c8');
      R(x, 2 + f * 2, 4, 5, 1, '#a0d4ff'); R(x, 9 - f * 2, 10, 5, 1, '#a0d4ff');
      R(x, 12 - f, 1, 2, 1, '#78b8f0'); R(x, 1 + f, 13, 2, 1, '#78b8f0');
    });
  }
  t['T'] = mk(x => {
    pasto(x);
    sobre(x, [['r', 6, 11, 4, 4, '#7a4a22'], ['e', 8, 7, 6.6, 5.8, '#2e8b3a'], ['e', 5.5, 5, 2.2, 1.6, '#5cc060', 's'], ['e', 11, 9, 2, 1.4, '#227030', 's']]);
  });
  t['F'] = mk(x => {
    pasto(x);
    const flor = (cx, cy, c) => { R(x, cx - 1, cy, 3, 1, c); R(x, cx, cy - 1, 1, 3, c); R(x, cx, cy, 1, 1, '#f8e040'); };
    flor(4, 4, '#e83a3a'); flor(11, 10, '#e83a3a'); flor(12, 3, '#ffffff'); flor(4, 12, '#ffffff');
  });
  t['f'] = mk(x => {
    pasto(x);
    sobre(x, [['r', 0, 5, 16, 2, '#c08848'], ['r', 0, 10, 16, 2, '#c08848'], ['r', 2, 3, 3, 12, '#a06a30'], ['r', 11, 3, 3, 12, '#a06a30']]);
  });
  t['S'] = mk(x => {
    pasto(x);
    sobre(x, [['r', 7, 10, 2, 5, '#7a4a22'], ['r', 2, 2, 12, 8, '#c89050'], ['r', 4, 4, 8, 1, '#8a5a2a'], ['r', 4, 6, 8, 1, '#8a5a2a']]);
  });
  // Litoral: juncos/totoras en el agua y puente de madera
  t['j'] = mk(x => {
    R(x, 0, 0, 16, 16, '#4898e0');
    R(x, 2, 12, 5, 1, '#a0d4ff'); R(x, 10, 14, 4, 1, '#a0d4ff');
    for (const [a, hh] of [[2, 10], [5, 13], [8, 9], [11, 12], [13, 8]]) {
      R(x, a, 14 - hh, 1, hh, '#3a8038'); R(x, a + 1, 15 - hh, 1, hh - 2, '#70c058');
      R(x, a, 12 - hh, 2, 3, '#8a5a2a');
    }
  });
  t['h'] = mk(x => {
    R(x, 0, 0, 16, 16, '#4898e0');
    R(x, 1, 0, 14, 16, '#b07a40');
    for (const y of [3, 7, 11, 15]) R(x, 1, y, 14, 1, '#7a4a22');
    R(x, 0, 0, 1, 16, '#6a3a1a'); R(x, 15, 0, 1, 16, '#6a3a1a');
  });
  // Selva Misionera: árbol de selva, tierra colorada; cueva: roca, piso de cueva, amatistas
  t['Y'] = mk(x => {
    R(x, 0, 0, 16, 16, '#3a8a3a');
    sobre(x, [['r', 6, 10, 4, 6, '#5a3414'], ['e', 8, 6, 7.6, 6.4, '#1e6a2a'], ['e', 5, 4, 3, 2.2, '#3a9a40', 's'], ['e', 12, 8, 2.4, 2, '#145020', 's']]);
    R(x, 3, 9, 1, 6, '#2a7a2a'); R(x, 13, 7, 1, 7, '#2a7a2a');
  });
  t['q'] = mk(x => {
    R(x, 0, 0, 16, 16, '#c8603a');
    for (const [a, b] of [[3, 2], [11, 5], [6, 12], [13, 13], [1, 8], [8, 7]]) R(x, a, b, 1, 1, '#a84828');
    R(x, 9, 2, 2, 1, '#d87a50'); R(x, 2, 13, 2, 1, '#d87a50');
  });
  t['R'] = mk(x => {
    R(x, 0, 0, 16, 16, '#6a5a4a');
    sobre(x, [['e', 5, 5, 5, 4, '#8a7a68'], ['e', 12, 11, 5, 4.5, '#7a6a58'], ['e', 4, 13, 3.5, 2.5, '#8a7a68']], { borde: false });
  });
  t[':'] = mk(x => {
    R(x, 0, 0, 16, 16, '#9a8670');
    for (const [a, b] of [[3, 2], [11, 5], [6, 12], [13, 13], [1, 8], [8, 7]]) R(x, a, b, 1, 1, '#7a6852');
  });
  t['a'] = mk(x => {
    R(x, 0, 0, 16, 16, '#9a8670');
    sobre(x, [['p', [[2, 15], [5, 3], [8, 15]], '#a050e0'], ['p', [[7, 15], [10, 6], [13, 15]], '#d8a0ff'], ['p', [[11, 15], [14, 9], [15, 15]], '#a050e0']]);
  });
  // Norte: arena, paja brava (con criaturas), cerros de colores y cardones
  const arena = x => {
    R(x, 0, 0, 16, 16, '#e0c890');
    for (const [a, b] of [[3, 2], [11, 5], [6, 12], [13, 13], [1, 8], [8, 7]]) R(x, a, b, 1, 1, '#c8a870');
  };
  t['-'] = mk(arena);
  t['u'] = mk(x => {
    arena(x);
    for (let k = 0; k < 4; k++) {
      const bx = (k % 2) * 8, by = (k >> 1) * 8;
      for (const [o, hh] of [[1, 6], [3, 7], [5, 5], [6, 6]]) {
        R(x, bx + o, by + 8 - hh, 1, hh, '#a08838');
        R(x, bx + o, by + 8 - hh, 1, 1, '#d8c060');
      }
    }
  });
  t['C'] = mk(x => {
    const fr = ['#c84a3a', '#e08a3a', '#9a5aa8', '#d8b050', '#6a9a5a', '#c86a5a'];
    for (let i = 0; i < 6; i++) { R(x, 0, i * 3 - 1, 16, 3, fr[i]); }
    R(x, 0, 15, 16, 1, '#7a3a2a');
    R(x, 3, 4, 2, 1, '#f0b080'); R(x, 10, 10, 3, 1, '#c090d0');
  });
  t['K'] = mk(x => {
    arena(x);
    sobre(x, [['r', 6, 2, 4, 13, '#3a8a4a'], ['r', 2, 6, 3, 6, '#3a8a4a'], ['r', 2, 6, 2, 2, '#3a8a4a'], ['r', 11, 4, 3, 6, '#3a8a4a'],
      ['r', 7, 3, 1, 11, '#5aaa60', 'c'], ['d', 7, 1, '#f0f0a0'], ['d', 12, 3, '#f0f0a0']]);
  });
  // Puna: salinas y cerros nevados
  t['w'] = mk(x => {
    R(x, 0, 0, 16, 16, '#f4f6f8');
    R(x, 0, 7, 16, 1, '#d8dee6'); R(x, 7, 0, 1, 7, '#d8dee6'); R(x, 3, 8, 1, 8, '#d8dee6'); R(x, 12, 8, 1, 8, '#d8dee6');
    R(x, 2, 2, 1, 1, '#ffffff'); R(x, 11, 12, 1, 1, '#ffffff');
  });
  t['N'] = mk(x => {
    R(x, 0, 0, 16, 16, '#e0c890');
    sobre(x, [['p', [[0, 16], [8, 1], [16, 16]], '#7a6a6a'], ['p', [[5, 7], [8, 1], [11, 7], [9, 6], [8, 8], [6, 6]], '#ffffff'], ['p', [[8, 1], [16, 16], [12, 16], [10, 8]], '#5a4a4a', 'c']]);
  });
  // Interiores
  t['_'] = mk(piso);
  t['#'] = mk(x => {
    R(x, 0, 0, 16, 16, '#e8dcc0');
    R(x, 0, 0, 16, 2, '#c8b490');
    R(x, 4, 2, 1, 10, '#dccfae'); R(x, 12, 2, 1, 10, '#dccfae');
    R(x, 0, 12, 16, 4, '#a87850'); R(x, 0, 12, 16, 1, '#c89868');
  });
  t['m'] = mk(x => { piso(x); R(x, 1, 3, 14, 10, '#902828'); R(x, 2, 4, 12, 8, '#c84848'); R(x, 3, 7, 10, 1, '#e87070'); });
  t['r'] = mk(x => { R(x, 0, 0, 16, 16, '#5a7ad0'); R(x, 0, 2, 16, 1, '#8aa8f0'); R(x, 0, 13, 16, 1, '#8aa8f0'); for (let i = 1; i < 16; i += 4) R(x, i, 7, 2, 2, '#f0d060'); });
  t['k'] = mk(x => {
    piso(x);
    const libros = [];
    const cols = ['#d04040', '#4060c0', '#40a050', '#e0b030', '#8040a0'];
    for (let fila = 0; fila < 3; fila++) for (let i = 0; i < 5; i++) libros.push(['r', 2 + i * 2.4, 2 + fila * 4.5, 2, 3.5, cols[(i + fila) % 5]]);
    sobre(x, [['r', 1, 0, 14, 15, '#8a5a2a'], ...libros.map(l => [...l, 'c'])]);
  });
  t['x'] = mk(x => { piso(x); sobre(x, [['r', 1, 10, 14, 5, '#a06a3a'], ['r', 3, 1, 10, 9, '#303040'], ['r', 4, 2, 8, 6, '#70b0e0', 'c']]); });
  t['p'] = mk(x => { piso(x); sobre(x, [['r', 5, 10, 6, 5, '#c0603a'], ['e', 8, 6.5, 5.5, 5, '#3a9a4a'], ['e', 5, 4, 2, 2, '#5cc060', 's']]); });
  t['b'] = mk(x => { piso(x); sobre(x, [['r', 2, 0, 12, 15, '#a06a3a'], ['r', 3, 1, 10, 13, '#f4f4f4'], ['r', 3, 6, 10, 8, '#e05050'], ['r', 3, 9, 10, 1, '#f08080']]); });
  t['t'] = mk(x => { piso(x); sobre(x, [['r', 0, 2, 16, 10, '#c48a50'], ['r', 0, 12, 16, 3, '#8a5a2a'], ['r', 1, 3, 14, 1, '#dca870', 'c']]); });
  t['o'] = t['t'];
  // Gimnasio psíquico: piso violeta y esferas sobre pedestales
  t['v'] = mk(x => {
    R(x, 0, 0, 16, 16, '#b8a0d8');
    R(x, 0, 0, 16, 1, '#a088c8'); R(x, 0, 0, 1, 16, '#a088c8');
    R(x, 7, 7, 2, 2, '#d8c8f0');
  });
  t['g'] = mk(x => {
    R(x, 0, 0, 16, 16, '#b8a0d8');
    sobre(x, [['r', 4, 10, 8, 5, '#6a5a8a'], ['r', 3, 9, 10, 2, '#8a7aaa'], ['e', 8, 6, 4.5, 4.5, '#f85888'], ['e', 6.5, 4.5, 1.3, 1.3, '#ffd0e0', 's']]);
  });
  t['c'] = mk(x => { piso(x); sobre(x, [['r', 1, 8, 14, 7, '#909aa8'], ['r', 3, 1, 10, 7, '#404858'], ['r', 4, 2, 8, 5, '#80e0a0', 'c']]); });
  return t;
}

// ===== Edificios =====
function crearEdificio(tipo, w, h, puerta) {
  const c = nuevoCanvas(w * 16, h * 16), x = c.getContext('2d');
  const R = (a, b, ww, hh, col) => { x.fillStyle = col; x.fillRect(a, b, ww, hh); };
  const ancho = w * 16, alto = h * 16;
  const techoH = (h - 2) * 16 + 4;
  const pared = tipo === 'lab' ? '#eef2f6' : tipo.startsWith('gimnasio') ? '#ece4f4' : tipo === 'adobe' ? '#e0c08a' : '#f6eedc';
  R(2, techoH - 4, ancho - 4, alto - techoH + 4, pared);
  R(2, alto - 3, ancho - 4, 3, '#a89878');
  const TECHOS = { lab: '#4f7fa8', casa2: '#3f8f6f', centro: '#d84848', gimnasio: '#7a4aa8', gimnasio2: '#7a6a5a', gimnasio3: '#3f8a3a', gimnasio4: '#3a7ab0', adobe: '#9a6a3a' };
  const tc = TECHOS[tipo] || '#c8553a';
  R(0, 0, ancho, techoH, tc);
  let fila = 0;
  for (let yy = 5; yy < techoH - 2; yy += 5, fila++) {
    R(0, yy, ancho, 1, tono(tc, 0.75));
    for (let xx = (fila % 2) * 4; xx < ancho; xx += 8) R(xx, yy - 4, 1, 4, tono(tc, 0.85));
  }
  R(0, 0, ancho, 2, tono(tc, 1.25));
  R(0, techoH - 2, ancho, 2, tono(tc, 0.6));
  if (tipo === 'lab') { R(ancho / 2 - 6, 6, 12, 10, '#f8f8f8'); R(ancho / 2 - 1, 8, 2, 6, '#40a050'); R(ancho / 2 - 4, 10, 8, 2, '#40a050'); }
  else if (tipo === 'centro') {
    // Cartel del CEMIC: cruz roja sobre fondo blanco
    R(ancho / 2 - 8, 5, 16, 13, '#ffffff'); R(ancho / 2 - 8, 5, 16, 1, '#c03030'); R(ancho / 2 - 8, 17, 16, 1, '#c03030');
    R(ancho / 2 - 2, 7, 4, 9, '#e03a3a'); R(ancho / 2 - 5, 10, 10, 3, '#e03a3a');
  } else if (tipo.startsWith('gimnasio')) {
    // Cartel con una estrella (insignia)
    const cx = ancho / 2;
    R(cx - 9, 4, 18, 15, '#f8f0ff'); R(cx - 9, 4, 18, 1, '#4a2a6a');
    R(cx - 1, 6, 2, 11, '#f0c030'); R(cx - 5, 10, 10, 2, '#f0c030'); R(cx - 3, 8, 6, 6, '#f0c030'); R(cx - 1, 10, 2, 2, '#f85888');
  } else { R(ancho - 14, 3, 6, 8, '#8a6a5a'); R(ancho - 15, 2, 8, 2, '#6a4a3a'); }
  const ventanas = tipo === 'lab' ? [1, 4] : tipo.startsWith('gimnasio') ? [1, 5] : [1, 3];
  for (const i of ventanas) {
    if (i === puerta) continue;
    const vx = i * 16 + 2, vy = alto - 26;
    R(vx, vy, 12, 11, '#6a4a2a'); R(vx + 1, vy + 1, 10, 9, '#88c8f0');
    R(vx + 1, vy + 1, 4, 3, '#c0e4ff'); R(vx + 6, vy + 1, 1, 9, '#6a4a2a'); R(vx + 1, vy + 5, 10, 1, '#6a4a2a');
  }
  const dx = puerta * 16;
  if (tipo === 'lab' || tipo.startsWith('gimnasio') || tipo === 'centro') {
    R(dx + 2, alto - 17, 12, 15, '#5a6a7a'); R(dx + 3, alto - 16, 10, 14, '#90d0f0'); R(dx + 7, alto - 16, 2, 14, '#5a6a7a'); R(dx + 4, alto - 15, 2, 4, '#d0f0ff');
  } else {
    R(dx + 3, alto - 16, 10, 14, '#5a3214'); R(dx + 4, alto - 15, 8, 13, '#9a6232'); R(dx + 10, alto - 9, 1, 2, '#f0d060');
  }
  x.strokeStyle = tono(tc, 0.35); x.lineWidth = 1;
  x.strokeRect(0.5, 0.5, ancho - 1, techoH - 1);
  x.strokeStyle = '#7a6a5a';
  x.strokeRect(2.5, techoH - 0.5, ancho - 5, alto - techoH);
  return c;
}

