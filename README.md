# Criaturas Criollas

Juego estilo GBA 2D de criaturas argentinas, diseñado por Felipe.

Jugar: https://infopolyartesanal-sudo.github.io/criaturascriollas/ (GitHub Pages)

Antes: https://criaturascriollas.netlify.app

## Cómo está armado

- `plantilla.html`: la página (estilos, pantalla y botones táctiles).
- `js/sprites.js`: motor de pixel-art, personajes, baldosas y edificios.
- `js/datos.js`: los 18 tipos, movimientos, objetos y especies.
- `js/mapas.js`: todos los lugares (Pueblo Tero, Ruta 1, casa, laboratorio, Ruta 2, Villa Camalote, Casa del Mate, Gimnasio 1) e historia.

## Cómo agregar un lugar nuevo

1. En `js/mapas.js`, dibujá la grilla con letras (una fila por línea, todas del mismo largo):
   `T` árbol · `.` pasto · `,` pasto alto (criaturas salvajes) · `=` camino · `~` agua · `j` juncos · `h` puente · `S` cartel · `F` flores.
   Interiores: `#` pared · `_` piso · `v` piso violeta · `m` alfombra de salida · `g` esfera.
2. Agregá una entrada en `MAPAS` con `nombre`, `grilla`, `edificios`, `salidas`, `carteles`, `encuentros` y `npcs`.
3. Conectalo: una `salida` es una baldosa que te lleva a otro mapa (`a`, `ax`, `ay`, `dir`). Hace falta una de ida y otra de vuelta.
4. Entrenadores: `entrenadorNPC({...})` pelea una sola vez y recuerda que le ganaste.
5. Criaturas nuevas van en `js/datos.js` (`ESPECIES`), y su dibujo en `img/<id>.png`.
- `js/juego.js`: motor del juego (mundo, diálogos, menús, batallas, evolución, guardado).
- `img/`: dibujos de Felipe pasados a pixel-art (`<id>.png`, opcional `<id>_espalda.png`).
  Si una especie tiene dibujo, el juego usa ese; si no, usa el sprite hecho con figuras.

## Publicar

```
python3 construir.py
```

Arma `dist/index.html` y `docs/index.html`. GitHub Pages publica `docs/` solo al hacer push a `main`.
