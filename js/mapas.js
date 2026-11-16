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
      {
        prueba: (x, y) => y === 0,
        accion: async () => {
          await decir('El camino hacia el LITORAL todavía está en construcción. ¡Muy pronto vas a poder seguir viaje!');
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

