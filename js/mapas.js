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
  nieve: { id: 'nieve', piel: '#e8c0a0', pelo: '#f0f0f8', peloLargo: true, gorra: '#3a7ab0', remera: '#e8f4ff', raya: '#3a7ab0', pant: '#2a3a5a' },
  almacenero: { id: 'almacenero', piel: '#e8b890', pelo: '#5a3a20', boina: '#3a3a5a', remera: '#3a8a4a', guardapolvo: true, pant: '#4a3a2a', barba: '#5a3a20' },
  sombra: { id: 'sombra', piel: '#e8d0c0', pelo: '#1a1a2a', peloLargo: true, sombrero: '#1a1a1a', remera: '#4a2a6a', raya: '#b060f0', pant: '#1a1a2a' },
  marea: { id: 'marea', piel: '#f0d0b8', pelo: '#2a3a5a', peloLargo: true, gorra: '#e8f0f8', remera: '#2a6ab0', raya: '#f0f0f0', pant: '#1a2a4a' },
  cumbre: { id: 'cumbre', piel: '#e0b088', pelo: '#e8e8f0', peloLargo: true, gorra: '#5a3ab0', remera: '#3a2a7a', raya: '#f8d040', pant: '#2a2a3a' },
  ceniza: { id: 'ceniza', piel: '#d8a070', pelo: '#c03020', peloLargo: true, remera: '#e06a20', raya: '#f8d040', pant: '#3a2a2a' },
  piloto: { id: 'piloto', piel: '#e8b890', pelo: '#3a2a1a', gorra: '#1a2a5a', remera: '#f0f0f8', raya: '#1a2a5a', pant: '#1a2a5a' },
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
  'YY..==================',
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

// Grillas de la Puna (w salina · N cerro nevado)
const RUTA6 = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NN--uuuu--==--uuuu--NN',
  'NN--uuuu--==--uuuu--NN',
  'NN-K------==-S----K-NN',
  'NNNN--wwwwwwwwww--NNNN',
  'NN----wwwwwwwwww----NN',
  'NN-uu-ww~~ww~~ww-uu-NN',
  'NN-uu-ww~~ww~~ww-uu-NN',
  'NN----wwwwwwwwww----NN',
  'NN--K-wwwwwwwwww-K--NN',
  'NN--------==--------NN',
  'NNNN-uuuuu==uuuuu-NNNN',
  'NNNN-uuuuu==uuuuu-NNNN',
  'NN------CC==CC------NN',
  'NN-K----CC==CC----K-NN',
  'NN--uuu---==---uuu--NN',
  'NN--uuu---==---uuu--NN',
  'NN--uuu-========uuu-NN',
  'NN------=------K----NN',
  'NNNN----=-uuuuuu--NNNN',
  'NNNN-K--=-uuuuuu--NNNN',
  'NN------=-uuuuuu----NN',
  'NN--=====S----------NN',
  'NN--=---------CCC---NN',
  'NN--=--uuuuu--CCC-K-NN',
  'NN--=--uuuuu--------NN',
  'NN--=======---uuuu--NN',
  'NN-K------=---uuuu--NN',
  'NN--uuuu--=---uuuu--NN',
  'NN--uuuu--=====-----NN',
  'NN------------=-----NN',
  'NN-K--uuuu--===-K---NN',
  'NN----uuuu--==------NN',
  'NN--------S-==--uu--NN',
  'NN--uuuu----==--uu--NN',
  'NNNNNNNNNNNN==NNNNNNNN',
];
const SUSQUES = [
  'NNNNNNNNNN==NNNNNNNNNNNN',
  'NN--------==S---------NN',
  'NN--K-----==-------K--NN',
  'NN--------==----------NN',
  'NN------------.......-NN',
  'NN-.....------.......-NN',
  'NN-.....------.......-NN',
  'NN-.....------.......-NN',
  'NN-.....--==--.......-NN',
  'NN---=--S-==-----=-S--NN',
  'NN-=================--NN',
  'NN--------==----------NN',
  'NN--wwww--==--.....---NN',
  'NN--wwww--==--.....---NN',
  'NN--wwww--==--.....---NN',
  'NN--------==--.....---NN',
  'NN--S-----==----------NN',
  'NN--------==------K---NN',
  'NNNNNNNNNN==NNNNNNNNNNNN',
];

// ===== Grillas de las regiones nuevas (generadas con tools/gen.py y retocadas) =====
const PAMPA = [
  'TTTTTTTTTT==TTTTTTTTTT',
  'TT.,,,,,..==........TT',
  'TT.,,,,,,,==........TT',
  'TTTT,,,,,S==,,,,,,..TT',
  'TTTT,,....==,,,TT,..TT',
  'TT,,,,....==...TT...TT',
  'TT........==........TT',
  'TTF,,,F...==.....TT.TT',
  'TT.,,,....==.....TT.TT',
  'TT........==........TT',
  'TT~~~~~~~~hh~~~~~~~~TT',
  'TT~~~~~~~~hh~~~~~~~~TT',
  'TT........==.F......TT',
  'TT........==.,,,,,,.TT',
  'TT........==.,,,,,,.TT',
  'TT.,,,TT,.==.,,,,,,.TT',
  'TT.,,,TT,.==..,,,,..TT',
  'TT........==...,,,,.TT',
  'TT.,,,,,,,==,,.,TT,.TT',
  'TT.,,,,,,,==,,..TT..TT',
  'TT......,,==,,......TT',
  'TT........==....,,,.TT',
  'TT........==....,,,.TT',
  'TT........==....,,,.TT',
  'TT........==........TT',
  'TT........==,,,.....TT',
  'TT........==,,,TT...TT',
  'TT........==,,,TT...TT',
  'TT...,,,.S==,,,,....TT',
  'TT...,,,..==,,,,....TT',
  'TT...,,,..==........TT',
  'TTTTTTTTTT==TTTTTTTTTT',
];
const SIERRAS = [
  'RRRRRRRRRR==RRRRRRRRRR',
  'RR........==........RR',
  'RR...F.TT,==,.......RR',
  'RR.,,RRTTS==,...RR..RR',
  'RR.,,RR,,.==....RR..RR',
  'RR.,,,,,,.==...RRR..RR',
  'RR........==...RR...RR',
  'RR........==........RR',
  'RR..,,,...========..RR',
  'RR..,,,.........==..RR',
  'RR..,,,...,,,...==..RR',
  'RR........,,,...==..RR',
  'RR........F,,,,.==..RR',
  'RR..,,,,,..,,,,.==..RR',
  'RR.,,,,,,RR,,,,.==..RR',
  'RR.,,,,,,RR.....==..RR',
  'RR.,,RR,,.......==..RR',
  'RR...RR,,,,.....==..RR',
  'RR...,,,,,,.....==..RR',
  'RR....,,,,,,....==..RR',
  'RR....,,,,,,,,,.==..RR',
  'RR.....,,,,,,,,.==..RR',
  'RR..F...........==..RR',
  'RR........========..RR',
  'RR........==........RR',
  'RR........==........RR',
  'RR........==........RR',
  'RR~~~~~~~~hh~~~~~~~~RR',
  'RR~~~~~~~~hh~~~~~~~~RR',
  'RR..,,,,,,==,,,,,...RR',
  'RR......,S==,,,,,,..RR',
  'RR......,,==,,,,,,..RR',
  'RR........==,,,,,,..RR',
  'RRRRRRRRRR==RRRRRRRRRR',
];
const TRAVESIA = [
  'CCCCCCCCCC==CCCCCCCCCC',
  'CC--------==--------CC',
  'CCuuu-----==--Kuuuu-CC',
  'CCuuu-uuuS==-K-uuuu-CC',
  'CCuuu-uuu-==-----RR-CC',
  'CC------K-==-RR--RR-CC',
  'CC------uu==uRR-----CC',
  'CC-----uuu==u-------CC',
  'CC-----uuu==u-------CC',
  'CC-----uuu=====-----CC',
  'CC-------uuuu==uuu--CC',
  'CC-------uuuu==uuu--CC',
  'CC-------uuuu==uuu--CC',
  'CC---K-------==-----CC',
  'CC-----------==--CC-CC',
  'CC-----------==--CC-CC',
  'CC-----------==-----CC',
  'CC-----uuuCC-==-----CC',
  'CC--K--uuuCCu==uu---CC',
  'CCCC---uuuuuu==uu---CC',
  'CCCC---uuuuuu==uuuu-CC',
  'CC---uuu-uuuu==uuuu-CC',
  'CC---uuu-u=====-----CC',
  'CC---uuu--==--------CC',
  'CC-RR-----==--------CC',
  'CC-RR-----==-----CC-CC',
  'CC--------==-----CC-CC',
  'CC--------==----CC--CC',
  'CCK-------==-uuuCC--CC',
  'CC---uuuuu==uuuuuu--CC',
  'CC---uuuuS==uuuuuu--CC',
  'CC---uuuuu==--------CC',
  'CC--------==--------CC',
  'CCCCCCCCCC==CCCCCCCCCC',
];
const TALAMPAYA = [
  'CCCCCCCCCC==CCCCCCCCCC',
  'CC-----uuu==--------CC',
  'CC-----uuu==--------CC',
  'CC-----uuS==--------CC',
  'CC--------==--------CC',
  'CC--------==--CC-CC-CC',
  'CC--------==--CC-CC-CC',
  'CC--------==--------CC',
  'CC--------==--------CC',
  'CC--uuuu--==--------CC',
  'CC--uuuuu-==---CC---CC',
  'CC-uuuuuu-==---CC---CC',
  'CC-uuuuuu-==--------CC',
  'CC-uuuuuuu==uuuu----CC',
  'CC-----uuu==uuuu----CC',
  'CC--------==uuuu----CC',
  'CC---uuuuu==---uuuuuCC',
  'CC-u========---uuuuuCC',
  'CC-u==uu-------uuuuuCC',
  'CC--==uu------------CC',
  'CC--==uu------R--R--CC',
  'CC--==--------------CC',
  'CCuu==-CC--CC-----CCCC',
  'CCuu==-CC--CCuuuuuCCCC',
  'CC--==-------uuuuuu-CC',
  'CC--==-uuu----------CC',
  'CC--========--------CC',
  'CC--------==uuuuu---CC',
  'CC--------==uuuuu---CC',
  'CC--R-----==uuuuu---CC',
  'CC-------S==-----uuuCC',
  'CC--------==u----uuuCC',
  'CC--------==u----uuuCC',
  'CCCCCCCCCC==CCCCCCCCCC',
];
const CALCHAQUI = [
  'CCCCCCCCCC==CCCCCCCCCC',
  'CC--------==--------CC',
  'CC-------u==---K--K-CC',
  'CCRR-----S==--------CC',
  'CCRR-----u==--------CC',
  'CC--------==--------CC',
  'CC-------u=====-----CC',
  'CC-K-----uuuu==-----CC',
  'CC-uuu-------==-----CC',
  'CC-uuuu------==-----CC',
  'CC~~~~~~~~~~~hh~~~~~CC',
  'CC~~~~~~~~~~~hh~~~~~CC',
  'CC--uuuuuuuuu==-----CC',
  'CC-----uuuuuu==-----CC',
  'CC-----uuuuuu==uuuuKCC',
  'CC-----------==uuuu-CC',
  'CC------K----==uuuu-CC',
  'CC-uuuuuRRuuu==uuCC-CC',
  'CC-uuuuuRRuuu==uuCC-CC',
  'CC----uuuuuuu==--K--CC',
  'CC-uuuuu-----==--CC-CC',
  'CC-uuuuu-----==--CC-CC',
  'CC-----------==-----CC',
  'CC-----------==-----CC',
  'CC-----------==-----CC',
  'CC---uuuuuu--==-----CC',
  'CC---uuuuuu--==-----CC',
  'CC-uuuuuK-=====-----CC',
  'CC-uuuuu--==--------CC',
  'CC--------==--------CC',
  'CC-----uuS==--------CC',
  'CC-----uuu==-----K--CC',
  'CC--------==----K---CC',
  'CCCCCCCCCC==CCCCCCCCCC',
];
const CHACO = [
  'TTTTTTTTTT==TTTTTTTTTT',
  'TT..F..,,,==,.......TT',
  'TT...TT,,,==,.......TT',
  'TT...TT,,S==,.......TT',
  'TT....,,,,==,,,,....TT',
  'TT........==,,,TT...TT',
  'TT........==...TT...TT',
  'TTTT....F.==.,,,,,..TT',
  'TTTT......==.,,,,,..TT',
  'TT........==.,,,,,..TT',
  'TT.,,,,,F.==........TT',
  'TT.,,,,,..========,,TT',
  'TT.,,,,,.....,,,==,,TT',
  'TT~~~~~~~~~~~~~~hh~~TT',
  'TT~~~~~~~~~~~~~~hh~~TT',
  'TT.....,,,......==..TT',
  'TT....,,,,,,,,,.==..TT',
  'TT....,,,,========..TT',
  'TT........==,,,.....TT',
  'TT........==........TT',
  'TT........==....,,,,TT',
  'TT...F....==....,,,,TT',
  'TT........==.....,,,TT',
  'TT..F.....==.,,,,...TT',
  'TT........==.,,,,...TT',
  'TT........==.,,,,...TT',
  'TT.....TT.==.....TT.TT',
  'TT.....TT.==.....TT.TT',
  'TT........==........TT',
  'TT........==,,,,....TT',
  'TT.......S==,,,,....TT',
  'TT.....F..==,,,,....TT',
  'TT........==........TT',
  'TTTTTTTTTT==TTTTTTTTTT',
];
const CALDENAL = [
  'TTTTTTTTTT==TTTTTTTTTT',
  'TT----T---==--------TT',
  'TT--------==--TT----TT',
  'TTTT-----S==--TT----TT',
  'TTTT------==----TTTTTT',
  'TT--------==-,,,,,TTTT',
  'TT--TTT---==-,,,,,,-TT',
  'TT---TT---==-,,,,,,-TT',
  'TT---,,,,,==--------TT',
  'TTTT-,,,,,==--------TT',
  'TTTT-TT,,,==--------TT',
  'TT--,TT,--==--------TT',
  'TT--,,,,--==--------TT',
  'TT--,,,,--==-----TT-TT',
  'TT--------==-----TT-TT',
  'TT--------==--------TT',
  'TT---T----==---T----TT',
  'TT-TT-----==--------TT',
  'TT-TT,,,--==-----,,,TT',
  'TT-,,,,,,,==-----,,,TT',
  'TT-,,,,,,,==-----,,,TT',
  'TT--------==,,--,,,-TT',
  'TT-TT-----==,,--,,,-TT',
  'TT-TT-----==,,,-,,,-TT',
  'TT------,,==,,,-----TT',
  'TT------,,==,,,---T-TT',
  'TT----TT--==-TT,,,,,TT',
  'TT,,,,TT--==-TT,,,,,TT',
  'TT,,,,,--S==--,,,,,,TT',
  'TT,,,,,---==--------TT',
  'TT--------==--------TT',
  'TTTTTTTTTT==TTTTTTTTTT',
];
const ESTEPA = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NN------uu==uu------NN',
  'NN------uu==uuu-----NN',
  'NNRNN----S==uuuu----NN',
  'NN-NNuuuu-==uuuu----NN',
  'NN--uuuuu-==uuuuuuu-NN',
  'NN----uuuu==-uuuuuu-NN',
  'NN----uuuu==----uuu-NN',
  'NN--------==--------NN',
  'NN-=========------R-NN',
  'NN-==---------------NN',
  'NN-==---uuuuuu------NN',
  'NN-==uuuuuuuuuR-----NN',
  'NN-==uuuuuuuuu------NN',
  'NN-=========--------NN',
  'NN--------==--------NN',
  'NN--------==--R-----NN',
  'NN-----uuu==--uRR---NN',
  'NN-----uuu==--uRR---NN',
  'NN--R--uuu==-RRuu---NN',
  'NN--------==-RRu----NN',
  'NN~~~~~~~~hh~~~~~~~~NN',
  'NN~~~~~~~~hh~~~~~~~~NN',
  'NN--------==--------NN',
  'NN--------==--------NN',
  'NN--------==--------NN',
  'NN--------==----uuNNNN',
  'NN--------==----uuNNNN',
  'NN--------==---NN---NN',
  'NN------uu==u--NN---NN',
  'NN--uuuuuS==u-------NN',
  'NN--uuuu--==---R----NN',
  'NN--------==--------NN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
// Pueblos nuevos (derivados de otros pueblos, cambiando las baldosas)
function teñir(filas, cambios) { return filas.map(f => f.split('').map(c => cambios[c] || c).join('')); }
const SERRANA = teñir(PUERTO, { Y: 'T', q: '=' });
const VALLEFERTIL = teñir(TILCARA, { K: 'R' });
const BARILOCHE = teñir(VILLA, { T: 'N' });
// Región 5 (Río Negro): rutas dibujadas de abajo hacia arriba (después se giran) y pueblos
const BOSQUE_ANDINO = [
  'TTTTTTTTTT==TTTTTTTTTT',
  'TT........==........TT',
  'TT........==,,,,,,..TT',
  'TT.......S==,,,,TT..TT',
  'TT.,,,,,,.==,,,,TT..TT',
  'TT.,,,RR,.==........TT',
  'TT,,,,RR,.==....F...TT',
  'TT,,,,,...==........TT',
  'TT,,,=======........TT',
  'TT,,,==,,,,.........TT',
  'TT,,,==,,,,.TT..,,,.TT',
  'TT..,==,,,..TT.F,,,.TT',
  'TT..,==,,,......,,,,TT',
  'TT..,==,,,......,,,,TT',
  'TT~~~hh~~~~~~~~~~~~~TT',
  'TT~~~hh~~~~~~~~~~~~~TT',
  'TTF..==.....,,,,....TT',
  'TT...==.....,,,,....TT',
  'TT,,,==,,,..,,,,....TT',
  'TT,,,==,,,.........FTT',
  'TT,,,==,,,..........TT',
  'TT...==.........F.F.TT',
  'TT...==.............TT',
  'TT...=======,,......TT',
  'TT......,,==,,......TT',
  'TT......,,==,,......TT',
  'TT....TT..==........TT',
  'TT....TT..==........TT',
  'TT..F....S==........TT',
  'TT........==........TT',
  'TT........==........TT',
  'TTTTTTTTTT==TTTTTTTTTT',
];
const LINEA_SUR = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NN--------==--------NN',
  'NN--------==--------NN',
  'NN----uuuS==--------NN',
  'NN----uuu-==--------NN',
  'NN--------==----uuuuNN',
  'NN---RRRR-==----uuuuNN',
  'NN---RRRRu==--------NN',
  'NN-----uuu==--------NN',
  'NN------uu==uu------NN',
  'NN------uu==uuuu----NN',
  'NN------uu==uuuuuuuuNN',
  'NN-------u==uu-uuuRRNN',
  'NN-------u==uu-uuuRRNN',
  'NNuuuu----==-----RR-NN',
  'NNuuu=======-----RR-NN',
  'NN---==--uuuuu------NN',
  'NN---==uuuuuuuRR----NN',
  'NN---==uuuu---RR-NN-NN',
  'NN---==--RRuuuuu-NN-NN',
  'NN---==--RRuuuuu----NN',
  'NN---==---uuuuuu----NN',
  'NNuuu==uu-----------NN',
  'NNuuu==uu-----------NN',
  'NNuuu=======--------NN',
  'NN-uuu----==--------NN',
  'NN-uuu----==--------NN',
  'NN--------==uuuuuu--NN',
  'NN-------S==uuuuuu--NN',
  'NN-uuuuu--==--------NN',
  'NN-uuuuu--==--------NN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
const MESETA = [
  'RRRRRRRRRR==RRRRRRRRRR',
  'RR--uuuuuu==uuuu----RR',
  'RR--uuRRuu==uuuu-RR-RR',
  'RR----RR-S==-----RR-RR',
  'RRRR------==--------RR',
  'RRRR------==--------RR',
  'RR--------==----RR--RR',
  'RR--------==----RR--RR',
  'RR--------==--------RR',
  'RR--------==-uuuu---RR',
  'RR--------==-uuuu---RR',
  'RR--------==-uuuu---RR',
  'RR-----uuu==-uuuu---RR',
  'RR-----uuu==-----RR-RR',
  'RR-uuu----==-----RR-RR',
  'RR-uuu-uuu==--------RR',
  'RR-uuu-uuu==--------RR',
  'RR-----uuu==u-------RR',
  'RR-----uuu==u-------RR',
  'RR--------==u-------RR',
  'RRRR------==---uuu--RR',
  'RRRR------==---uuRR-RR',
  'RR--------==---uuRRuRR',
  'RR-----uuu==u---uuuuRR',
  'RR-----uuu==u---uuuuRR',
  'RR-----uuu==u-------RR',
  'RR-----uuu==--------RR',
  'RR--uuuuuu==--------RR',
  'RR-uuuuuuS==-----RR-RR',
  'RR-uuuuu--==-----RR-RR',
  'RR--------==--------RR',
  'RRRRRRRRRR==RRRRRRRRRR',
];
const ELBOLSON = teñir(PUERTO, { Y: 'N', q: '=' });
const JACOBACCI = teñir(TILCARA, { C: 'N', K: 'R' });
const SOMUNCURA = teñir(PUERTO, { Y: 'R', q: '=', '.': '-', F: '-' });
// Región 6 (costa patagónica y Tierra del Fuego): el mar se dibuja a la IZQUIERDA y al girar 180 queda al ESTE
const VALDES = [
  'RRRRRRRRRR==RRRRRRRRRR',
  'RR~~~-----==--------RR',
  'RR~~~-----==-uuRRu--RR',
  'RR~~~uuuuS==-uuRRuuuRR',
  'RR~~~RRuu-==-uuuuuuuRR',
  'RR~~~RR---==--------RR',
  'RR~~~-----==--------RR',
  'RR~~~-----==--------RR',
  'RR~~~-----==--------RR',
  'RR~~~uuu--==--------RR',
  'RR~~~uuuu-==-----uuuRR',
  'RR~~~uuuu-==-----uuuRR',
  'RR~~~uuuu-==--------RR',
  'RR~~~-----==--------RR',
  'RR~~~-----==--------RR',
  'RR~~~-----==--------RR',
  'RR~~~-----==--------RR',
  'RR~~~--uuu==-----RR-RR',
  'RR~~~=======-----RR-RR',
  'RR~~~==uuu----------RR',
  'RR~~~==----uuuu-----RR',
  'RR~~~==u---uuuuu----RR',
  'RR~~~==u----uuuu----RR',
  'RR~~~==-----uuuu----RR',
  'RR~~~==------uuu----RR',
  'RR~~~==------uuu----RR',
  'RR~~~=======--------RR',
  'RR~~~uuuu-==--------RR',
  'RR~~~uuuuS==--------RR',
  'RR~~~u-uuu==----uuu-RR',
  'RR~~~u-uuu==----uuu-RR',
  'RRRRRRRRRR==RRRRRRRRRR',
];
const SANTACRUZ = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NN~~~----u==--------NN',
  'NN~~~----u==--------NN',
  'NN~~~uuu-S==--------NN',
  'NN~~~uuu--==--------NN',
  'NN~~~-----==------RRNN',
  'NN~~~-----==------RRNN',
  'NN~~~--uuu==uuuuu---NN',
  'NN~~~--uuu==uuuuu---NN',
  'NN~~~--uuu==uuuuu---NN',
  'NN~~~-----==---RR---NN',
  'NN~~~-----==---RR---NN',
  'NN~~~-----==--------NN',
  'NN~~~-----==-----RR-NN',
  'NN~~~--uuu==u----RR-NN',
  'NN~~~--uuu==u--uuuu-NN',
  'NN~~~--uuu==u--uuuu-NN',
  'NN~~~-----==--------NN',
  'NN~~~-----======----NN',
  'NN~~~---------==----NN',
  'NN~~~---------==----NN',
  'NN~~~---------==uu--NN',
  'NN~~~---------==uu--NN',
  'NN~~~uuuu-----==uu--NN',
  'NN~~~uuuu-----==----NN',
  'NN~~~uuuu-----==----NN',
  'NN~~~uuuu-======----NN',
  'NN~~~uuuu-==uuuu-NN-NN',
  'NN~~~uuRRS==uuuu-NN-NN',
  'NN~~~uuRRu==--------NN',
  'NN~~~-----==--------NN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
const ESTRECHO = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NN~~~.....==........NN',
  'NN~~~.....==.TT,,,,,NN',
  'NN~~~...,S==,TT,,,,,NN',
  'NN~~~...,,==,,......NN',
  'NN~~~,,,,,==,,......NN',
  'NN~~~,,,..==,,,.....NN',
  'NN~~~~~~~~hh~~~~~~~~NN',
  'NN~~~~~~~~hh~~~~~~~~NN',
  'NN~~~.....==........NN',
  'NN~~~.....==........NN',
  'NN~~~.....==........NN',
  'NN~~~...,,==,,,,,,..NN',
  'NN~~~...,,==,,,,,,..NN',
  'NN~~~TT..,==,,,,,,..NN',
  'NN~~~TT...==...,,,,.NN',
  'NN~~~.....==.,,,,,,.NN',
  'NN~~~.....==.,,,,..FNN',
  'NN~~~.....======...FNN',
  'NN~~~.........==....NN',
  'NN~~~.........==,,..NN',
  'NN~~~......F..==,,..NN',
  'NN~~~.........==....NN',
  'NN~~~NN.......==,,..NN',
  'NN~~~NN,,.....==,,..NN',
  'NN~~~,,,,.======,,,.NN',
  'NN~~~,,...==,,,,,,,.NN',
  'NN~~~.....==,,,,,,,.NN',
  'NN~~~..,,S==........NN',
  'NN~~~..,,,==...F....NN',
  'NN~~~..,,,==........NN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
const MADRYN = teñir(TILCARA, { C: 'R', K: '-' });
const GALLEGOS = teñir(PUERTO, { Y: 'N', q: '=' });
const USHUAIA = teñir(VILLA, { T: 'N' });
// Región 7 (Catamarca): rutas 19 y 20 van al OESTE (ccw), la 21 SUBE a la Puna
const VALLECAT = [
  'CCCCCCCCCC==CCCCCCCCCC',
  'CC....,,,,==........CC',
  'CC....,,,,==........CC',
  'CC....,,,S==,,......CC',
  'CC........==,,......CC',
  'CC........==........CC',
  'CC...,,,,.==....CC..CC',
  'CC...,,,,.==....CC..CC',
  'CC....,,,,==........CC',
  'CC..,,,,,,==....CC..CC',
  'CC..,,,,,,==....CC..CC',
  'CC,,,,,,,.==,,,.....CC',
  'CC,,,=======,,,.....CC',
  'CC,,,==,,,,.........CC',
  'CC...==.....,,,,,,..CC',
  'CC...==.....,,,,,,..CC',
  'CC..,==,....,,,,,,KKCC',
  'CC..,==,.....,,,,,KKCC',
  'CC..,==,.....,,,,,,.CC',
  'CC...==.,,,,,KK...CCCC',
  'CCF..==.,,,,,KK...CCCC',
  'CC...==..F..........CC',
  'CC..,==,,...........CC',
  'CC..,==,,........,,,CC',
  'CC..,==,,.,,,,,..,,,CC',
  'CC...=======,,,....FCC',
  'CC....,,,.==........CC',
  'CC....,,,.==....F...CC',
  'CC..F....S==........CC',
  'CC........==...F....CC',
  'CC........==........CC',
  'CCCCCCCCCC==CCCCCCCCCC',
];
const TATON = [
  'CCCCCCCCCC==CCCCCCCCCC',
  'CC--------==--------CC',
  'CC-------u==uuuuuu--CC',
  'CC-------S==uuuuuu--CC',
  'CC----uuuu==-uuuuu--CC',
  'CC----uRRu==--------CC',
  'CCuuuuuRRu==--------CC',
  'CCuuuuuu--==--------CC',
  'CCuuCCRR-u========--CC',
  'CC--CCRR-uuuu---==--CC',
  'CC--CCuuuuuuu---==--CC',
  'CC--CCuuuuuu----==--CC',
  'CC----uuRRuu----==--CC',
  'CC------RR------==--CC',
  'CC--------------==--CC',
  'CC-----------uuu==--CC',
  'CC---------CCuuu==u-CC',
  'CC------uuuCCuuu==u-CC',
  'CC------uuuuu---==--CC',
  'CC--------------==--CC',
  'CC------------uu==uuCC',
  'CC------------uu==uuCC',
  'CC------uuuuuuuu==uuCC',
  'CC------uuuuuuuu==--CC',
  'CC----RRuuuuuuuu==--CC',
  'CC-RR-RR--------==--CC',
  'CC-RR-uuuuu-----==--CC',
  'CC-uuuuuuu========--CC',
  'CC-uuuuuuS==u-------CC',
  'CC-uuu----==--------CC',
  'CC--------==--------CC',
  'CCCCCCCCCC==CCCCCCCCCC',
];
const PUNA_ATACAMA = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NN--------==--------NN',
  'NN--------==uu------NN',
  'NN-------S==uu------NN',
  'NN--------==uu------NN',
  'NN--------==uuuu----NN',
  'NNRRuuuuu-==uuNN----NN',
  'NNRRuuuuuu==uuNNuu--NN',
  'NN-----uuu==uuuuuu--NN',
  'NN-----uuu==u---uNNuNN',
  'NN--------==u---uNNuNN',
  'NN--------==uuu-----NN',
  'NN--------==uuu-----NN',
  'NN-------u==uuu-----NN',
  'NN-------u==uuu-----NN',
  'NN--------==--------NN',
  'NN--------==--------NN',
  'NN--------======----NN',
  'NN--------uuu-==----NN',
  'NN------------==----NN',
  'NN------------==----NN',
  'NN--uuu-------==----NN',
  'NN~~~~~~~~~~~~~~~~~~NN',
  'NN~~~~~~~~~~~~~~~~~~NN',
  'NN~~~~~~~~~~~~~~~~~~NN',
  'NN-----------u==uuu-NN',
  'NN-----------u==uuu-NN',
  'NN--------======uuu-NN',
  'NN-------S==--------NN',
  'NN--------==--------NN',
  'NN--------==--------NN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
const CATAMARCA = teñir(PUERTO, { Y: 'C', q: '=' });
const BELEN = teñir(TILCARA, {});
const FIAMBALA = teñir(PUERTO, { Y: 'C', q: '=', '.': '-', F: '-' });
const OJOS = teñir(TILCARA, { C: 'N', K: 'R', '.': '-' });
// Región 8 (Cuyo y el Aconcagua): rutas 22 y 23 BAJAN por la cordillera (180), la 24 va al OESTE (ccw) hacia el Aconcagua
const LAGUNA_BRAVA = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NN--------==--------NN',
  'NN---NN---==---uuuuuNN',
  'NN---NN--S==---uuuuuNN',
  'NN-------u==u--uuuuuNN',
  'NN-----uuu==u-------NN',
  'NN-uuuuuuu==----F---NN',
  'NN-uuuuuuu==------F-NN',
  'NN--F-----==--------NN',
  'NN--------==--------NN',
  'NN--------==--F-----NN',
  'NN--------==--------NN',
  'NN----uuuu==--------NN',
  'NN----uuuu==--------NN',
  'NN-uuNNuuu=======---NN',
  'NN-RRNNuu------==---NN',
  'NN-RR-uuu------==---NN',
  'NNNN-uuuu------==---NN',
  'NNNN-uuuu-=======---NN',
  'NN--------==--------NN',
  'NN~~~~~~~~~~~~~~~~~~NN',
  'NN~~~~~~~~~~~~~~~~~~NN',
  'NN~~~~~~~~~~~~~~~~~~NN',
  'NN---uuuuu==uuuu----NN',
  'NNRR-uuuu-==uuuu----NN',
  'NNRR-uuuu-==uuuuuuuuNN',
  'NN------F-==uuuuuuuuNN',
  'NN--------==-uuuuuuuNN',
  'NN-------S==---uuuNNNN',
  'NN----F-uu==u--uuuNNNN',
  'NN------uu==u-------NN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
const CUEVA_ANDES = [
  'RRRRRRRRRR::RRRRRRRRRR',
  'RR::::::::::::::::::RR',
  'RR::Raa:::S:::aaR:::RR',
  'RR::RRR::::::::RR:::RR',
  'RR::::::::::::::::::RR',
  'RRRRRRRRROOORRRRRRRRRR',
  'RR::::::::::::::::::RR',
  'RR::::RR:::::RR:::::RR',
  'RR::::RR:::::RR:::::RR',
  'RRRRRRRRRRRRRRRR::::RR',
  'RR::::::::::::::::::RR',
  'RR::aa:::RRRR:::::::RR',
  'RR::::::::RR:::::RR:RR',
  'RR::::RR::::::::::::RR',
  'RR::::RRRRRRRRRRRRRRRR',
  'RR::::::::::::::::::RR',
  'RR:::::::::RR:::::::RR',
  'RR::RR:::::RR:::aa::RR',
  'RR::RR::::::::::::::RR',
  'RRRRRRRRROOORRRRRRRRRR',
  'RR::::::::::::::::::RR',
  'RR:::RR:::::::RR::::RR',
  'RR:::RR::RRRR:RR::::RR',
  'RR:::::::RRRR:::::::RR',
  'RRRRRRRR::::::RRRRRRRR',
  'RR::::::::::::::::::RR',
  'RR::aaR:::::::Raa:::RR',
  'RR::RRR:::::::RRR:::RR',
  'RR:::::::S::::::::::RR',
  'RR::::::::::::::::::RR',
  'RR::::::::::::::::::RR',
  'RRRRRRRRRR::RRRRRRRRRR',
];
// Ascenso al Aconcagua: se SUBE (no se gira); hay que romper rocas y bloques de hielo con el PICO
const ASCENSO = [
  'NNNNNNNNNN==NNNNNNNNNN',
  'NNwwwwwwww==wwwwwwwwNN',
  'NNwwRRwwwwwwwwwwRRwwNN',
  'NNwwRRwwwSwwwwwwRRwwNN',
  'NNwwwwwwwwwwwwwwwwwwNN',
  'NNNNNNNNNNZZNNNNNNNNNN',
  'NNwwwwwwwwwwwwwwwwwwNN',
  'NNwwwwNNNwwwwwwNNNwwNN',
  'NNww--NNN------NNN--NN',
  'NN----------------uuNN',
  'NNuu----RR------uuuuNN',
  'NNuu----RR------uuuuNN',
  'NNNNNNNNNNNNNNXNNNNNNN',
  'NN------------------NN',
  'NN--uuuu----RR------NN',
  'NN--uuuu----RR--uu--NN',
  'NN--------------uu--NN',
  'NNNNNNNNXNNNNNNNNNNNNN',
  'NN------------------NN',
  'NN--RR------uuuuu---NN',
  'NN--RR------uuuuu---NN',
  'NN------NNN---------NN',
  'NN------NNN----RR---NN',
  'NN------------------NN',
  'NNNNNNNNNNNNNNNNXNNNNN',
  'NN------------------NN',
  'NN--uuuu-----uuuu---NN',
  'NN--uuuu-----uuuu---NN',
  'NN------RR----------NN',
  'NN------RR----------NN',
  'NN------------------NN',
  'NNuuu----------uuu--NN',
  'NNuuu----RR----uuu--NN',
  'NN-------RR---------NN',
  'NN------------------NN',
  'NN--uu--------uu----NN',
  'NN--uu---S==--uu----NN',
  'NN--------==--------NN',
  'NN--------==--------NN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
const RODEO = teñir(PUERTO, { Y: 'N', q: '=', '.': '-', F: '-' });
const USPALLATA = teñir(TILCARA, { C: 'T', K: 'T', '-': '.' });
const PLAZA_MULAS = teñir(TILCARA, { C: 'N', K: 'R', '.': 'w' });
// Desvío de la Ruta 2: el pantano del Bañado del Río Salado (se entra por el OESTE)
const BANADO = [
  'TTTTTTTTTTTTTTTTTTTTTTTT',
  'TT,,,~~~~,,,,TT,,,,~~~TT',
  'TT,,,~~~~,,,,,,,,,,~~~TT',
  'TT,,,,,,,,~~~~,,,F,,,,TT',
  'TT..,,,,,,~~~~,,,,,,..TT',
  'TT..F,,,,,,,,,,~~~~,,,TT',
  'TT....,,,,,,,,,~~~~,,.TT',
  '==========,,,,,,,,,,..TT',
  '==========,,,,~~~,,,..TT',
  'TT..~~~~..,,,,~~~,,,,.TT',
  'TT..~~~~.,,,,,,,,,F,,.TT',
  'TT,,,,,..,,,~~~~~,,,,,TT',
  'TT,,,,,,,,,,~~~~~,,S,.TT',
  'TT,,F,,,~~~,,,,,,,,,,.TT',
  'TT,,,,,,~~~,,,,,,,,,,,TT',
  'TTTTTTTTTTTTTTTTTTTTTTTT',
];
// Desvío de la Ruta 7 (Yungas): EL MONTE CERRADO, bosque muy oscuro (se entra por el ESTE)
const MONTE = [
  'YYYYYYYYYYYYYYYYYYYYYYYYYY',
  'YYYYYYYYYYYYYYYYYYYYYYYYYY',
  'YYYY.,YYYYYYYYYYYYYYYYY,.Y',
  'YYYY,,..,.,.,.,.,.,,,YY.,Y',
  'YYYY,,,,.,.,.....,,,.YY,,Y',
  'YYYYYYYYYYY,.YYYYYY.,YY.,Y',
  'YYYYYYYYYYY..YYYYYY..,,,.Y',
  'YYYYYYYYYYY.,YYYYYY.,,,,YY',
  'YYY.,...,,.,,YYYYYY,.YYYYY',
  'YYY....,,..,YYYYYYY,,YYYYY',
  'YYY.,YYYYYYYY,,YYYY.,,====',
  'YYY,.YYYYYYYY,,YYYY,..====',
  'YYY.,YYYYYYYY.,YYYYYYSYYYY',
  'YYY,,YYYYYYYY,.YYYYYYYYYYY',
  'YYY,,YYYYYYYYYYYYY,,.,.YYY',
  'YYY.,.,,,..YYYYYYY,.,,.YYY',
  'YYY..,.....YYYYYYY,.YYYYYY',
  'YYYYYYYYY.,YYYYYYY,,YYYYYY',
  'YYY.,...,,.,,.,....,YYYYYY',
  'YYY,....,,.,,..,.,,YYYYYYY',
  'YYYYYYYYYYYYYYYYYYYYYYYYYY',
  'YYYYYYYYYYYYYYYYYYYYYYYYYY',
];
const TAFI = [
  'RRRRRRRRRR==RRRRRRRRRRRR',
  'RR........==S.........RR',
  'RR..F.....==.......F..RR',
  'RR........==..RRRRRRR.RR',
  'RR............RRRRRRR.RR',
  'RR............RRRRRRR.RR',
  'RR............RRRRRRR.RR',
  'RR............RRRRRRR.RR',
  'RR........==..RRR:RRR.RR',
  'RR...=..S.==.....=.S..RR',
  'RR.=================..RR',
  'RR........==..........RR',
  'RR..F.....==....F.....RR',
  'RR........==..~~~~~...RR',
  'RR........==..~~~~~...RR',
  'RR........==..~~~~~...RR',
  'RR........==..........RR',
  'RR........==...R..R...RR',
  'RR..S.....==..........RR',
  'RR........==...R..R...RR',
  'RR........==..........RR',
  'RRRRRRRRRR==RRRRRRRRRRRR',
];
// La Salamanca: cueva de Tafí del Valle donde está el gimnasio de ROCA
const SALAMANCA = [
  'RRRRRRRRRRRRR',
  'RRa:::::::aRR',
  'RR:::::::::RR',
  'RR::RR:RR::RR',
  'RRa:::::::aRR',
  'RRRR:::::RRRR',
  'RR:::::::::RR',
  'RR:RR:::RR:RR',
  'RR:::::::::RR',
  'RRRRR:::RRRRR',
  'RR:::::::::RR',
  'RRa:RR:RR:aRR',
  'RR:::::::::RR',
  'RRRRR:::RRRRR',
  'RRRRRR:RRRRRR',
];


// CEMIC: centro donde curan a las criaturas (hay uno en cada pueblo)
function crearCentro(destino, ax, ay, idCentro) {
  return {
    nombre: 'CEMIC',
    grilla: desdeTexto([
      '#########',
      '#k_x_x_p#',
      '#t____tt#',
      '#_______#',
      '#_______#',
      '#p_____p#',
      '#_______#',
      '####m####',
    ]),
    edificios: [],
    salidas: [{ x: 4, y: 7, a: destino, ax, ay, dir: 0 }],
    objetos: {
      k: 'Un estante con vendas, termómetros y frascos de remedios para criaturas.',
      x: 'Un cartel que dice: "CEMIC. Cuidamos a tus criaturas como si fueran nuestras".',
      t: 'El mostrador del CEMIC.',
      p: 'Una planta de mburucuyá con flores violetas.',
    },
    npcs: [
      {
        id: 'rosa', x: 4, y: 2, dir: 0, pal: PAL.rosa,
        hablar: async () => {
          await decir('ENFERMERA ROSA: ¡Bienvenido al CEMIC! ¿Tus criaturas están cansadas?');
          if (!S.equipo.length) { await decir('Ah, todavía no tenés criaturas. ¡Volvé cuando tengas!'); return; }
          curarEquipo();
          S.flags.centro = { mapa: idCentro, x: 4, y: 4, dir: 1 };
          await decir('Las revisamos, las mimamos y... ¡listo! Tus criaturas recuperaron toda su energía.');
          await decir('ENFERMERA ROSA: Si pierden una pelea, te traemos al CEMIC a descansar. ¡Volvé cuando quieras!');
          guardar();
        },
      },
      // El almacén está adentro de cada CEMIC
      { id: 'almacenero', x: 2, y: 2, dir: 0, pal: PAL.almacenero, hablar: () => tienda() },
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

// Tomi: pelea una vez y usa el inicial que eligió (base, medio o final)
const TOMI_FORMAS = {
  medio: { flamartija: 'dracobrasa', ajolodo: 'branquiotox', ramoa: 'lianaco' },
  final: { flamartija: 'ignidraxx', ajolodo: 'iberaxolot', ramoa: 'carayarbore' },
};
function tomiNPC(o) {
  return {
    id: o.id, x: o.x, y: o.y, dir: o.dir, pal: PAL.tomi,
    hablar: async () => {
      if (S.flags[o.bandera]) { await decir(o.despues); return; }
      for (const t of o.antes) await decir(t);
      const base = S.flags.inicialTomi || 'ramoa';
      const suyo = o.forma === 'base' ? base : TOMI_FORMAS[o.forma][base];
      const r = await batalla({ entrenador: { nombre: 'TOMI', pal: PAL.tomi, equipo: [...o.equipo, [suyo, o.nivel]] } });
      if (r === 'gana') {
        S.flags[o.bandera] = true;
        await decir(o.gana);
        if (o.premio) {
          S.bolsa.alfajor = (S.bolsa.alfajor || 0) + o.premio;
          await decir(`¡Felipe recibió ${o.premio} ALFAJORES!`);
        }
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
      { x: 10, y: 0, a: 'pampa', ax: 10, ay: 30, dir: 1 },
      { x: 11, y: 0, a: 'pampa', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 1. Al norte: la LLANURA PAMPEANA y las SIERRAS DE CÓRDOBA. ¡Cuidado con el pasto alto!',
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
          if (S.flags.beto) { await decir('GAUCHO BETO: Seguí entrenando, gurí. Las sierras de Córdoba te esperan.'); return; }
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
    nombre: 'RUTA 9 · ESTEROS DEL IBERÁ',
    exterior: true,
    grilla: desdeTexto(RUTA2),
    edificios: [],
    salidas: [
      { x: 10, y: 35, a: 'chaco', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 35, a: 'chaco', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'villa', ax: 10, ay: 22, dir: 1 },
      { x: 11, y: 0, a: 'villa', ax: 11, ay: 22, dir: 1 },
    ],
    carteles: {
      '12,3': 'VILLA CAMALOTE, acá nomás al SUR. ¡Cuidado con los mosquitos!',
      '13,32': 'RUTA 9 · ESTEROS DEL IBERÁ. Por el puente de madera se cruza la laguna. Dicen que en el pasto del pantano se esconden AJOLODO, como el inicial de Agua.',
    },
    encuentros: { lista: [['mosquillon', 20], ['carpinchon', 18], ['junquito', 12], ['terito', 12], ['yacarelito', 10], ['totorarca', 8], ['ajolodo', 6], ['ceibito', 6], ['lechucita', 5], ['faeve', 4], ['espejito', 3], ['anahisa', 2]], min: 31, max: 34 }, // AJOLODO: inicial de Agua, en el pantano
    npcs: [
      entrenadorNPC({
        id: 'pescador', x: 12, y: 16, dir: 2, pal: PAL.pescador, nombre: 'PESCADOR RAÚL',
        equipo: [['carpinchon', 31], ['mosquillon', 32]],
        antes: ['PESCADOR RAÚL: ¡Shh! Me espantás los dorados...', '¡Bueno, ya que estás, peleemos!'],
        gana: 'PESCADOR RAÚL: Me ganaste... Hoy no pica nada, ¡ni los peces ni mis criaturas!',
        despues: 'PESCADOR RAÚL: En el agua de la laguna viven los JUNQUITOS. Parecen totoras, ¡pero tienen ojitos!',
      }),
      entrenadorNPC({
        id: 'chica_estero', x: 16, y: 27, dir: 2, pal: PAL.chica, nombre: 'GUÍA SOLE',
        equipo: [['totorarca', 32], ['terito', 32], ['anahisa', 33]],
        antes: ['GUÍA SOLE: ¡Bienvenido a los esteros! Acá las criaturas son de PLANTA y de AGUA.', '¿Querés ver a las mías?'],
        gana: 'GUÍA SOLE: ¡Qué bien entrenaste! Seguro le vas a dar pelea a TALA.',
        despues: 'GUÍA SOLE: TALA, la líder de PUERTO WANDA, usa PLANTA. ¡El FUEGO, el HIELO y los VOLADORES le ganan!',
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
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 23, a: 'ruta2', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 23, a: 'ruta2', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 0, a: 'ruta3', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'ruta3', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 10. Hacia la SELVA MISIONERA y las MINAS DE WANDA.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá cuando quieras!',
      '19,9': 'MUELLE DE VILLA CAMALOTE. Desde acá salen las canoas a los esteros.',
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
          if (S.flags.insignia3) await decir('PESCADOR: ¡Así que le ganaste a TALA! Ahora sí que sos un baqueano del Litoral.');
          else {
            await decir('PESCADOR: Más adelante, en PUERTO WANDA, está el gimnasio de PLANTA de TALA.');
            await decir('Pero ojo: cada criatura tiene un segundo tipo distinto. ¡Llevá un equipo variado!');
          }
        },
      },
    ],
  },

  centro: crearCentro('villa', 5, 9, 'centro'),

  gimnasio: {
    nombre: 'GIMNASIO VALLE DE LA LUNA',
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
    salidas: [{ x: 5, y: 11, a: 'vallefertil', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      g: 'Una esfera de cristal. Adentro se ven nubes que se mueven solas...',
    },
    npcs: [
      entrenadorNPC({
        id: 'vidente1', x: 3, y: 8, dir: 3, pal: PAL.vidente, nombre: 'ADIVINO TITO',
        equipo: [['lechucita', 12], ['espejito', 12]],
        antes: ['ADIVINO TITO: Ya sabía que ibas a venir...', '¡Y también sé que vas a perder!'],
        gana: 'ADIVINO TITO: Eso... eso no lo vi venir.',
        despues: 'ADIVINO TITO: LUNA te espera al fondo. Su PUMITA medita... ¡y después pega como un boxeador!',
      }),
      entrenadorNPC({
        id: 'vidente2', x: 7, y: 4, dir: 2, pal: PAL.vidente, nombre: 'ADIVINA MARGA',
        equipo: [['mimetit', 13], ['pumita', 13]],
        antes: ['ADIVINA MARGA: Las cartas dicen que hoy hay pelea. ¡Las cartas nunca fallan!'],
        gana: 'ADIVINA MARGA: Mmm... Tendría que haber mezclado mejor las cartas.',
        despues: 'ADIVINA MARGA: Las criaturas de LUNA son rápidas. ¡Llevá mates por las dudas!',
      }),
      {
        id: 'luna', x: 5, y: 1, dir: 0, pal: PAL.luna,
        hablar: async () => {
          if (S.flags.insignia1) {
            await decir('LUNA: Las piedras del valle ya te mostraron tu camino. Seguí viaje hacia Tucumán, Felipe.');
            return;
          }
          await decir('LUNA: Hola, Felipe. Te estaba esperando... me lo dijeron las piedras del Valle de la Luna.');
          await decir('Soy LUNA, líder del GIMNASIO DEL VALLE DE LA LUNA. Mis criaturas sienten lo que pensás antes de que te muevas.');
          await decir('Si me ganás, te llevás la INSIGNIA ESPEJO. ¿Empezamos?');
          const r = await batalla({ entrenador: { nombre: 'LÍDER LUNA', pal: PAL.luna, equipo: [['condorito', 13], ['mythfae', 14], ['mimetit', 14], ['pumita', 15], ['espejon', 16]] } });
          if (r === 'gana') {
            S.flags.insignia1 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 1);
            await decir('LUNA: Tu mente es clara como el cielo de San Juan. Te ganaste esto.');
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
    nombre: 'RUTA 10 · SELVA MISIONERA',
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
      '8,15': 'RUTA 10 · SELVA MISIONERA. La tierra es colorada por el hierro de las piedras.',
      '14,29': 'Al ESTE: MINAS DE WANDA y PUERTO WANDA, con el GIMNASIO DE PLANTA.',
    },
    encuentros: { lista: [['capullon', 20], ['cuison', 18], ['arquineo', 14], ['piedrin', 12], ['mosquillon', 10], ['zorrazo', 8], ['piquibrasa', 6], ['ceibito', 6], ['polillaca', 4], ['pumita', 3]], min: 32, max: 35 },
    npcs: [
      entrenadorNPC({
        id: 'guardaparque_selva', x: 12, y: 13, dir: 2, pal: PAL.guarda, nombre: 'GUARDAPARQUE ANA',
        equipo: [['cuison', 33], ['arquineo', 34]],
        antes: ['GUARDAPARQUE ANA: ¡Alto ahí! En la selva hay que saber cuidarse.', '¡A ver si tus criaturas están preparadas!'],
        gana: 'GUARDAPARQUE ANA: ¡Muy bien! Estás listo para seguir.',
        despues: 'GUARDAPARQUE ANA: Si ves un PELUCHÍN, no lo toques con la mano. ¡Pica muchísimo!',
      }),
      entrenadorNPC({
        id: 'cazabichos', x: 6, y: 18, dir: 0, pal: PAL.nene, nombre: 'CAZABICHOS JUANI',
        equipo: [['capullon', 33], ['polillaca', 35], ['mosquillon', 34]],
        antes: ['CAZABICHOS JUANI: ¡Mirá todos los bichos que atrapé! ¿Peleamos?'],
        gana: 'CAZABICHOS JUANI: ¡Nooo! Mis bichitos...',
        despues: 'CAZABICHOS JUANI: Los PELUCHINES se hacen capullo y después... ¡POLILLACA! Dicen que tiene ojos de yaguareté en las alas.',
      }),
      entrenadorNPC({
        id: 'mochilera', x: 13, y: 25, dir: 2, pal: PAL.chica, nombre: 'MOCHILERA FLOR',
        equipo: [['totorarca', 34], ['micalonco', 35]],
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
    encuentros: { lista: [['piedrin', 26], ['geodin', 22], ['peludin', 12], ['rocamonte', 10], ['micalonco', 8], ['capullon', 8], ['garkol', 6], ['vizcachita', 6]], min: 33, max: 36 },
    npcs: [
      entrenadorNPC({
        id: 'minero1', x: 14, y: 13, dir: 2, pal: PAL.beto, nombre: 'MINERO HUGO',
        equipo: [['micalonco', 34], ['geodin', 35]],
        antes: ['MINERO HUGO: ¡Eh, pibe! Esta mina es peligrosa.', '¡Te muestro cómo pelean las criaturas de piedra!'],
        gana: 'MINERO HUGO: ¡Uf! Me dejaste más molido que una piedra.',
        despues: 'MINERO HUGO: Los GEODINES tienen cristales adentro. Cuando crecen se vuelven WANDACOLOSOS, ¡enormes!',
      }),
      entrenadorNPC({
        id: 'minero2', x: 12, y: 6, dir: 2, pal: PAL.abuelo, nombre: 'MINERO DON PEDRO',
        equipo: [['peludin', 35], ['rocamonte', 35], ['arquineo', 36]],
        antes: ['MINERO DON PEDRO: Cuarenta años picando piedra, m\'hijo. ¡A ver qué traés!'],
        gana: 'MINERO DON PEDRO: Bien, bien. Tenés pasta de campeón.',
        despues: 'MINERO DON PEDRO: TALA, la líder de PUERTO WANDA, usa PLANTA. ¡Llevá FUEGO, HIELO, VOLADOR o BICHO!',
      }),
    ],
  },

  puerto: {
    nombre: 'PUERTO WANDA',
    exterior: true,
    grilla: desdeTexto(PUERTO),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio3', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'minas', ax: 9, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'minas', ax: 10, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro2', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio3', ax: 5, ay: 10, dir: 1 },
      { x: 10, y: 0, a: 'caldenal', ax: 10, ay: 30, dir: 1 },
      { x: 11, y: 0, a: 'caldenal', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 11. Hacia el SUR: el CALDENAL PAMPEANO y la PATAGONIA.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá cuando quieras!',
      '19,9': 'GIMNASIO DE PUERTO WANDA. Líder: TALA, guardiana de la selva. Tipo PLANTA.',
      '4,18': 'PUERTO WANDA. Tierra colorada, yerba mate y piedras preciosas.',
    },
    npcs: [
      {
        id: 'tarefero', x: 7, y: 11, dir: 0, pal: PAL.guarda,
        hablar: async () => {
          await decir('TAREFERO: Yo cosecho yerba mate en los yerbales. ¡Los CUISITOS siempre andan escondidos entre las plantas!');
        },
      },
      tomiNPC({
        id: 'tomi_puerto', x: 13, y: 18, dir: 2, bandera: 'tomi4', forma: 'final', nivel: 36,
        equipo: [['arquineo', 34], ['micalonco', 34], ['nevulon', 34]],
        antes: ['TOMI: ¡Felipe! Vine desde el norte en un camión de yerba. ¡Estoy más fuerte que nunca!', 'TOMI: ¡Mirá cómo evolucionó mi compañero!'],
        gana: 'TOMI: ¡No puede ser! Bueno... ganale a TALA, ¿eh? Tomá.',
        despues: 'TOMI: Yo me voy para el sur. ¡Dicen que en Bariloche hace un frío que congela los mocos!',
        premio: 3,
      }),
    ],
  },

  centro2: crearCentro('puerto', 5, 9, 'centro2'),

  // ================= NORTE ARGENTINO =================
  ruta4: {
    nombre: 'RUTA 7 · YUNGAS',
    exterior: true,
    grilla: desdeTexto(RUTA4),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'tafi', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'tafi', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'calilegua', ax: 10, ay: 13, dir: 1 },
      { x: 11, y: 0, a: 'calilegua', ax: 11, ay: 13, dir: 1 },
    ],
    carteles: {
      '16,12': 'RUTA 7 · YUNGAS. La selva de las nubes: siempre hay neblina entre los árboles. Dicen que en el pasto alto del bosque se esconden RAMOA, como el inicial de Planta.',
      '13,30': 'Al norte: CALILEGUA. De ahí sale el camino al CHACO y al LITORAL.',
    },
    encuentros: { lista: [['cuison', 18], ['capullon', 14], ['mosquillon', 12], ['arquineo', 12], ['carpinchon', 10], ['condorito', 10], ['cardito', 8], ['zorrazo', 8], ['ramoa', 6], ['polillaca', 3]], min: 25, max: 28 }, // RAMOA: inicial de Planta, en el bosque
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
      { x: 21, y: 8, a: 'chaco', ax: 10, ay: 32, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al norte: QUEBRADA DE HUMAHUACA, TILCARA y la PUNA. ¡Un desvío ideal para entrenar!',
      '8,7': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá cuando quieras!',
      '4,12': 'CALILEGUA. Al este: RUTA 8 · EL IMPENETRABLE, hacia el CHACO, el LITORAL y MISIONES.',
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
    nombre: 'QUEBRADA DE HUMAHUACA',
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
      '13,31': 'QUEBRADA DE HUMAHUACA. Cuidado con la PAJA BRAVA: ahí se esconden las criaturas.',
    },
    encuentros: { lista: [['cardito', 22], ['chispuna', 18], ['piedrin', 14], ['farolito', 14], ['condorito', 12], ['vizcachita', 10], ['geodin', 6], ['volcarin', 4]], min: 27, max: 30 },
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
        despues: 'ARRIERO RAMÓN: En la Puna hay criaturas de HIELO. ¡Buen lugar para entrenar antes de ir a Bariloche!',
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
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'ruta5', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'ruta5', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro4', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 0, a: 'ruta6', ax: 12, ay: 34, dir: 1 },
      { x: 11, y: 0, a: 'ruta6', ax: 13, ay: 34, dir: 1 },
    ],
    carteles: {
      '12,1': 'Hacia LA PUNA y las SALINAS GRANDES.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá cuando quieras!',
      '19,9': 'PUCARÁ DE TILCARA. Un pueblo de piedra que construyeron hace casi mil años.',
      '4,18': 'TILCARA. Casas de adobe y cerros de siete colores.',
    },
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
          await decir('NENE: ¿Viste los cardones? Los RODCARDOS se hacen bolita y bajan rodando por los cerros. ¡Más rápido que el viento!');
        },
      },
    ],
  },

  centro4: crearCentro('tilcara', 5, 9, 'centro4'),

  gimnasio3: {
    nombre: 'GIMNASIO WANDA',
    grilla: desdeTexto([
      '###########',
      '#YqqqqqqqY#',
      '#qqYYqYYqq#',
      '#qqqqqqqqq#',
      '#YqYqqqYqY#',
      '#qqqqqqqqq#',
      '#qYYqqqYYq#',
      '#qqqqqqqqq#',
      '#YqqYqYqqY#',
      '#qqqqqqqqq#',
      '#qqqqqqqqq#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'puerto', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      Y: 'Un árbol de la selva lleno de lianas y orquídeas.',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim3_a', x: 2, y: 7, dir: 3, pal: PAL.chica, nombre: 'JARDINERA PAZ',
        equipo: [['cuison', 32], ['totorarca', 32]],
        antes: ['JARDINERA PAZ: ¡Cuidado con pisar las plantas! Si querés pasar, primero ganame.'],
        gana: 'JARDINERA PAZ: Ay, mis plantitas... Bueno, pasá.',
        despues: 'JARDINERA PAZ: TALA conoce cada árbol de la selva misionera. ¡Hasta les pone nombre!',
      }),
      entrenadorNPC({
        id: 'gim3_b', x: 8, y: 5, dir: 2, pal: PAL.ayudante, nombre: 'BOTÁNICO EZE',
        equipo: [['piquibrasa', 33], ['cardito', 33], ['cuisito', 32]],
        antes: ['BOTÁNICO EZE: Conozco cada planta de la selva. ¡Y cada debilidad de tus criaturas!'],
        gana: 'BOTÁNICO EZE: Mmm, eso no estaba en mis libros.',
        despues: 'BOTÁNICO EZE: Las PLANTAS sufren con el FUEGO, el HIELO, el VENENO, los BICHOS y los VOLADORES.',
      }),
      {
        id: 'tala', x: 5, y: 1, dir: 0, pal: PAL.tala,
        hablar: async () => {
          if (S.flags.insignia3) {
            await decir('TALA: Llevás la fuerza de la selva. ¡Buen viaje a la Patagonia, Felipe!');
            return;
          }
          if (!S.flags.insignia2) {
            await decir('TALA: Primero conseguí la INSIGNIA AMATISTA de ROCÍO, en LA SALAMANCA de Tucumán. Después te espero.');
            return;
          }
          await decir('TALA: Bienvenido a mi selva, Felipe. Acá todo crece rápido y fuerte.');
          await decir('Soy TALA, líder del GIMNASIO WANDA. Mis criaturas aguantan la lluvia, el calor y la tierra colorada.');
          await decir('Si me ganás, te llevás la INSIGNIA CARDÓN. ¡Vamos!');
          const r = await batalla({ entrenador: { nombre: 'LÍDER TALA', pal: PAL.tala, equipo: [['totorarca', 33], ['anahisa', 34], ['cuison', 34], ['piquillonco', 35], ['rodcardo', 36]] } });
          if (r === 'gana') {
            S.flags.insignia3 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 3);
            await decir('TALA: Ganaste con todas las de la ley. La selva te reconoce.');
            await decir('¡Felipe recibió la INSIGNIA CARDÓN!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 4;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('TALA: Llevate estos ALFAJORES y BOLEADORAS. En la Patagonia te van a hacer falta.');
            guardar();
          }
        },
      },
    ],
  },
  // ================= LA PUNA =================
  ruta6: {
    nombre: 'SALINAS GRANDES',
    exterior: true,
    grilla: desdeTexto(RUTA6),
    edificios: [],
    salidas: [
      { x: 12, y: 35, a: 'tilcara', ax: 10, ay: 1, dir: 0 },
      { x: 13, y: 35, a: 'tilcara', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'susques', ax: 10, ay: 17, dir: 1 },
      { x: 11, y: 0, a: 'susques', ax: 11, ay: 17, dir: 1 },
    ],
    carteles: {
      '13,3': 'SALINAS GRANDES. Un mar de sal blanca a 3.400 metros de altura.',
      '9,22': 'LA PUNA. ¡Abrigate! De noche hace muchísimo frío.',
      '10,33': 'Al norte: SUSQUES, el último pueblo de la Puna.',
    },
    encuentros: { lista: [['nevuki', 20], ['glaciolito', 16], ['pinguinoide', 14], ['chispuna', 12], ['condorito', 10], ['vizcachita', 10], ['micalonco', 6], ['farolito', 6], ['nevulon', 4], ['volcarin', 4], ['venomin', 10]], min: 29, max: 33 },
    npcs: [
      entrenadorNPC({
        id: 'salinero', x: 8, y: 10, dir: 3, pal: PAL.beto, nombre: 'SALINERO BRAULIO',
        equipo: [['glaciolito', 31], ['micalonco', 31], ['vizcachita', 32]],
        antes: ['SALINERO BRAULIO: Corto bloques de sal todo el día. ¡Mis criaturas son duras como la sal!'],
        gana: 'SALINERO BRAULIO: ¡Me dejaste salado! Ja, ja.',
        despues: 'SALINERO BRAULIO: Los GLACIOLITOS bajan de los cerros nevados. Cuando crecen se vuelven MORENACOLOSOS, ¡gigantes!',
      }),
      entrenadorNPC({
        id: 'llamera', x: 7, y: 17, dir: 3, pal: PAL.coplera, nombre: 'PASTORA DE LLAMAS ROSA',
        equipo: [['nevuki', 31], ['condorito', 31], ['farolito', 32]],
        antes: ['PASTORA ROSA: Mis llamas se asustan con los forasteros. ¡Demostrame que sos buena gente con un duelo!'],
        gana: 'PASTORA ROSA: Ya sé que sos de confianza. Pasá, pasá.',
        despues: 'PASTORA ROSA: El NEVUKI esconde su carita en la cola cuando hay tormenta. ¡Es lo más tierno que hay!',
      }),
      entrenadorNPC({
        id: 'vulcanologo', x: 9, y: 27, dir: 3, pal: PAL.ayudante, nombre: 'VULCANÓLOGO TINCHO',
        equipo: [['chispuna', 31], ['volcarin', 32], ['pinguinoide', 32]],
        antes: ['VULCANÓLOGO TINCHO: ¡En la Puna hay volcanes y nieve al mismo tiempo! ¿Fuego o hielo? ¡Probemos!'],
        gana: 'VULCANÓLOGO TINCHO: Mi teoría falló... ¡Hay que repetir el experimento!',
        despues: 'VULCANÓLOGO TINCHO: Contra el HIELO usá FUEGO, LUCHA, ROCA o ACERO. ¡Pero NIEVE mezcla tipos para cubrirse!',
      }),
      tomiNPC({
        id: 'tomi3', x: 14, y: 30, dir: 2, bandera: 'ent_tomi3', forma: 'medio', nivel: 32,
        equipo: [['arquineo', 30], ['micalonco', 30], ['nevuki', 30]],
        antes: ['TOMI: ¡Felipe! ¡Vos también subiste a la Puna a entrenar! ¡Esta vez sí que te gano!'],
        gana: 'TOMI: ¡Nooo! Bueno... ¡algún día te gano, vas a ver!',
        despues: 'TOMI: Voy a seguir entrenando. ¡Nos vemos en el próximo gimnasio!',
      }),
    ],
  },

  susques: {
    nombre: 'SUSQUES',
    exterior: true,
    grilla: desdeTexto(SUSQUES),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 12, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 18, a: 'ruta6', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 18, a: 'ruta6', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro5', ax: 4, ay: 6, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al norte: la frontera con Chile. ¡Por acá no se sigue! Volvé a Calilegua para seguir viaje.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con un tecito de coca para la altura!',
      '19,9': 'IGLESIA DE SUSQUES. Paredes de adobe y techo de paja, ¡tiene más de 400 años!',
      '4,16': 'SUSQUES. Un pueblito de adobe en el medio de la Puna.',
    },
    objetos: { w: 'Un piletón de sal. ¡Brilla con el sol!' },
    disparadores: [
      {
        prueba: (x, y) => y === 0,
        accion: async () => {
          await decir('Más allá está la frontera. ¡Por acá no se sigue! Volvé a Calilegua y seguí hacia el Chaco.');
          await pasoForzado(0);
        },
      },
    ],
    npcs: [
      {
        id: 'abuelo_susques', x: 8, y: 13, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          await decir('ABUELO: En la Puna el sol quema y el viento congela. Las criaturas de acá son muy fuertes.');
          await decir('Dicen que NIEVE, la líder de Bariloche, viene a entrenar acá con su MORENACOLOSO en el medio de las tormentas.');
        },
      },
    ],
  },

  centro5: crearCentro('susques', 5, 9, 'centro5'),

  gimnasio4: {
    nombre: 'GIMNASIO BARILOCHE',
    grilla: desdeTexto([
      '###########',
      '#a-------a#',
      '#wwRwwwRww#',
      '#wwwwwwwww#',
      '#RwwRwRwwR#',
      '#wwwwwwwww#',
      '#wRRwwwRRw#',
      '#wwwwwwwww#',
      '#awwRwRwwa#',
      '#wwwwwwwww#',
      '#wwwwwwwww#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'bariloche', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      R: 'Un bloque de hielo milenario con piedras adentro.',
      a: 'Cristales de hielo que nunca se derriten.',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim4_a', x: 2, y: 7, dir: 3, pal: PAL.nieve, nombre: 'ESQUIADORA LU',
        equipo: [['pinguinoide', 39], ['nevulon', 39], ['glacivenom', 40]],
        antes: ['ESQUIADORA LU: ¡Este piso resbala! Pero mis criaturas no se caen nunca. ¡Duelo!'],
        gana: 'ESQUIADORA LU: ¡Me resbalé! Bueno, pasá.',
        despues: 'ESQUIADORA LU: El HIELO sufre con el FUEGO, la LUCHA, la ROCA y el ACERO.',
      }),
      entrenadorNPC({
        id: 'gim4_b', x: 8, y: 5, dir: 2, pal: PAL.beto, nombre: 'ANDINISTA BRUNO',
        equipo: [['glaciolito', 40], ['vientuino', 41]],
        antes: ['ANDINISTA BRUNO: Subí el Aconcagua tres veces. ¡Tu equipo no me asusta!'],
        gana: 'ANDINISTA BRUNO: Ganaste la cumbre, Felipe.',
        despues: 'ANDINISTA BRUNO: NIEVE es durísima. Su NEVUKHAN, el zorro de seis colas, es imparable.',
      }),
      {
        id: 'nieve', x: 5, y: 1, dir: 0, pal: PAL.nieve,
        hablar: async () => {
          if (S.flags.insignia4) {
            await decir('NIEVE: Derretiste mi hielo, Felipe. Seguí subiendo, la cordillera te espera.');
            return;
          }
          if (!S.flags.insignia3) {
            await decir('NIEVE: Primero conseguí la INSIGNIA CARDÓN de TALA, en Puerto Wanda. Después te espero.');
            return;
          }
          await decir('NIEVE: Llegaste hasta Bariloche... Pocos aguantan el frío de la cordillera.');
          await decir('Soy NIEVE, líder del GIMNASIO BARILOCHE. Mis criaturas nacieron entre la nieve y la roca de los Andes.');
          await decir('Si me ganás, te llevás la INSIGNIA GLACIAR. ¡Preparate para congelarte!');
          const r = await batalla({ entrenador: { nombre: 'LÍDER NIEVE', pal: PAL.nieve, equipo: [['glacivenom', 40], ['morenacoloso', 41], ['nevulon', 41], ['vientuino', 42], ['nevukhan', 43]] } });
          if (r === 'gana') {
            S.flags.insignia4 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 4);
            await decir('NIEVE: Tu fuego es más fuerte que mi hielo. Te lo ganaste.');
            await decir('¡Felipe recibió la INSIGNIA GLACIAR!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 5;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('NIEVE: Llevate estos ALFAJORES y BOLEADORAS. ¡Ya tenés cuatro insignias, la mitad del camino!');
            guardar();
          }
        },
      },
    ],
  },
  // ================= PAMPA Y CÓRDOBA =================
  banado: {
    nombre: 'BAÑADO DEL RÍO SALADO',
    exterior: true,
    grilla: desdeTexto(BANADO),
    edificios: [],
    salidas: [
      { x: 0, y: 7, a: 'pampa', ax: 20, ay: 12, dir: 2 },
      { x: 0, y: 8, a: 'pampa', ax: 20, ay: 13, dir: 2 },
    ],
    carteles: {
      '19,12': 'BAÑADO DEL RÍO SALADO. Juncos, lagunitas y barro: acá viven criaturas de PLANTA, AGUA, TIERRA y VENENO. ¡Y dicen que también AJOLODO!',
    },
    objetos: { '~': 'Agua quieta y oscura del bañado. Se ven burbujitas... ¿será una criatura?' },
    encuentros: { lista: [['junquito', 14], ['carpinchu', 12], ['cuisito', 12], ['ajolodo', 10], ['larvin', 10], ['peludin', 10], ['ceibito', 8], ['hornerito', 8], ['yacarelito', 6], ['mosquillon', 6], ['capullon', 4]], min: 4, max: 8 },
    npcs: [
      {
        id: 'pescador_banado', x: 21, y: 9, dir: 2, pal: PAL.pescador,
        hablar: async () => {
          await decir('PESCADOR: ¡Shhh, que se espantan las tarariras! Este bañado se llena con el agua del río Salado.');
          await decir('Entre los juncos se esconden AJOLODO, JUNQUITO y CARPINCHU. Y ojo con los mosquitos: ¡algunos tienen VENENO!');
        },
      },
    ],
  },

  monte: {
    nombre: 'EL MONTE CERRADO',
    exterior: true,
    oscuro: 2, // más oscuro que el Gimnasio 5
    grilla: desdeTexto(MONTE),
    edificios: [],
    salidas: [
      { x: 25, y: 10, a: 'ruta4', ax: 2, ay: 13, dir: 3 },
      { x: 25, y: 11, a: 'ruta4', ax: 2, ay: 14, dir: 3 },
    ],
    carteles: {
      '21,12': 'EL MONTE CERRADO. Acá los árboles tapan el sol y casi no se ve nada. Dicen que en el fondo vive un ermitaño...',
    },
    objetos: { Y: 'Árboles tan juntos que no pasa ni la luz. Se escuchan ruidos raros entre las hojas...' },
    encuentros: { lista: [['capullon', 14], ['cuison', 12], ['lechucita', 12], ['farolito', 12], ['garkol', 10], ['mimetit', 10], ['ramoa', 8], ['faeve', 8], ['polillaca', 6], ['howlup', 4], ['sparknight', 4]], min: 26, max: 30 },
    npcs: [
      {
        id: 'ermitano_monte', x: 4, y: 2, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          if (S.flags.regaloMonte) { await decir('ERMITAÑO: En la oscuridad las criaturas FANTASMA y SINIESTRO se sienten como en casa. ¡Cuidate, gurí!'); return; }
          await decir('ERMITAÑO: ¡Uh! ¿Cómo llegaste hasta acá con esta oscuridad? Hace años que nadie me visita.');
          await decir('Tomá, te lo ganaste por valiente. La encontré entre las raíces de un árbol gigante.');
          S.bolsa.piedraNoche = (S.bolsa.piedraNoche || 0) + 1;
          S.flags.regaloMonte = true;
          await decir('¡Felipe recibió una PIEDRA NOCHE!');
          await decir('ERMITAÑO: Con ella, GARKOL se vuelve GARGORRUPT y FAEVE se vuelve DUSKFAE. ¡Usala bien!');
          guardar();
        },
      },
    ],
  },

  pampa: {
    nombre: 'RUTA 2 · LLANURA PAMPEANA',
    exterior: true,
    grilla: desdeTexto(PAMPA),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'pueblo', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 31, a: 'pueblo', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'serrana', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 0, a: 'serrana', ax: 11, ay: 20, dir: 1 },
    ],
    carteles: {
      '9,28': 'RUTA 2 · LLANURA PAMPEANA. Campo, ombúes y lagunas hasta donde llega la vista.',
      '9,3': 'Al norte: VILLA SERRANA, en las SIERRAS DE CÓRDOBA.',
    },
    encuentros: { lista: [['terito', 25], ['vizcachita', 22], ['peludin', 18], ['hornerito', 14], ['cuisito', 10], ['zorrito', 8], ['lechucita', 3]], min: 4, max: 7 },
    npcs: [
      entrenadorNPC({
        id: 'resero', x: 12, y: 6, dir: 2, pal: PAL.beto, nombre: 'RESERO JUAN',
        equipo: [['vizcachita', 6], ['terito', 7]],
        antes: ['RESERO JUAN: ¡Epa! Estoy arreando las vacas a la estancia.', '¡Un duelito y sigo viaje!'],
        gana: 'RESERO JUAN: ¡Qué guapo, gurí! Me ganaste de punta a punta.',
        despues: 'RESERO JUAN: Las VIZCACHITAS hacen cuevas enormes en el campo. ¡Cuidado donde pisás!',
      }),
      entrenadorNPC({
        id: 'nene_pampa', x: 13, y: 17, dir: 2, pal: PAL.nene, nombre: 'NENE FACU',
        equipo: [['peludin', 6], ['hornerito', 7]],
        antes: ['NENE FACU: ¡Mi HORNERITO sabe hacer casitas de barro! ¿Peleamos?'],
        gana: 'NENE FACU: ¡Uh! Mi hornerito se fue a su nido...',
        despues: 'NENE FACU: Cuando el HORNERITO crece se vuelve ARQUINEO. ¡Construye casas gigantes!',
      }),
      {
        id: 'nena_pampa', x: 8, y: 22, dir: 3, pal: PAL.nena,
        hablar: async () => {
          await decir('NENA: De noche, arriba de los postes, a veces se ve una LECHUCITA.');
          await decir('¡Dicen que con esos ojazos puede leerte la mente!');
        },
      },
    ],
  },

  serrana: {
    nombre: 'VILLA SERRANA',
    exterior: true,
    grilla: desdeTexto(SERRANA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'pampa', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'pampa', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro6', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 0, a: 'sierras', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'sierras', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 3. Hacia las SIERRAS DE CÓRDOBA y, más lejos, SAN JUAN.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá cuando quieras!',
      '19,9': 'CASA DE LA FAMILIA QUIROGA.',
      '4,18': 'VILLA SERRANA. Ríos de agua clarita y sierras de piedra.',
    },
    npcs: [
      {
        id: 'nene_serrana', x: 7, y: 11, dir: 0, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.regaloSerrana) { await decir('NENE: ¿Estaban ricos los alfajores cordobeses? ¡Son de fruta y con glasé!'); return; }
          await decir('NENE: ¡Bienvenido a Córdoba! Tomá, probá los alfajores de acá.');
          S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 2;
          S.flags.regaloSerrana = true;
          await decir('¡Felipe recibió 2 ALFAJORES!');
          guardar();
        },
      },
      {
        id: 'abuela_serrana', x: 13, y: 18, dir: 2, pal: PAL.coplera,
        hablar: async () => {
          await decir('ABUELA: El primer GIMNASIO queda lejos, en SAN JUAN, al lado del VALLE DE LA LUNA.');
          await decir('Hay que cruzar las sierras y después el desierto. ¡Pasá por el CEMIC antes de salir!');
        },
      },
    ],
  },

  centro6: crearCentro('serrana', 5, 9, 'centro6'),

  sierras: {
    nombre: 'RUTA 3 · SIERRAS DE CÓRDOBA',
    exterior: true,
    grilla: desdeTexto(SIERRAS),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'serrana', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'serrana', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'travesia', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'travesia', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '9,30': 'RUTA 3 · SIERRAS DE CÓRDOBA. Cruzá el arroyo por el puentecito.',
      '9,3': 'Al OESTE: la TRAVESÍA hacia SAN JUAN. ¡Llevá agua y mates!',
    },
    encuentros: { lista: [['piedrin', 22], ['hornerito', 14], ['zorrito', 12], ['condorito', 12], ['peluchin', 10], ['espejito', 10], ['pumita', 10], ['faeve', 6], ['carpinchu', 4]], min: 7, max: 11 },
    npcs: [
      entrenadorNPC({
        id: 'escaladora', x: 15, y: 12, dir: 3, pal: PAL.chica, nombre: 'ESCALADORA MAITE',
        equipo: [['piedrin', 9], ['condorito', 10]],
        antes: ['ESCALADORA MAITE: ¡Subí todas estas piedras con las manos! ¿Te animás a un duelo?'],
        gana: 'ESCALADORA MAITE: ¡Me caí de la piedra! Bueno, ganaste.',
        despues: 'ESCALADORA MAITE: Arriba de las sierras vuelan CONDORITOS. ¡Son criaturas PSÍQUICAS!',
      }),
      entrenadorNPC({
        id: 'turista', x: 18, y: 18, dir: 2, pal: PAL.ayudante, nombre: 'TURISTA CHARLY',
        equipo: [['espejito', 9], ['zorrito', 10], ['hornerito', 10]],
        antes: ['TURISTA CHARLY: ¡Vine de vacaciones a las sierras! Y traje a mis criaturas. ¡Duelo!'],
        gana: 'TURISTA CHARLY: ¡Qué vacaciones movidas!',
        despues: 'TURISTA CHARLY: Encontré un ESPEJITO en el arroyo. ¡Dicen que te muestra el futuro!',
      }),
      {
        id: 'serrano', x: 12, y: 25, dir: 2, pal: PAL.abuelo,
        hablar: async () => {
          await decir('SERRANO: Por acá anda el PUMITA. Se sienta arriba de una piedra a meditar...');
          await decir('...y si lo molestás, ¡te tira unas piñas que ni te cuento!');
        },
      },
    ],
  },

  travesia: {
    nombre: 'RUTA 4 · TRAVESÍA SANJUANINA',
    exterior: true,
    grilla: desdeTexto(TRAVESIA),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'sierras', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'sierras', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'vallefertil', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 0, a: 'vallefertil', ax: 11, ay: 20, dir: 1 },
    ],
    carteles: {
      '9,30': 'RUTA 4 · TRAVESÍA SANJUANINA. Desierto, jarillas y mucho sol.',
      '9,3': 'Al OESTE: VALLE FÉRTIL y el GIMNASIO DEL VALLE DE LA LUNA.',
    },
    encuentros: { lista: [['vizcachita', 18], ['lechucita', 16], ['piedrin', 14], ['espejito', 14], ['pumita', 12], ['mimetit', 10], ['faeve', 8], ['cardito', 8], ['flamartija', 6]], min: 10, max: 14 },
    npcs: [
      tomiNPC({
        id: 'tomi_travesia', x: 12, y: 26, dir: 2, bandera: 'tomi2', forma: 'base', nivel: 14,
        equipo: [['terito', 12], ['piedrin', 12]],
        antes: ['TOMI: ¡Felipe! ¡Te estaba esperando en el medio del desierto!', 'TOMI: Yo también voy al gimnasio de LUNA. ¡Pero primero te gano a vos!'],
        gana: 'TOMI: ¡Otra vez! ¿Cómo hacés? Bueno... tomá, por ganarme.',
        despues: 'TOMI: ¡Voy a entrenar un montón! Nos vemos más adelante.',
        premio: 2,
      }),
      entrenadorNPC({
        id: 'arqueologa', x: 15, y: 16, dir: 2, pal: PAL.rosa, nombre: 'ARQUEÓLOGA VERO',
        equipo: [['mimetit', 12], ['espejito', 12], ['pumita', 13]],
        antes: ['ARQUEÓLOGA VERO: Busco huesos de dinosaurio. ¡Pero un duelo también me viene bien!'],
        gana: 'ARQUEÓLOGA VERO: ¡Me dejaste como un fósil!',
        despues: 'ARQUEÓLOGA VERO: En el VALLE DE LA LUNA encontraron algunos de los dinosaurios más viejos del mundo.',
      }),
      entrenadorNPC({
        id: 'mochilero', x: 12, y: 2, dir: 2, pal: PAL.pescador, nombre: 'MOCHILERO LEO',
        equipo: [['lechucita', 12], ['vizcachita', 13]],
        antes: ['MOCHILERO LEO: ¡Hace un calor bárbaro! Un duelo y me tiro a la sombra.'],
        gana: 'MOCHILERO LEO: Uf... ahora sí, a la sombra.',
        despues: 'MOCHILERO LEO: Las criaturas de LUNA son PSÍQUICAS. Les ganan los BICHOS, los FANTASMAS y los SINIESTROS.',
      }),
    ],
  },

  // ================= SAN JUAN =================
  vallefertil: {
    nombre: 'VALLE FÉRTIL',
    exterior: true,
    grilla: desdeTexto(VALLEFERTIL),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'travesia', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'travesia', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro7', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio', ax: 5, ay: 10, dir: 1 },
      { x: 10, y: 0, a: 'talampaya', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'talampaya', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 5. Hacia TALAMPAYA y TUCUMÁN.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá cuando quieras!',
      '19,9': 'GIMNASIO DEL VALLE DE LA LUNA. Líder: LUNA, la que ve más allá de las piedras. Tipo PSÍQUICO.',
      '4,18': 'VALLE FÉRTIL. La puerta del VALLE DE LA LUNA, en San Juan.',
    },
    objetos: { R: 'Una piedra con forma de hongo. ¡El viento la talló durante millones de años!' },
    npcs: [
      {
        id: 'sanjuanino', x: 7, y: 11, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          await decir('SANJUANINO: ¿Viste las piedras raras del Valle de la Luna? Una parece un submarino, otra un hongo...');
          await decir('De noche, con la luna llena, dicen que las piedras te hablan. ¡Por eso LUNA entrena acá!');
        },
      },
      {
        id: 'nene_valle', x: 18, y: 19, dir: 2, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.insignia1) await decir('NENE: ¡Le ganaste a LUNA! ¡Ya tenés tu primera insignia!');
          else await decir('NENE: LUNA adivina lo que vas a hacer antes de que lo hagas. ¡Llevá un equipo variado para sorprenderla!');
        },
      },
    ],
  },

  centro7: crearCentro('vallefertil', 5, 9, 'centro7'),

  // ================= LA RIOJA Y TUCUMÁN =================
  talampaya: {
    nombre: 'RUTA 5 · TALAMPAYA',
    exterior: true,
    grilla: desdeTexto(TALAMPAYA),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'vallefertil', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'vallefertil', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'calchaqui', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'calchaqui', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '9,30': 'RUTA 5 · TALAMPAYA. Paredones rojos de más de cien metros de alto.',
      '9,3': 'Al norte: los VALLES CALCHAQUÍES y TAFÍ DEL VALLE.',
    },
    encuentros: { lista: [['piedrin', 22], ['rocori', 18], ['condorito', 14], ['chispuna', 12], ['geodin', 10], ['cardito', 10], ['mimetit', 8], ['garkol', 6]], min: 15, max: 19 },
    npcs: [
      entrenadorNPC({
        id: 'guarda_talampaya', x: 7, y: 30, dir: 3, pal: PAL.guarda, nombre: 'GUARDAPARQUE ÓSCAR',
        equipo: [['piedrin', 16], ['condorito', 17]],
        antes: ['GUARDAPARQUE ÓSCAR: ¡Bienvenido a Talampaya! Antes de pasar, mostrame lo que sabés.'],
        gana: 'GUARDAPARQUE ÓSCAR: ¡Muy bien! Cuidá el parque, ¿eh?',
        despues: 'GUARDAPARQUE ÓSCAR: En los paredones hay dibujos de hace miles de años. ¡Se llaman petroglifos!',
      }),
      entrenadorNPC({
        id: 'paleontologa', x: 7, y: 21, dir: 3, pal: PAL.rosa, nombre: 'PALEONTÓLOGA INÉS',
        equipo: [['rocori', 17], ['geodin', 17], ['garkol', 18]],
        antes: ['PALEONTÓLOGA INÉS: ¡Mis criaturas son duras como un hueso de dinosaurio!'],
        gana: 'PALEONTÓLOGA INÉS: ¡Ja! Me ganaste con todas las de la ley.',
        despues: 'PALEONTÓLOGA INÉS: ROCÍO, la líder de TUCUMÁN, entrena adentro de una cueva. ¡Usá AGUA, PLANTA, LUCHA o ACERO!',
      }),
      {
        id: 'riojana', x: 12, y: 8, dir: 2, pal: PAL.coplera,
        hablar: async () => {
          await decir('RIOJANA: Mirá para arriba... ¿ves los cóndores dando vueltas?');
          await decir('Los CONDORITOS los imitan, pero todavía no saben volar tan alto. ¡Ja, ja!');
        },
      },
    ],
  },

  calchaqui: {
    nombre: 'RUTA 6 · VALLES CALCHAQUÍES',
    exterior: true,
    grilla: desdeTexto(CALCHAQUI),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'talampaya', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'talampaya', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'tafi', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 0, a: 'tafi', ax: 11, ay: 20, dir: 1 },
    ],
    carteles: {
      '9,30': 'RUTA 6 · VALLES CALCHAQUÍES. Cardones, viñedos y cerros de colores. Dicen que entre los cerros, cerca de la cueva, se esconden FLAMARTIJA, como el inicial de Fuego.',
      '9,3': 'Al norte: TAFÍ DEL VALLE y LA SALAMANCA.',
    },
    encuentros: { lista: [['cardito', 22], ['rocori', 16], ['piquibrote', 12], ['hornerito', 12], ['vizcachita', 12], ['farolito', 10], ['flamartija', 6], ['glaciolito', 6], ['garkol', 6], ['chispuna', 4]], min: 18, max: 22 }, // FLAMARTIJA: inicial de Fuego, en la montaña camino a La Salamanca
    npcs: [
      entrenadorNPC({
        id: 'vinatero', x: 15, y: 23, dir: 2, pal: PAL.beto, nombre: 'VIÑATERO PANCHO',
        equipo: [['cardito', 19], ['piquibrote', 19], ['vizcachita', 20]],
        antes: ['VIÑATERO PANCHO: ¡Estoy cosechando uvas! ¿Un duelo mientras descanso?'],
        gana: 'VIÑATERO PANCHO: ¡Me dejaste hecho pasa de uva!',
        despues: 'VIÑATERO PANCHO: Los CARDITOS crecen despacito. Con paciencia se vuelven RODCARDOS.',
      }),
      entrenadorNPC({
        id: 'artesana_calchaqui', x: 12, y: 15, dir: 2, pal: PAL.coplera, nombre: 'ARTESANA LUCÍA',
        equipo: [['farolito', 20], ['rocori', 20]],
        antes: ['ARTESANA LUCÍA: Hago vasijas de barro como las de los antiguos. ¡Y también sé pelear!'],
        gana: 'ARTESANA LUCÍA: ¡Se me rompió la vasija! Bueno, ganaste.',
        despues: 'ARTESANA LUCÍA: De noche, por los cerros, aparece el FAROLITO. ¡Es una luz mala, pero buenita!',
      }),
      {
        id: 'abuelo_calchaqui', x: 12, y: 3, dir: 2, pal: PAL.abuelo,
        hablar: async () => {
          await decir('ABUELO: ¿Vas para Tafí? Allá está LA SALAMANCA, una cueva en el medio del cerro.');
          await decir('Cuenta la leyenda que en las salamancas se aprende a tocar la guitarra y a domar potros...');
          await decir('...¡y ROCÍO aprendió ahí a pelear con criaturas de piedra!');
        },
      },
    ],
  },

  tafi: {
    nombre: 'TAFÍ DEL VALLE',
    exterior: true,
    grilla: desdeTexto(TAFI),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'calchaqui', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'calchaqui', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro8', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio2', ax: 6, ay: 13, dir: 1 },
      { x: 10, y: 0, a: 'ruta4', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'ruta4', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 7. Hacia las YUNGAS y CALILEGUA, en el norte.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá cuando quieras!',
      '19,9': 'LA SALAMANCA. Gimnasio de ROCA. Líder: ROCÍO, la que aprendió en la cueva.',
      '4,18': 'TAFÍ DEL VALLE. Menhires, quesos y un dique en el medio de las montañas.',
    },
    objetos: { R: 'Un menhir: una piedra larga y parada que pusieron acá hace miles de años.' },
    npcs: [
      {
        id: 'nene_tafi', x: 7, y: 11, dir: 0, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.insignia2) await decir('NENE: ¡Saliste de LA SALAMANCA con la insignia! ¡Sos un valiente!');
          else {
            await decir('NENE: ¿Vas a entrar a LA SALAMANCA? Adentro está oscuro y hay criaturas de piedra...');
            await decir('¡Contra la ROCA usá AGUA, PLANTA, LUCHA, TIERRA o ACERO!');
          }
        },
      },
      {
        id: 'quesera', x: 17, y: 16, dir: 2, pal: PAL.rosa,
        hablar: async () => {
          if (S.flags.regaloTafi) { await decir('QUESERA: El queso de Tafí es famoso en todo el país. ¡Volvé cuando quieras!'); return; }
          await decir('QUESERA: ¡Hola, viajero! Para entrar a la cueva te van a hacer falta fuerzas. Tomá.');
          S.bolsa.mate = (S.bolsa.mate || 0) + 3;
          S.flags.regaloTafi = true;
          await decir('¡Felipe recibió 3 MATES!');
          guardar();
        },
      },
    ],
  },

  centro8: crearCentro('tafi', 5, 9, 'centro8'),

  // ================= EL CHACO =================
  chaco: {
    nombre: 'RUTA 8 · EL IMPENETRABLE',
    exterior: true,
    grilla: desdeTexto(CHACO),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'calilegua', ax: 20, ay: 8, dir: 2 },
      { x: 11, y: 33, a: 'calilegua', ax: 20, ay: 8, dir: 2 },
      { x: 10, y: 0, a: 'ruta2', ax: 10, ay: 34, dir: 1 },
      { x: 11, y: 0, a: 'ruta2', ax: 11, ay: 34, dir: 1 },
    ],
    carteles: {
      '9,30': 'RUTA 8 · EL IMPENETRABLE. Un monte tan tupido que casi no se puede pasar.',
      '9,3': 'Al este: los ESTEROS DEL IBERÁ y el LITORAL.',
    },
    encuentros: { lista: [['zorrazo', 16], ['carpinchon', 14], ['cuison', 14], ['mosquillon', 12], ['arquineo', 12], ['capullon', 10], ['yacarelito', 8], ['peludin', 8], ['farolito', 6]], min: 30, max: 33 },
    npcs: [
      entrenadorNPC({
        id: 'guardafauna', x: 12, y: 21, dir: 2, pal: PAL.guarda, nombre: 'GUARDAFAUNA PEDRO',
        equipo: [['zorrazo', 31], ['carpinchon', 31]],
        antes: ['GUARDAFAUNA PEDRO: Cuido a los animales del monte chaqueño. ¡A ver cómo cuidás a los tuyos!'],
        gana: 'GUARDAFAUNA PEDRO: ¡Muy bien! Se nota que los querés.',
        despues: 'GUARDAFAUNA PEDRO: En este monte vive el yaguareté. ¡Quedan muy poquitos y hay que cuidarlos!',
      }),
      entrenadorNPC({
        id: 'fotografa', x: 12, y: 6, dir: 2, pal: PAL.chica, nombre: 'FOTÓGRAFA JULI',
        equipo: [['arquineo', 32], ['capullon', 31], ['mosquillon', 32]],
        antes: ['FOTÓGRAFA JULI: ¡Quieto ahí! Te saco una foto... ¡y después peleamos!'],
        gana: 'FOTÓGRAFA JULI: ¡Salí movida! Bueno, ganaste.',
        despues: 'FOTÓGRAFA JULI: Más adelante están los ESTEROS. ¡Ahí saco las mejores fotos de yacarés!',
      }),
      {
        id: 'hachero', x: 18, y: 16, dir: 2, pal: PAL.beto,
        hablar: async () => {
          await decir('MONTARAZ: ¿Sabías que el quebracho es tan duro que el hacha rebota?');
          await decir('Por eso le dicen "quiebra-hacha". ¡Los árboles de acá son los más fuertes del país!');
        },
      },
    ],
  },

  // ================= PATAGONIA =================
  caldenal: {
    nombre: 'RUTA 11 · CALDENAL PAMPEANO',
    exterior: true,
    grilla: desdeTexto(CALDENAL),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'puerto', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 31, a: 'puerto', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'estepa', ax: 10, ay: 32, dir: 1 },
      { x: 11, y: 0, a: 'estepa', ax: 11, ay: 32, dir: 1 },
    ],
    carteles: {
      '9,28': 'RUTA 11 · CALDENAL PAMPEANO. Bosques de caldén y médanos de arena, en La Pampa.',
      '9,3': 'Al sur: la ESTEPA PATAGÓNICA y BARILOCHE.',
    },
    encuentros: { lista: [['vizcachita', 14], ['terito', 14], ['zorrazo', 14], ['arquineo', 12], ['cuison', 12], ['peludin', 10], ['nevuki', 8], ['condorito', 8], ['pumentor', 4]], min: 36, max: 39 },
    npcs: [
      entrenadorNPC({
        id: 'puestero', x: 12, y: 15, dir: 2, pal: PAL.beto, nombre: 'PUESTERO ARIEL',
        equipo: [['vizcachita', 37], ['terito', 37], ['zorrazo', 38]],
        antes: ['PUESTERO ARIEL: ¡Qué lejos viniste, gurí! Desde Misiones hasta La Pampa... ¡A ver qué traés!'],
        gana: 'PUESTERO ARIEL: ¡Mamita! Sí que viniste entrenado.',
        despues: 'PUESTERO ARIEL: Más al sur empieza la PATAGONIA. Allá el viento sopla tan fuerte que vuela el sombrero.',
      }),
      entrenadorNPC({
        id: 'guarda_caldenal', x: 7, y: 24, dir: 3, pal: PAL.guarda, nombre: 'GUARDAPARQUE LIHUÉ',
        equipo: [['arquineo', 38], ['cuison', 38], ['pumentor', 38]],
        antes: ['GUARDAPARQUE LIHUÉ: ¡El caldén es el árbol de La Pampa! Y yo soy su guardián. ¡Duelo!'],
        gana: 'GUARDAPARQUE LIHUÉ: ¡Bien ahí! Pasá nomás.',
        despues: 'GUARDAPARQUE LIHUÉ: NIEVE, la líder de Bariloche, usa HIELO. ¡FUEGO, LUCHA, ROCA y ACERO le ganan!',
      }),
      {
        id: 'pampeano', x: 13, y: 4, dir: 2, pal: PAL.abuelo,
        hablar: async () => {
          await decir('PAMPEANO: Los caldenes tienen cientos de años. ¡Algunos ya estaban acá antes que los gauchos!');
        },
      },
    ],
  },

  estepa: {
    nombre: 'RUTA 12 · ESTEPA PATAGÓNICA',
    exterior: true,
    grilla: desdeTexto(ESTEPA),
    edificios: [],
    salidas: [
      { x: 10, y: 33, a: 'caldenal', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 33, a: 'caldenal', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'bariloche', ax: 10, ay: 22, dir: 1 },
      { x: 11, y: 0, a: 'bariloche', ax: 11, ay: 22, dir: 1 },
    ],
    carteles: {
      '9,30': 'RUTA 12 · ESTEPA PATAGÓNICA. Coirones, viento y cielo enorme.',
      '9,3': 'Ya se ve la CORDILLERA. Al frente: BARILOCHE y el GIMNASIO DE HIELO.',
    },
    encuentros: { lista: [['nevulon', 14], ['pinguinoide', 12], ['venomin', 10], ['glaciolito', 10], ['condorito', 10], ['vizcachita', 10], ['zorrazo', 10], ['volcarin', 8], ['vientuino', 4]], min: 38, max: 41 },
    npcs: [
      entrenadorNPC({
        id: 'ovejero', x: 12, y: 25, dir: 2, pal: PAL.beto, nombre: 'OVEJERO ANSELMO',
        equipo: [['nevulon', 40], ['vizcachita', 40], ['zorrazo', 41]],
        antes: ['OVEJERO ANSELMO: Cuido mil ovejas con mis criaturas. ¡Y ninguna se pierde!'],
        gana: 'OVEJERO ANSELMO: ¡Me dejaste esquilado!',
        despues: 'OVEJERO ANSELMO: Los NEVUKIS se esconden en la nieve. ¡Solo se les ve la colita!',
      }),
      entrenadorNPC({
        id: 'vulcanologa', x: 6, y: 16, dir: 3, pal: PAL.ayudante, nombre: 'VULCANÓLOGA PAULA',
        equipo: [['chispuna', 39], ['volcarin', 40], ['glaciolito', 41]],
        antes: ['VULCANÓLOGA PAULA: ¡El volcán Lanín tiene nieve arriba y fuego adentro! ¿Fuego o hielo? ¡Peleemos!'],
        gana: 'VULCANÓLOGA PAULA: ¡Hiciste erupción! Ganaste.',
        despues: 'VULCANÓLOGA PAULA: El FUEGO derrite el HIELO... ¡pero ojo, que NIEVE tiene criaturas de ROCA también!',
      }),
      {
        id: 'mapuche', x: 8, y: 8, dir: 3, pal: PAL.coplera,
        hablar: async () => {
          await decir('ABUELA: ¿Ves esos árboles altos allá en la montaña? Son pehuenes, las araucarias.');
          await decir('Sus piñones son riquísimos. ¡Las criaturas de la cordillera los juntan para el invierno!');
        },
      },
    ],
  },

  bariloche: {
    nombre: 'BARILOCHE',
    exterior: true,
    grilla: desdeTexto(BARILOCHE),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio4', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 23, a: 'estepa', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 23, a: 'estepa', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro9', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio4', ax: 5, ay: 10, dir: 1 },
    ],
    carteles: {
      '12,1': 'RUTA 13. Hacia el GIMNASIO 5... (¡todavía en construcción!)',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con chocolate caliente para el frío!',
      '19,9': 'GIMNASIO DE BARILOCHE. Líder: NIEVE, la reina de la cordillera. Tipo HIELO.',
      '4,20': 'BARILOCHE. Lagos, bosques y montañas nevadas a orillas del Nahuel Huapi.',
    },
    disparadores: [
      {
        prueba: (x, y) => y === 0,
        accion: async () => {
          await decir('El camino hacia el GIMNASIO 5 todavía está en construcción. ¡Muy pronto vas a poder seguir viaje!');
          await pasoForzado(0);
        },
      },
    ],
    npcs: [
      {
        id: 'chocolatero', x: 7, y: 18, dir: 0, pal: PAL.ayudante,
        hablar: async () => {
          if (S.flags.regaloBariloche) { await decir('CHOCOLATERO: ¡El chocolate de Bariloche es el mejor del mundo! Bueno... eso digo yo.'); return; }
          await decir('CHOCOLATERO: ¡Llegaste a Bariloche! Tomá, unos alfajores bañados en chocolate.');
          S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 3;
          S.flags.regaloBariloche = true;
          await decir('¡Felipe recibió 3 ALFAJORES!');
          guardar();
        },
      },
      {
        id: 'guia_bari', x: 19, y: 15, dir: 2, pal: PAL.nieve,
        hablar: async () => {
          if (S.flags.insignia4) await decir('GUÍA: ¡Le ganaste a NIEVE! Ya tenés la mitad de las insignias del país.');
          else {
            await decir('GUÍA: En el lago Nahuel Huapi vive un monstruo: el NAHUELITO. ¡Dicen que es una criatura legendaria!');
            await decir('Pero primero tenés que ganarle a NIEVE. ¡Su NEVUKHAN es imparable!');
          }
        },
      },
    ],
  },

  centro9: crearCentro('bariloche', 5, 9, 'centro9'),

  // ================= REGIÓN 5: RÍO NEGRO (BOSQUE ANDINO → LÍNEA SUR → SOMUNCURÁ) =================
  // Las rutas se dibujan "de abajo hacia arriba" y se giran al final del archivo
  ruta13: {
    nombre: 'RUTA 13 · BOSQUE ANDINO',
    exterior: true,
    grilla: desdeTexto(BOSQUE_ANDINO),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'bariloche', ax: 10, ay: 22, dir: 1 },
      { x: 11, y: 31, a: 'bariloche', ax: 11, ay: 22, dir: 1 },
      { x: 10, y: 0, a: 'elbolson', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'elbolson', ax: 11, ay: 1, dir: 0 },
    ],
    carteles: {
      '9,28': 'RUTA 13 · BOSQUE ANDINO. Coihues, lagos y niebla. Dicen que en este bosque viven los duendes...',
      '9,3': 'Al sur: EL BOLSÓN, al pie del cerro Piltriquitrón.',
    },
    encuentros: { lista: [['howlup', 16], ['escarchin', 14], ['celestin', 10], ['faeve', 12], ['farolito', 12], ['garkol', 10], ['lechuzonte', 10], ['nevulon', 8], ['condorito', 8], ['pumentor', 6], ['candilejo', 4]], min: 34, max: 37 },
    npcs: [
      entrenadorNPC({
        id: 'guarda_bosque', x: 7, y: 17, dir: 2, pal: PAL.guarda, nombre: 'GUARDAPARQUE NAHUEL',
        equipo: [['lechuzonte', 45], ['howlup', 45], ['nevulon', 46]],
        antes: ['GUARDAPARQUE NAHUEL: ¡Shhh! En la niebla del bosque se esconden criaturas que nunca viste. ¡Duelo!'],
        gana: 'GUARDAPARQUE NAHUEL: ¡Uh! Me ganaste como una sombra.',
        despues: 'GUARDAPARQUE NAHUEL: Los HOWLUP le aúllan a la luna. ¡Su sombra parece mucho más grande que ellos!',
      }),
      entrenadorNPC({
        id: 'mochilera', x: 12, y: 7, dir: 2, pal: PAL.chica, nombre: 'MOCHILERA SOFI',
        equipo: [['faeve', 45], ['candilejo', 46], ['garkol', 46]],
        antes: ['MOCHILERA SOFI: ¡Vengo caminando desde Bariloche! ¿Peleamos para descansar las piernas?'],
        gana: 'MOCHILERA SOFI: ¡Qué equipo que tenés!',
        despues: 'MOCHILERA SOFI: Le di una VELA ÁNIMA a mi FAEVE... ¡y se volvió un fantasmita rosado! Se venden en el ALMACÉN.',
      }),
      {
        id: 'duende_fan', x: 13, y: 27, dir: 2, pal: PAL.nene,
        hablar: async () => {
          await decir('NENE: ¿Sabías que en El Bolsón hay un bosque con árboles tallados? Tienen caras de duendes y de animales.');
          await decir('Yo una vez vi un duende de verdad... ¡Era negro con ojos rosas y se reía!');
        },
      },
    ],
  },

  elbolson: {
    nombre: 'EL BOLSÓN',
    exterior: true,
    grilla: desdeTexto(ELBOLSON),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 0, a: 'ruta13', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'ruta13', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro10', ax: 4, ay: 6, dir: 1 },
      { x: 23, y: 10, a: 'ruta14', ax: 10, ay: 30, dir: 1 },
      { x: 23, y: 11, a: 'ruta14', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al NORTE: RUTA 13, de vuelta a BARILOCHE. Al ESTE: RUTA 14, la LÍNEA SUR.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con dulce de frambuesa casero!',
      '19,9': 'FERIA ARTESANAL. Mates, tejidos, cerveza... ¡y dulces de frutas finas!',
      '4,18': 'EL BOLSÓN. Valle de chacras y bosques, al pie del cerro Piltriquitrón.',
    },
    npcs: [
      {
        id: 'artesano', x: 8, y: 15, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          if (S.flags.regaloBolson) { await decir('ARTESANO: En el BOSQUE TALLADO hay más de cincuenta esculturas en los troncos. ¡Andá a verlo algún día!'); return; }
          await decir('ARTESANO: ¡Bienvenido a El Bolsón! Tomá, para el camino.');
          S.bolsa.mate = (S.bolsa.mate || 0) + 5;
          S.flags.regaloBolson = true;
          await decir('¡Felipe recibió 5 MATES!');
          await decir('ARTESANO: Hacia el ESTE empieza la LÍNEA SUR: mucha meseta, poca gente y un viento que te despeina.');
          guardar();
        },
      },
      {
        id: 'nena_bolson', x: 17, y: 18, dir: 2, pal: PAL.nena,
        hablar: async () => {
          await decir('NENA: La líder del GIMNASIO 5 vive en la MESETA DE SOMUNCURÁ. Se llama SOMBRA.');
          await decir('Usa criaturas FANTASMA y SINIESTRO. ¡A mí me da un poquito de miedo!');
        },
      },
    ],
  },

  centro10: crearCentro('elbolson', 5, 9, 'centro10'),

  ruta14: {
    nombre: 'RUTA 14 · LÍNEA SUR',
    exterior: true,
    grilla: desdeTexto(LINEA_SUR),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'elbolson', ax: 22, ay: 10, dir: 2 },
      { x: 11, y: 31, a: 'elbolson', ax: 22, ay: 11, dir: 2 },
      { x: 10, y: 0, a: 'jacobacci', ax: 1, ay: 10, dir: 3 },
      { x: 11, y: 0, a: 'jacobacci', ax: 1, ay: 11, dir: 3 },
    ],
    carteles: {
      '9,28': 'RUTA 14 · LÍNEA SUR. La estepa de Río Negro: coirones, piedras y viento.',
      '9,3': 'Al este: INGENIERO JACOBACCI, la estación de LA TROCHITA.',
    },
    encuentros: { lista: [['sparknight', 16], ['howlup', 12], ['vizcachita', 12], ['zorrazo', 10], ['terito', 10], ['candilejo', 10], ['garkol', 10], ['peludin', 8], ['condorito', 8]], min: 36, max: 39 },
    npcs: [
      entrenadorNPC({
        id: 'arriero', x: 7, y: 9, dir: 3, pal: PAL.beto, nombre: 'ARRIERO JUAN',
        equipo: [['zorrazo', 47], ['sparknight', 47], ['vizcachita', 48]],
        antes: ['ARRIERO JUAN: ¡Epa, gurí! Acá en la meseta el que no pelea se vuela con el viento. ¡Duelo!'],
        gana: 'ARRIERO JUAN: ¡Me dejaste de a pie!',
        despues: 'ARRIERO JUAN: Los SPARKNIGHT se esconden entre las piedras. Cuando crecen se vuelven negros como la noche.',
      }),
      entrenadorNPC({
        id: 'tejedora', x: 7, y: 21, dir: 2, pal: PAL.coplera, nombre: 'TEJEDORA AYELÉN',
        equipo: [['candilejo', 47], ['howlup', 48], ['garkol', 48]],
        antes: ['TEJEDORA AYELÉN: Tejo ponchos con lana de oveja... ¡y con mis criaturas te voy a enredar!'],
        gana: 'TEJEDORA AYELÉN: ¡Se me deshizo el ovillo!',
        despues: 'TEJEDORA AYELÉN: SOMBRA es la guardiana de las PIEDRAS QUE HABLAN. Las criaturas FANTASMA sufren con el FANTASMA y el SINIESTRO.',
      }),
      {
        id: 'baqueano', x: 14, y: 2, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          await decir('BAQUEANO: ¿Ves esa luz que aparece y desaparece en el campo, de noche? Es la LUZ MALA.');
          await decir('Los viejos dicen que no hay que seguirla nunca. ¡Algunas criaturas FANTASMA la usan para atacar!');
        },
      },
    ],
  },

  jacobacci: {
    nombre: 'INGENIERO JACOBACCI',
    exterior: true,
    grilla: desdeTexto(JACOBACCI),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 6, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 0, y: 10, a: 'ruta14', ax: 10, ay: 1, dir: 0 },
      { x: 0, y: 11, a: 'ruta14', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro11', ax: 4, ay: 6, dir: 1 },
      { x: 23, y: 10, a: 'ruta15', ax: 10, ay: 30, dir: 1 },
      { x: 23, y: 11, a: 'ruta15', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al OESTE: RUTA 14, hacia EL BOLSÓN. Al ESTE: RUTA 15, la MESETA DE SOMUNCURÁ.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Pasá a tomar unos mates!',
      '19,9': 'ESTACIÓN DE LA TROCHITA. El Viejo Expreso Patagónico, un tren a vapor de hace cien años.',
      '4,18': 'INGENIERO JACOBACCI. Un pueblo de la LÍNEA SUR, en el medio de la meseta rionegrina.',
    },
    npcs: [
      tomiNPC({
        id: 'tomi_jacobacci', x: 12, y: 16, dir: 2, bandera: 'tomi5', forma: 'final', nivel: 50,
        equipo: [['arquitemplillo', 47], ['wandacoloso', 47], ['nevukhan', 48], ['gargorrupt', 48]],
        antes: [
          'TOMI: ¡Felipe! Llegué en LA TROCHITA. ¡Un tren a vapor de verdad, con humo y todo!',
          'TOMI: Yo también voy al GIMNASIO 5. Pero antes... ¡veamos quién entrenó más en la Patagonia!',
        ],
        gana: 'TOMI: ¡No puede ser! Bueno... SOMBRA usa FANTASMA y SINIESTRO. ¡Llevá criaturas que les ganen!',
        despues: 'TOMI: Me vuelvo en tren a entrenar. ¡Nos vemos en el próximo gimnasio, Felipe!',
        premio: 5,
      }),
      {
        id: 'maquinista', x: 19, y: 11, dir: 1, pal: PAL.beto,
        hablar: async () => {
          await decir('MAQUINISTA: ¡LA TROCHITA es tan angosta que las vías miden menos de un metro de ancho!');
          await decir('Hace cien años llevaba lana por toda la meseta. ¡Ahora lleva turistas y criaturas curiosas!');
        },
      },
    ],
  },

  centro11: crearCentro('jacobacci', 5, 9, 'centro11'),

  ruta15: {
    nombre: 'RUTA 15 · MESETA DE SOMUNCURÁ',
    exterior: true,
    grilla: desdeTexto(MESETA),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'jacobacci', ax: 22, ay: 10, dir: 2 },
      { x: 11, y: 31, a: 'jacobacci', ax: 22, ay: 11, dir: 2 },
      { x: 10, y: 0, a: 'somuncura', ax: 1, ay: 10, dir: 3 },
      { x: 11, y: 0, a: 'somuncura', ax: 1, ay: 11, dir: 3 },
    ],
    carteles: {
      '9,28': 'RUTA 15 · MESETA DE SOMUNCURÁ. En mapuche, SOMUNCURÁ quiere decir "piedra que habla".',
      '9,3': 'Al este: el PARAJE SOMUNCURÁ y el GIMNASIO 5.',
    },
    objetos: { R: 'Una roca de basalto llena de agujeros. Cuando sopla el viento... ¡parece que susurra!' },
    encuentros: { lista: [['sparknight', 14], ['howlup', 14], ['candilejo', 12], ['garkol', 12], ['farolito', 10], ['faeve', 10], ['vizcachita', 8], ['zorrazo', 8], ['gargorrupt', 2]], min: 38, max: 41 },
    npcs: [
      entrenadorNPC({
        id: 'paleonto', x: 12, y: 5, dir: 2, pal: PAL.ayudante, nombre: 'CIENTÍFICA MARA',
        equipo: [['gargorrupt', 49], ['sparknight', 49], ['wandacoloso', 50]],
        antes: ['CIENTÍFICA MARA: En la meseta hay ranitas que no viven en ningún otro lugar del mundo. ¡Y yo las cuido! ¡Duelo!'],
        gana: 'CIENTÍFICA MARA: ¡Interesante! Lo voy a anotar en mi libreta.',
        despues: 'CIENTÍFICA MARA: El viento sopla entre las rocas de basalto y hace ruidos raros. Por eso dicen que las piedras hablan.',
      }),
      entrenadorNPC({
        id: 'cazafantasmas', x: 6, y: 9, dir: 3, pal: PAL.tomi, nombre: 'BUSCADOR DE ÁNIMAS LEO',
        equipo: [['candilejo', 49], ['duskfae', 50], ['howlup', 50]],
        antes: ['BUSCADOR LEO: ¡Estoy buscando la LUZ MALA! ¿No la viste? Bueno... ¡entonces peleemos!'],
        gana: 'BUSCADOR LEO: ¡Me asustaste más que la Luz Mala!',
        despues: 'BUSCADOR LEO: Contra FANTASMA y SINIESTRO van bien el HADA, la LUCHA y el BICHO... ¡pero ojo, que la LUCHA no le hace nada al FANTASMA!',
      }),
      entrenadorNPC({
        id: 'ermitano', x: 13, y: 26, dir: 2, pal: PAL.abuelo, nombre: 'ERMITAÑO ANSELMO',
        equipo: [['farolito', 49], ['wraithfae', 50], ['umbratail', 51]],
        antes: ['ERMITAÑO ANSELMO: Hace cuarenta años que escucho a las piedras. Hoy me dijeron que ibas a venir.'],
        gana: 'ERMITAÑO ANSELMO: Las piedras tenían razón: sos fuerte.',
        despues: 'ERMITAÑO ANSELMO: SOMBRA entrena a oscuras. Adentro de su gimnasio casi no se ve nada.',
      }),
    ],
  },

  somuncura: {
    nombre: 'PARAJE SOMUNCURÁ',
    exterior: true,
    grilla: desdeTexto(SOMUNCURA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio5', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 0, y: 10, a: 'ruta15', ax: 10, ay: 1, dir: 0 },
      { x: 0, y: 11, a: 'ruta15', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro12', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio5', ax: 5, ay: 10, dir: 1 },
      { x: 10, y: 21, a: 'ruta16', ax: 10, ay: 30, dir: 1 },
      { x: 11, y: 21, a: 'ruta16', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al OESTE: RUTA 15, de vuelta a la LÍNEA SUR. Al SUR: RUTA 16, la COSTA PATAGÓNICA, hacia TIERRA DEL FUEGO.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Hasta en el medio de la meseta!',
      '19,9': 'GIMNASIO DE SOMUNCURÁ. Líder: SOMBRA, la que escucha a las piedras. Tipo FANTASMA y SINIESTRO.',
      '4,18': 'PARAJE SOMUNCURÁ. Una meseta de piedra negra, más alta que las nubes de la estepa.',
    },
    objetos: { R: 'Una roca de basalto llena de agujeros. Cuando sopla el viento... ¡parece que susurra!' },
    npcs: [
      {
        id: 'poblador', x: 7, y: 11, dir: 0, pal: PAL.coplera,
        hablar: async () => {
          await decir('POBLADORA: Mi abuela decía que las piedras de la meseta guardan las voces de los que pasaron por acá.');
          await decir('Cuando el viento sopla fuerte... ¡las escuchás hablar!');
        },
      },
      {
        id: 'nene_somun', x: 18, y: 18, dir: 2, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.insignia5) await decir('NENE: ¡Le ganaste a SOMBRA! ¡Y en la oscuridad!');
          else {
            await decir('NENE: SOMBRA tiene criaturas FANTASMA y SINIESTRO. Su ANDESPECTRO es el espíritu de un guerrero de la cordillera...');
            await decir('¡Las criaturas HADA aguantan bien a las SINIESTRO, y las de FANTASMA y SINIESTRO les pegan fuerte a las FANTASMA!');
          }
        },
      },
    ],
  },

  centro12: crearCentro('somuncura', 5, 9, 'centro12'),

  gimnasio5: {
    nombre: 'GIMNASIO SOMUNCURÁ',
    oscuro: true,
    grilla: desdeTexto([
      '###########',
      '#a__vvv__a#',
      '#R_RvvvR_R#',
      '#__R___R__#',
      '#R___R___R#',
      '#__R___R__#',
      '#R___R___R#',
      '#_R_____R_#',
      '#___R_R___#',
      '#_________#',
      '#_________#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'somuncura', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      R: 'Una piedra de basalto de la meseta. Si acercás la oreja... ¡se oye un susurro!',
      a: 'Cristales violetas que brillan apenas en la oscuridad.',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim5_a', x: 8, y: 5, dir: 2, pal: PAL.sombra, nombre: 'MÉDIUM CLARA',
        equipo: [['candilejo', 50], ['glaciar', 50], ['gargorrupt', 51]],
        antes: ['MÉDIUM CLARA: Uuuuh... ¿Quién anda ahí? ¡No se ve nada! ¡Peleemos a oscuras!'],
        gana: 'MÉDIUM CLARA: Los espíritus me dijeron que ibas a ganar... y tenían razón.',
        despues: 'MÉDIUM CLARA: Las criaturas FANTASMA no sienten los golpes NORMAL ni LUCHA. ¡Ojo con eso!',
      }),
      entrenadorNPC({
        id: 'gim5_b', x: 2, y: 3, dir: 3, pal: PAL.tomi, nombre: 'MATERO NOCTURNO FIDEL',
        equipo: [['duskfae', 51], ['umbratail', 51]],
        antes: ['MATERO FIDEL: Tomo mate a la luz de la luna. ¡Y mis criaturas pelean mejor de noche!'],
        gana: 'MATERO FIDEL: Se me lavó el mate...',
        despues: 'MATERO FIDEL: SOMBRA tiene seis criaturas. ¡La última es la más fuerte!',
      }),
      {
        id: 'sombra', x: 5, y: 1, dir: 0, pal: PAL.sombra,
        hablar: async () => {
          if (S.flags.insignia5) {
            await decir('SOMBRA: Las piedras siguen hablando de vos, Felipe. Seguí hacia el sur, hasta el fin del mundo.');
            return;
          }
          if (!S.flags.insignia4) {
            await decir('SOMBRA: Primero conseguí la INSIGNIA GLACIAR de NIEVE, en Bariloche. Las piedras me lo dijeron.');
            return;
          }
          await decir('SOMBRA: ...Shhh. ¿Lo escuchás? Es el viento entre las rocas. Las piedras de Somuncurá me contaron que venías.');
          await decir('Soy SOMBRA, líder del GIMNASIO SOMUNCURÁ. Mis criaturas viven entre la niebla y la noche.');
          await decir('Si me ganás, te llevás la INSIGNIA ECO. ¡Que la oscuridad te acompañe!');
          const r = await batalla({ entrenador: { nombre: 'LÍDER SOMBRA', pal: PAL.sombra, equipo: [['wraithfae', 50], ['cobijoso', 51], ['yaguaraba', 51], ['umbratail', 52], ['umbracor', 52], ['andespectro', 53]] } });
          if (r === 'gana') {
            S.flags.insignia5 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 5);
            await decir('SOMBRA: Encendiste una luz en mi oscuridad. Te la ganaste.');
            await decir('¡Felipe recibió la INSIGNIA ECO!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 5;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            S.bolsa.velaAnima = (S.bolsa.velaAnima || 0) + 1;
            await decir('SOMBRA: Llevate estos ALFAJORES, BOLEADORAS y una VELA ÁNIMA. ¡Ya tenés cinco insignias!');
            guardar();
          }
        },
      },
    ],
  },

  // ================= REGIÓN 6: COSTA PATAGÓNICA Y TIERRA DEL FUEGO =================
  ruta16: {
    nombre: 'RUTA 16 · PENÍNSULA VALDÉS',
    exterior: true,
    grilla: desdeTexto(VALDES),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'somuncura', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 31, a: 'somuncura', ax: 11, ay: 20, dir: 1 },
      { x: 10, y: 0, a: 'madryn', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'madryn', ax: 11, ay: 1, dir: 0 },
    ],
    carteles: {
      '9,28': 'RUTA 16 · PENÍNSULA VALDÉS. Al este, el mar: ballenas, lobos marinos y pingüinos.',
      '9,3': 'Al sur: PUERTO MADRYN.',
    },
    objetos: { '~': '¡Allá lejos salta una ballena franca! Llegan a Península Valdés todos los inviernos.' },
    encuentros: { lista: [['pinguinoide', 16], ['carpibarro', 14], ['celestin', 12], ['zorrazo', 10], ['vizcachita', 10], ['condorito', 10], ['sparknight', 8], ['peludin', 8], ['vientuino', 6], ['howlup', 6]], min: 42, max: 45 },
    npcs: [
      entrenadorNPC({
        id: 'guardafauna', x: 12, y: 8, dir: 2, pal: PAL.guarda, nombre: 'GUARDAFAUNA LUCÍA',
        equipo: [['vientuino', 53], ['carpibarro', 53], ['condorito', 54]],
        antes: ['GUARDAFAUNA LUCÍA: ¡Cuidado, que acá los lobos marinos tienen cría! Si querés pasar, primero un duelo.'],
        gana: 'GUARDAFAUNA LUCÍA: ¡Muy bien! Pero no hagas ruido cerca de la costa.',
        despues: 'GUARDAFAUNA LUCÍA: Los PINGUINOIDE nadan rapidísimo. ¡Debajo del agua parecen volar!',
      }),
      entrenadorNPC({
        id: 'buzo', x: 8, y: 23, dir: 2, pal: PAL.pescador, nombre: 'BUZO MARTÍN',
        equipo: [['iberadraco', 53], ['pinguinoide', 54], ['carpibarro', 54]],
        antes: ['BUZO MARTÍN: Recién salgo del agua. ¡Hay que estar loco para bucear con este frío! ¿Peleamos?'],
        gana: 'BUZO MARTÍN: ¡Me dejaste más frío que el mar!',
        despues: 'BUZO MARTÍN: Al AGUA le ganan la PLANTA y el ELÉCTRICO. ¡Acordate para el gimnasio de Ushuaia!',
      }),
      {
        id: 'avistaje', x: 13, y: 14, dir: 2, pal: PAL.chica,
        hablar: async () => {
          await decir('CHICA: ¡Vine a ver ballenas! Las ballenas francas vienen a tener sus crías acá, en el golfo.');
          await decir('Una me saludó con la cola. ¡Te lo juro!');
        },
      },
    ],
  },

  madryn: {
    nombre: 'PUERTO MADRYN',
    exterior: true,
    grilla: desdeTexto(MADRYN),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 6, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 0, a: 'ruta16', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'ruta16', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro13', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 21, a: 'ruta17', ax: 10, ay: 30, dir: 1 },
      { x: 11, y: 21, a: 'ruta17', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al NORTE: RUTA 16, de vuelta a SOMUNCURÁ. Al SUR: RUTA 17, la COSTA DE SANTA CRUZ.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con tortas galesas!',
      '19,9': 'MUSEO DEL MAR. Esqueletos de ballenas y fósiles de la Patagonia.',
      '4,18': 'PUERTO MADRYN. Ciudad de playas y ballenas, fundada por colonos galeses.',
    },
    npcs: [
      {
        id: 'galesa', x: 7, y: 11, dir: 0, pal: PAL.rosa,
        hablar: async () => {
          if (S.flags.regaloMadryn) { await decir('SEÑORA GALESA: Mis abuelos llegaron desde Gales en un barco, hace muchísimos años. ¡Y trajeron la receta de la torta negra!'); return; }
          await decir('SEÑORA GALESA: ¡Qué frío hace, gurí! Tomá, unos alfajores para el viaje al sur.');
          S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 3;
          S.flags.regaloMadryn = true;
          await decir('¡Felipe recibió 3 ALFAJORES!');
          guardar();
        },
      },
      {
        id: 'pescador_madryn', x: 19, y: 11, dir: 1, pal: PAL.pescador,
        hablar: async () => {
          await decir('PESCADOR: La líder del GIMNASIO 6 es MAREA, de USHUAIA. ¡Allá en la punta de Tierra del Fuego!');
          await decir('Usa criaturas de AGUA. ¡Contra el agua van la PLANTA y el ELÉCTRICO!');
        },
      },
    ],
  },

  centro13: crearCentro('madryn', 5, 9, 'centro13'),

  ruta17: {
    nombre: 'RUTA 17 · COSTA DE SANTA CRUZ',
    exterior: true,
    grilla: desdeTexto(SANTACRUZ),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'madryn', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 31, a: 'madryn', ax: 11, ay: 20, dir: 1 },
      { x: 10, y: 0, a: 'gallegos', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'gallegos', ax: 11, ay: 1, dir: 0 },
    ],
    carteles: {
      '9,28': 'RUTA 17 · COSTA DE SANTA CRUZ. Acantilados, viento helado y colonias de pingüinos.',
      '9,3': 'Al sur: RÍO GALLEGOS, la última ciudad antes del ESTRECHO DE MAGALLANES.',
    },
    objetos: { '~': 'El mar está helado y con olas grandes. ¡Mejor no meterse!' },
    encuentros: { lista: [['pinguinoide', 14], ['vientuino', 12], ['carpibarro', 12], ['zorrazo', 10], ['nevulon', 10], ['glaciolito', 10], ['escarchin', 10], ['venomin', 8], ['glaciperador', 2]], min: 44, max: 47 },
    npcs: [
      entrenadorNPC({
        id: 'esquilador', x: 12, y: 4, dir: 2, pal: PAL.beto, nombre: 'ESQUILADOR RAÚL',
        equipo: [['nevulon', 55], ['zorrazo', 55], ['glyptopampa', 56]],
        antes: ['ESQUILADOR RAÚL: En las estancias de Santa Cruz hay más ovejas que personas. ¡Y más criaturas que ovejas!'],
        gana: 'ESQUILADOR RAÚL: ¡Me esquilaste, che!',
        despues: 'ESQUILADOR RAÚL: Para cruzar a Tierra del Fuego hay que tomar la BALSA en el Estrecho de Magallanes.',
      }),
      entrenadorNPC({
        id: 'pinguinera', x: 12, y: 20, dir: 3, pal: PAL.nieve, nombre: 'BIÓLOGA JULIETA',
        equipo: [['pinguinoide', 55], ['vientuino', 56], ['glaciperador', 56]],
        antes: ['BIÓLOGA JULIETA: ¡Estoy contando pingüinos! Me perdí en el 4.327... ¡Por tu culpa! ¡Duelo!'],
        gana: 'BIÓLOGA JULIETA: Bueno, ahora tengo que empezar a contar de nuevo...',
        despues: 'BIÓLOGA JULIETA: Los pingüinos de Magallanes vuelven todos los años al mismo nido. ¡Con la misma pareja!',
      }),
      {
        id: 'gaucho_sur', x: 17, y: 30, dir: 1, pal: PAL.abuelo,
        hablar: async () => {
          await decir('PAISANO: Acá el viento sopla tan fuerte que los árboles crecen torcidos. ¡Les dicen "árboles bandera"!');
        },
      },
    ],
  },

  gallegos: {
    nombre: 'RÍO GALLEGOS',
    exterior: true,
    grilla: desdeTexto(GALLEGOS),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 0, a: 'ruta17', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'ruta17', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro14', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 21, a: 'ruta18', ax: 10, ay: 30, dir: 1 },
      { x: 11, y: 21, a: 'ruta18', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al NORTE: RUTA 17, hacia PUERTO MADRYN. Al SUR: el ESTRECHO DE MAGALLANES y TIERRA DEL FUEGO.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con chocolate caliente y torta frita!',
      '19,9': 'Acá se juntan los camioneros que van a Tierra del Fuego. ¡Todavía falta un montón!',
      '4,18': 'RÍO GALLEGOS. Capital de Santa Cruz, a orillas de un río con mareas gigantes.',
    },
    npcs: [
      tomiNPC({
        id: 'tomi_gallegos', x: 12, y: 16, dir: 2, bandera: 'tomi6', forma: 'final', nivel: 57,
        equipo: [['arquitemplillo', 54], ['wandacoloso', 55], ['nevukhan', 55], ['gargorrupt', 55], ['umbratail', 56]],
        antes: [
          'TOMI: ¡Felipe! ¿Viste qué frío? Tengo puestas tres camperas.',
          'TOMI: Dicen que MAREA, la líder de Ushuaia, es imbatible. ¡Pero primero tenés que ganarme a mí!',
        ],
        gana: 'TOMI: ¡Otra vez! Bueno... MAREA tiene criaturas de AGUA. ¡PLANTA y ELÉCTRICO les ganan!',
        despues: 'TOMI: Yo me quedo a entrenar en Río Gallegos. ¡Andá a ganar esa insignia!',
        premio: 5,
      }),
      {
        id: 'camionero', x: 8, y: 15, dir: 0, pal: PAL.beto,
        hablar: async () => {
          await decir('CAMIONERO: El río Gallegos tiene mareas enormes: ¡el agua sube y baja como diez metros por día!');
          await decir('Y para llegar a Ushuaia hay que cruzar el Estrecho en balsa. ¡Agarrate fuerte!');
        },
      },
    ],
  },

  centro14: crearCentro('gallegos', 5, 9, 'centro14'),

  ruta18: {
    nombre: 'RUTA 18 · ESTRECHO DE MAGALLANES',
    exterior: true,
    grilla: desdeTexto(ESTRECHO),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'gallegos', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 31, a: 'gallegos', ax: 11, ay: 20, dir: 1 },
      { x: 10, y: 0, a: 'ushuaia', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'ushuaia', ax: 11, ay: 1, dir: 0 },
    ],
    carteles: {
      '9,28': 'RUTA 18 · ESTRECHO DE MAGALLANES. Más adelante, la BALSA cruza a TIERRA DEL FUEGO.',
      '9,3': 'TIERRA DEL FUEGO. Al sur: USHUAIA, la ciudad del fin del mundo.',
    },
    objetos: { '~': 'El agua del Estrecho de Magallanes. ¡Acá se juntan el océano Atlántico y el Pacífico!' },
    encuentros: { lista: [['pinguinoide', 12], ['vientuino', 12], ['carpibarro', 10], ['zorrazo', 10], ['escarchin', 10], ['nevulon', 10], ['lechuzonte', 10], ['glaciolito', 8], ['glyptopampa', 4], ['glaciperador', 4]], min: 46, max: 49 },
    npcs: [
      entrenadorNPC({
        id: 'castorero', x: 13, y: 11, dir: 2, pal: PAL.guarda, nombre: 'GUARDAPARQUE ANA',
        equipo: [['lechuzonte', 57], ['glyptopampa', 57], ['vientuino', 58]],
        antes: ['GUARDAPARQUE ANA: ¡Bienvenido a Tierra del Fuego! Los bosques de acá son los más australes del mundo. ¡Duelo!'],
        gana: 'GUARDAPARQUE ANA: ¡Qué bien entrenás! Ushuaia está cerca.',
        despues: 'GUARDAPARQUE ANA: En el Canal Beagle hay un faro rojo y blanco: el faro LES ÉCLAIREURS. ¡Es el símbolo de Ushuaia!',
      }),
      entrenadorNPC({
        id: 'marinero', x: 12, y: 22, dir: 3, pal: PAL.pescador, nombre: 'MARINERO ERNESTO',
        equipo: [['iberadraco', 57], ['totorarca', 57], ['glaciperador', 58]],
        antes: ['MARINERO ERNESTO: Crucé el Estrecho de Magallanes como mil veces. ¡Con tormentas y todo! ¿Te animás?'],
        gana: 'MARINERO ERNESTO: ¡Hundiste mi barco!',
        despues: 'MARINERO ERNESTO: MAREA tiene seis criaturas. ¡Y la última es su compañera de toda la vida!',
      }),
      {
        id: 'balsero', x: 9, y: 10, dir: 3, pal: PAL.beto,
        hablar: async () => {
          await decir('BALSERO: ¡Subí, que zarpamos! La balsa cruza el Estrecho todo el día. ¡Ojo con las olas!');
        },
      },
    ],
  },

  ushuaia: {
    nombre: 'USHUAIA',
    exterior: true,
    vuelos: ['catamarca'], // con el PILOTO
    grilla: desdeTexto(USHUAIA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio6', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 0, a: 'ruta18', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'ruta18', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro15', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio6', ax: 5, ay: 10, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al NORTE: RUTA 18, el ESTRECHO DE MAGALLANES. Más al sur, solo la Antártida. ¡Para ir a CATAMARCA, hablá con el PILOTO!',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡El CEMIC más austral del mundo!',
      '19,9': 'GIMNASIO DE USHUAIA. Líder: MAREA, la guardiana del faro. Tipo AGUA.',
      '4,20': 'USHUAIA. La ciudad del fin del mundo, entre la montaña y el Canal Beagle.',
    },
    objetos: { '~': 'El CANAL BEAGLE. A lo lejos se ve el faro Les Éclaireurs, rojo y blanco.' },
    npcs: [
      {
        id: 'presidio', x: 7, y: 18, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          if (S.flags.regaloUshuaia) { await decir('ABUELO: Antes Ushuaia era una cárcel: el PRESIDIO DEL FIN DEL MUNDO. ¡Hoy es un museo!'); return; }
          await decir('ABUELO: ¡Llegaste al fin del mundo, pibe! Tomá, para que tus criaturas no pasen frío.');
          S.bolsa.mate = (S.bolsa.mate || 0) + 5;
          S.flags.regaloUshuaia = true;
          await decir('¡Felipe recibió 5 MATES!');
          guardar();
        },
      },
      {
        id: 'piloto_ush', x: 12, y: 18, dir: 2, pal: PAL.piloto,
        hablar: async () => {
          if (!S.flags.insignia6) {
            await decir('PILOTO: Desde el aeropuerto de Ushuaia vuelo hasta CATAMARCA, en el norte.');
            await decir('Pero solo llevo a los entrenadores que tienen la INSIGNIA FARO de MAREA. ¡Andá al gimnasio!');
            return;
          }
          await decir('PILOTO: ¡Felicitaciones por la INSIGNIA FARO! El GIMNASIO 7 está en CATAMARCA, al lado de un volcán.');
          if (await siNo('¿Querés volar a CATAMARCA?')) {
            await decir('PILOTO: ¡Abrochate el cinturón! Son más de 3.000 kilómetros. ¡Despegamos!');
            await viajar({ a: 'catamarca', ax: 9, ay: 15, dir: 0 });
          }
        },
      },
      {
        id: 'guia_ushuaia', x: 19, y: 15, dir: 2, pal: PAL.nieve,
        hablar: async () => {
          if (S.flags.insignia6) await decir('GUÍA: ¡Le ganaste a MAREA! Ya tenés seis insignias. ¡Solo te faltan dos!');
          else {
            await decir('GUÍA: MAREA cuida el faro del Canal Beagle desde chiquita. ¡Sus criaturas nadan en el agua más fría del país!');
            await decir('Su AZULARZA hace llover cuando entra a pelear. ¡Con la lluvia, el AGUA pega más fuerte!');
          }
        },
      },
    ],
  },

  centro15: crearCentro('ushuaia', 5, 9, 'centro15'),

  gimnasio6: {
    nombre: 'GIMNASIO USHUAIA',
    grilla: desdeTexto([
      '###########',
      '#a___v___a#',
      '#~~~_v_~~~#',
      '#~~~___~~~#',
      '#_________#',
      '#_~~~h~~~_#',
      '#_~~~h~~~_#',
      '#_________#',
      '#~~_____~~#',
      '#~~_____~~#',
      '#_________#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'ushuaia', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      '~': 'Una pileta con agua helada del Canal Beagle. ¡Brrr!',
      a: 'Una maqueta del faro Les Éclaireurs, rojo y blanco.',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim6_a', x: 2, y: 7, dir: 3, pal: PAL.pescador, nombre: 'PESCADOR DE CENTOLLAS BRUNO',
        equipo: [['carpibarro', 57], ['totorarca', 58], ['iberadraco', 58]],
        antes: ['PESCADOR BRUNO: ¡Las centollas de Ushuaia son las más ricas del mundo! Y mis criaturas, las más fuertes. ¡Duelo!'],
        gana: 'PESCADOR BRUNO: ¡Se me escaparon todas las centollas!',
        despues: 'PESCADOR BRUNO: Las criaturas de AGUA sufren con la PLANTA y el ELÉCTRICO.',
      }),
      entrenadorNPC({
        id: 'gim6_b', x: 8, y: 4, dir: 2, pal: PAL.marea, nombre: 'NADADORA SOL',
        equipo: [['azularza', 58], ['glyptopampa', 59]],
        antes: ['NADADORA SOL: ¡Me tiro al Canal Beagle todos los años en invierno! ¿Vos te animás a pelear conmigo?'],
        gana: 'NADADORA SOL: ¡Uy! Me congelé de la sorpresa.',
        despues: 'NADADORA SOL: Cuidado con la LLUVIA de AZULARZA: con lluvia el agua pega más y el fuego, menos.',
      }),
      {
        id: 'marea', x: 5, y: 1, dir: 0, pal: PAL.marea,
        hablar: async () => {
          if (S.flags.insignia6) {
            await decir('MAREA: El faro siempre te va a guiar de vuelta, Felipe. Seguí: todavía te faltan dos insignias.');
            return;
          }
          if (!S.flags.insignia5) {
            await decir('MAREA: Primero conseguí la INSIGNIA ECO de SOMBRA, en Somuncurá. Después hablamos.');
            return;
          }
          await decir('MAREA: ¡Llegaste al fin del mundo! Desde el faro te vi cruzar el Estrecho en la balsa.');
          await decir('Soy MAREA, líder del GIMNASIO USHUAIA. Mis criaturas nadan en el agua más fría de la Argentina.');
          await decir('Si me ganás, te llevás la INSIGNIA FARO. ¡Que suba la marea!');
          // Equipo pedido por Poly (20/11): el inicial de agua, Gliptopampa, Totorarca, Glaciorka, Iberadraco y Azularza.
          const r = await batalla({ entrenador: { nombre: 'LÍDER MAREA', pal: PAL.marea, equipo: [['totorarca', 56], ['glaciorka', 57], ['azularza', 57], ['glyptopampa', 58], ['iberadraco', 59], ['iberaxolot', 60]] } });
          if (r === 'gana') {
            S.flags.insignia6 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 6);
            await decir('MAREA: La marea bajó... Te ganaste la insignia, Felipe.');
            await decir('¡Felipe recibió la INSIGNIA FARO!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 5;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('MAREA: Llevate estos ALFAJORES y BOLEADORAS. ¡Ya tenés seis insignias!');
            S.bolsa.balsa = 1;
            await decir('MAREA: Y tomá mi BALSA. Con ella vas a poder cruzar lagunas, ríos y el mar. ¡Más adelante la vas a necesitar!');
            await decir('¡Felipe recibió la BALSA!');
            guardar();
          }
        },
      },
    ],
  },

  // ================= REGIÓN 7: CATAMARCA (VALLE → BELÉN → FIAMBALÁ → PUNA DE ATACAMA) =================
  catamarca: {
    nombre: 'SAN FERNANDO DEL VALLE DE CATAMARCA',
    exterior: true,
    vuelos: ['ushuaia'], // con el PILOTO
    grilla: desdeTexto(CATAMARCA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 5, y: 8, a: 'centro16', ax: 4, ay: 6, dir: 1 },
      { x: 0, y: 10, a: 'ruta19', ax: 11, ay: 30, dir: 1 },
      { x: 0, y: 11, a: 'ruta19', ax: 10, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al OESTE: RUTA 19, el VALLE DE CATAMARCA, hacia BELÉN, FIAMBALÁ y la PUNA.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con empanadas catamarqueñas!',
      '19,9': 'AEROPUERTO. Vuelos a USHUAIA.',
      '4,18': 'SAN FERNANDO DEL VALLE DE CATAMARCA. Rodeada de cerros, olivos y nogales.',
    },
    npcs: [
      {
        id: 'piloto_cat', x: 8, y: 15, dir: 0, pal: PAL.piloto,
        hablar: async () => {
          await decir('PILOTO: ¡Hola, Felipe! Desde acá vuelo a USHUAIA, en el fin del mundo.');
          if (await siNo('¿Querés volar a USHUAIA?')) {
            await decir('PILOTO: ¡Abrochate el cinturón! ¡Despegamos!');
            await viajar({ a: 'ushuaia', ax: 12, ay: 19, dir: 0 });
          }
        },
      },
      {
        id: 'nena_cat', x: 17, y: 18, dir: 2, pal: PAL.nena,
        hablar: async () => {
          await decir('NENA: La líder del GIMNASIO 7 es CENIZA. ¡Entrena al lado del volcán OJOS DEL SALADO, el volcán más alto del mundo!');
          await decir('Usa criaturas de FUEGO. ¡AGUA, TIERRA y ROCA les ganan!');
        },
      },
    ],
  },

  centro16: crearCentro('catamarca', 5, 9, 'centro16'),

  ruta19: {
    nombre: 'RUTA 19 · VALLE DE CATAMARCA',
    exterior: true,
    grilla: desdeTexto(VALLECAT),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'catamarca', ax: 1, ay: 11, dir: 3 },
      { x: 11, y: 31, a: 'catamarca', ax: 1, ay: 10, dir: 3 },
      { x: 10, y: 0, a: 'belen', ax: 22, ay: 11, dir: 2 },
      { x: 11, y: 0, a: 'belen', ax: 22, ay: 10, dir: 2 },
    ],
    carteles: {
      '9,28': 'RUTA 19 · VALLE DE CATAMARCA. Cardones, olivos y cerros por todos lados.',
      '9,3': 'Al oeste: BELÉN, la ciudad del poncho.',
    },
    encuentros: { lista: [['motorb', 14], ['calderito', 14], ['zorrazo', 12], ['cardito', 10], ['rodcardo', 8], ['piquibrote', 10], ['vizcachita', 10], ['condorito', 8], ['chispuna', 8], ['piquillonco', 4]], min: 50, max: 53 },
    npcs: [
      entrenadorNPC({
        id: 'olivero', x: 12, y: 5, dir: 2, pal: PAL.beto, nombre: 'OLIVERO HÉCTOR',
        equipo: [['rodcardo', 61], ['piquillonco', 61], ['zorrazo', 62]],
        antes: ['OLIVERO HÉCTOR: Cosecho aceitunas todo el día. ¡Y a la tarde, una buena pelea!'],
        gana: 'OLIVERO HÉCTOR: ¡Me dejaste hecho aceite!',
        despues: 'OLIVERO HÉCTOR: Los MOTORB hacen ruido de moto. ¡Si los escuchás, están cerca!',
      }),
      entrenadorNPC({
        id: 'mecanica', x: 8, y: 21, dir: 2, pal: PAL.ayudante, nombre: 'MECÁNICA VALERIA',
        equipo: [['motorb', 61], ['dynacore', 62], ['chispuna', 62]],
        antes: ['MECÁNICA VALERIA: ¡Arreglo motores y entreno criaturas que SON motores! ¿Probamos el tuyo?'],
        gana: 'MECÁNICA VALERIA: ¡Se me fundió el motor!',
        despues: 'MECÁNICA VALERIA: Con una PIEDRA TRUENO, DYNACORE se vuelve TURBORUSH. ¡Se venden en el ALMACÉN!',
      }),
      {
        id: 'nuecero', x: 14, y: 29, dir: 1, pal: PAL.abuelo,
        hablar: async () => {
          await decir('ABUELO: En Catamarca hacemos los mejores dulces de nuez y de membrillo. ¡Probalos cuando pases por Belén!');
        },
      },
    ],
  },

  belen: {
    nombre: 'BELÉN',
    exterior: true,
    grilla: desdeTexto(BELEN),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 6, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 23, y: 10, a: 'ruta19', ax: 11, ay: 1, dir: 0 },
      { x: 23, y: 11, a: 'ruta19', ax: 10, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro17', ax: 4, ay: 6, dir: 1 },
      { x: 0, y: 10, a: 'ruta20', ax: 11, ay: 30, dir: 1 },
      { x: 0, y: 11, a: 'ruta20', ax: 10, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al ESTE: RUTA 19, hacia CATAMARCA. Al OESTE: RUTA 20, las DUNAS DE TATÓN y FIAMBALÁ.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con dulce de membrillo!',
      '19,9': 'TEJEDURÍA. Ponchos de vicuña y de llama, hechos a mano en telar.',
      '4,18': 'BELÉN. La cuna del poncho, en el oeste de Catamarca.',
    },
    npcs: [
      {
        id: 'tejedor_belen', x: 7, y: 11, dir: 0, pal: PAL.coplera,
        hablar: async () => {
          if (S.flags.regaloBelen) { await decir('TEJEDORA: Un poncho de vicuña tarda meses en tejerse. ¡Es el más suave del mundo!'); return; }
          await decir('TEJEDORA: ¡Qué bueno que pasaste por Belén! Tomá, unas piedras que encontré en el río.');
          S.bolsa.piedraAgua = (S.bolsa.piedraAgua || 0) + 1;
          S.flags.regaloBelen = true;
          await decir('¡Felipe recibió una PIEDRA AGUA!');
          await decir('TEJEDORA: Si se la das a un CALDERITO, se vuelve SUBMARINGER, ¡un volcán submarino!');
          guardar();
        },
      },
      {
        id: 'nene_belen', x: 19, y: 11, dir: 1, pal: PAL.nene,
        hablar: async () => {
          await decir('NENE: CALDERITO tiene dos evoluciones: si lo entrenás se vuelve LANÍNGER, ¡y con una PIEDRA AGUA, SUBMARINGER!');
        },
      },
    ],
  },

  centro17: crearCentro('belen', 5, 9, 'centro17'),

  ruta20: {
    nombre: 'RUTA 20 · DUNAS DE TATÓN',
    exterior: true,
    grilla: desdeTexto(TATON),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'belen', ax: 1, ay: 11, dir: 3 },
      { x: 11, y: 31, a: 'belen', ax: 1, ay: 10, dir: 3 },
      { x: 10, y: 0, a: 'fiambala', ax: 22, ay: 11, dir: 2 },
      { x: 11, y: 0, a: 'fiambala', ax: 22, ay: 10, dir: 2 },
    ],
    carteles: {
      '9,28': 'RUTA 20 · DUNAS DE TATÓN. ¡Las dunas de arena más altas del mundo!',
      '9,3': 'Al oeste: FIAMBALÁ y sus aguas termales.',
    },
    encuentros: { lista: [['calderito', 14], ['dynacore', 12], ['chispuna', 12], ['volcarin', 12], ['zorrazo', 10], ['terito', 10], ['vizcachita', 10], ['candilejo', 8], ['laninger', 4]], min: 52, max: 55 },
    npcs: [
      entrenadorNPC({
        id: 'sandboard', x: 12, y: 5, dir: 2, pal: PAL.chica, nombre: 'SANDBOARDISTA FLOR',
        equipo: [['volcarin', 63], ['zorzaliente', 63], ['laninger', 64]],
        antes: ['SANDBOARDISTA FLOR: ¡Me tiro por las dunas en tabla! ¿Te animás a una pelea a toda velocidad?'],
        gana: 'SANDBOARDISTA FLOR: ¡Me comí toda la arena!',
        despues: 'SANDBOARDISTA FLOR: Algunas dunas de Tatón miden más de mil metros. ¡Y suenan cuando sopla el viento!',
      }),
      entrenadorNPC({
        id: 'vulcanologo', x: 13, y: 19, dir: 3, pal: PAL.guarda, nombre: 'VULCANÓLOGO DIEGO',
        equipo: [['laninger', 63], ['submaringer', 64], ['andragon', 64]],
        antes: ['VULCANÓLOGO DIEGO: ¡Estudio los volcanes de la Puna! Los de fuego y los que tienen lagunas adentro. ¡Duelo!'],
        gana: 'VULCANÓLOGO DIEGO: ¡Entraste en erupción!',
        despues: 'VULCANÓLOGO DIEGO: Ojo con SUBMARINGER y LANÍNGER: si los debilitás con un golpe, ¡pueden explotar y llevarse a tu criatura!',
      }),
      {
        id: 'baqueano_taton', x: 5, y: 30, dir: 1, pal: PAL.abuelo,
        hablar: async () => {
          await decir('BAQUEANO: Cuando el viento sopla en las dunas, la arena hace un ruido como de tambor. ¡Le dicen la arena que canta!');
        },
      },
    ],
  },

  fiambala: {
    nombre: 'FIAMBALÁ',
    exterior: true,
    grilla: desdeTexto(FIAMBALA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 23, y: 10, a: 'ruta20', ax: 11, ay: 1, dir: 0 },
      { x: 23, y: 11, a: 'ruta20', ax: 10, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro18', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 0, a: 'ruta21', ax: 10, ay: 30, dir: 1 },
      { x: 11, y: 0, a: 'ruta21', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al NORTE: RUTA 21, la PUNA DE ATACAMA y el volcán OJOS DEL SALADO. Al ESTE: las DUNAS DE TATÓN.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Y después, a las termas!',
      '19,9': 'TERMAS DE FIAMBALÁ. Piletas de agua caliente que salen de la montaña.',
      '4,18': 'FIAMBALÁ. Un oasis de viñedos al pie de la cordillera.',
    },
    npcs: [
      tomiNPC({
        id: 'tomi_fiambala', x: 12, y: 16, dir: 2, bandera: 'tomi7', forma: 'final', nivel: 64,
        equipo: [['arquitemplillo', 61], ['wandacoloso', 62], ['nevukhan', 62], ['gargorrupt', 62], ['umbratail', 63]],
        antes: [
          'TOMI: ¡Felipe! Vine a las termas a descansar... pero vos no me dejás tranquilo, ¿eh?',
          'TOMI: Bueno, ¡vamos con todo! ¡Esta vez sí te gano!',
        ],
        gana: 'TOMI: ¡Ufa! Andá, CENIZA te espera arriba, al lado del volcán. ¡AGUA, TIERRA y ROCA le ganan al FUEGO!',
        despues: 'TOMI: Me voy a meter en las termas un rato. ¡Suerte en el GIMNASIO 7!',
        premio: 5,
      }),
      {
        id: 'termas', x: 8, y: 15, dir: 0, pal: PAL.rosa,
        hablar: async () => {
          await decir('SEÑORA: ¡Las termas están buenísimas! El agua sale calentita del volcán.');
          await decir('Mis criaturas se metieron y salieron como nuevas.');
          curarEquipo();
          await decir('¡Las criaturas de Felipe se dieron un baño termal y recuperaron toda su energía!');
        },
      },
    ],
  },

  centro18: crearCentro('fiambala', 5, 9, 'centro18'),

  ruta21: {
    nombre: 'RUTA 21 · PUNA DE ATACAMA',
    exterior: true,
    grilla: desdeTexto(PUNA_ATACAMA),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'fiambala', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 31, a: 'fiambala', ax: 11, ay: 1, dir: 0 },
      { x: 10, y: 0, a: 'ojos', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 0, a: 'ojos', ax: 11, ay: 20, dir: 1 },
    ],
    carteles: {
      '9,28': 'RUTA 21 · PUNA DE ATACAMA. Más adelante la SALINA está inundada: ¡hay que cruzarla en BALSA!',
      '9,3': 'Al norte: la BASE del volcán OJOS DEL SALADO y el GIMNASIO 7.',
    },
    objetos: { '~': 'La SALINA se inundó con el deshielo. El agua es salada y helada... ¡y muy profunda!' },
    encuentros: { lista: [['dynacore', 12], ['calderito', 12], ['volcarin', 12], ['laninger', 10], ['condorito', 10], ['glaciolito', 10], ['vientuino', 8], ['escarchin', 8], ['zorzaliente', 4], ['andragon', 3]], min: 54, max: 56 },
    npcs: [
      entrenadorNPC({
        id: 'andinista_puna', x: 12, y: 15, dir: 2, pal: PAL.nieve, nombre: 'ANDINISTA CAMILA',
        equipo: [['glaciolito', 64], ['zorzaliente', 65], ['laninger', 65]],
        antes: ['ANDINISTA CAMILA: Voy a subir el Ojos del Salado: ¡6.893 metros! Pero antes, un duelo para entrar en calor.'],
        gana: 'ANDINISTA CAMILA: ¡Uf! Me quedé sin aire.',
        despues: 'ANDINISTA CAMILA: En la cumbre del Ojos del Salado hay una laguna. ¡Es la más alta del mundo!',
      }),
      entrenadorNPC({
        id: 'arriero_puna', x: 13, y: 20, dir: 3, pal: PAL.beto, nombre: 'ARRIERO SEGUNDO',
        equipo: [['turborush', 65], ['submaringer', 65], ['andragon', 66]],
        antes: ['ARRIERO SEGUNDO: Cruzo la cordillera con mis mulas desde que era así de chiquito. ¡A ver qué tenés!'],
        gana: 'ARRIERO SEGUNDO: ¡Bien ahí, gurí! Tenés el corazón de un arriero.',
        despues: 'ARRIERO SEGUNDO: CENIZA hace salir un sol que raja la tierra. ¡Con ese sol el FUEGO pega más fuerte!',
      }),
      {
        id: 'llamero', x: 5, y: 12, dir: 3, pal: PAL.coplera,
        hablar: async () => {
          await decir('LLAMERA: Las vicuñas y las llamas aguantan el frío de la Puna con su lana. ¡Y las criaturas de fuego se calientan solas!');
        },
      },
    ],
  },

  ojos: {
    nombre: 'BASE OJOS DEL SALADO',
    exterior: true,
    grilla: desdeTexto(OJOS),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio7', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'ruta21', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'ruta21', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro19', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio7', ax: 5, ay: 10, dir: 1 },
    ],
    carteles: {
      '12,1': 'Arriba: el volcán OJOS DEL SALADO, el volcán más alto del mundo. Al SUR: RUTA 21, de vuelta a FIAMBALÁ.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡El CEMIC más alto del país!',
      '19,9': 'GIMNASIO OJOS DEL SALADO. Líder: CENIZA, la que duerme al lado del volcán. Tipo FUEGO.',
      '4,18': 'BASE OJOS DEL SALADO. El último refugio antes de la cumbre.',
    },
    npcs: [
      {
        id: 'refugiero', x: 7, y: 11, dir: 0, pal: PAL.guarda,
        hablar: async () => {
          await decir('REFUGIERO: ¿Sentís el piso tibio? Es el volcán. Todavía está vivo, aunque duerme hace mucho.');
        },
      },
      {
        id: 'nene_ojos', x: 19, y: 11, dir: 1, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.insignia7) await decir('NENE: ¡Le ganaste a CENIZA! ¡Ya tenés siete insignias! Solo te falta el ACONCAGUA...');
          else {
            await decir('NENE: El gimnasio de CENIZA tiene un río de LAVA adentro. ¡No te caigas!');
            await decir('Su última criatura hace salir un SOL que raja la tierra. ¡Llevá criaturas de AGUA, TIERRA y ROCA!');
          }
        },
      },
    ],
  },

  centro19: crearCentro('ojos', 5, 9, 'centro19'),

  gimnasio7: {
    nombre: 'GIMNASIO OJOS DEL SALADO',
    grilla: desdeTexto([
      '###########',
      '#a__vvv__a#',
      '#LL_vvv_LL#',
      '#LL_____LL#',
      '#___LLL___#',
      '#_L_LLL_L_#',
      '#_L_____L_#',
      '#___L_L___#',
      '#LL_____LL#',
      '#LL_____LL#',
      '#_________#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'ojos', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      L: '¡LAVA! Mejor no acercarse mucho... ¡quema!',
      a: 'Una piedra volcánica que todavía está calentita.',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim7_a', x: 7, y: 3, dir: 2, pal: PAL.ceniza, nombre: 'FOGONERO RAMIRO',
        equipo: [['laninger', 64], ['dynacore', 64], ['zorzaliente', 65]],
        antes: ['FOGONERO RAMIRO: ¡Acá adentro hace 50 grados! ¿Aguantás el calor? ¡Duelo!'],
        gana: 'FOGONERO RAMIRO: ¡Me apagaste el fogón!',
        despues: 'FOGONERO RAMIRO: El FUEGO sufre con el AGUA, la TIERRA y la ROCA.',
      }),
      entrenadorNPC({
        id: 'gim7_b', x: 1, y: 6, dir: 3, pal: PAL.coplera, nombre: 'ASADORA MARTA',
        equipo: [['submaringer', 65], ['turborush', 65]],
        antes: ['ASADORA MARTA: ¡Tengo las brasas listas para el asado! Pero primero... ¡una pelea!'],
        gana: 'ASADORA MARTA: ¡Se me quemó el asado!',
        despues: 'ASADORA MARTA: CENIZA tiene seis criaturas. ¡Y la última trae el sol con ella!',
      }),
      {
        id: 'ceniza', x: 5, y: 1, dir: 0, pal: PAL.ceniza,
        hablar: async () => {
          if (S.flags.insignia7) {
            await decir('CENIZA: Apagaste mi fuego, Felipe. Ahora andá al ACONCAGUA: el último gimnasio te espera.');
            return;
          }
          if (!S.flags.insignia6) {
            await decir('CENIZA: Primero conseguí la INSIGNIA FARO de MAREA, en Ushuaia. Después volvé.');
            return;
          }
          await decir('CENIZA: ¡Llegaste hasta el volcán más alto del mundo! Pocos aguantan este calor... y este frío.');
          await decir('Soy CENIZA, líder del GIMNASIO OJOS DEL SALADO. Mis criaturas nacieron de la lava.');
          await decir('Si me ganás, te llevás la INSIGNIA VOLCÁN. ¡Que arda la Puna!');
          // Equipo pedido por Poly (20/11): Ignidraxx, Turborush, Zorzaliente, Piquillonco, Submaringer y Braspuma (con SEQUÍA).
          const r = await batalla({ entrenador: { nombre: 'LÍDER CENIZA', pal: PAL.ceniza, equipo: [['piquillonco', 64], ['submaringer', 65], ['zorzaliente', 65], ['turborush', 66], ['ignidraxx', 66], ['braspuma', 67, { hab: 'sequia' }]] } });
          if (r === 'gana') {
            S.flags.insignia7 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 7);
            await decir('CENIZA: El volcán se durmió otra vez... Te ganaste la insignia, Felipe.');
            await decir('¡Felipe recibió la INSIGNIA VOLCÁN!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 5;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('CENIZA: Llevate estos ALFAJORES y BOLEADORAS. ¡Siete insignias! Ya solo te falta el ACONCAGUA.');
            S.bolsa.pico = 1;
            await decir('CENIZA: Y llevate mi PICO. El camino al ACONCAGUA está lleno de derrumbes: ¡con esto rompés rocas y hielo!');
            await decir('¡Felipe recibió el PICO!');
            guardar();
          }
        },
      },
    ],
  },

  // ================= REGIÓN 8: CUYO Y EL ACONCAGUA (LAGUNA BRAVA en BALSA → RODEO → CUEVA DE LOS ANDES → USPALLATA → ASCENSO AL ACONCAGUA con el PICO → PLAZA DE MULAS) =================
  ruta22: {
    nombre: 'RUTA 22 · LAGUNA BRAVA',
    exterior: true,
    grilla: desdeTexto(LAGUNA_BRAVA),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'ojos', ax: 1, ay: 10, dir: 3 },
      { x: 11, y: 31, a: 'ojos', ax: 1, ay: 11, dir: 3 },
      { x: 10, y: 0, a: 'rodeo', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'rodeo', ax: 11, ay: 1, dir: 0 },
    ],
    carteles: {
      '9,28': 'RUTA 22 · LAGUNA BRAVA. Una laguna salada a 4.300 metros, llena de flamencos. No hay puente: ¡se cruza en BALSA!',
      '9,3': 'Al sur: RODEO, en SAN JUAN.',
    },
    objetos: { '~': 'El agua de la LAGUNA BRAVA es salada y helada. ¡Allá lejos hay cientos de flamencos!' },
    encuentros: { lista: [['dracotox', 14], ['pebbleby', 14], ['patagon', 12], ['celestin', 10], ['glaciolito', 10], ['condorito', 10], ['escarchin', 8], ['vientuino', 8], ['volcarin', 8], ['filodrac', 6]], min: 56, max: 59 },
    npcs: [
      entrenadorNPC({
        id: 'guarda_brava', x: 12, y: 9, dir: 2, pal: PAL.guarda, nombre: 'GUARDAPARQUE INÉS',
        equipo: [['azularza', 67], ['dracotox', 67], ['glaciorka', 68]],
        antes: ['GUARDAPARQUE INÉS: ¡Shhh! No asustes a los flamencos. Si querés pasar, primero mostrame qué tan bien cuidás a tus criaturas.'],
        gana: 'GUARDAPARQUE INÉS: Muy bien. Se nota que las cuidás.',
        despues: 'GUARDAPARQUE INÉS: Los flamencos son rosados por lo que comen: unos bichitos chiquitos de la laguna.',
      }),
      entrenadorNPC({
        id: 'arriero_brava', x: 9, y: 19, dir: 3, pal: PAL.beto, nombre: 'ARRIERO VICENTE',
        equipo: [['ironboulder', 68], ['laninger', 68], ['estepasaurio', 69]],
        antes: ['ARRIERO VICENTE: Por estos cerros pasaban las caravanas de mulas a Chile. ¡Y yo todavía los cruzo! ¿Me ganás?'],
        gana: 'ARRIERO VICENTE: ¡Qué guacho! Me ganaste de punta a punta.',
        despues: 'ARRIERO VICENTE: En la cordillera viven dragones. Los PEBBLEBY lamen las piedras porque les gustan los minerales.',
      }),
      {
        id: 'flamencos', x: 17, y: 23, dir: 2, pal: PAL.chica,
        hablar: async () => {
          await decir('CHICA: ¿Viste a los flamencos? Duermen parados en una sola pata... ¡y no se caen!');
          await decir('Más al sur, en el ACONCAGUA, dicen que hay una líder que entrena DRAGONES. ¡Qué miedo!');
        },
      },
    ],
  },

  rodeo: {
    nombre: 'RODEO',
    exterior: true,
    grilla: desdeTexto(RODEO),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 0, a: 'ruta22', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'ruta22', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro20', ax: 4, ay: 6, dir: 1 },
      { x: 10, y: 21, a: 'ruta23', ax: 10, ay: 30, dir: 1 },
      { x: 11, y: 21, a: 'ruta23', ax: 11, ay: 30, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al NORTE: RUTA 22, la LAGUNA BRAVA. Al SUR: la CUEVA DE LOS ANDES, hacia MENDOZA.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con uvas y pasas de uva sanjuaninas!',
      '19,9': 'DIQUE CUESTA DEL VIENTO. ¡El mejor viento del mundo para hacer windsurf!',
      '4,18': 'RODEO, SAN JUAN. Un pueblo de álamos, viento y montañas.',
    },
    npcs: [
      {
        id: 'windsurf', x: 7, y: 11, dir: 0, pal: PAL.pescador,
        hablar: async () => {
          if (S.flags.regaloRodeo) { await decir('WINDSURFISTA: Acá el viento sopla todas las tardes. ¡Mis criaturas de VOLADOR vuelan solas!'); return; }
          await decir('WINDSURFISTA: ¡Ey, viajero! ¿Vas para el ACONCAGUA? Allá arriba hace un frío tremendo.');
          await decir('Tomá, llevate estos ALFAJORES para el camino.');
          S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 3;
          S.flags.regaloRodeo = true;
          await decir('¡Felipe recibió 3 ALFAJORES!');
          guardar();
        },
      },
      {
        id: 'nena_rodeo', x: 17, y: 18, dir: 2, pal: PAL.nena,
        hablar: async () => {
          await decir('NENA: La líder del ÚLTIMO GIMNASIO es CUMBRE. ¡Vive en PLAZA DE MULAS, al pie del ACONCAGUA!');
          await decir('Usa criaturas de tipo DRAGÓN. ¡Al DRAGÓN le ganan el HIELO, el HADA... y otro DRAGÓN!');
        },
      },
    ],
  },

  centro20: crearCentro('rodeo', 5, 9, 'centro20'),

  ruta23: {
    nombre: 'CUEVA DE LOS ANDES',
    exterior: true,
    cueva: true,
    oscuro: true,
    grilla: desdeTexto(CUEVA_ANDES),
    edificios: [],
    salidas: [
      { x: 10, y: 31, a: 'rodeo', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 31, a: 'rodeo', ax: 11, ay: 20, dir: 1 },
      { x: 10, y: 0, a: 'uspallata', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'uspallata', ax: 11, ay: 1, dir: 0 },
    ],
    carteles: {
      '9,28': 'CUEVA DE LOS ANDES. Un túnel viejo de mineros por debajo de la cordillera. ¡Hay derrumbes!',
      '10,2': 'Al sur: la salida a USPALLATA, en MENDOZA.',
    },
    objetos: {
      R: 'La pared de la cueva. Está fría y húmeda.',
      a: 'Cristales de cuarzo que brillan en la oscuridad.',
    },
    encuentros: { lista: [['pebbleby', 14], ['filodrac', 12], ['dracotox', 12], ['rocori', 10], ['geodin', 10], ['glaciolito', 10], ['mimetit', 8], ['howlup', 8], ['patagon', 8], ['ironboulder', 4]], min: 58, max: 61 },
    npcs: [
      {
        id: 'minero_cueva', x: 8, y: 20, dir: 0, pal: PAL.almacenero,
        hablar: async () => {
          await decir('MINERO: ¡Cuidado! Hubo un derrumbe y las piedras taparon el túnel.');
          if (S.bolsa.pico) await decir('MINERO: ¡Pero vos tenés un PICO! Ponete enfrente de las rocas con grietas y apretá A.');
          else await decir('MINERO: Con un PICO de minero se pueden romper. CENIZA, la del volcán, tiene uno...');
        },
      },
      entrenadorNPC({
        id: 'espeleologa', x: 8, y: 16, dir: 3, pal: PAL.coplera, nombre: 'ESPELEÓLOGA MARA',
        equipo: [['espectradraco', 69], ['wandacoloso', 70], ['noxidragon', 70]],
        antes: ['ESPELEÓLOGA MARA: Exploro cuevas hace veinte años. ¡Y en la oscuridad mis criaturas son imbatibles!'],
        gana: 'ESPELEÓLOGA MARA: ¡Me apagaste la linterna!',
        despues: 'ESPELEÓLOGA MARA: En las cuevas viven muchas criaturas de ROCA. ¡El AGUA y la PLANTA les ganan!',
      }),
      entrenadorNPC({
        id: 'minero_ivan', x: 16, y: 12, dir: 2, pal: PAL.beto, nombre: 'MINERO IVÁN',
        equipo: [['ironboulder', 70], ['micalonco', 70], ['rocantour', 71]],
        antes: ['MINERO IVÁN: ¡Estas piedras son mías! Si las querés romper, primero ganame.'],
        gana: 'MINERO IVÁN: Está bien, rompé lo que quieras.',
        despues: 'MINERO IVÁN: IRONBOULDER se come los minerales de la cueva. ¡Por eso tiene la panza encendida!',
      }),
    ],
  },

  uspallata: {
    nombre: 'USPALLATA',
    exterior: true,
    grilla: desdeTexto(USPALLATA),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 15, y: 4, w: 5, h: 4, tipo: 'casa2', puerta: 2, abre: false },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'casa', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 0, a: 'ruta23', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 0, a: 'ruta23', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro21', ax: 4, ay: 6, dir: 1 },
      { x: 0, y: 10, a: 'ruta24', ax: 10, ay: 38, dir: 1 },
      { x: 0, y: 11, a: 'ruta24', ax: 11, ay: 38, dir: 1 },
    ],
    carteles: {
      '12,1': 'Al NORTE: la CUEVA DE LOS ANDES, hacia SAN JUAN. Al OESTE: el ASCENSO AL ACONCAGUA. ¡Llevá el PICO!',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡Con tortitas mendocinas!',
      '19,9': 'LAS BÓVEDAS. Hornos antiguos donde se fundían metales de la montaña.',
      '4,18': 'USPALLATA, MENDOZA. Un valle verde de álamos en medio de la cordillera.',
    },
    npcs: [
      tomiNPC({
        id: 'tomi_uspallata', x: 12, y: 16, dir: 2, bandera: 'tomi8', forma: 'final', nivel: 72,
        equipo: [['arquitemplillo', 69], ['wandacoloso', 70], ['nevukhan', 70], ['gargorrupt', 70], ['umbratail', 71]],
        antes: [
          'TOMI: ¡Felipe! Sabía que ibas a pasar por acá. ¡Yo también voy al ACONCAGUA!',
          'TOMI: Pero antes... ¡nuestra última pelea antes del último gimnasio! ¡Con todo!',
        ],
        gana: 'TOMI: ¡No puede ser! Sos el mejor entrenador que conozco, Felipe. ¡Andá y ganale a CUMBRE!',
        despues: 'TOMI: CUMBRE usa DRAGONES. Yo llevaría HIELO, HADA y DRAGÓN. ¡Te espero arriba!',
        premio: 5,
      }),
      {
        id: 'senor_uspallata', x: 7, y: 11, dir: 0, pal: PAL.abuelo,
        hablar: async () => {
          await decir('SEÑOR: En Uspallata los álamos se ponen amarillos en otoño. ¡Parece que el valle se prende fuego!');
          await decir('Por esta ruta pasan los camiones que cruzan a Chile por el paso CRISTO REDENTOR.');
        },
      },
    ],
  },

  centro21: crearCentro('uspallata', 5, 9, 'centro21'),

  ruta24: {
    nombre: 'ASCENSO AL ACONCAGUA',
    exterior: true,
    grilla: desdeTexto(ASCENSO),
    edificios: [],
    salidas: [
      { x: 10, y: 39, a: 'uspallata', ax: 1, ay: 10, dir: 3 },
      { x: 11, y: 39, a: 'uspallata', ax: 1, ay: 11, dir: 3 },
      { x: 10, y: 0, a: 'plaza', ax: 10, ay: 20, dir: 1 },
      { x: 11, y: 0, a: 'plaza', ax: 11, ay: 20, dir: 1 },
    ],
    carteles: {
      '9,36': 'ASCENSO AL ACONCAGUA. El camino está tapado de rocas y hielo: ¡rompelos con el PICO y subí!',
      '9,3': 'Arriba: PLAZA DE MULAS, la base del ACONCAGUA y el GIMNASIO 8. ¡Ya casi llegás!',
    },
    objetos: { w: 'Nieve dura y resbalosa. ¡Pisá con cuidado!', R: 'Una piedra enorme. Esta no tiene grietas: no se puede romper.' },
    encuentros: { lista: [['condorito', 14], ['filodrac', 12], ['glaciolito', 12], ['escarchin', 12], ['estepasaurio', 10], ['vientuino', 10], ['andragon', 8], ['ironboulder', 6], ['espadonix', 6], ['noxidragon', 4]], min: 60, max: 63 },
    npcs: [
      {
        id: 'guarda_horcones', x: 9, y: 37, dir: 3, pal: PAL.guarda,
        hablar: async () => {
          await decir('GUARDAPARQUE: ¡Bienvenido al PARQUE PROVINCIAL ACONCAGUA! Desde acá se sube a pie hasta PLAZA DE MULAS.');
          if (S.bolsa.pico) await decir('Hubo avalanchas y el camino está tapado. Con tu PICO podés romper las rocas y el hielo con grietas.');
          else await decir('Hubo avalanchas y el camino está tapado. Sin un PICO no vas a poder subir.');
        },
      },
      entrenadorNPC({
        id: 'guia_horcones', x: 12, y: 9, dir: 2, pal: PAL.nieve, nombre: 'GUÍA DE MONTAÑA PAZ',
        equipo: [['glaciperador', 71], ['pampadon', 72], ['andespectro', 72]],
        antes: ['GUÍA PAZ: ¡Llegaste hasta acá rompiendo piedras! Antes del último tramo, demostrame que estás preparado.'],
        gana: 'GUÍA PAZ: Estás listo. Subí despacio, que falta el aire.',
        despues: 'GUÍA PAZ: El ACONCAGUA mide casi 7.000 metros. ¡Desde la cumbre se ve el océano Pacífico!',
      }),
      entrenadorNPC({
        id: 'mulero', x: 6, y: 23, dir: 3, pal: PAL.beto, nombre: 'MULERO RAMÓN',
        equipo: [['ironboulder', 72], ['turborush', 72], ['latigacer', 73]],
        antes: ['MULERO RAMÓN: Mis mulas llevan las mochilas de los andinistas hasta PLAZA DE MULAS. ¡Y mis criaturas, a vos te llevan por delante!'],
        gana: 'MULERO RAMÓN: ¡Ufa! Mejor vuelvo con mis mulas.',
        despues: 'MULERO RAMÓN: LATIGÁCER tiene una cola de acero que corta como una espada. ¡Ojo con su LÁTIGO METÁLICO!',
      }),
    ],
  },

  plaza: {
    nombre: 'PLAZA DE MULAS',
    exterior: true,
    grilla: desdeTexto(PLAZA_MULAS),
    edificios: [
      { x: 3, y: 5, w: 5, h: 4, tipo: 'centro', puerta: 2, abre: true },
      { x: 14, y: 4, w: 7, h: 5, tipo: 'gimnasio8', puerta: 3, abre: true },
      { x: 3, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
      { x: 14, y: 13, w: 5, h: 4, tipo: 'adobe', puerta: 2, abre: false },
    ],
    salidas: [
      { x: 10, y: 21, a: 'ruta24', ax: 10, ay: 1, dir: 0 },
      { x: 11, y: 21, a: 'ruta24', ax: 11, ay: 1, dir: 0 },
      { x: 5, y: 8, a: 'centro22', ax: 4, ay: 6, dir: 1 },
      { x: 17, y: 8, a: 'gimnasio8', ax: 5, ay: 10, dir: 1 },
    ],
    carteles: {
      '12,1': 'Arriba: la cumbre del ACONCAGUA, 6.961 metros. ¡Todavía no se puede subir! Abajo: el ASCENSO, de vuelta a USPALLATA.',
      '8,9': 'CEMIC. Curamos a tus criaturas gratis. ¡El CEMIC más alto de América!',
      '19,9': 'GIMNASIO ACONCAGUA. Líder: CUMBRE, la domadora de dragones. Tipo DRAGÓN.',
      '4,18': 'PLAZA DE MULAS. El campamento base del ACONCAGUA, a 4.300 metros de altura.',
    },
    npcs: [
      {
        id: 'bruno_plaza', x: 7, y: 11, dir: 0, pal: PAL.beto,
        hablar: async () => {
          await decir('ANDINISTA BRUNO: ¡Felipe! ¿Te acordás de mí? Te peleé en el gimnasio de Bariloche.');
          await decir('Te dije que subí el ACONCAGUA tres veces. ¡Ahora voy por la cuarta!');
        },
      },
      {
        id: 'nene_plaza', x: 19, y: 11, dir: 1, pal: PAL.nene,
        hablar: async () => {
          if (S.flags.insignia8) await decir('NENE: ¡Le ganaste a CUMBRE! ¡Tenés las OCHO insignias! Sos el mejor entrenador de la Argentina.');
          else {
            await decir('NENE: CUMBRE tiene seis DRAGONES. ¡Y cada uno tiene otro tipo más: FUEGO, ROCA, ACERO, VENENO, TIERRA y AGUA!');
            await decir('Al DRAGÓN le ganan el HIELO, el HADA y el DRAGÓN. ¡Pero cuidado: el ACERO aguanta el HIELO y el HADA!');
          }
        },
      },
    ],
  },

  centro22: crearCentro('plaza', 5, 9, 'centro22'),

  gimnasio8: {
    nombre: 'GIMNASIO ACONCAGUA',
    grilla: desdeTexto([
      '###########',
      '#a_wvvvw_a#',
      '#RR_vvv_RR#',
      '#R_______R#',
      '#__ww_ww__#',
      '#_RwwRwwR_#',
      '#__ww_ww__#',
      '#R_______R#',
      '#RR_w_w_RR#',
      '#_________#',
      '#_________#',
      '#####m#####',
    ]),
    edificios: [],
    salidas: [{ x: 5, y: 11, a: 'plaza', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      R: 'Una piedra de la montaña con marcas de garras. ¡Algo muy grande la arañó!',
      a: 'Escamas de dragón que brillan como piedras preciosas.',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim8_a', x: 7, y: 3, dir: 2, pal: PAL.guarda, nombre: 'DOMADOR JULIO',
        equipo: [['espadonix', 71], ['estepasaurio', 71], ['ironboulder', 72]],
        antes: ['DOMADOR JULIO: Entreno dragones desde chiquito. ¡Mirá qué escamas! ¿Te animás?'],
        gana: 'DOMADOR JULIO: ¡Me ganaste! Mis dragones necesitan más entrenamiento.',
        despues: 'DOMADOR JULIO: Los ataques de DRAGÓN no le hacen nada a las criaturas de HADA. ¡Acordate!',
      }),
      entrenadorNPC({
        id: 'gim8_b', x: 2, y: 6, dir: 3, pal: PAL.nieve, nombre: 'ANDINISTA SOFÍA',
        equipo: [['noxidragon', 72], ['phantolycan', 72], ['umbratail', 73]],
        antes: ['ANDINISTA SOFÍA: Subí hasta acá con mis dragones en la mochila. ¡Ahora vas a ver lo que pueden hacer!'],
        gana: 'ANDINISTA SOFÍA: Bueno... me quedo a mirar cómo le ganás a CUMBRE.',
        despues: 'ANDINISTA SOFÍA: La última criatura de CUMBRE es PAMPADÓN, el dragón martillo. ¡Hace temblar toda la montaña!',
      }),
      {
        id: 'cumbre', x: 5, y: 1, dir: 0, pal: PAL.cumbre,
        hablar: async () => {
          if (S.flags.insignia8) {
            if (S.flags.regiohmAtrapado) { await decir('CUMBRE: ¡Calmaste a REGIOHM! La montaña está en paz gracias a vos, Felipe.'); return; }
            await decir('CUMBRE: ¡Felipe! Los SEIS CLANES de las gemas subieron a la cumbre. ¡Quieren despertar al TITÁN que duerme ahí!');
            await decir('Ya tenés las OCHO insignias: podés subir. Salí de PLAZA DE MULAS hacia el NORTE. ¡Cuidate mucho!');
            return;
          }
          if (!S.flags.insignia7) {
            await decir('CUMBRE: Primero conseguí la INSIGNIA VOLCÁN de CENIZA, en el OJOS DEL SALADO. Después volvé.');
            return;
          }
          await decir('CUMBRE: Llegaste al techo de América. Muy pocos entrenadores suben hasta acá.');
          await decir('Soy CUMBRE, líder del GIMNASIO ACONCAGUA. Mis dragones nacieron entre las nubes y la roca.');
          await decir('Si me ganás, te llevás la INSIGNIA CUMBRE: la última. ¡Que ruja la montaña!');
          // Equipo pedido por Poly (22/11): Ignidraxx, Ironboulder, Latigácer, Noxidragón, Pampadón (tiburón martillo) e Iberadraco.
          const r = await batalla({ entrenador: { nombre: 'LÍDER CUMBRE', pal: PAL.cumbre, equipo: [['noxidragon', 72], ['ironboulder', 72], ['iberadraco', 73], ['ignidraxx', 73], ['latigacer', 74, { hab: 'cortante' }], ['pampadon', 75, { hab: 'intimidacion' }]] } });
          if (r === 'gana') {
            S.flags.insignia8 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 8);
            await decir('CUMBRE: La montaña se quedó en silencio... Te ganaste la insignia, Felipe.');
            await decir('¡Felipe recibió la INSIGNIA CUMBRE!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 5;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('CUMBRE: Llevate estos ALFAJORES y BOLEADORAS. ¡Tenés las OCHO insignias de la Argentina!');
            guardar();
            await decir('...¡Mirá! Allá arriba, en la cumbre, hay una luz VIOLETA. ¡Los SEIS CLANES de las gemas subieron juntos!');
            await decir('CUMBRE: Quieren despertar a REGIOHM, el TITÁN que duerme en el ACONCAGUA. ¡Subí por el NORTE de PLAZA DE MULAS y frenalos!');
          }
        },
      },
    ],
  },

  // ================= LA SALAMANCA (GIMNASIO 2) =================
  gimnasio2: {
    nombre: 'LA SALAMANCA',
    grilla: desdeTexto(SALAMANCA),
    edificios: [],
    salidas: [{ x: 6, y: 14, a: 'tafi', ax: 17, ay: 9, dir: 0 }],
    objetos: {
      R: 'La pared de la cueva. Está fría y húmeda.',
      a: 'Cristales que brillan en la oscuridad. ¡Iluminan toda la Salamanca!',
    },
    npcs: [
      entrenadorNPC({
        id: 'gim2_a', x: 3, y: 10, dir: 3, pal: PAL.beto, nombre: 'PICAPEDRERO LUCAS',
        equipo: [['piedrin', 20], ['rocamonte', 21]],
        antes: ['PICAPEDRERO LUCAS: ¡Para llegar a ROCÍO tenés que pasar por mí!'],
        gana: 'PICAPEDRERO LUCAS: Me partiste como a una piedra...',
        despues: 'PICAPEDRERO LUCAS: Las criaturas de ROCÍO son durísimas. ¡Golpeá con AGUA o PLANTA!',
      }),
      entrenadorNPC({
        id: 'gim2_b', x: 9, y: 6, dir: 2, pal: PAL.abuelo, nombre: 'GEÓLOGO ÁLVARO',
        equipo: [['geodin', 21], ['garkol', 22]],
        antes: ['GEÓLOGO ÁLVARO: Estas rocas tienen millones de años. ¡Y mis criaturas también son duras como ellas!'],
        gana: 'GEÓLOGO ÁLVARO: Interesante... Muy interesante.',
        despues: 'GEÓLOGO ÁLVARO: MICALONCO tiene escamas de mica que brillan como espejos. ¡Es el favorito de ROCÍO!',
      }),
      {
        id: 'rocio', x: 6, y: 1, dir: 0, pal: PAL.rocio,
        hablar: async () => {
          if (S.flags.insignia2) {
            await decir('ROCÍO: Tenés la fuerza de una montaña, Felipe. ¡El norte te espera!');
            return;
          }
          if (!S.flags.insignia1) {
            await decir('ROCÍO: ¿Todavía no tenés la INSIGNIA ESPEJO? Primero ganale a LUNA, en el VALLE DE LA LUNA.');
            return;
          }
          await decir('ROCÍO: ¡Bienvenido a LA SALAMANCA, la cueva más misteriosa de Tucumán!');
          await decir('Dicen que acá adentro se aprende cualquier cosa. Yo aprendí a pelear con criaturas de piedra.');
          await decir('Soy ROCÍO, líder del gimnasio de ROCA. ¡Si querés la INSIGNIA AMATISTA, vas a tener que romper la piedra!');
          const r = await batalla({ entrenador: { nombre: 'LÍDER ROCÍO', pal: PAL.rocio, equipo: [['rocamonte', 21], ['garkol', 22], ['geodin', 22], ['glaciolito', 23], ['micalonco', 24]] } });
          if (r === 'gana') {
            S.flags.insignia2 = true;
            S.flags.insignias = Math.max(S.flags.insignias || 0, 2);
            await decir('ROCÍO: ¡Increíble! Rompiste mi defensa de piedra.');
            await decir('¡Felipe recibió la INSIGNIA AMATISTA!');
            S.bolsa.alfajor = (S.bolsa.alfajor || 0) + 3;
            S.bolsa.boleadora = (S.bolsa.boleadora || 0) + 5;
            await decir('ROCÍO: Y llevate estos ALFAJORES y BOLEADORAS. ¡En el norte hay criaturas que todavía nadie atrapó!');
            S.bolsa.bici = 1;
            await decir('ROCÍO: ¡Ah! Y esto también: mi BICICLETA de montaña. Con ella vas a cruzar el país el doble de rápido.');
            await decir('¡Felipe recibió la BICICLETA!');
            await decir('Usala desde el MENÚ (BICICLETA) o desde la MOCHILA. ¡Solo se puede andar afuera!');
            guardar();
          }
        },
      },
    ],
  },
};

// ================= EL MAPA CON LA FORMA DE ARGENTINA =================
// Las rutas se dibujan "de abajo hacia arriba", pero en el país el viaje sube y baja:
// Córdoba → San Juan va al OESTE, Jujuy → Chaco al ESTE, Chaco → Iberá BAJA,
// Iberá → Misiones al ESTE, y de Misiones a la Patagonia se BAJA todo.
// Acá se giran esas rutas y se abren los costados de los pueblos que hacen falta.
function abrir(id, celdas, letra) { for (const [x, y] of celdas) MAPAS[id].grilla[y][x] = letra; }
function moverSalidas(id, haciaMapa, nuevas) {
  const ss = MAPAS[id].salidas.filter(s => s.a === haciaMapa);
  ss.forEach((s, i) => Object.assign(s, nuevas[i]));
}
function llegadas(desde, haciaMapa, nuevas) { moverSalidas(desde, haciaMapa, nuevas); }

// --- Pueblos: abrir los costados nuevos y cerrar los viejos ---
// Villa Serrana: sale al OESTE hacia las Sierras
abrir('serrana', [[10, 0], [11, 0]], 'T');
abrir('serrana', [[0, 10], [1, 10], [0, 11], [1, 11]], '=');
moverSalidas('serrana', 'sierras', [{ x: 0, y: 10 }, { x: 0, y: 11 }]);
llegadas('sierras', 'serrana', [{ ax: 1, ay: 10, dir: 3 }, { ax: 1, ay: 11, dir: 3 }]);
MAPAS.serrana.carteles['12,1'] = 'VILLA SERRANA. Al OESTE: RUTA 3, las SIERRAS DE CÓRDOBA y, más lejos, SAN JUAN.';
// Valle Fértil: se llega desde el ESTE (la Travesía)
abrir('vallefertil', [[10, 21], [11, 21]], 'C');
abrir('vallefertil', [[22, 10], [23, 10], [22, 11], [23, 11]], '=');
moverSalidas('vallefertil', 'travesia', [{ x: 23, y: 10 }, { x: 23, y: 11 }]);
llegadas('travesia', 'vallefertil', [{ ax: 22, ay: 10, dir: 2 }, { ax: 22, ay: 11, dir: 2 }]);
MAPAS.vallefertil.carteles['12,1'] = 'Al NORTE: RUTA 5, hacia TALAMPAYA y TUCUMÁN. Al ESTE: la TRAVESÍA, de vuelta a Córdoba.';
// Villa Camalote: se llega BAJANDO desde los Esteros (arriba) y se sigue al ESTE hacia la selva
abrir('villa', [[10, 23], [11, 23]], 'T');
abrir('villa', [[21, 10], [22, 10], [23, 10], [21, 11], [22, 11], [23, 11]], 'h');
moverSalidas('villa', 'ruta2', [{ x: 10, y: 0 }, { x: 11, y: 0 }]);
moverSalidas('villa', 'ruta3', [{ x: 23, y: 10 }, { x: 23, y: 11 }]);
llegadas('ruta2', 'villa', [{ ax: 10, ay: 1, dir: 0 }, { ax: 11, ay: 1, dir: 0 }]);
llegadas('ruta3', 'villa', [{ ax: 22, ay: 10, dir: 2 }, { ax: 22, ay: 11, dir: 2 }]);
MAPAS.villa.carteles['12,1'] = 'Al NORTE: RUTA 9, los ESTEROS DEL IBERÁ. Al ESTE, cruzando el puente: RUTA 10, la SELVA MISIONERA.';
// Puerto Wanda: hacia el sur se sale por el OESTE
abrir('puerto', [[10, 0], [11, 0]], 'Y');
abrir('puerto', [[0, 10], [1, 10], [0, 11], [1, 11]], 'q');
moverSalidas('puerto', 'caldenal', [{ x: 0, y: 10 }, { x: 0, y: 11 }]);
llegadas('caldenal', 'puerto', [{ ax: 1, ay: 10, dir: 3 }, { ax: 1, ay: 11, dir: 3 }]);
MAPAS.puerto.carteles['12,1'] = 'Al OESTE: RUTA 11. Hay que BAJAR por todo el país hasta el CALDENAL PAMPEANO y la PATAGONIA.';
// Bariloche: se llega BAJANDO desde la estepa (arriba); al SUR, la Ruta 13 (en construcción)
moverSalidas('bariloche', 'estepa', [{ x: 10, y: 0 }, { x: 11, y: 0 }]);
llegadas('estepa', 'bariloche', [{ ax: 10, ay: 1, dir: 0 }, { ax: 11, ay: 1, dir: 0 }]);
MAPAS.bariloche.disparadores = [];
MAPAS.bariloche.salidas.push(
  { x: 10, y: 23, a: 'ruta13', ax: 10, ay: 30, dir: 1 },
  { x: 11, y: 23, a: 'ruta13', ax: 11, ay: 30, dir: 1 },
);
MAPAS.bariloche.carteles['12,1'] = 'BARILOCHE. Al NORTE: la ESTEPA PATAGÓNICA. Al SUR: RUTA 13, el BOSQUE ANDINO y EL BOLSÓN.';
// El Bolsón: se llega BAJANDO (arriba) y se sale al ESTE; se cierra el sur
abrir('elbolson', [[10, 21], [11, 21]], 'N');
abrir('elbolson', [[22, 10], [23, 10], [22, 11], [23, 11]], '=');
// Jacobacci: se cruza de OESTE a ESTE
abrir('jacobacci', [[10, 0], [11, 0], [10, 21], [11, 21]], 'N');
abrir('jacobacci', [[0, 10], [1, 10], [0, 11], [1, 11], [22, 10], [23, 10], [22, 11], [23, 11]], '=');
// Paraje Somuncurá: se llega desde el OESTE; arriba cerrado, abajo el camino en construcción
abrir('somuncura', [[10, 0], [11, 0]], 'R');
// Ushuaia: el fin del mundo, se llega desde el norte y abajo está cerrado
abrir('ushuaia', [[10, 23], [11, 23]], 'N');
// Región 7: abrir costados y cerrar lo que no se usa
abrir('catamarca', [[10, 0], [11, 0], [10, 21], [11, 21]], 'C');
abrir('catamarca', [[0, 10], [1, 10], [0, 11], [1, 11]], '=');
abrir('belen', [[10, 0], [11, 0], [10, 21], [11, 21]], 'C');
abrir('belen', [[0, 10], [1, 10], [0, 11], [1, 11], [22, 10], [23, 10], [22, 11], [23, 11]], '=');
abrir('fiambala', [[10, 21], [11, 21]], 'C');
abrir('fiambala', [[22, 10], [23, 10], [22, 11], [23, 11]], '=');
abrir('ojos', [[10, 0], [11, 0]], 'N');
// Región 8: desde Ojos del Salado se sale por el OESTE a la cordillera y se BAJA hasta el Aconcagua
abrir('ojos', [[0, 10], [1, 10], [0, 11], [1, 11]], '=');
MAPAS.ojos.salidas.push(
  { x: 0, y: 10, a: 'ruta22', ax: 10, ay: 30, dir: 1 },
  { x: 0, y: 11, a: 'ruta22', ax: 11, ay: 30, dir: 1 },
);
MAPAS.ojos.carteles['12,1'] = 'Arriba: el volcán OJOS DEL SALADO. Al SUR: RUTA 21, a FIAMBALÁ. Al OESTE: RUTA 22, por la cordillera hacia el ACONCAGUA.';
abrir('uspallata', [[10, 21], [11, 21]], 'T');
abrir('uspallata', [[0, 10], [1, 10], [0, 11], [1, 11]], '=');
abrir('plaza', [[10, 0], [11, 0]], 'N');
abrir('somuncura', [[0, 10], [1, 10], [0, 11], [1, 11]], '=');

// --- Rutas: girarlas ---
// cw = el "arriba" del dibujo pasa a ser el ESTE; ccw = pasa a ser el OESTE; 180 = pasa a ser el SUR
const GIROS = { cw: [2, 3, 1, 0], ccw: [3, 2, 0, 1], '180': [1, 0, 3, 2] };
function girarPunto(giro, x, y, w, h) {
  if (giro === 'cw') return [h - 1 - y, x];
  if (giro === 'ccw') return [y, w - 1 - x];
  return [w - 1 - x, h - 1 - y];
}
function girarMapa(id, giro) {
  const m = MAPAS[id], g = m.grilla, h = g.length, w = g[0].length;
  const P = (x, y) => girarPunto(giro, x, y, w, h), D = d => GIROS[giro][d];
  // las llegadas desde otros mapas
  for (const otro of Object.values(MAPAS)) for (const s of otro.salidas || []) {
    if (s.a !== id) continue;
    [s.ax, s.ay] = P(s.ax, s.ay); s.dir = D(s.dir);
  }
  const nw = giro === '180' ? w : h, nh = giro === '180' ? h : w;
  const ng = Array.from({ length: nh }, () => Array(nw));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const [a, b] = P(x, y); ng[b][a] = g[y][x]; }
  m.grilla = ng;
  for (const s of m.salidas || []) [s.x, s.y] = P(s.x, s.y);
  for (const n of m.npcs || []) { [n.x, n.y] = P(n.x, n.y); n.dir = D(n.dir); }
  if (m.carteles) {
    const c = {};
    for (const [k, v] of Object.entries(m.carteles)) { const [x, y] = k.split(',').map(Number); const [a, b] = P(x, y); c[a + ',' + b] = v; }
    m.carteles = c;
  }
}
girarMapa('sierras', 'ccw');
girarMapa('travesia', 'ccw');
girarMapa('chaco', 'cw');
girarMapa('ruta2', '180');
girarMapa('ruta3', 'cw');
girarMapa('caldenal', '180');
girarMapa('estepa', '180');
// Región 5: Ruta 13 BAJA desde Bariloche; Rutas 14 y 15 van hacia el ESTE
// Ruta 2 (Llanura Pampeana): desvío al ESTE, justo al sur del río, hacia el Bañado del Río Salado
abrir('pampa', [[20, 12], [21, 12], [20, 13], [21, 13]], '=');
MAPAS.pampa.salidas.push(
  { x: 21, y: 12, a: 'banado', ax: 1, ay: 7, dir: 3 },
  { x: 21, y: 13, a: 'banado', ax: 1, ay: 8, dir: 3 },
);
abrir('pampa', [[19, 14]], 'S');
MAPAS.pampa.carteles['19,14'] = 'Al ESTE, siguiendo el río: el BAÑADO DEL RÍO SALADO. ¡Un pantano lleno de criaturas!';
// Ruta 7 (Yungas): desvío al OESTE hacia El Monte Cerrado
abrir('ruta4', [[0, 13], [1, 13], [0, 14], [1, 14]], '=');
MAPAS.ruta4.salidas.push(
  { x: 0, y: 13, a: 'monte', ax: 24, ay: 10, dir: 2 },
  { x: 0, y: 14, a: 'monte', ax: 24, ay: 11, dir: 2 },
);
girarMapa('ruta13', '180');
girarMapa('ruta14', 'cw');
girarMapa('ruta15', 'cw');
// Región 6: todo BAJA por la costa
girarMapa('ruta16', '180');
girarMapa('ruta17', '180');
girarMapa('ruta18', '180');
// Región 7: hacia el OESTE por Catamarca; la Ruta 21 sube derecho a la Puna
girarMapa('ruta19', 'ccw');
girarMapa('ruta20', 'ccw');
// Región 8: la Ruta 22 y la Cueva de los Andes BAJAN por la cordillera; el Ascenso al Aconcagua SUBE (no se gira)
girarMapa('ruta22', '180');
girarMapa('ruta23', '180');

// ===== LOS SEIS CLANES DE LAS GEMAS (presentación de Felipe, diapositivas 189-204) =====
// Todos son PSÍQUICOS + el segundo tipo de su gema. Cada clan corta el paso DOS veces en el viaje
// (un RECLUTA y su JEFE parados en la salida del pueblo); después del Gimnasio 8 se juntan en la cumbre
// del ACONCAGUA para despertar a REGIOHM. Nombres de clanes y jefes: propuestos por Claude, Felipe los puede cambiar.
Object.assign(PAL, {
  clanMente: { id: 'clanMente', piel: '#f0c8a8', pelo: '#2a1a2a', gorra: '#c030a0', remera: '#2a1a3a', raya: '#f070c0', pant: '#1a1a2a' },
  clanAlma: { id: 'clanAlma', piel: '#f0c8a8', pelo: '#3a2a4a', gorra: '#8a4ae0', remera: '#e8d8f8', raya: '#a060f0', pant: '#3a2a5a' },
  clanRealidad: { id: 'clanRealidad', piel: '#e8c0a0', pelo: '#1a1a1a', gorra: '#1a1a1a', remera: '#3a1010', raya: '#e03030', pant: '#101010' },
  clanPoder: { id: 'clanPoder', piel: '#d8a070', pelo: '#2a1a10', gorra: '#e03030', remera: '#7a1a2a', raya: '#f8d040', pant: '#2a1a1a' },
  clanEspacio: { id: 'clanEspacio', piel: '#e8c0a0', pelo: '#1a2a4a', gorra: '#2a5ac8', remera: '#1a2a5a', raya: '#f8d040', pant: '#101a3a' },
  clanTiempo: { id: 'clanTiempo', piel: '#e0b088', pelo: '#3a3a2a', gorra: '#c8a040', remera: '#2a4a3a', raya: '#40d080', pant: '#2a2a1a' },
  cortex: { id: 'cortex', piel: '#f0c8a8', pelo: '#e8e8f0', capa: true, sombrero: '#c030a0', remera: '#c030a0', raya: '#f8f8f8', pant: '#1a1a2a', barba: '#e8e8f0' },
  anima: { id: 'anima', piel: '#f4d8c0', pelo: '#e8d8f8', peloLargo: true, remera: '#8a4ae0', raya: '#f8f8ff', pant: '#3a2a5a', guardapolvo: true },
  ilusion: { id: 'ilusion', piel: '#e8c0a0', pelo: '#e03030', peloLargo: true, sombrero: '#1a1a1a', remera: '#1a1a1a', raya: '#e03030', pant: '#3a1010' },
  mazo: { id: 'mazo', piel: '#c89060', pelo: '#1a1a1a', boina: '#e03030', remera: '#e03030', raya: '#f8d040', pant: '#2a1a1a', barba: '#1a1a1a' },
  cometa: { id: 'cometa', piel: '#e8c0a0', pelo: '#f8d040', gorra: '#1a2a5a', remera: '#2a5ac8', raya: '#f8d040', pant: '#101a3a' },
  clepsidra: { id: 'clepsidra', piel: '#e0b088', pelo: '#40d080', peloLargo: true, sombrero: '#c8a040', remera: '#c8a040', raya: '#2a4a3a', pant: '#2a2a1a' },
});

const CLANES = {
  mente: { nombre: 'CLAN MENTE', gema: 'GEMA DE LA MENTE', guardian: 'REGIMENTO', tipo: 'PSÍQUICO', jefe: 'CÓRTEX', palJefe: 'cortex', pal: 'clanMente' },
  alma: { nombre: 'CLAN ALMA', gema: 'GEMA DEL ALMA', guardian: 'REGIANIMA', tipo: 'PSÍQUICO y HADA', jefe: 'ÁNIMA', palJefe: 'anima', pal: 'clanAlma' },
  poder: { nombre: 'CLAN PODER', gema: 'GEMA DEL PODER', guardian: 'REGIPULSO', tipo: 'PSÍQUICO y LUCHA', jefe: 'MAZO', palJefe: 'mazo', pal: 'clanPoder' },
  realidad: { nombre: 'CLAN REALIDAD', gema: 'GEMA DE LA REALIDAD', guardian: 'REGIFRACTO', tipo: 'PSÍQUICO y SINIESTRO', jefe: 'ILUSIÓN', palJefe: 'ilusion', pal: 'clanRealidad' },
  espacio: { nombre: 'CLAN ESPACIO', gema: 'GEMA DEL ESPACIO', guardian: 'REGIÓRBITA', tipo: 'PSÍQUICO y ELÉCTRICO', jefe: 'COMETA', palJefe: 'cometa', pal: 'clanEspacio' },
  tiempo: { nombre: 'CLAN TIEMPO', gema: 'GEMA DEL TIEMPO', guardian: 'REGICRONO', tipo: 'PSÍQUICO y ACERO', jefe: 'CLEPSIDRA', palJefe: 'clepsidra', pal: 'clanTiempo' },
};

// Un encuentro: RECLUTA + JEFE parados en las dos baldosas de la salida. Se van recién cuando les ganás a los dos.
function encuentroClan(o) {
  const c = CLANES[o.clan], vez = o.vez;
  const idR = `clan_${o.clan}${vez}_r`, idJ = `clan_${o.clan}${vez}_j`;
  const listo = () => S.flags['ent_' + idR] && S.flags['ent_' + idJ];
  const recluta = entrenadorNPC({
    id: idR, x: o.r[0], y: o.r[1], dir: o.dir, pal: PAL[c.pal], nombre: 'RECLUTA DEL ' + c.nombre,
    equipo: o.recluta,
    antes: vez === 1
      ? [`RECLUTA: ¡Alto ahí! Por acá no pasa nadie. ¡Somos el ${c.nombre}!`, `Buscamos la ${c.gema}. ¡Y ningún chico nos va a molestar!`]
      : [`RECLUTA: ¡Otra vez vos! El ${c.nombre} no se olvida de los que lo molestan.`, '¡Esta vez no pasás!'],
    gana: 'RECLUTA: ¡No puede ser! ¡Jefe, ayúdeme!',
    despues: `RECLUTA: Nuestras criaturas son todas PSÍQUICAS... ¡y además ${c.tipo === 'PSÍQUICO' ? 'nada más que PSÍQUICAS' : c.tipo.split(' y ')[1]}!`,
  });
  const jefe = entrenadorNPC({
    id: idJ, x: o.j[0], y: o.j[1], dir: o.dir, pal: PAL[c.palJefe], nombre: 'JEFE ' + c.jefe,
    equipo: o.jefe,
    antes: vez === 1
      ? [`${c.jefe}: Así que vos sos el famoso Felipe... Soy ${c.jefe}, jefe del ${c.nombre}.`,
        `En la ${c.gema} duerme ${c.guardian}, su guardián. Cuando lo tengamos, nada nos va a parar.`,
        '¡Correte del camino, nene!']
      : [`${c.jefe}: Felipe... ya tenemos a ${c.guardian} bajo nuestro control.`,
        'Los seis clanes nos vamos a juntar en la cumbre del ACONCAGUA. Ahí está dormido el TITÁN de todas las gemas.',
        '¡Y vos no vas a llegar!'],
    gana: vez === 1
      ? `${c.jefe}: Grr... Ganaste esta vez. Pero el ${c.nombre} va a volver. ¡Nos vamos!`
      : `${c.jefe}: No importa. El plan ya está en marcha. ¡Nos vemos en el ACONCAGUA, Felipe!`,
    despues: `${c.jefe}: ...`,
  });
  recluta.visible = () => !listo();
  jefe.visible = () => !listo();
  const m = MAPAS[o.mapa];
  m.npcs.push(recluta, jefe);
  // Si Felipe quiere salir por ahí (zona = las dos baldosas antes de la salida), el clan le corta el paso.
  // Si pierde una batalla, vuelve al CEMIC; así que después de esto, o les ganó a los dos o ya no está acá.
  m.disparadores = (m.disparadores || []).concat([{
    prueba: (x, y) => !listo() && o.zona.some(([zx, zy]) => zx === x && zy === y),
    accion: async () => {
      const r = npcPorId(idR), j = npcPorId(idJ);
      for (const n of [r, j]) if (n) n.dir = Math.abs(n.x - S.x) > Math.abs(n.y - S.y) ? (n.x > S.x ? 2 : 3) : (n.y > S.y ? 1 : 0);
      await decir(vez === 1 ? `¡Alto! ¡El ${c.nombre} te corta el paso!` : `¡Alto! ¡El ${c.nombre} otra vez!`);
      if (!S.flags['ent_' + idR]) await recluta.hablar();
      if (S.flags['ent_' + idR] && !S.flags['ent_' + idJ] && S.mapa === o.mapa) await jefe.hablar();
    },
  }]);
}

// Primera vuelta (antes del Gimnasio 5) y segunda vuelta (del 5 al 8), cada vez más fuertes
const ENCUENTROS_CLANES = [
  { clan: 'mente', vez: 1, mapa: 'serrana', zona: [[1, 10], [1, 11]], r: [2, 9], j: [2, 12], dir: 3,
    recluta: [['lechucita', 9], ['espejito', 10]], jefe: [['condorito', 11], ['lechucita', 11], ['mimetit', 13]] },
  { clan: 'alma', vez: 1, mapa: 'tafi', zona: [[10, 1], [11, 1]], r: [9, 2], j: [12, 2], dir: 0,
    recluta: [['anahisa', 25], ['mythfae', 26]], jefe: [['lechuzonte', 26], ['anahisa', 27], ['mythfae', 29]] },
  { clan: 'poder', vez: 1, mapa: 'villa', zona: [[22, 10], [22, 11]], r: [21, 9], j: [20, 9], dir: 2,
    recluta: [['pumentor', 31], ['braspuma', 32]], jefe: [['lechuzonte', 32], ['braspuma', 33], ['pumentor', 35]] },
  { clan: 'realidad', vez: 1, mapa: 'puerto', zona: [[1, 10], [1, 11]], r: [2, 9], j: [2, 12], dir: 3,
    recluta: [['yaguaraba', 37], ['espejonte', 37]], jefe: [['duskfae', 38], ['umbracor', 39], ['mythfae', 39], ['yaguaraba', 40]] },
  { clan: 'espacio', vez: 1, mapa: 'bariloche', zona: [[10, 22], [11, 22]], r: [9, 22], j: [12, 22], dir: 1,
    recluta: [['dynacore', 43], ['lechuzonte', 43]], jefe: [['condorito', 44], ['dynacore', 44], ['espectradraco', 45], ['turborush', 47]] },
  { clan: 'tiempo', vez: 1, mapa: 'jacobacci', zona: [[22, 10], [22, 11]], r: [21, 9], j: [21, 12], dir: 2,
    recluta: [['espejonte', 47], ['umbracor', 48]], jefe: [['espadonix', 48], ['umbracor', 49], ['espectradraco', 49], ['espejonte', 51]] },
  { clan: 'mente', vez: 2, mapa: 'madryn', zona: [[10, 20], [11, 20]], r: [9, 20], j: [12, 20], dir: 1,
    recluta: [['lechuzonte', 54], ['condorito', 55]], jefe: [['condorito', 55], ['lechuzonte', 56], ['espejonte', 56], ['mythfae', 57], ['espectradraco', 58]] },
  { clan: 'alma', vez: 2, mapa: 'gallegos', zona: [[10, 20], [11, 20]], r: [9, 20], j: [12, 20], dir: 1,
    recluta: [['anahisa', 56], ['mythfae', 57]], jefe: [['wraithfae', 57], ['anahisa', 58], ['duskfae', 58], ['lechuzonte', 58], ['mythfae', 60]] },
  { clan: 'poder', vez: 2, mapa: 'belen', zona: [[1, 10], [1, 11]], r: [2, 9], j: [2, 12], dir: 3,
    recluta: [['pumentor', 61], ['braspuma', 62]], jefe: [['lechuzonte', 62], ['carayarbore', 63], ['braspuma', 63], ['espejonte', 63], ['pumentor', 65]] },
  { clan: 'realidad', vez: 2, mapa: 'fiambala', zona: [[10, 1], [11, 1]], r: [9, 2], j: [12, 2], dir: 0,
    recluta: [['yaguaraba', 63], ['duskfae', 64]], jefe: [['umbratail', 64], ['umbracor', 65], ['mythfae', 65], ['yaguaraba', 65], ['duskfae', 67]] },
  { clan: 'espacio', vez: 2, mapa: 'rodeo', zona: [[10, 20], [11, 20]], r: [9, 20], j: [12, 20], dir: 1,
    recluta: [['turborush', 67], ['espectradraco', 68]], jefe: [['condorito', 68], ['lechuzonte', 69], ['espectradraco', 69], ['mythfae', 70], ['turborush', 71]] },
  { clan: 'tiempo', vez: 2, mapa: 'uspallata', zona: [[1, 10], [1, 11]], r: [2, 9], j: [2, 12], dir: 3,
    recluta: [['espejonte', 69], ['latigacer', 70]], jefe: [['umbracor', 70], ['latigacer', 71], ['espectradraco', 71], ['pumentor', 71], ['espejonte', 73]] },
];
ENCUENTROS_CLANES.forEach(encuentroClan);

// ===== LA CUMBRE DEL ACONCAGUA: los clanes despiertan a REGIOHM =====
const CIMA = [
  'NNNNNNNNNNNNNNNNNNNNNN',
  'NNNNNNNwwwwwwwwNNNNNNN',
  'NNNNNwwwwwwwwwwwwNNNNN',
  'NNNNwwwwwwwwwwwwwwNNNN',
  'NNNwwwwwwwwwwwwwwwwNNN',
  'NNNwwwwwwwwwwwwwwwwNNN',
  'NNwwwwwwwwwwwwwwwwwwNN',
  'NNwwwwwwwwwwwwwwwwwwNN',
  'NNwwwwwwwwwwwwwwwwwwNN',
  'NNNwwwwwwwwwwwwwwwwNNN',
  'NNNwwwwwwwwwwwwwwwwNNN',
  'NNNNwwwwwwwwwwwwwwNNNN',
  'NNNNNwwwwwwwwwwwwNNNNN',
  'NNNNNNNNwwwwwwNNNNNNNN',
  'NNNNNNNNNwwwwNNNNNNNNN',
  'NNNNNNNNNSwwNNNNNNNNNN',
  'NNNNNNNNNNwwNNNNNNNNNN',
  'NNNNNNNNNN==NNNNNNNNNN',
];
const JEFES_CIMA = [['mente', 8, 6], ['alma', 14, 6], ['realidad', 5, 9], ['poder', 17, 9], ['espacio', 7, 12], ['tiempo', 15, 12]];
MAPAS.cima = {
  nombre: 'CUMBRE DEL ACONCAGUA',
  exterior: true,
  grilla: desdeTexto(CIMA),
  edificios: [],
  salidas: [
    { x: 10, y: 17, a: 'plaza', ax: 10, ay: 1, dir: 0 },
    { x: 11, y: 17, a: 'plaza', ax: 11, ay: 1, dir: 0 },
  ],
  carteles: { '9,15': 'CUMBRE DEL ACONCAGUA, 6.961 metros. El techo de América.' },
  objetos: { w: 'Nieve que brilla con una luz violeta muy rara...' },
  npcs: [
    ...JEFES_CIMA.map(([k, x, y]) => ({
      id: 'cima_' + k, x, y, dir: [0, 0, 3, 2, 1, 1][JEFES_CIMA.findIndex(j => j[0] === k)], pal: PAL[CLANES[k].palJefe],
      visible: () => !S.flags.clanesHuyeron,
      hablar: async () => { await decir(`${CLANES[k].jefe}: ¡No molestes, Felipe! ¡Estamos por despertar al TITÁN!`); },
    })),
    {
      id: 'regiohm', x: 11, y: 8, dir: 0, criatura: 'regiohm',
      visible: () => S.flags.regiohmDesperto && !S.flags.regiohmAtrapado,
      hablar: pelearRegiohm,
    },
  ],
  disparadores: [
    { prueba: (x, y) => y <= 12 && !S.flags.regiohmDesperto, accion: () => despertarRegiohm() },
  ],
};

async function despertarRegiohm() {
  const dec = async (k, t) => { const n = npcPorId('cima_' + k); if (n) n.dir = 0; await decir(t); };
  for (let i = 0; i < 2; i++) await pasoForzado(1); // Felipe se acerca al círculo
  await decir('Los jefes de los SEIS CLANES formaron un círculo perfecto en la cumbre...');
  await dec('mente', 'CÓRTEX: ¡Llegó el momento! ¡Guardianes de las gemas, arrodíllense!');
  await decir('REGIMENTO, REGIANIMA, REGIPULSO, REGIFRACTO, REGIÓRBITA y REGICRONO se arrodillaron, cada uno en su lugar.');
  await dec('tiempo', 'CLEPSIDRA: Con sus gemas como llaves vamos a romper el sello de la montaña.');
  await dec('poder', 'MAZO: ¡Todos juntos! ¡AHORA!');
  for (let i = 0; i < 3; i++) await destello(10);
  await decir('¡Las gemas empezaron a girar a toda velocidad! Su luz tiñó el cielo de violeta.');
  await decir('¡Se abrió un PORTAL gigante en la cumbre!');
  await destello(30);
  S.flags.regiohmDesperto = true;
  await decir('Del portal salió... ¡REGIOHM, el TITÁN PRIMIGENIO! Un coloso de mármol blanco con relieves de oro.');
  await decir('REGIOHM extendió sus brazos con calma y empezó a absorber las seis gemas...');
  await dec('realidad', 'ILUSIÓN: ¡No! ¡Se está llevando las gemas! ¡Teníamos que ser NOSOTROS los dueños de su poder!');
  await dec('espacio', 'COMETA: ¡Ataquen! ¡Todas las criaturas a la vez! ¡Tiene que obedecernos!');
  await decir('Cientos de criaturas de los clanes atacaron a REGIOHM...');
  await destello(16);
  await decir('...y la paciencia del TITÁN se rompió. ¡Sus ojos blancos se pusieron ROJOS como el fuego!');
  await decir('¡REGIOHM soltó un RUGIDO PSÍQUICO que hizo temblar toda la montaña! Las máquinas de los clanes quedaron hechas chatarra.');
  await dec('alma', 'ÁNIMA: ¡Se nos fue de las manos! ¡Corran!');
  await fundido(1, 16);
  S.flags.clanesHuyeron = true;
  await esperar(10);
  await fundido(0, 16);
  await decir('Los jefes de los clanes escaparon montaña abajo entre las piedras...');
  await decir('Felipe se quedó solo frente a REGIOHM. ¡Es la última defensa de toda la región!');
  guardar();
  await pelearRegiohm();
}

async function pelearRegiohm() {
  if (!S.equipo.some(m => m.ps > 0)) { await decir('Tus criaturas no tienen energía. ¡Curalas en el CEMIC de PLAZA DE MULAS!'); return; }
  await decir('REGIOHM: ¡¡GROOOOAAAAR!!');
  const r = await batalla({ salvaje: ['regiohm', 80], legendario: true });
  if (r === 'atrapado') {
    S.flags.regiohmAtrapado = true;
    await decir('Los ojos de REGIOHM volvieron a ser blancos. El TITÁN ahora está tranquilo... ¡y es tu compañero!');
    await decir('¡Felipe salvó a toda la región! ¡Sos un verdadero CAMPEÓN de las CRIATURAS CRIOLLAS!');
    guardar();
  } else if (r === 'gana') {
    await decir('REGIOHM cayó sobre la nieve y se quedó quieto, descansando...');
    await decir('Sus ojos todavía brillan. Cuando quieras, podés volver a intentar atraparlo.');
  } else if (r === 'huir') {
    await decir('REGIOHM sigue en la cumbre, esperando...');
  }
}

async function destello(cuadros = 12) {
  for (let i = 0; i <= cuadros; i++) { ui.destello = 1 - i / cuadros; await esperar(1); }
  ui.destello = 0;
}

// Plaza de Mulas: arriba se sube a la cumbre, pero solo con las OCHO insignias
abrir('plaza', [[10, 0], [11, 0]], '=');
MAPAS.plaza.salidas.push(
  { x: 10, y: 0, a: 'cima', ax: 10, ay: 16, dir: 1 },
  { x: 11, y: 0, a: 'cima', ax: 11, ay: 16, dir: 1 },
);
MAPAS.plaza.carteles['12,1'] = 'Arriba: la CUMBRE del ACONCAGUA, 6.961 metros. Solo pueden subir los que tienen las OCHO insignias. Abajo: el ASCENSO.';
MAPAS.plaza.disparadores = (MAPAS.plaza.disparadores || []).concat([
  {
    prueba: (x, y) => y === 1 && (x === 10 || x === 11) && !S.flags.insignia8,
    accion: async () => {
      await decir('Un viento helado baja de la cumbre. Sin las OCHO insignias es muy peligroso seguir subiendo.');
      await pasoForzado(0);
    },
  },
]);


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

