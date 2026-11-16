#!/usr/bin/env python3
"""Arma dist/index.html (un solo archivo para subir a Netlify).

- Junta plantilla.html con los scripts de js/.
- Convierte los dibujos de img/*.png en js/imagenes.js (data URLs).
  Nombre del archivo = id de la especie (ej: piquibrote.png).
  Opcional: <id>_espalda.png para la vista de espalda.
"""
import base64, json, os, re

RAIZ = os.path.dirname(os.path.abspath(__file__))
ORDEN = ['sprites.js', 'imagenes.js', 'datos.js', 'mapas.js', 'juego.js']


def generar_imagenes():
    carpeta = os.path.join(RAIZ, 'img')
    imgs = {}
    if os.path.isdir(carpeta):
        for f in sorted(os.listdir(carpeta)):
            if f.lower().endswith('.png'):
                with open(os.path.join(carpeta, f), 'rb') as fh:
                    imgs[f[:-4]] = 'data:image/png;base64,' + base64.b64encode(fh.read()).decode()
    cuerpo = ',\n'.join(f'  {json.dumps(k)}: {json.dumps(v)}' for k, v in imgs.items())
    with open(os.path.join(RAIZ, 'js', 'imagenes.js'), 'w', encoding='utf-8') as fh:
        fh.write("'use strict';\n// Generado por construir.py a partir de img/. No editar a mano.\n")
        fh.write('const IMAGENES = {\n' + cuerpo + ('\n' if imgs else '') + '};\n')
    return len(imgs)


def construir():
    n = generar_imagenes()
    with open(os.path.join(RAIZ, 'plantilla.html'), encoding='utf-8') as fh:
        html = fh.read()
    bloques = []
    for nombre in ORDEN:
        with open(os.path.join(RAIZ, 'js', nombre), encoding='utf-8') as fh:
            bloques.append(f'<script>\n// ===== {nombre} =====\n{fh.read()}</script>\n')
    html = re.sub(r'(<!--JS:[\w.]+-->\n)+', lambda m: ''.join(bloques), html, count=1)
    os.makedirs(os.path.join(RAIZ, 'dist'), exist_ok=True)
    salida = os.path.join(RAIZ, 'dist', 'index.html')
    with open(salida, 'w', encoding='utf-8') as fh:
        fh.write(html)
    # Copia para GitHub Pages (Settings → Pages → rama main, carpeta /docs)
    os.makedirs(os.path.join(RAIZ, 'docs'), exist_ok=True)
    with open(os.path.join(RAIZ, 'docs', 'index.html'), 'w', encoding='utf-8') as fh:
        fh.write(html)
    open(os.path.join(RAIZ, 'docs', '.nojekyll'), 'w').close()
    print(f'Listo: dist/index.html ({len(html) // 1024} KB, {n} dibujos)')


if __name__ == '__main__':
    construir()
