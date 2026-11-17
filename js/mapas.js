'use strict';
// ===== Paletas de personajes =====
const PAL = {
  felipe: { id: 'felipe', piel: '#f4c8a0', pelo: '#5a3820', gorra: '#6cb4ee', remera: '#6cb4ee', raya: '#ffffff', pant: '#2a3a6a' },
  mama: { id: 'mama', piel: '#f0c098', pelo: '#7a4020', peloLargo: true, remera: '#e07a9a', pant: '#4a4a7a' },
  ceibo: { id: 'ceibo', piel: '#f4c8a0', pelo: '#c0302a', peloLargo: true, remera: '#ffffff', guardapolvo: true, pant: '#3a6a4a' },
  tomi: { id: 'tomi', piel: '#e8b890', pelo: '#202020', remera: '#d84030', pant: '#303030' },
  abuelo: { id: 'abuelo', piel: '#e8b890', pelo: '#d8d8d8', boina: '#2a2a2a', remera: '#9a6a3a', pant: '#5a4a3a', barba: '#e8e8e8' },
  beto: { id: 'beto', piel: '#d8a070', pelo: '#3a2a1a', sombrero: '#3a3030', remera: '#f0ecd8', raya: '#d03030', pant: '#3a3a3a' },
  guarda: { id: 'guarda', piel: '#e8b890', pelo: '#4a3020', sombrero: '#7a8a4a', remera: '#8a9a5a', pant: '#5a4a3a' },
  nene: { id: 'nene', piel: '#f0c098', pelo: '#3a2a1a', remera: '#f0c030', pant: '#3a5a9a' },
  ayudante: { id: 'ayudante', piel: '#e0b088', pelo: '#2a2a2a', remera: '#ffffff', guardapolvo: true, pant: '#4a4a6a' },
  // Litoral
  pescador: { id: 'pescador', piel: '#d8a070', pelo: '#3a2a1a', sombrero: '#d8c080', remera: '#4a8ac8', pant: '#3a3a3a' },
  chica: { id: 'chica', piel: '#f0c098', pelo: '#2a1a10', peloLargo: true, remera: '#58b048', pant: '#7a5a3a' },
  rosa: { id: 'rosa', piel: '#e8b890', pelo: '#a8a8a8', peloLargo: true, remera: '#e08a2a', guardapolvo: true, pant: '#5a4a3a' },
  luna: { id: 'luna', piel: '#f0c8a8', pelo: '#e8e8f8', peloLargo: true, remera: '#7a4aa8', guardapolvo: true, pant: '#3a2a5a' },
  vidente: { id: 'vidente', piel: '#e0b088', pelo: '#2a2a2a', boina: '#f85888', remera: '#9a6ac8', pant: '#3a2a5a' },
  rocio: { id: 'rocio', piel: '#d8a070', pelo: '#3a2a1a', peloLargo: true, gorra: '#f0c030', remera: '#c8603a', pant: '#4a4a5a' },
  tala: { id: 'tala', piel: '#c89060', pelo: '#2a1a10', sombrero: '#3a3030', remera: '#c83a2a', raya: '#f0e0b0', pant: '#3a3a3a' },
  coplera: { id: 'coplera', piel: '#c89060', pelo: '#2a1a10', peloLargo: true, sombrero: '#5a4a3a', remera: '#3a8ac8', pant: '#c83a5a' },
  nena: { id: 'nena', piel: '#f4c8a0', pelo: '#c08040', peloLargo: true, remera: '#f070a0', pant: '#4a6aa8' },
};

function grilla(w, h, ch) { return Array.from({ length: h }, () => Array(w).fill(ch)); }
function llenar(g, x, y, w, h, ch) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && g[j][i] !== undefined) g[j][i] = ch;
}
function desdeTexto(filas) { return filas.map(f => f.split('')); }

function crearPueblo() {
  const w = 22, h = 30, g = grilla(w, h, '.');
  for (let y = 0; y < h; y++) { g[y][0] = g[y][1] = g[y][w - 1] = g[y][w - 2] = 'T'; }
  for (let x = 0; x < w; x++) { g[0][x] = 'T'; g[h - 1][x] = 'T'; }
  // Ruta 1 (al norte)
  llenar(g, 2, 1, 8, 3, ','); llenar(g, 12, 1, 8, 3, ',');
  llenar(g, 5, 4, 3, 2, 'T'); llenar(g, 14, 4, 3, 2, 'T');
  llenar(g, 2, 6, 6, 4, ','); llenar(g, 13, 6, 7, 2, ',');
  llenar(g, 15, 8, 2, 2, 'F');
  for (const y of [10, 11]) for (let x = 2; x < 20; x++) if (x < 9 || x > 12) g[y][x] = 'T';
  // Caminos
  llenar(g, 10, 0, 2, 26, '=');
  llenar(g, 3, 18, 16, 1, '=');
  g[17][5] = '='; g[17][16] = '=';
  llenar(g, 5, 25, 5, 1, '=');
  // Laguna y flores
  llenar(g, 13, 21, 6, 4, '~');
  llenar(g, 2, 19, 3, 1, 'F'); llenar(g, 14, 19, 3, 1, 'F'); llenar(g, 8, 21, 1, 2, 'F'); llenar(g, 15, 27, 3, 1, 'F');
  // Carteles
  g[1][12] = 'S'; g[17][9] = 'S'; g[17][18] = 'S'; g[24][8] = 'S';
  return g;
}

// Grillas del Litoral (T árbol · , pasto alto · = camino · ~ agua · j juncos · h puente · S cartel · F flores)
const RUTA2 = [
  'TTTTTTTTTT==TTTTTTTTTT',
  'TT,,,,,,..==..,,,,,,TT',
  'TT,,,,,,..==..,,,,,,TT',
  'TT..F.....==S...F...TT',
  'TTjj~~~~jj==jj~~~~jjTT',
  'TT~~~~~~~~hh~~~~~~~~TT',
  'TT~~~~~~~~hh~~~~~~~~TT',
  'TTjj~~~~jjhhjj~~~~jjTT',
  'TT........==........TT',
  'TT,,,,,,..==,,,,,,..TT',
  'TT,,,,,,..==,,,,,,..TT',
  'TT,,TT,,..==,,TT,,..TT',
  'TT..TT....======....TT',
  'TT..........,,==....TT',
  'TTj~~jj.....,,==....TT',
  'TT~~~~~j..,,,,==,,,.TT',
  'TT~~~~~j..,,,,==,,,.TT',
  'TTj~~jj...,,,,==,,,.TT',
  'TT........======....TT',
  'TT..,,,,..==....jj~jTT',
  'TT..,,,,..==...j~~~~TT',
  'TT..,,,,..==...j~~~~TT',
  'TT........==....jj~jTT',
  'TT.TT.....======....TT',
  'TT.TT.,,,,....==,,,,TT',
  'TT....,,,,....==,,,,TT',
  'TT....,,,,F...==,,,,TT',
  'TT............==....TT',
  'TTj~~~~jj.....==....TT',
  'TT~~~~~~j.======....TT',
  'TTjjjjj...==........TT',
  'TT,,,,....==..,,,,,,TT',
  'TT,,,,....==.S,,,,,,TT',
  'TT,,,,....==..,,,,,,TT',
  'TT,,,,....==..,,,,,,TT',
  'TTTTTTTTTT==TTTTTTTTTT',
];
const VILLA = [
  'TTTTTTTTTT==TTTTTTTTTT~~',
  'TT........==S.......Tj~~',
  'TT.F......==.......F.j~~',
  'TT........==.........j~~',
  'TT....................j~',
  'TT....................j~',
  'TT....................j~',
  'TT....................j~',
  'TT........==..........j~',
  'TT...=..S.==.....=.S..j~',
  'TT.=================..j~',
  'TT........==.........j~~',
  'TT..F.....==....F...j~~~',
  'TT........==........j~~~',
  'TT........==..~~~~..j~~~',
  'TT........==.j~~~~j.j~~~',
  'TT........==.j~~~~j..j~~',
  'TT........==..jjjj...j~~',
  'TT.FF.....==.........j~~',
  'TT........==.....F...j~~',
  'TT..S.....==.........j~~',
  'TT........==.........Tj~',
  'TT........==.........Tj~',
  'TTTTTTTTTT==TTTTTTTTTTTT',
];

// Grillas de Misiones (Y árbol de selva · q tierra colorada · R roca · : piso de cueva · a amatistas)
const RUTA3 = [
  'YYYYYYYYYYqqYYYYYYYYYY',
  'YY,,,,,,..qq..,,,,,,YY',
  'YY,,YY,,..qq..,,YY,,YY',
  'YY,,YY,,..qq....YY..YY',
  'YY........qqqqqq....YY',
  'YYYY..,,,,,,..qq,,..YY',
  'YYYY..,,,,,,..qq,,..YY',
  'YY~~~~~~~~~~~~hh~~~~YY',
  'YY~~~~~~~~~~~~hh~~~~YY',
  'YY....,,,,....qq....YY',
  'YY....,,,,....qq,,,,YY',
  'YY..YYYY..qqqqqq,,,,YY',
  'YY..YYYY..qq....,,,,YY',
  'YY,,,,....qq..YYYY..YY',
  'YY,,,,....qq..YYYY..YY',
  'YY,,,,..S.qq........YY',
  'YYYY......qqqqqqq...YY',
  'YYYY,,,,,,,,,,..q...YY',
  'YY..,,,,,,,,,,..q,,,YY',
  'YY..,,,,YY,,,,..q,,,YY',
  'YY......YY......q,,,YY',
  'YY..qqqqqqqqqqqqq...YY',
  'YY..q.....YYYY......YY',
  'YY..q,,,,,YYYY,,,,..YY',
  'YY..q,,,,,....,,,,..YY',
  'YY..qqqqqqqq..,,,,..YY',
  'YY,,,,,,..qq..YY....YY',
  'YY,,,,,,..qq..YY,,,,YY',
  'YYYY......qq....,,,,YY',
  'YY....F...qq..S.,,,,YY',
  'YY,,,,....qq........YY',
  'YY,,,,....qq..,,,,..YY',
  'YY,,,,....qq..,,,,..YY',
  'YYYYYYYYYYqqYYYYYYYYYY',
];
const MINAS = [
  'RRRRRRRRRqqRRRRRRRRR',
  'RR::::::::::::::::RR',
  'RR::RRRR::::RRRR::RR',
  'RR::RaaR::::RaaR::RR',
  'RR::::::::RR::::::RR',
  'RRRRRR::::RR::RRRRRR',
  'RR::::::::::::::::RR',
  'RR::RRRRRRRR::RR::RR',
  'RR::::::::RR::RR::RR',
  'RRRRRR::::RR::::::RR',
  'RRa:::::::RRRRRR::RR',
  'RRa:::RR::::::::::RR',
  'RR::::RR::RRRRRRRRRR',
  'RR::::RR::::::::::RR',
  'RRRR::RRRRRRRR::::RR',
  'RR::::::::::::::a:RR',
  'RR::RRRRRR::RRRR::RR',
  'RR::RaaaaR::RRRR::RR',
  'RR::::::::::::::::RR',
  'RRRRRRRR::RRRRRRRRRR',
  'RR::::::::::::::::RR',
  'RR::::::::::::::::RR',
  'RRRRRRRRRqqRRRRRRRRR',
];
const PUERTO = [
  'YYYYYYYYYYqqYYYYYYYYYYYY',
  'YY........qqS.........YY',
  'YY..F.....qq.......F..YY',
  'YY........qq..........YY',
  'YY....................YY',
  'YY....................YY',
  'YY....................YY',
  'YY....................YY',
  'YY........qq..........YY',
  'YY...q..S.qq.....q.S..YY',
  'YY.qqqqqqqqqqqqqqqqq..YY',
  'YY........qq..........YY',
  'YY..F.....qq....F.....YY',
  'YY........qq..........YY',
  'YY........qq..........YY',
  'YY........qq..........YY',
  'YY........qq..........YY',
  'YY........qq..........YY',
  'YY..S.....qq......F...YY',
  'YY........qq..........YY',
  'YY........qq..........YY',
  'YYYYYYYYYYqqYYYYYYYYYYYY',
];

// Grillas del Norte (- arena · u paja brava (criaturas) · C cerros de colores · K cardón)
const RUTA4 = [
  'YYYYYYYYYY==YYYYYYYYYY',
  'YY,,,,,,..==..,,,,,,YY',
  'YY,,YYYY..==..YYYY,,YY',
  'YY,,YYYY..==..YYYY,,YY',
  'YY........======....YY',
  'YY..,,,,,,,,..==,,..YY',
  'YY..,,,,,,,,..==,,..YY',
  'YYYY,,,,YY,,..==,,YYYY',
  'YYYY....YY....==..YYYY',
  'YY~~~~~~~~~~~~hh~~~~YY',
  'YY~~~~~~~~~~~~hh~~~~YY',
  'YY....,,,,....==....YY',
  'YY..============S...YY',
  'YY..==..,,,,,,,,,,..YY',
  'YY..==..,,,,,,,,,,..YY',
  'YY..==..YYYY..YYYY..YY',
  'YY..==..YYYY..YYYY..YY',
  'YY..==========......YY',
  'YY,,,,,,,,,,==,,,,..YY',
  'YY,,,,,,,,,,==,,,,..YY',
  'YY,,YYYY,,,,==YYYY..YY',
  'YY..YYYY....==YYYY..YY',
  'YY..........==......YY',
  'YY...=========..,,,,YY',
  'YY...=..,,,,....,,,,YY',
  'YY...=..,,,,..YY,,,,YY',
  'YY...=..,,,,..YY....YY',
  'YY...======.........YY',
  'YY,,,,,,..==..,,,,,,YY',
  'YY,,,,,,..==..,,,,,,YY',
  'YY....F...==.S..F...YY',
  'YY,,,,....==....,,,,YY',
  'YY,,,,....==....,,,,YY',
  'YYYYYYYYYY==YYYYYYYYYY',
];
const CALILEGUA = [
  'YYYYYYYYYY==YYYYYYYYYY',
  'YY........==S.......YY',
  'YY..F.....==....F...YY',
  'YY........==........YY',
  'YY........==........YY',
  'YY........==........YY',
  'YY........==........YY',
  'YY...=..S.==...=....YY',
  'YY..=========.......YY',
  'YY........==........YY',
  'YY..F.....==...~~~..YY',
  'YY........==..~~~~~.YY',
  'YY..S.....==...~~~..YY',
  'YY........==........YY',
  'YYYYYYYYYY==YYYYYYYYYY',
];
const RUTA5 = [
  'CCCCCCCCCC==CCCCCCCCCC',
  'CC--uuuu--==--uuuu--CC',
  'CC--uuuu--==--uuuu--CC',
  'CC-K------==------K-CC',
  'CCCC--K---======--CCCC',
  'CCCC------uuu-==--CCCC',
  'CC--uuuuu-uuu-==K---CC',
  'CC--uuuuu-----==----CC',
  'CC-K---CCCC---==-uu-CC',
  'CC-----CCCC---==Suu-CC',
  'CC--============-uu-CC',
  'CC--=---------------CC',
  'CC--=--K--uuuuuu--K-CC',
  'CC--=-----uuuuuu----CC',
  'CCC-=---CCCuuuuu--CCCC',
  'CCC-=---CCC-------CCCC',
  'CC--==========------CC',
  'CC---uuuuu---=--K---CC',
  'CC-K-uuuuu---=------CC',
  'CC---uuuuu---=-CCC--CC',
  'CC-----------=-CCC--CC',
  'CCCC--K---====------CC',
  'CCCC------=----uuu--CC',
  'CC--uuuu--=----uuu--CC',
  'CC--uuuu--=--K-uuu--CC',
  'CC--------=---------CC',
  'CC-K--CCC-====--K---CC',
  'CC----CCC----=------CC',
  'CC--uuuu-----=-uuuu-CC',
  'CC--uuuu--====-uuuu-CC',
  'CC--------==---uuuu-CC',
  'CC-K------==-S------CC',
  'CC--uuuu--==---uuu--CC',
  'CC--uuuu--==---uuu--CC',
  'CCCCCCCCCC==CCCCCCCCCC',
];
const TILCARA = [
  'CCCCCCCCCC==CCCCCCCCCCCC',
  'CC--------==S---------CC',
  'CC--K-----==-------K--CC',
  'CC--------==----------CC',
  'CC------------.......-CC',
  'CC-.....------.......-CC',
  'CC-.....------.......-CC',
  'CC-.....------.......-CC',
  'CC-.....--==--.......-CC',
  'CC---=--S-==-----=-S--CC',
  'CC-=================--CC',
  'CC--------==----------CC',
  'CC--K-----==----K-----CC',
  'CC-.....--==--.....---CC',
  'CC-.....--==--.....---CC',
  'CC-.....--==--.....---CC',
  'CC-.....--==--.....---CC',
  'CC--------==----------CC',
  'CC--S-----==------K---CC',
  'CC--------==----------CC',
  'CC--------==----------CC',
  'CCCCCCCCCC==CCCCCCCCCCCC',
];

// Casa del Mate (se puede repetir en cada pueblo)
function crearCentro(destino, ax, ay, idCentro) {
  return {
    nombre: 'CASA DEL MATE',
    grilla: desdeTexto([
      '#########',
      '#k_x_x_p#',
      '#tt___tt#',
      '#_______#',
      '#_______#',
      '#p_____p#',
      '#_______#',
      '####m####',
    ]),
    edificios: [],
    salidas: [{ x: 4, y: 7, a: destino, ax, ay, dir: 0 }],
    objetos: {
      k: 'Un estante lleno de termos, yerbas y bombillas de todos los colores.',
      x: 'Un cuadro del río Paraná al atardecer.',
      t: 'El mostrador de la Casa del Mate.',
      p: 'Una planta de mburucuyá con flores violetas.',
    },
    npcs: [
      {
        id: 'rosa', x: 4, y: 2, dir: 0, pal: PAL.rosa,
        hablar: async () => {
          await decir('DOÑA ROSA: ¡Bienvenido a la CASA DEL MATE! ¿Tus criaturas están cansadas?');
          if (!S.equipo.length) { await decir('Ah, todavía no tenés criaturas. ¡Volvé cuando tengas!'); return; }
          curarEquipo();
          S.flags.centro = { mapa: idCentro, x: 4, y: 4, dir: 1 };
          await decir('Unos mates bien cebados y... ¡listo! Tus criaturas recuperaron toda su energía.');
          await decir('DOÑA ROSA: Si pierden una pelea, te traemos acá a descansar. ¡Volvé cuando quieras!');
          guardar();
        },
      },
    ],
  };
}

// Entrenador que pelea una sola vez (queda anotado en S.flags.ent_<id>)
function entrenadorNPC(o) {
  return {
    id: o.id, x: o.x, y: o.y, dir: o.dir, pal: o.pal,
    hablar: async () => {
      const clave = 'ent_' + o.id;
      if (S.flags[clave]) { await decir(o.despues); return; }
      for (const t of o.antes) await decir(t);
      const r = await batalla({ entrenador: { nombre: o.nombre, pal: o.pal, equipo: o.equipo } });
      if (r === 'gana') {
        S.flags[clave] = true;
        await decir(o.gana);
        guardar();
      }
    },
  };
}

const MAPAS = {
  pueblo: {
    nombre: 'PUEBLO TERO',
    grilla: crearPueblo(),
    edificios: [
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: true },
      { x: 13, y: 13, w: 6, h: 4, tipo: 'lab', puerta: 3, abre: true },
      { x: 3, y: 21, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 5, y: 16, a: 'casa', ax: 4, ay: 6, dir: 1 },
      { x: 16, y: 16, a: 'lab', ax: 5, ay: 8, dir: 1 },
      { x: 10, y: 0, a: 'ruta2', ax: 10, ay: 34, dir: 1 },
      { x: 11, y: 0, a: 'ruta2', ax: 11, ay: 34, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 1. Al norte: el LITORAL. ¡Cuidado con el pasto alto!',
      '9,17': 'PUEBLO TERO. Donde el viento trae el grito de los teros.',
      '18,17': 'LABORATORIO de la PROFESORA CEIBO. Estudio de Criaturas Criollas.',
      '8,24': 'CASA DE TOMI.',
    },
    encuentros: { lista: [['terito', 33], ['vizcachita', 28], ['peludin', 20], ['hornerito', 14], ['condorito', 5]], min: 2, max: 4 },
    disparadores: [
      {
        prueba: (x, y) => y === 11 && !S.flags.inicial,
        accion: async () => {
          const g = npcPorId('guarda'); if (g) g.dir = 2;
          await decir('GUARDAPARQUE: ¡Eh, Felipe! ¡Pará, pará!');
          await decir('El pasto alto está lleno de criaturas salvajes. No podés ir sin una criatura que te cuide.');
          await decir('Pasá por el laboratorio de la Profesora Ceibo. ¡Te está esperando!');
          await pasoForzado(0);
        },
      },
    ],
    npcs: [
      {
        id: 'guarda', x: 12, y: 12, dir: 2, pal: PAL.guarda,
        hablar: async () => {
          if (!S.flags.inicial) await decir('GUARDAPARQUE: Sin una criatura no te dejo pasar al pasto alto. ¡Es por tu seguridad!');
          else await decir('GUARDAPARQUE: ¡Ya tenés compañero! En el pasto alto hay teros, vizcachas, peludos y horneros. Dicen que a veces baja un CONDORITO de los riscos...');
        },
      },
      {
        id: 'abuelo', x: 17, y: 20, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          await decir('ABUELO: Buenas, m\'hijo. ¿Se toma un matecito?');
          if (S.equipo.length) {
            curarEquipo();
            await decir('¡Tus criaturas se tomaron unos mates y recuperaron toda su energía!');
            await decir('ABUELO: Cuando estén cansadas, vení a verme. Acá siempre hay agua caliente.');
          } else {
            await decir('ABUELO: Ah, ¿todavía no tenés criatura? La Profe Ceibo te va a dar una, ya vas a ver.');
          }
        },
      },
      {
        id: 'nene', x: 6, y: 27, dir: 3, pal: PAL.nene,
        hablar: async () => {
          await decir('NENE: ¿Sabías que el tero grita fuertísimo para cuidar su nido?');
          await decir('¡Por eso a los teritos no hay que molestarlos cuando están con sus pichones!');
        },
      },
      {
        id: 'beto', x: 9, y: 7, dir: 3, pal: PAL.beto,
        hablar: async () => {
          if (S.flags.beto) { await decir('GAUCHO BETO: Seguí entrenando, gurí. El Litoral te espera.'); return; }
          await decir('GAUCHO BETO: ¡Epa, gurí! ¿Te animás a un duelo criollo?');
          const r = await batalla({ entrenador: { nombre: 'GAUCHO BETO', pal: PAL.beto, equipo: [['peludin', 4], ['terito', 4]] } });
          if (r === 'gana') {
            S.flags.beto = true;
            await decir('GAUCHO BETO: ¡Qué baqueano que sos! Tomá, te lo ganaste.');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 1;
            await decir('¡Felipe recibió un ALFAJOR!');
            guardar();
          }
        },
      },
    ],
  },

  casa: {
    nombre: 'CASA DE FELIPE',
    grilla: desdeTexto([
      '#########',
      '#kk__x_p#',
      '#_______#',
      '#__tt___#',
      '#_______#',
      '#_____b_#',
      '#_______#',
      '####m####',
    ]),
    edificios: [],
    salidas: [{ x: 4, y: 7, a: 'pueblo', ax: 5, ay: 17, dir: 0 }],
    objetos: {
      k: 'Libros de animales de la Argentina. ¡Hay uno sobre el yaguareté!',
      x: 'En la tele pasan un partido de fútbol. ¡Goooool!',
      p: 'Una planta de mburucuyá. ¡Tiene una flor violeta!',
      b: 'Tu cama. Todavía está calentita.',
      t: 'Sobre la mesa hay un termo y un mate.',
    },
    npcs: [
      {
        id: 'mama', x: 5, y: 3, dir: 2, pal: PAL.mama,
        hablar: async () => {
          if (!S.flags.inicial) {
            await decir('MAMÁ: ¡Buen día, Felipe! La Profesora Ceibo te anda buscando.');
            await decir('Su laboratorio está acá nomás, saliendo a la derecha. ¡Andá, que te espera!');
          } else {
            await decir('MAMÁ: ¡Felipe! ¿Cómo andan tus criaturas? Descansen un ratito acá.');
            curarEquipo();
            await decir('¡Tus criaturas recuperaron toda su energía!');
            await decir('MAMÁ: ¡Cuidate mucho y volvé para la cena!');
          }
        },
      },
    ],
  },

  lab: {
    nombre: 'LABORATORIO',
    grilla: desdeTexto([
      '###########',
      '#kkkkk_kkk#',
      '#_________#',
      '#___ooo___#',
      '#_________#',
      '#c_______p#',
      '#_________#',
      '#__rrrrr__#',
      '#_________#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 9, a: 'pueblo', ax: 16, ay: 17, dir: 0 }],
    objetos: {
      k: 'Libros sobre criaturas de todas las regiones: la Selva, la Puna, la Patagonia...',
      c: 'La compu de la Profe. Dice: "REGISTRO DE CRIATURAS CRIOLLAS: en construcción".',
      p: 'Un helecho gigante de la selva misionera.',
    },
    boleadoras: [{ x: 4, y: 3, id: 'ramoa' }, { x: 5, y: 3, id: 'flamartija' }, { x: 6, y: 3, id: 'ajolodo' }],
    npcs: [
      {
        id: 'ceibo', x: 5, y: 2, dir: 0, pal: PAL.ceibo,
        hablar: async () => {
          if (!S.flags.inicial) {
            if (!S.flags.hablóProfe) {
              await decir('PROFE CEIBO: ¡Felipe! ¡Qué bueno que viniste!');
              await decir('Hoy es un día especial: vas a recibir tu primera CRIATURA CRIOLLA.');
              await decir('Sobre la mesa hay tres BOLEADORAS. En cada una descansa una criatura.');
              await decir('Una de PLANTA, una de FUEGO y una de AGUA. ¡Elegí la que más te guste!');
              S.flags.hablóProfe = true;
            } else {
              await decir('PROFE CEIBO: Las boleadoras están sobre la mesa. ¡Mirálas con calma!');
            }
          } else if (!S.flags.regalos) {
            await entregarRegalos();
          } else {
            await decir('PROFE CEIBO: En cada región de nuestro país hay un GIMNASIO. ¡Ganá las 8 insignias y llegá a la Liga del Fin del Mundo!');
          }
        },
      },
      {
        id: 'tomi', x: 8, y: 4, dir: 2, pal: PAL.tomi, visible: () => !S.flags.tomiSeFue,
        hablar: async () => {
          if (!S.flags.inicial) await decir('TOMI: ¡Hola, Felipe! Yo ya sé cuál voy a elegir... ¡Pero elegí vos primero!');
          else await decir('TOMI: ...');
        },
      },
      {
        id: 'ayudante', x: 2, y: 6, dir: 3, pal: PAL.ayudante,
        hablar: async () => {
          await decir('AYUDANTE: Las criaturas de PLANTA le ganan a las de AGUA, las de AGUA a las de FUEGO, y las de FUEGO a las de PLANTA.');
          await decir('¡Pensá bien antes de cada pelea!');
        },
      },
    ],
  },
  // ================= LITORAL =================
  ruta2: {
    nombre: 'RUTA 2 · ESTEROS',
    exterior: true,
    grilla: desdeTexto(RUTA2),
    edificios: [],
    salidas: [
      { x: 10, y: 35, a: 'pueblo', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 35, a: 'pueblo', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'villa', ax: 10, ay: 22, dir: 1 },
      { x: 11, y: 0, a: 'villa', ax: 11, ay: 22, dir: 1 },
    ],
    carteles: {
      '12,3': 'VILLA CAMALOTE, acá nomás al norte. ¡Cuidado con los mosquitos!',
      '13,32': 'RUTA 2 · LOS ESTEROS. Por el puente de madera se cruza la laguna.',
    },
    encuentros: { lista: [['larvin', 26], ['carpinchu', 22], ['junquito', 22], ['terito', 14], ['yacarelito', 10], ['ceibito', 6]], min: 6, max: 9 },
    npcs: [
      entrenadorNPC({
        id: 'pescador', x: 12, y: 16, dir: 2, pal: PAL.pescador, nombre: 'PESCADOR RAÚL',
        equipo: [['carpinchu', 8], ['larvin', 9]],
        antes: ['PESCADOR RAÚL: ¡Shh! Me espantás los dorados...', '¡Bueno, ya que estás, peleemos!'],
        gana: 'PESCADOR RAÚL: Me ganaste... Hoy no pica nada, ¡ni los peces ni mis criaturas!',
        despues: 'PESCADOR RAÚL: En el agua de la laguna viven los JUNQUITOS. Parecen totoras, ¡pero tienen ojitos!',
      }),
      entrenadorNPC({
        id: 'chica_estero', x: 16, y: 27, dir: 2, pal: PAL.chica, nombre: 'GUÍA SOLE',
        equipo: [['junquito', 9], ['terito', 9], ['ceibito', 10]],
        antes: ['GUÍA SOLE: ¡Bienvenido a los esteros! Acá las criaturas son de PLANTA y de AGUA.', '¿Querés ver a las mías?'],
        gana: 'GUÍA SOLE: ¡Qué bien entrenaste! Seguro le vas a dar pelea a LUNA.',
        despues: 'GUÍA SOLE: LUNA, la líder del gimnasio, usa criaturas que te leen la mente. ¡Dicen que los BICHOS la ponen nerviosa!',
      }),
      {
        id: 'nena', x: 12, y: 8, dir: 2, pal: PAL.nena,
        hablar: async () => {
          await decir('NENA: ¿Viste las larvitas que nadan en zigzag? ¡Son LARVINES!');
          await decir('Cuando crecen se vuelven MOSQUILLONES y zumban un montón. ¡Bzzzz!');
        },
      },
    ],
  },

  villa: {
    nombre: 'VILLA CAMALOTE',
    exterior: true,
    grilla: desdeTexto(VILLA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 23, a: 'ruta2', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 23, a: 'ruta2', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio', ax: 5, ay: 10, dir: 1 },
      { x: 10, y: 0, a: 'ruta3', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'ruta3', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 3. Hacia la SELVA MISIONERA y las MINAS DE WANDA.',
      '8,9': 'CASA DEL MATE. Tus criaturas descansan gratis. ¡Siempre hay agua caliente!',
      '19,9': 'GIMNASIO DE VILLA CAMALOTE. Líder: LUNA, la que ve más allá del agua. Tipo PSÍQUICO.',
      '4,20': 'VILLA CAMALOTE. Donde el río trae flores flotantes.',
    },
    npcs: [
      {
        id: 'nene_villa', x: 7, y: 18, dir: 0, pal: PAL.nene,
        hablar: async () => {
          await decir('NENE: ¿Sabías que los camalotes son plantas que flotan y viajan por el río?');
          await decir('¡A veces llevan arriba ranas, bichitos y hasta algún yacaré chiquito!');
        },
      },
      {
        id: 'pescador_villa', x: 19, y: 15, dir: 2, pal: PAL.pescador,
        hablar: async () => {
          if (S.flags.insignia1) await decir('PESCADOR: ¡Así que le ganaste a LUNA! Ahora sí que sos un baqueano del Litoral.');
          else {
            await decir('PESCADOR: Las criaturas PSÍQUICAS le tienen miedo a los BICHOS, a los FANTASMAS y a las SINIESTRAS.');
            await decir('Y las PSÍQUICAS le pegan fuerte a las de LUCHA y VENENO. ¡Pensalo antes de entrar al gimnasio!');
          }
        },
      },
    ],
  },

  centro: crearCentro('villa', 5, 9, 'centro'),

  gimnasio: {
    nombre: 'GIMNASIO CAMALOTE',
    grilla: desdeTexto([
      '###########',
      '#g_______g#',
      '#vvvvrvvvv#',
      '#vgvvrvvgv#',
      '#vvvvrvvvv#',
      '#gvvvrvvvg#',
      '#vvvvrvvvv#',
      '#vgvvrvvgv#',
      '#vvvvrvvvv#',
      '#vvvvrvvvv#',
      '#vvvvrvvvv#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'villa', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      g: 'Una esfera de cristal. Adentro se ven nubes que se mueven solas...',
    },
    npcs: [
      entrenadorNPC({
        id: 'vidente1', x: 3, y: 8, dir: 3, pal: PAL.vidente, nombre: 'ADIVINO TITO',
        equipo: [['condorito', 12], ['larvin', 12]],
        antes: ['ADIVINO TITO: Ya sabía que ibas a venir...', '¡Y también sé que vas a perder!'],
        gana: 'ADIVINO TITO: Eso... eso no lo vi venir.',
        despues: 'ADIVINO TITO: LUNA te espera al fondo. Sus criaturas florecen en el estero.',
      }),
      entrenadorNPC({
        id: 'vidente2', x: 7, y: 4, dir: 2, pal: PAL.vidente, nombre: 'ADIVINA MARGA',
        equipo: [['ceibito', 13], ['condorito', 13]],
        antes: ['ADIVINA MARGA: Las cartas dicen que hoy hay pelea. ¡Las cartas nunca fallan!'],
        gana: 'ADIVINA MARGA: Mmm... Tendría que haber mezclado mejor las cartas.',
        despues: 'ADIVINA MARGA: Las criaturas de LUNA son rápidas. ¡Llevá mates por las dudas!',
      }),
      {
        id: 'luna', x: 5, y: 1, dir: 0, pal: PAL.luna,
        hablar: async () => {
          if (S.flags.insignia1) {
            await decir('LUNA: El espejo del estero ya te mostró tu camino. Seguí viaje, Felipe.');
            return;
          }
          await decir('LUNA: Hola, Felipe. Te estaba esperando... lo vi en el reflejo del agua.');
          await decir('Soy LUNA, líder del GIMNASIO CAMALOTE. Mis criaturas sienten lo que pensás antes de que te muevas.');
          await decir('Si me ganás, te llevás la INSIGNIA ESPEJO. ¿Empezamos?');
          const r = await batalla({ entrenador: { nombre: 'LÍDER LUNA', pal: PAL.luna, equipo: [['condorito', 14], ['ceibito', 14], ['anahisa', 16]] } });
          if (r === 'gana') {
            S.flags.insignia1 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 1);
            await decir('LUNA: Tu mente es clara como el agua del Iberá. Te ganaste esto.');
            await decir('¡Felipe recibió la INSIGNIA ESPEJO!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 3;
            await decir('LUNA: Y llevate estos ALFAJORES para el viaje. ¡Te vas a encontrar con criaturas cada vez más fuertes!');
            guardar();
          }
        },
      },
    ],
  },
  // ================= SELVA MISIONERA =================
  ruta3: {
    nombre: 'RUTA 3 · SELVA MISIONERA',
    exterior: true,
    grilla: desdeTexto(RUTA3),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'villa', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'villa', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'minas', ax: 9, ay: 21, dir: 1 },
      { x: 11, y: 0, a: 'minas', ax: 10, ay: 21, dir: 1 },
    ],
    carteles: {
      '8,15': 'RUTA 3 · SELVA MISIONERA. La tierra es colorada por el hierro de las piedras.',
      '14,29': 'Al norte: MINAS DE WANDA y PUERTO WANDA. ¡Llevá mates!',
    },
    encuentros: { lista: [['peluchin', 26], ['cuisito', 20], ['hornerito', 16], ['piedrin', 16], ['larvin', 10], ['zorrito', 8], ['ceibito', 4]], min: 11, max: 15 },
    npcs: [
      entrenadorNPC({
        id: 'guardaparque_selva', x: 12, y: 13, dir: 2, pal: PAL.guarda, nombre: 'GUARDAPARQUE ANA',
        equipo: [['cuisito', 13], ['hornerito', 14]],
        antes: ['GUARDAPARQUE ANA: ¡Alto ahí! En la selva hay que saber cuidarse.', '¡A ver si tus criaturas están preparadas!'],
        gana: 'GUARDAPARQUE ANA: ¡Muy bien! Estás listo para seguir.',
        despues: 'GUARDAPARQUE ANA: Si ves un PELUCHÍN, no lo toques con la mano. ¡Pica muchísimo!',
      }),
      entrenadorNPC({
        id: 'cazabichos', x: 6, y: 18, dir: 0, pal: PAL.nene, nombre: 'CAZABICHOS JUANI',
        equipo: [['peluchin', 12], ['capullon', 14], ['larvin', 13]],
        antes: ['CAZABICHOS JUANI: ¡Mirá todos los bichos que atrapé! ¿Peleamos?'],
        gana: 'CAZABICHOS JUANI: ¡Nooo! Mis bichitos...',
        despues: 'CAZABICHOS JUANI: Los PELUCHINES se hacen capullo y después... ¡POLILLACA! Dicen que tiene ojos de yaguareté en las alas.',
      }),
      entrenadorNPC({
        id: 'mochilera', x: 13, y: 25, dir: 2, pal: PAL.chica, nombre: 'MOCHILERA FLOR',
        equipo: [['junquito', 14], ['piedrin', 15]],
        antes: ['MOCHILERA FLOR: ¡Vengo de las Cataratas! ¿Me das un duelo para despedirme de la selva?'],
        gana: 'MOCHILERA FLOR: ¡Qué bien peleás! Me voy contenta.',
        despues: 'MOCHILERA FLOR: En las MINAS DE WANDA hay piedras preciosas... ¡y criaturas que parecen piedras!',
      }),
    ],
  },

  minas: {
    nombre: 'MINAS DE WANDA',
    exterior: true,
    cueva: true,
    grilla: desdeTexto(MINAS),
    edificios: [],
    salidas: [
      { x: 9, y: 22, a: 'ruta3', ax: 10, ay: 1, dir: 0 },
      { x: 10, y: 22, a: 'ruta3', ax: 11, ay: 1, dir: 0 },
      { x: 9, y: 0, a: 'puerto', ax: 10, ay: 20, dir: 1 },
      { x: 10, y: 0, a: 'puerto', ax: 11, ay: 20, dir: 1 },
    ],
    objetos: {
      a: '¡Cristales de amatista violeta! Brillan con luz propia.',
    },
    encuentros: { lista: [['piedrin', 32], ['geodin', 22], ['peludin', 20], ['condorito', 8], ['capullon', 10], ['vizcachita', 8]], min: 14, max: 18 },
    npcs: [
      entrenadorNPC({
        id: 'minero1', x: 14, y: 13, dir: 2, pal: PAL.beto, nombre: 'MINERO HUGO',
        equipo: [['piedrin', 16], ['geodin', 17]],
        antes: ['MINERO HUGO: ¡Eh, pibe! Esta mina es peligrosa.', '¡Te muestro cómo pelean las criaturas de piedra!'],
        gana: 'MINERO HUGO: ¡Uf! Me dejaste más molido que una piedra.',
        despues: 'MINERO HUGO: Los GEODINES tienen cristales adentro. Cuando crecen se vuelven WANDACOLOSOS, ¡enormes!',
      }),
      entrenadorNPC({
        id: 'minero2', x: 12, y: 6, dir: 2, pal: PAL.abuelo, nombre: 'MINERO DON PEDRO',
        equipo: [['peludin', 17], ['piedrin', 18], ['hornerito', 17]],
        antes: ['MINERO DON PEDRO: Cuarenta años picando piedra, m\'hijo. ¡A ver qué traés!'],
        gana: 'MINERO DON PEDRO: Bien, bien. Tenés pasta de campeón.',
        despues: 'MINERO DON PEDRO: Contra las criaturas de ROCA, usá AGUA, PLANTA o LUCHA. ¡No falla!',
      }),
    ],
  },

  puerto: {
    nombre: 'PUERTO WANDA',
    exterior: true,
    grilla: desdeTexto(PUERTO),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio2', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'minas', ax: 9, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'minas', ax: 10, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro2', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio2', ax: 5, ay: 10, dir: 1 },
      { x: 10, y: 0, a: 'ruta4', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'ruta4', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 4. Hacia las YUNGAS y el NORTE ARGENTINO.',
      '8,9': 'CASA DEL MATE. Tus criaturas descansan gratis.',
      '19,9': 'GIMNASIO DE PUERTO WANDA. Líder: ROCÍO, la minera de corazón de piedra. Tipo ROCA.',
      '4,18': 'PUERTO WANDA. Tierra colorada, yerba mate y piedras preciosas.',
    },
    npcs: [
      {
        id: 'tarefero', x: 7, y: 11, dir: 0, pal: PAL.guarda,
        hablar: async () => {
          await decir('TAREFERO: Yo cosecho yerba mate en los yerbales. ¡Los CUISITOS siempre andan escondidos entre las plantas!');
        },
      },
      {
        id: 'tomi2', x: 13, y: 18, dir: 2, pal: PAL.tomi,
        hablar: async () => {
          if (S.flags.tomi2) { await decir('TOMI: ¡La próxima te gano seguro! Voy a entrenar en las minas.'); return; }
          await decir('TOMI: ¡Felipe! ¡Sabía que te iba a encontrar acá!');
          await decir('TOMI: Yo también vengo por la insignia de ROCÍO. ¡Pero primero te gano a vos!');
          const fuerte = { flamartija: 'dracobrasa', ajolodo: 'branquiotox', ramoa: 'lianaco' };
          const mio = S.flags.inicialTomi || 'ramoa';
          const r = await batalla({ entrenador: { nombre: 'TOMI', pal: PAL.tomi, equipo: [['terito', 17], ['piedrin', 17], [fuerte[mio] || mio, 19]] } });
          if (r === 'gana') {
            S.flags.tomi2 = true;
            await decir('TOMI: ¡Otra vez! ¿Cómo hacés? Bueno... tomá, por ganarme.');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 2;
            await decir('¡Felipe recibió 2 ALFAJORES!');
            guardar();
          }
        },
      },
    ],
  },

  centro2: crearCentro('puerto', 5, 9, 'centro2'),

  gimnasio2: {
    nombre: 'GIMNASIO WANDA',
    grilla: desdeTexto([
      '###########',
      '#R_______R#',
      '#__RR_RR__#',
      '#a_______a#',
      '#RR_R_R_RR#',
      '#_________#',
      '#__RR_RR__#',
      '#_________#',
      '#R__R_R__R#',
      '#_________#',
      '#_________#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'puerto', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      R: 'Una roca enorme traída de las minas.',
      a: 'Cristales de amatista. ¡Son el orgullo de Puerto Wanda!',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim2_a', x: 2, y: 7, dir: 3, pal: PAL.beto, nombre: 'PICAPEDRERO LUCAS',
        equipo: [['piedrin', 20], ['geodin', 21]],
        antes: ['PICAPEDRERO LUCAS: ¡Para llegar a ROCÍO tenés que pasar por mí!'],
        gana: 'PICAPEDRERO LUCAS: Me partiste como a una piedra...',
        despues: 'PICAPEDRERO LUCAS: Las criaturas de ROCÍO son durísimas. ¡Golpeá con AGUA o PLANTA!',
      }),
      entrenadorNPC({
        id: 'gim2_b', x: 8, y: 5, dir: 2, pal: PAL.abuelo, nombre: 'GEÓLOGO ÁLVARO',
        equipo: [['peludin', 21], ['micalonco', 22]],
        antes: ['GEÓLOGO ÁLVARO: Estas rocas tienen millones de años. ¡Y mis criaturas también son duras como ellas!'],
        gana: 'GEÓLOGO ÁLVARO: Interesante... Muy interesante.',
        despues: 'GEÓLOGO ÁLVARO: MICALONCO tiene escamas de mica que brillan como espejos. ¡Es mi favorito!',
      }),
      {
        id: 'rocio', x: 5, y: 1, dir: 0, pal: PAL.rocio,
        hablar: async () => {
          if (S.flags.insignia2) {
            await decir('ROCÍO: Tenés la fuerza de una montaña, Felipe. ¡El norte te espera!');
            return;
          }
          if (!S.flags.insignia1) {
            await decir('ROCÍO: ¿Todavía no tenés la INSIGNIA ESPEJO? Primero ganale a LUNA en Villa Camalote.');
            return;
          }
          await decir('ROCÍO: ¡Bienvenido a las profundidades de Puerto Wanda!');
          await decir('Soy ROCÍO, líder del GIMNASIO WANDA. Mis criaturas nacieron entre cristales y tierra colorada.');
          await decir('¡Si querés la INSIGNIA AMATISTA, vas a tener que romper la piedra!');
          const r = await batalla({ entrenador: { nombre: 'LÍDER ROCÍO', pal: PAL.rocio, equipo: [['piedrin', 21], ['geodin', 22], ['micalonco', 24]] } });
          if (r === 'gana') {
            S.flags.insignia2 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 2);
            await decir('ROCÍO: ¡Increíble! Rompiste mi defensa de piedra.');
            await decir('¡Felipe recibió la INSIGNIA AMATISTA!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 3;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('ROCÍO: Y llevate estos ALFAJORES y BOLEADORAS. ¡En el norte hay criaturas que todavía nadie atrapó!');
            guardar();
          }
        },
      },
    ],
  },
  // ================= NORTE ARGENTINO =================
  ruta4: {
    nombre: 'RUTA 4 · YUNGAS',
    exterior: true,
    grilla: desdeTexto(RUTA4),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'puerto', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'puerto', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'calilegua', ax: 10, ay: 13, dir: 1 },
      { x: 11, y: 0, a: 'calilegua', ax: 11, ay: 13, dir: 1 },
    ],
    carteles: {
      '16,12': 'RUTA 4 · YUNGAS. La selva de las nubes: siempre hay neblina entre los árboles.',
      '13,30': 'Al norte: CALILEGUA. Después, la QUEBRADA DE HUMAHUACA.',
    },
    encuentros: { lista: [['cuison', 18], ['capullon', 14], ['mosquillon', 12], ['arquineo', 12], ['carpinchon', 10], ['condorito', 10], ['cardito', 8], ['zorrazo', 8], ['polillaca', 3]], min: 22, max: 26 },
    npcs: [
      entrenadorNPC({
        id: 'pajarera', x: 12, y: 2, dir: 2, pal: PAL.chica, nombre: 'OBSERVADORA MECHI',
        equipo: [['arquineo', 24], ['condorito', 25]],
        antes: ['OBSERVADORA MECHI: ¡Shhh! Estoy mirando pájaros...', '¡Bueno, ya los espantaste! ¡Ahora peleamos!'],
        gana: 'OBSERVADORA MECHI: Ganaste, pero yo vi un tucán. Así que estamos a mano.',
        despues: 'OBSERVADORA MECHI: En las Yungas hay más de 500 tipos de aves. ¡Y criaturas que todavía no tienen nombre!',
      }),
      entrenadorNPC({
        id: 'biologo', x: 14, y: 18, dir: 2, pal: PAL.ayudante, nombre: 'BIÓLOGO NICO',
        equipo: [['capullon', 23], ['mosquillon', 24], ['cuison', 25]],
        antes: ['BIÓLOGO NICO: Estoy estudiando a los bichos de la selva. ¿Me ayudás con un experimento? ¡Un duelo!'],
        gana: 'BIÓLOGO NICO: ¡Fascinante! Voy a anotar todo esto.',
        despues: 'BIÓLOGO NICO: Los CAPULLONES que viven acá se vuelven POLILLACAS. Hay muy poquitas... ¡si ves una, atrapala!',
      }),
      entrenadorNPC({
        id: 'guarda_yungas', x: 6, y: 25, dir: 3, pal: PAL.guarda, nombre: 'GUARDAPARQUE TATA',
        equipo: [['carpinchon', 25], ['zorrazo', 26]],
        antes: ['GUARDAPARQUE TATA: ¡Bienvenido al Parque Calilegua! Antes de pasar, mostrame que sabés pelear.'],
        gana: 'GUARDAPARQUE TATA: ¡Muy bien! Cuidá la selva, ¿eh?',
        despues: 'GUARDAPARQUE TATA: Más arriba la selva se termina y empiezan los cerros de colores. ¡Es otro mundo!',
      }),
    ],
  },

  calilegua: {
    nombre: 'CALILEGUA',
    exterior: true,
    grilla: desdeTexto(CALILEGUA),
    edificios: [
      { x: 3, y: 3, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 13, y: 3, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 14, a: 'ruta4', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 14, a: 'ruta4', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 6, a: 'centro3', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 0, a: 'ruta5', ax: 10, ay: 33, dir: 1 },
      { x: 11, y: 0, a: 'ruta5', ax: 11, ay: 33, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 5 · QUEBRADA DE HUMAHUACA. Hacia TILCARA.',
      '8,7': 'CASA DEL MATE. Tus criaturas descansan gratis.',
      '4,12': 'CALILEGUA. Al pie de las Yungas.',
    },
    npcs: [
      {
        id: 'abuela_cali', x: 15, y: 9, dir: 2, pal: PAL.coplera,
        hablar: async () => {
          await decir('ABUELA: ¿Vas para la Quebrada, m\'hijito? Tené cuidado de noche...');
          await decir('Dicen que aparece una LUZ MALA, una lucecita verde que te hace perder el camino.');
          await decir('Le dicen FAROLITO. ¡Pero si lo atrapás, dicen que es buen compañero!');
        },
      },
      {
        id: 'nene_cali', x: 6, y: 10, dir: 0, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.regaloCali) { await decir('NENE: ¡Usalos bien! En la Quebrada hay criaturas fuertes.'); return; }
          await decir('NENE: ¡Hola! Mi mamá hace los mejores alfajores de maicena del norte. ¡Tomá!');
          S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 3;
          S.flags.regaloCali = true;
          await decir('¡Felipe recibió 3 ALFAJORES!');
          guardar();
        },
      },
    ],
  },

  centro3: crearCentro('calilegua', 5, 7, 'centro3'),

  ruta5: {
    nombre: 'RUTA 5 · QUEBRADA',
    exterior: true,
    grilla: desdeTexto(RUTA5),
    edificios: [],
    salidas: [
      { x: 10, y: 34, a: 'calilegua', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 34, a: 'calilegua', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'tilcara', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 0, a: 'tilcara', ax: 11, ay: 20, dir: 1 },
    ],
    carteles: {
      '16,9': 'QUEBRADA DE HUMAHUACA. Los cerros tienen siete colores. ¡Contalos!',
      '13,31': 'RUTA 5. Cuidado con la PAJA BRAVA: ahí se esconden las criaturas.',
    },
    encuentros: { lista: [['cardito', 22], ['chispuna', 18], ['piedrin', 14], ['farolito', 14], ['condorito', 12], ['vizcachita', 10], ['geodin', 6], ['volcarin', 4]], min: 27, max: 31 },
    npcs: [
      entrenadorNPC({
        id: 'coplera', x: 7, y: 29, dir: 3, pal: PAL.coplera, nombre: 'COPLERA DOÑA ELBA',
        equipo: [['farolito', 28], ['vizcachita', 29], ['cardito', 29]],
        antes: ['COPLERA DOÑA ELBA: ♪ Vengo de la Quebrada, traigo mi caja y mi voz... ♪', '♪ ¡Si me ganás en el duelo, te canto una copla a vos! ♪'],
        gana: 'COPLERA DOÑA ELBA: ♪ Me ganaste, gurisito, ¡qué bien que peleaste vos! ♪',
        despues: 'COPLERA DOÑA ELBA: Mi FAROLITO me acompaña de noche. Cuando crezca va a ser CANDILEJO.',
      }),
      entrenadorNPC({
        id: 'arriero', x: 15, y: 21, dir: 2, pal: PAL.beto, nombre: 'ARRIERO RAMÓN',
        equipo: [['condorito', 29], ['piedrin', 30], ['cardito', 30]],
        antes: ['ARRIERO RAMÓN: ¡Epa! Llevo mis llamas a Tilcara. ¿Peleamos mientras descansan?'],
        gana: 'ARRIERO RAMÓN: Sos más rápido que una vicuña, gurí.',
        despues: 'ARRIERO RAMÓN: La líder de Tilcara cuida un jardín de cardones. ¡Las criaturas de FUEGO y VOLADOR le ganan!',
      }),
      entrenadorNPC({
        id: 'andinista', x: 12, y: 5, dir: 2, pal: PAL.chica, nombre: 'ANDINISTA CAMI',
        equipo: [['chispuna', 29], ['geodin', 30], ['volcarin', 31]],
        antes: ['ANDINISTA CAMI: ¡Subí todos estos cerros! Ahora quiero subir de nivel con un duelo.'],
        gana: 'ANDINISTA CAMI: ¡Uf! Me quedé sin aire... será la altura.',
        despues: 'ANDINISTA CAMI: Más al norte está la PUNA. Allá hace un frío que congela hasta las piedras.',
      }),
    ],
  },

  tilcara: {
    nombre: 'TILCARA',
    exterior: true,
    grilla: desdeTexto(TILCARA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio3', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'ruta5', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'ruta5', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro4', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio3', ax: 5, ay: 10, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 6. Hacia LA PUNA... (¡todavía en construcción!)',
      '8,9': 'CASA DEL MATE. Tus criaturas descansan gratis.',
      '19,9': 'GIMNASIO DE TILCARA. Líder: TALA, guardián del jardín de cardones. Tipo PLANTA.',
      '4,18': 'TILCARA. Casas de adobe y cerros de siete colores.',
    },
    disparadores: [
      {
        prueba: (x, y) => y === 0,
        accion: async () => {
          await decir('El camino hacia LA PUNA todavía está en construcción. ¡Muy pronto vas a poder seguir viaje!');
          await pasoForzado(0);
        },
      },
    ],
    npcs: [
      {
        id: 'artesana', x: 7, y: 11, dir: 0, pal: PAL.coplera,
        hablar: async () => {
          await decir('ARTESANA: Tejo ponchos con lana de llama. Los colores los saco de los cerros.');
          await decir('¿Sabías que los cardones crecen apenas unos centímetros por año? ¡Algunos tienen cientos de años!');
        },
      },
      {
        id: 'nene_tilcara', x: 18, y: 19, dir: 2, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.insignia3) await decir('NENE: ¡Le ganaste a TALA! ¡Sos un campeón!');
          else await decir('NENE: TALA nunca perdió con nadie de acá. ¡Dicen que su RODCARDO rueda más rápido que el viento!');
        },
      },
    ],
  },

  centro4: crearCentro('tilcara', 5, 9, 'centro4'),

  gimnasio3: {
    nombre: 'GIMNASIO TILCARA',
    grilla: desdeTexto([
      '###########',
      '#K-------K#',
      '#--KK-KK--#',
      '#---------#',
      '#K-K---K-K#',
      '#---------#',
      '#-KK---KK-#',
      '#---------#',
      '#K--K-K--K#',
      '#---------#',
      '#---------#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'tilcara', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      K: 'Un cardón gigante. ¡Tiene flores blancas arriba de todo!',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim3_a', x: 2, y: 7, dir: 3, pal: PAL.chica, nombre: 'JARDINERA PAZ',
        equipo: [['cuison', 32], ['junquito', 32]],
        antes: ['JARDINERA PAZ: ¡Cuidado con pisar las plantas! Si querés pasar, primero ganame.'],
        gana: 'JARDINERA PAZ: Ay, mis plantitas... Bueno, pasá.',
        despues: 'JARDINERA PAZ: TALA riega los cardones una vez por mes. ¡Con eso les alcanza!',
      }),
      entrenadorNPC({
        id: 'gim3_b', x: 8, y: 5, dir: 2, pal: PAL.ayudante, nombre: 'BOTÁNICO EZE',
        equipo: [['lianaco', 33], ['cardito', 33], ['ceibito', 32]],
        antes: ['BOTÁNICO EZE: Conozco cada planta de la Quebrada. ¡Y cada debilidad de tus criaturas!'],
        gana: 'BOTÁNICO EZE: Mmm, eso no estaba en mis libros.',
        despues: 'BOTÁNICO EZE: Las PLANTAS sufren con el FUEGO, el HIELO, el VENENO, los BICHOS y los VOLADORES.',
      }),
      {
        id: 'tala', x: 5, y: 1, dir: 0, pal: PAL.tala,
        hablar: async () => {
          if (S.flags.insignia3) {
            await decir('TALA: Llevás la fuerza del cardón: paciente y firme. ¡Buen viaje a la Puna, Felipe!');
            return;
          }
          if (!S.flags.insignia2) {
            await decir('TALA: Primero conseguí la INSIGNIA AMATISTA de ROCÍO, en Puerto Wanda. Después te espero.');
            return;
          }
          await decir('TALA: Bienvenido a mi jardín, Felipe. Acá todo crece despacio, pero crece fuerte.');
          await decir('Soy TALA, líder del GIMNASIO TILCARA. Mis criaturas aguantan el sol, el viento y la sequía.');
          await decir('Si me ganás, te llevás la INSIGNIA CARDÓN. ¡Vamos!');
          const r = await batalla({ entrenador: { nombre: 'LÍDER TALA', pal: PAL.tala, equipo: [['totorarca', 33], ['cuison', 34], ['anahisa', 34], ['rodcardo', 36]] } });
          if (r === 'gana') {
            S.flags.insignia3 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 3);
            await decir('TALA: Ganaste con todas las de la ley. El jardín te reconoce.');
            await decir('¡Felipe recibió la INSIGNIA CARDÓN!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 4;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('TALA: Llevate estos ALFAJORES y BOLEADORAS. En la Puna te van a hacer falta.');
            guardar();
          }
        },
      },
    ],
  },
};

// ===== Escenas de la historia =====
// Tomi siempre se queda con el inicial que le gana al tuyo
const CONTRA = { ramoa: 'flamartija', flamartija: 'ajolodo', ajolodo: 'ramoa' };

async function mirarBoleadora(b) {
  const tomada = S.flags.inicial === b.id || S.flags.inicialTomi === b.id;
  if (tomada) { await decir('La mesa está vacía.'); return; }
  if (S.flags.inicial) { await decir('Es una boleadora de la Profe. Mejor no tocarla.'); return; }
  if (!S.flags.hablóProfe) { await decir('Hay tres boleadoras sobre la mesa. Mejor hablá primero con la Profesora Ceibo.'); return; }
  const esp = ESPECIES[b.id];
  ui.vista = { id: b.id };
  const si = await siNo(`¿Elegís a ${esp.nombre.toUpperCase()}, ${esp.desc}? Es de tipo ${esp.tipos.map(nombreTipo).join('/')}.`);
  if (!si) { ui.vista = null; return; }
  const m = crearCriatura(b.id, 5);
  S.equipo.push(m);
  S.flags.inicial = b.id;
  await decir(`¡Felipe eligió a ${esp.nombre.toUpperCase()}!`);
  ui.vista = null;
  const rival = CONTRA[b.id];
  S.flags.inicialTomi = rival;
  const tomi = npcPorId('tomi');
  tomi.dir = 2;
  await decir(`TOMI: ¡Entonces yo me quedo con ${ESPECIES[rival].nombre.toUpperCase()}!`);
  await decir('TOMI: ¡Felipe! ¡Probemos nuestras criaturas! ¡Dale, peleemos!');
  const r = await batalla({ entrenador: { nombre: 'TOMI', pal: PAL.tomi, equipo: [[rival, 5]], sinDerrota: true } });
  curarEquipo();
  if (r === 'gana') await decir('TOMI: ¡Uh! ¡Ganaste vos! La próxima vez te gano yo, ¡vas a ver!');
  else await decir('TOMI: ¡Jaja! ¡Gané yo! Pero estuviste cerca, eh.');
  await decir('TOMI: Me voy a entrenar a la Ruta 1. ¡Chau, Profe! ¡Chau, Felipe!');
  S.flags.tomiSeFue = true;
  await entregarRegalos();
}

async function entregarRegalos() {
  await decir('PROFE CEIBO: ¡Qué buen duelo! Ya se nota que van a ser grandes compañeros.');
  await decir('Tomá, esto te va a servir para tu viaje.');
  S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
  S.bolsa.mate = (S.bolsa.mate || 0) + 3;
  await decir('¡Felipe recibió 5 BOLEADORAS y 3 MATES!');
  await decir('PROFE CEIBO: Con las BOLEADORAS podés atrapar criaturas salvajes. Primero debilitalas un poco, ¡así es más fácil!');
  await decir('Y los MATES recuperan la energía de tus criaturas. ¡Andá a explorar la Ruta 1, al norte del pueblo!');
  S.flags.regalos = true;
  guardar();
}

