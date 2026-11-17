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
      '12,3': 'VILLA CAMALOTE, acá nomás al norte. ¡Cuidado con los mosquitos!',
      '13,32': 'RUTA 9 · ESTEROS DEL IBERÁ. Por el puente de madera se cruza la laguna.',
    },
    encuentros: { lista: [['mosquillon', 20], ['carpinchon', 18], ['junquito', 12], ['terito', 12], ['yacarelito', 10], ['totorarca', 8], ['ceibito', 6], ['lechucita', 5], ['faeve', 4], ['espejito', 3], ['anahisa', 2]], min: 31, max: 34 },
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
      '14,29': 'Al norte: MINAS DE WANDA y PUERTO WANDA, con el GIMNASIO DE PLANTA.',
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
      '16,12': 'RUTA 7 · YUNGAS. La selva de las nubes: siempre hay neblina entre los árboles.',
      '13,30': 'Al norte: CALILEGUA. De ahí sale el camino al CHACO y al LITORAL.',
    },
    encuentros: { lista: [['cuison', 18], ['capullon', 14], ['mosquillon', 12], ['arquineo', 12], ['carpinchon', 10], ['condorito', 10], ['cardito', 8], ['zorrazo', 8], ['polillaca', 3]], min: 25, max: 28 },
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
      '9,3': 'Al norte: la TRAVESÍA hacia SAN JUAN. ¡Llevá agua y mates!',
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
      '9,3': 'Al norte: VALLE FÉRTIL y el GIMNASIO DEL VALLE DE LA LUNA.',
    },
    encuentros: { lista: [['vizcachita', 18], ['lechucita', 16], ['piedrin', 14], ['espejito', 14], ['pumita', 12], ['mimetit', 10], ['faeve', 8], ['cardito', 8]], min: 10, max: 14 },
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
      '9,30': 'RUTA 6 · VALLES CALCHAQUÍES. Cardones, viñedos y cerros de colores.',
      '9,3': 'Al norte: TAFÍ DEL VALLE y LA SALAMANCA.',
    },
    encuentros: { lista: [['cardito', 22], ['rocori', 16], ['piquibrote', 12], ['hornerito', 12], ['vizcachita', 12], ['farolito', 10], ['glaciolito', 6], ['garkol', 6], ['chispuna', 4]], min: 18, max: 22 },
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

