# Criaturas Criollas

Juego estilo GBA 2D de criaturas argentinas, diseñado por Felipe.

Jugar: https://infopolyartesanal-sudo.github.io/criaturascriollas/ (GitHub Pages)

Antes: https://criaturascriollas.netlify.app

## Cómo está armado

- `plantilla.html`: la página (estilos, pantalla y botones táctiles).
- `js/sprites.js`: motor de pixel-art, personajes, baldosas y edificios.
- `js/datos.js`: los 18 tipos, movimientos, objetos y especies.
- `js/mapas.js`: todos los lugares e historia. Recorrido: Pueblo Tero → Llanura Pampeana → Villa Serrana (Córdoba) → Sierras → Travesía → Valle Fértil (Gimnasio 1, Psíquico) → Talampaya → Valles Calchaquíes → Tafí del Valle (Gimnasio 2, Roca, en la cueva La Salamanca) → Yungas → Calilegua (desvío al norte: Quebrada, Tilcara, Salinas Grandes, Susques) → El Impenetrable → Esteros del Iberá → Villa Camalote → Selva Misionera → Minas de Wanda → Puerto Wanda (Gimnasio 3, Planta) → Caldenal Pampeano → Estepa Patagónica → Bariloche (Gimnasio 4, Hielo) → Bosque Andino → El Bolsón → Línea Sur → Ingeniero Jacobacci → Meseta de Somuncurá → Paraje Somuncurá (Gimnasio 5, Fantasma/Siniestro, a oscuras) → Península Valdés → Puerto Madryn → Costa de Santa Cruz → Río Gallegos → Estrecho de Magallanes → Ushuaia (Gimnasio 6, Agua).
- El viaje sigue la forma de Argentina: Córdoba → San Juan al OESTE, San Juan → Jujuy al NORTE, Jujuy → Chaco al ESTE, Chaco → Iberá BAJANDO, Iberá → Misiones al ESTE, de Misiones a Bariloche se BAJA, de Bariloche a El Bolsón se BAJA de El Bolsón a Somuncurá se va al ESTE y de Somuncurá a Ushuaia se BAJA por la costa (el mar queda al este). Las rutas se dibujan siempre "de abajo hacia arriba" y al final de `js/mapas.js` (`girarMapa`) se giran; ahí también se abren los costados de los pueblos (`abrir`, `moverSalidas`).
- Cada pueblo tiene un CEMIC (`crearCentro`), donde curan a las criaturas.
- Gimnasios 1 a 4: el líder lleva 5 criaturas. Gimnasios 5 a 8: 6 criaturas.

## Cómo agregar un lugar nuevo

1. En `js/mapas.js`, dibujá la grilla con letras (una fila por línea, todas del mismo largo):
   `T` árbol · `.` pasto · `,` pasto alto (criaturas salvajes) · `=` camino · `~` agua · `j` juncos · `h` puente · `S` cartel · `F` flores.
   Interiores: `#` pared · `_` piso · `v` piso violeta · `m` alfombra de salida · `g` esfera.
   Selva y cueva: `Y` árbol de selva · `q` tierra colorada · `R` roca · `:` piso de cueva (con `cueva: true` salen criaturas) · `a` amatistas.
   Norte: `-` arena · `u` paja brava (con criaturas) · `C` cerros de colores · `K` cardón.
2. Para rutas nuevas podés usar `tools/gen.py` (genera la grilla). Agregá una entrada en `MAPAS` con `nombre`, `grilla`, `edificios`, `salidas`, `carteles`, `encuentros` y `npcs`.
3. Conectalo: una `salida` es una baldosa que te lleva a otro mapa (`a`, `ax`, `ay`, `dir`). Hace falta una de ida y otra de vuelta.
4. Entrenadores: `entrenadorNPC({...})` pelea una sola vez y recuerda que le ganaste.
5. Criaturas nuevas van en `js/datos.js` (`ESPECIES`), y su dibujo en `img/<id>.png`.
- `js/musica.js`: música original de 8 bits hecha con Web Audio (temas RUTA, BATALLA y GIMNASIO). Se puede apagar desde el menú (MÚSICA: SÍ/NO).
- `js/juego.js`: motor del juego (mundo, diálogos, menús, batallas, evolución, guardado).
- `img/`: dibujos de Felipe pasados a pixel-art (`<id>.png`, opcional `<id>_espalda.png`).
  Si una especie tiene dibujo, el juego usa ese; si no, usa el sprite hecho con figuras.

## Publicar

```
python3 construir.py
```

Arma `dist/index.html` y `docs/index.html`. GitHub Pages publica `docs/` solo al hacer push a `main`.

## Movimientos: NIVEL y TUTOR

Menú → Equipo → criatura → MOVIMIENTOS.
- NIVEL: los movimientos que la criatura (o sus formas anteriores) ya aprendió por nivel. Se vuelven a enseñar gratis.
- TUTOR (también gratis): los que aprendería más adelante por nivel + los extra de la tabla `TUTOR` en `js/datos.js`, que elige Felipe. Formato: `idEspecie: ['idMovimiento', ...]`.
