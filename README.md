# Criaturas Criollas

Juego estilo GBA 2D de criaturas argentinas, diseñado por Felipe.

Jugar: https://criaturascriollas.netlify.app

## Cómo está armado

- `plantilla.html`: la página (estilos, pantalla y botones táctiles).
- `js/sprites.js`: motor de pixel-art, personajes, baldosas y edificios.
- `js/datos.js`: los 18 tipos, movimientos, objetos y especies.
- `js/mapas.js`: Pueblo Tero, Ruta 1, casa, laboratorio e historia.
- `js/juego.js`: motor del juego (mundo, diálogos, menús, batallas, evolución, guardado).
- `img/`: dibujos de Felipe pasados a pixel-art (`<id>.png`, opcional `<id>_espalda.png`).
  Si una especie tiene dibujo, el juego usa ese; si no, usa el sprite hecho con figuras.

## Publicar

```
python3 construir.py
```

Arma `dist/index.html`. En Netlify: **Deploys** → arrastrar ese archivo.
