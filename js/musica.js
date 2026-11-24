'use strict';
// ================= MÚSICA (8 bits, compuesta para el juego) =================
// Temas originales: RUTA (para caminar), BATALLA, GIMNASIO (fanfarria épica para los
// gimnasios y las peleas contra los líderes) y MISTERIO (bosque oscuro y cuevas). Se generan con Web Audio, sin archivos.
// Notas: 'C5/4' = do de la 5ª octava que dura 4 semicorcheas (16 = un compás). 'R' = silencio.
// Batería: 'k' bombo, 's' redoblante, 'h' platillo.

// Repite un grupo de notas: rep('E4/1 G4/1 B4/1 G4/1', 4)
function rep(grupo, n) { return Array(n).fill(grupo).join(' '); }

const CANCIONES = {
  // CHACARERA (6/8 con hemiola, en la menor): violín, rasguido de guitarra, bajo y bombo legüero
  // Cada compás de 6/8 dura 12 semicorcheas.
  ruta: {
    bpm: 100,
    canales: [
      { tipo: 'square', duty: 0.5, vol: 0.12, notas: [
        'E5/2 A5/2 C6/2 B5/2 A5/2 E5/2', 'G#5/4 B5/2 D6/2 C6/2 B5/2', 'B5/2 A5/2 G#5/2 A5/2 B5/4', 'A5/6 E5/2 A5/2 C6/2',
        'D6/2 F6/2 E6/2 D6/2 C6/2 A5/2', 'C6/4 B5/2 A5/2 E5/4', 'F5/2 E5/2 D5/2 E5/2 G#5/2 B5/2', 'A5/8 R/4',
        'C6/2 E6/2 C6/2 B5/2 A5/2 B5/2', 'C6/4 A5/4 E5/4', 'D6/2 C6/2 B5/2 A5/2 G#5/2 A5/2', 'B5/6 E5/6',
        'A5/2 C6/2 E6/2 D6/2 C6/2 B5/2', 'C6/2 B5/2 A5/2 G5/2 F5/4', 'E5/2 F5/2 G#5/2 B5/2 D6/2 B5/2', 'A5/8 R/4'] },
      // rasguido: arpegio de la guitarra en corcheas
      { tipo: 'square', duty: 0.25, vol: 0.05, notas: [
        'A3/2 C4/2 E4/2 A3/2 C4/2 E4/2', 'E3/2 G#3/2 D4/2 E3/2 G#3/2 B3/2', 'E3/2 G#3/2 D4/2 E3/2 G#3/2 B3/2', 'A3/2 C4/2 E4/2 A3/2 C4/2 E4/2',
        'D3/2 F3/2 A3/2 D3/2 F3/2 A3/2', 'A3/2 C4/2 E4/2 A3/2 C4/2 E4/2', 'E3/2 G#3/2 D4/2 E3/2 G#3/2 B3/2', 'A3/2 C4/2 E4/2 A3/4 R/2',
        'A3/2 C4/2 E4/2 A3/2 C4/2 E4/2', 'F3/2 A3/2 C4/2 F3/2 A3/2 C4/2', 'E3/2 G#3/2 D4/2 E3/2 G#3/2 B3/2', 'E3/2 G#3/2 B3/2 E3/2 G#3/2 B3/2',
        'A3/2 C4/2 E4/2 A3/2 C4/2 E4/2', 'D3/2 F3/2 A3/2 D3/2 F3/2 A3/2', 'E3/2 G#3/2 D4/2 E3/2 G#3/2 B3/2', 'A3/2 C4/2 E4/2 A3/4 R/2'] },
      // bajo: un compás en 6/8 (dos golpes) y otro en 3/4 (tres golpes): la hemiola de la chacarera
      { tipo: 'triangle', vol: 0.24, notas: [
        'A2/6 E2/6', 'E2/4 B2/4 E2/4', 'E2/6 B2/6', 'A2/4 E2/4 A2/4',
        'D2/6 A2/6', 'A2/4 E2/4 A2/4', 'E2/6 B2/6', 'A2/4 E2/4 A2/4',
        'A2/6 E2/6', 'F2/4 C3/4 F2/4', 'E2/6 B2/6', 'E2/4 B2/4 E2/4',
        'A2/6 E2/6', 'D2/4 A2/4 D2/4', 'E2/6 B2/6', 'A2/4 E2/4 A2/4'] },
      // bombo legüero: k = parche (grave), s = aro (golpe seco)
      { tipo: 'bateria', vol: 0.08, notas: ['k/2 s/2 s/2 k/2 s/2 s/2', 'k/4 s/2 k/2 s/2 s/2'] },
    ],
  },
  // BATALLA: rápida y fluida, melodía que corre, arpegios continuos y bajo en corcheas (mi menor)
  batalla: {
    bpm: 176,
    canales: [
      { tipo: 'square', duty: 0.5, vol: 0.11, notas: [
        'E5/1 F#5/1 G5/1 A5/1 B5/2 B5/2 E6/2 D6/2 B5/2 G5/2', 'C6/4 B5/2 A5/2 G5/2 A5/2 B5/4',
        'A5/1 B5/1 C6/1 D6/1 E6/2 D6/2 C6/2 B5/2 A5/2 F#5/2', 'B5/6 A5/2 G5/2 F#5/2 D#5/4',
        'E5/1 G5/1 B5/1 E6/1 G6/2 F#6/2 E6/2 B5/2 G5/2 B5/2', 'C6/2 A5/2 E5/2 A5/2 C6/2 E6/2 D6/2 C6/2',
        'B5/2 C6/2 D6/2 E6/2 F#6/2 G6/2 A6/2 F#6/2', 'G6/4 F#6/4 D#6/4 B5/4'] },
      { tipo: 'square', duty: 0.125, vol: 0.045, notas: [
        rep('E4/1 G4/1 B4/1 G4/1', 4), rep('C4/1 E4/1 G4/1 E4/1', 4), rep('D4/1 F#4/1 A4/1 F#4/1', 4), rep('B3/1 D#4/1 F#4/1 D#4/1', 4),
        rep('E4/1 G4/1 B4/1 G4/1', 4), rep('A3/1 C4/1 E4/1 C4/1', 4), rep('C4/1 E4/1 G4/1 E4/1', 2) + ' ' + rep('D4/1 F#4/1 A4/1 F#4/1', 2), rep('B3/1 D#4/1 F#4/1 D#4/1', 4)] },
      { tipo: 'triangle', vol: 0.24, notas: [
        rep('E2/2 E3/2', 4), rep('C2/2 C3/2', 4), rep('D2/2 D3/2', 4), rep('B1/2 B2/2', 4),
        rep('E2/2 E3/2', 4), rep('A1/2 A2/2', 4), rep('C2/2 C3/2', 2) + ' ' + rep('D2/2 D3/2', 2), rep('B1/2 B2/2', 4)] },
      { tipo: 'bateria', vol: 0.07, notas: ['k/2 h/2 s/2 h/2 k/2 k/2 s/2 h/2', 'k/2 h/2 s/2 h/2 k/2 h/1 h/1 s/2 s/1 s/1'] },
    ],
  },
  // GIMNASIO: apertura épica (sol menor → termina en SOL MAYOR): cuerdas en semicorcheas sin parar,
  // trompetas heroicas con saltos grandes, contracanto largo, bajo galopante y timbales con redobles.
  gimnasio: {
    bpm: 140,
    canales: [
      { tipo: 'square', duty: 0.5, vol: 0.13, notas: [
        'G4/4 D5/6 C5/2 D5/4', 'D#5/6 D5/2 C5/4 A#4/4', 'D5/4 F5/6 D#5/2 F5/4', 'C6/12 A5/4',
        'A#5/6 A5/2 G5/4 D5/4', 'G5/6 F5/2 D#5/4 G5/4', 'C6/4 A#5/4 A5/4 G5/4', 'F#5/12 D5/4',
        'G5/4 A#5/6 G5/2 D#6/4', 'D6/6 C6/2 A5/4 F5/4', 'F5/4 A5/4 D6/4 F6/4', 'D6/12 A#5/4',
        'D#6/6 D6/2 C6/4 A#5/4', 'C6/6 A#5/2 A5/4 C6/4', 'D6/4 C6/2 A5/2 F#5/4 A5/4', 'B5/12 R/4'] },
      { tipo: 'square', duty: 0.25, vol: 0.055, notas: [
        'A#4/16', 'G4/16', 'F4/16', 'A4/16', 'D5/16', 'A#4/16', 'D#4/16', 'F#4/16',
        'A#4/16', 'C5/16', 'A4/16', 'A#4/16', 'G4/16', 'A4/16', 'F#4/16', 'D5/12 R/4'] },
      { tipo: 'square', duty: 0.125, vol: 0.04, notas: [
        rep('G4/1 D5/1 G5/1 D5/1', 4), rep('D#4/1 A#4/1 D#5/1 A#4/1', 4), rep('A#3/1 F4/1 A#4/1 F4/1', 4), rep('F4/1 C5/1 F5/1 C5/1', 4),
        rep('G4/1 D5/1 G5/1 D5/1', 4), rep('D#4/1 A#4/1 D#5/1 A#4/1', 4), rep('C4/1 G4/1 C5/1 G4/1', 4), rep('D4/1 A4/1 D5/1 F#4/1', 4),
        rep('D#4/1 A#4/1 D#5/1 A#4/1', 4), rep('F4/1 C5/1 F5/1 C5/1', 4), rep('D4/1 A4/1 D5/1 A4/1', 4), rep('G4/1 D5/1 G5/1 D5/1', 4),
        rep('D#4/1 A#4/1 D#5/1 A#4/1', 4), rep('F4/1 C5/1 F5/1 C5/1', 4), rep('D4/1 A4/1 D5/1 F#4/1', 4), rep('G4/1 B4/1 D5/1 G5/1', 3) + ' R/4'] },
      { tipo: 'triangle', vol: 0.26, notas: [
        rep('G1/2 G1/2 G2/2 G1/2', 2), rep('D#2/2 D#2/2 D#3/2 D#2/2', 2), rep('A#1/2 A#1/2 A#2/2 A#1/2', 2), rep('F2/2 F2/2 F3/2 F2/2', 2),
        rep('G1/2 G1/2 G2/2 G1/2', 2), rep('D#2/2 D#2/2 D#3/2 D#2/2', 2), rep('C2/2 C2/2 C3/2 C2/2', 2), rep('D2/2 D2/2 D3/2 D2/2', 2),
        rep('D#2/2 D#2/2 D#3/2 D#2/2', 2), rep('F2/2 F2/2 F3/2 F2/2', 2), rep('D2/2 D2/2 D3/2 D2/2', 2), rep('G1/2 G1/2 G2/2 G1/2', 2),
        rep('D#2/2 D#2/2 D#3/2 D#2/2', 2), rep('F2/2 F2/2 F3/2 F2/2', 2), rep('D2/2 D2/2 D3/2 D2/2', 2), 'G1/4 G2/4 G1/4 R/4'] },
      { tipo: 'bateria', vol: 0.1, notas: [
        rep('k/4 s/4 k/2 k/2 s/4', 7), 's/1 s/1 s/1 s/1 s/1 s/1 s/1 s/1 k/4 k/4',
        rep('k/4 s/4 k/2 k/2 s/4', 7), 'k/2 k/2 s/1 s/1 s/1 s/1 k/4 h/4'] },
    ],
  },
  // MISTERIO: para el bosque oscuro y las cuevas. Lento, en re menor, con notas que "no cierran"
  // (do sostenido, sol sostenido) y un bombo suave como un latido.
  misterio: {
    bpm: 66,
    canales: [
      // flauta: la melodía, suave y con vibrato
      { tipo: 'flauta', vol: 0.15, notas: [
        'D5/6 R/2 F5/4 E5/4', 'C#5/8 R/8', 'A4/4 D5/4 F5/4 A5/4', 'G#5/12 R/4',
        'G5/6 R/2 F5/4 E5/4', 'F5/4 E5/4 D5/4 C#5/4', 'D5/4 A4/4 F4/4 E4/4', 'D4/12 R/4'] },
      // campanitas lejanas
      { tipo: 'campana', vol: 0.05, notas: ['D6/8 R/8', 'E6/8 R/8', 'F6/8 R/8', 'D6/8 R/8', 'A#5/8 R/8', 'C#6/8 R/8', 'A5/8 R/8', 'E5/8 R/8'] },
      // colchón de acordes (dos voces)
      { tipo: 'pad', vol: 0.045, notas: ['F3/16', 'E3/16', 'F3/16', 'F3/16', 'D3/16', 'E3/16', 'F3/16', 'E3/16'] },
      { tipo: 'pad', vol: 0.04, notas: ['A3/16', 'A3/16', 'A3/16', 'A#3/16', 'A#3/16', 'C#4/16', 'A3/16', 'C#4/16'] },
      // bajo profundo
      { tipo: 'grave', vol: 0.22, notas: ['D2/16', 'A1/16', 'D2/16', 'A#1/16', 'G1/16', 'A1/16', 'D2/16', 'A1/16'] },
      // viento entre los árboles
      { tipo: 'viento', vol: 0.06, notas: ['w/32 R/16 w/24 R/24 w/32'] },
      // latido
      { tipo: 'bateria', vol: 0.035, notas: ['k/2 k/2 R/12'] },
    ],
  },
};

const NOTA_BASE = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
function frecuencia(n) {
  const m = n.match(/^([A-G])([#b]?)(\d)$/);
  if (!m) return null;
  let semis = NOTA_BASE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) - 4) * 12;
  return 440 * Math.pow(2, semis / 12);
}
function prepararCancion(c) {
  return c.canales.map(ch => {
    const notas = ch.notas.join(' ').trim().split(/\s+/).map(t => { const [n, l] = t.split('/'); return [n, Number(l)]; });
    const total = notas.reduce((a, x) => a + x[1], 0);
    return { ...ch, lista: notas, total };
  });
}

const MUS = { ctx: null, pista: null, gen: 0, maestro: null, canales: [], inicio: 0, ruido: null, prendida: true };
try { MUS.prendida = localStorage.getItem('cc_musica') !== 'no'; } catch (e) {}

function musicaIniciar() {
  if (MUS.ctx) { if (MUS.ctx.state === 'suspended') MUS.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  MUS.ctx = new AC();
  const n = MUS.ctx.sampleRate;
  MUS.ruido = MUS.ctx.createBuffer(1, n, n);
  const d = MUS.ruido.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  MUS.ondas = {};
}
['keydown', 'pointerdown', 'touchstart'].forEach(ev => window.addEventListener(ev, musicaIniciar, { passive: true }));

function ondaCuadrada(duty) {
  const k = String(duty);
  if (MUS.ondas[k]) return MUS.ondas[k];
  const N = 32, re = new Float32Array(N), im = new Float32Array(N);
  for (let i = 1; i < N; i++) re[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * duty);
  return (MUS.ondas[k] = MUS.ctx.createPeriodicWave(re, im));
}

function musicaCambiar(pista) {
  if (MUS.pista === pista) return;
  MUS.pista = pista;
  MUS.gen++;
  const ctx = MUS.ctx; if (!ctx) return;
  if (MUS.maestro) {
    const viejo = MUS.maestro;
    viejo.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    setTimeout(() => viejo.disconnect(), 600);
    MUS.maestro = null;
  }
  if (!pista || !MUS.prendida) return;
  const c = CANCIONES[pista];
  MUS.maestro = ctx.createGain(); MUS.maestro.gain.value = 0.4; MUS.maestro.connect(ctx.destination);
  MUS.semi = 60 / c.bpm / 4;
  MUS.canales = prepararCancion(c).map(ch => ({ ...ch, i: 0, t: ctx.currentTime + 0.1 }));
}

function tocarNota(ch, nota, t, dur) {
  const ctx = MUS.ctx, out = MUS.maestro;
  if (nota === 'R') return;
  const g = ctx.createGain(); g.connect(out);
  if (ch.tipo === 'bateria') {
    if (nota === 'k') {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(ch.vol * 4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.connect(g); o.start(t); o.stop(t + 0.16);
    } else {
      const s = ctx.createBufferSource(); s.buffer = MUS.ruido;
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = nota === 'h' ? 7000 : 1500;
      const largo = nota === 'h' ? 0.04 : 0.12;
      g.gain.setValueAtTime(ch.vol * (nota === 'h' ? 0.8 : 2.2), t); g.gain.exponentialRampToValueAtTime(0.001, t + largo);
      s.connect(f); f.connect(g); s.start(t, Math.random() * 0.5); s.stop(t + largo + 0.01);
    }
    return;
  }
  // Instrumentos "suaves" (para MISTERIO): viento, flauta, pad, campana y bajo grave
  if (ch.tipo === 'viento') { // ráfaga de viento: ruido filtrado que crece y se apaga
    const s = ctx.createBufferSource(); s.buffer = MUS.ruido; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4;
    f.frequency.setValueAtTime(280, t); f.frequency.linearRampToValueAtTime(950, t + dur * 0.5); f.frequency.linearRampToValueAtTime(320, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(ch.vol, t + dur * 0.5); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); s.start(t); s.stop(t + dur + 0.05);
    return;
  }
  const fr = frecuencia(nota); if (!fr) return;
  if (ch.tipo === 'flauta') { // seno con vibrato y entrada suave
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(fr, t);
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5; lg.gain.value = fr * 0.007;
    lfo.connect(lg); lg.connect(o.frequency);
    const fin = t + dur;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(ch.vol, t + 0.12);
    g.gain.setValueAtTime(ch.vol, Math.max(t + 0.12, fin - 0.12)); g.gain.linearRampToValueAtTime(0.0001, fin + 0.1);
    o.connect(g); o.start(t); lfo.start(t); o.stop(fin + 0.12); lfo.stop(fin + 0.12);
    return;
  }
  if (ch.tipo === 'pad') { // colchón: dos sierras desafinadas apenas, filtradas, que entran y salen despacio
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 750; f.Q.value = 0.6;
    const fin = t + dur;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(ch.vol, t + Math.min(0.8, dur / 3));
    g.gain.setValueAtTime(ch.vol, fin - 0.3); g.gain.linearRampToValueAtTime(0.0001, fin + 0.5);
    for (const det of [-7, 7]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(fr, t); o.detune.value = det; o.connect(f); o.start(t); o.stop(fin + 0.55); }
    f.connect(g);
    return;
  }
  if (ch.tipo === 'campana') { // campanita: fundamental y armónicos "raros" que se apagan solos
    g.gain.setValueAtTime(ch.vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    for (const [mult, v] of [[1, 1], [2.76, 0.35], [5.4, 0.12]]) {
      const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(fr * mult, t); og.gain.value = v;
      o.connect(og); og.connect(g); o.start(t); o.stop(t + 2.5);
    }
    return;
  }
  if (ch.tipo === 'grave') { // bajo profundo y redondo
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(fr, t);
    const fin = t + dur;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(ch.vol, t + 0.08);
    g.gain.setValueAtTime(ch.vol, fin - 0.25); g.gain.linearRampToValueAtTime(0.0001, fin + 0.2);
    o.connect(g); o.start(t); o.stop(fin + 0.25);
    return;
  }
  const o = ctx.createOscillator();
  if (ch.tipo === 'square') o.setPeriodicWave(ondaCuadrada(ch.duty || 0.5)); else o.type = 'triangle';
  o.frequency.setValueAtTime(fr, t);
  const fin = t + dur * 0.92;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(ch.vol, t + 0.01);
  if (ch.tipo === 'square') g.gain.setTargetAtTime(ch.vol * 0.6, t + 0.05, 0.1);
  g.gain.setValueAtTime(g.gain.value, fin - 0.02);
  g.gain.linearRampToValueAtTime(0, fin);
  o.connect(g); o.start(t); o.stop(fin + 0.01);
}

// Qué tema corresponde ahora
function pistaDeseada() {
  if (S.escena === 'batalla' && bt) return bt.ent && /^LÍDER/.test(bt.ent.nombre) ? 'gimnasio' : 'batalla';
  if (S.escena === 'mundo') {
    if (/^gimnasio/.test(S.mapa)) return 'gimnasio';
    const m = MAPAS[S.mapa];
    if (m && (m.cueva || m.oscuro || m.musica === 'misterio')) return 'misterio'; // bosque oscuro y cuevas
    return 'ruta';
  }
  if (S.escena === 'titulo' || S.escena === 'intro') return 'ruta';
  if (S.escena === 'evo') return MUS.pista;
  return null;
}

function musicaTick() {
  const ctx = MUS.ctx;
  if (!ctx || ctx.state !== 'running') return;
  musicaCambiar(MUS.prendida ? pistaDeseada() : null);
  if (!MUS.maestro) return;
  const hasta = ctx.currentTime + 0.25;
  for (const ch of MUS.canales) {
    if (ch.t < ctx.currentTime - 0.5) ch.t = ctx.currentTime + 0.05; // si la pestaña estuvo dormida
    while (ch.t < hasta) {
      const [nota, largo] = ch.lista[ch.i];
      const dur = largo * MUS.semi;
      tocarNota(ch, nota, ch.t, dur);
      ch.t += dur;
      ch.i = (ch.i + 1) % ch.lista.length;
    }
  }
}

function musicaAlternar() {
  MUS.prendida = !MUS.prendida;
  try { localStorage.setItem('cc_musica', MUS.prendida ? 'si' : 'no'); } catch (e) {}
  MUS.pista = undefined;
  musicaCambiar(MUS.prendida ? pistaDeseada() : null);
}

// ================= LOS GUARDIANES: un tema para cada REGI, y REGIOHM los junta a todos =====
// Los seis temas usan los mismos acordes (re menor: Rem · Sib · Do · La · Rem · Solm · Sib · La, 8 compases)
// y cada uno tiene su propio instrumento y su propio dibujo de melodía. Por eso se pueden tocar todos juntos:
// el tema de REGIOHM es la suma de los seis, más un bajo y una batería más pesados.
const ACORDES_REGI = ['Dm', 'Bb', 'C', 'A', 'Dm', 'Gm', 'Bb', 'A'];
const VOZ_REGI = {
  // MENTE: campanitas que dan vueltas como pensamientos
  mente: { tipo: 'campana', vol: 0.05, compases: {
    Dm: 'D6/2 F6/2 A6/2 F6/2 D6/2 A5/2 F6/2 A6/2', Bb: 'Bb5/2 D6/2 F6/2 D6/2 Bb5/2 F5/2 D6/2 F6/2', C: 'C6/2 E6/2 G6/2 E6/2 C6/2 G5/2 E6/2 G6/2',
    A: 'C#6/2 E6/2 A6/2 E6/2 C#6/2 A5/2 E6/2 A6/2', Gm: 'G5/2 Bb5/2 D6/2 Bb5/2 G5/2 D5/2 Bb5/2 D6/2', A2: 'A5/2 C#6/2 E6/2 A6/2 E6/4 R/4' } },
  // ALMA: una flauta lenta y triste
  alma: { tipo: 'flauta', vol: 0.11, sueltos: ['A5/8 F5/4 D5/4', 'D6/8 C6/4 Bb5/4', 'C6/6 E6/2 G6/8', 'E6/12 C#6/4', 'F6/8 E6/4 D6/4', 'D6/8 Bb5/8', 'F5/4 G5/4 A5/4 Bb5/4', 'A5/16'] },
  // PODER: un riff pesado y cortado, como golpes
  poder: { tipo: 'square', duty: 0.5, vol: 0.075, compases: {
    Dm: 'D4/2 D4/1 R/1 D4/2 F4/2 A4/3 G4/1 F4/2 E4/2', Bb: 'Bb3/2 Bb3/1 R/1 Bb3/2 D4/2 F4/3 E4/1 D4/2 C4/2', C: 'C4/2 C4/1 R/1 C4/2 E4/2 G4/3 F4/1 E4/2 D4/2',
    A: 'A3/2 A3/1 R/1 A3/2 C#4/2 E4/4 E4/2 R/2', Gm: 'G3/2 G3/1 R/1 G3/2 Bb3/2 D4/3 C4/1 Bb3/2 A3/2', A2: 'A3/2 A3/2 C#4/2 E4/2 A4/4 R/4' } },
  // REALIDAD: una melodía finita y torcida, siempre a destiempo
  realidad: { tipo: 'square', duty: 0.125, vol: 0.06, compases: {
    Dm: 'R/1 A5/1 R/1 G#5/1 R/1 A5/1 R/1 D6/3 C#6/1 D6/1 F6/2 E6/2', Bb: 'R/1 F5/1 R/1 E5/1 R/1 F5/1 R/1 Bb5/3 A5/1 Bb5/1 D6/2 C6/2',
    C: 'R/1 G5/1 R/1 F#5/1 R/1 G5/1 R/1 C6/3 B5/1 C6/1 E6/2 D6/2', A: 'R/1 E5/1 R/1 D#5/1 R/1 E5/1 R/1 A5/3 G#5/1 A5/1 C#6/2 E6/2',
    Gm: 'R/1 D5/1 R/1 C#5/1 R/1 D5/1 R/1 G5/3 F#5/1 G5/1 Bb5/2 A5/2', A2: 'R/1 E5/1 R/1 D#5/1 R/1 E5/1 R/1 A5/9' } },
  // ESPACIO: arpegios rapidísimos que suben y bajan, como estrellas
  espacio: { tipo: 'square', duty: 0.25, vol: 0.035, compases: {
    Dm: rep('D4/1 F4/1 A4/1 D5/1 F5/1 A5/1 D5/1 A4/1', 2), Bb: rep('Bb3/1 D4/1 F4/1 Bb4/1 D5/1 F5/1 Bb4/1 F4/1', 2), C: rep('C4/1 E4/1 G4/1 C5/1 E5/1 G5/1 C5/1 G4/1', 2),
    A: rep('A3/1 C#4/1 E4/1 A4/1 C#5/1 E5/1 A4/1 E4/1', 2), Gm: rep('G3/1 Bb3/1 D4/1 G4/1 Bb4/1 D5/1 G4/1 D4/1', 2), A2: rep('A3/1 C#4/1 E4/1 A4/1 C#5/1 E5/1 A4/1 E4/1', 2) } },
  // TIEMPO: un colchón de acordes que no se apura
  tiempo: { tipo: 'pad', vol: 0.07, sueltos: ['F4/16', 'D4/16', 'E4/16', 'C#4/16', 'F4/16', 'Bb3/16', 'D4/16', 'C#4/16'] },
};
function vozRegi(k) {
  const v = VOZ_REGI[k];
  const notas = v.sueltos || ACORDES_REGI.map((a, i) => v.compases[i === 7 && v.compases.A2 ? 'A2' : a]);
  return { tipo: v.tipo, duty: v.duty, vol: v.vol, notas };
}
const BAJO_REGI = { tipo: 'triangle', vol: 0.22, notas: [rep('D2/2 D3/2', 4), rep('Bb1/2 Bb2/2', 4), rep('C2/2 C3/2', 4), rep('A1/2 A2/2', 4),
  rep('D2/2 D3/2', 4), rep('G1/2 G2/2', 4), rep('Bb1/2 Bb2/2', 4), rep('A1/2 A2/2', 4)] };
const RELOJ = { tipo: 'bateria', vol: 0.05, notas: ['h/4 h/4 h/4 h/4'] }; // el tic-tac de REGICRONO
for (const k of Object.keys(VOZ_REGI)) {
  const voz = vozRegi(k); voz.vol *= 1.5; // solo: más fuerte
  CANCIONES['regi_' + k] = { bpm: 128, canales: [voz, BAJO_REGI, { tipo: 'bateria', vol: 0.07, notas: ['k/4 s/4 k/2 k/2 s/4'] }, ...(k === 'tiempo' ? [RELOJ] : [])] };
}
CANCIONES.regiohm = {
  bpm: 138,
  canales: [
    ...Object.keys(VOZ_REGI).map(vozRegi),
    { ...BAJO_REGI, vol: 0.26 },
    { tipo: 'bateria', vol: 0.08, notas: ['k/2 h/2 s/2 h/2 k/2 k/2 s/2 h/2', 'k/2 h/2 s/2 h/2 k/2 h/1 h/1 s/2 s/1 s/1'] },
    RELOJ,
  ],
};
// Qué REGI es cada especie
const TEMA_DE_ESPECIE = { regimento: 'regi_mente', regianima: 'regi_alma', regipulso: 'regi_poder', regifracto: 'regi_realidad', regiorbita: 'regi_espacio', regicrono: 'regi_tiempo', regiohm: 'regiohm' };
const _pistaBase = pistaDeseada;
pistaDeseada = function () {
  if (S.escena === 'batalla' && bt && bt.rival && TEMA_DE_ESPECIE[bt.rival.id]) return TEMA_DE_ESPECIE[bt.rival.id];
  if (S.escena === 'batalla' && bt && !bt.rival && MUS.pista && /^regi/.test(MUS.pista)) return MUS.pista; // entre criatura y criatura no cortar
  if (S.escena === 'mundo' && /^templo_/.test(S.mapa)) return 'regi_' + S.mapa.slice(7);
  return _pistaBase();
};
