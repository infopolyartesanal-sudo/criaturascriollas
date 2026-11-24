# Genera las grillas de los CAMINOS A LOS TEMPLOS: se entra por abajo (x=10,11) y el templo está arriba.
# El templo es un edificio de 6x4 en x=8..13, y=2..5, con la puerta en (10,5).
import random, json, sys
def camino_templo(seed, borde, suelo, pasto, obst, camino, W=22, H=26):
    r = random.Random(seed)
    g = [[suelo]*W for _ in range(H)]
    for y in range(H):
        for x in (0, 1, W-2, W-1): g[y][x] = borde
    for x in range(W): g[0][x] = borde; g[1][x] = borde; g[H-1][x] = borde
    path = set()
    x = 10; y = H-1
    for yy in (H-6, H-11, H-16, 9):
        nx = r.choice([4, 5, 15, 16]) if x == 10 else 10
        if yy == 9: nx = 10
        for k in range(yy, y+1): path.add((x, k)); path.add((x+1, k))
        for k in range(min(x, nx), max(x, nx)+2): path.add((k, yy)); path.add((k, yy-1))
        x = nx; y = yy
    for k in range(5, 10): path.add((10, k)); path.add((11, k))
    plaza = {(a, b) for a in range(6, 16) for b in range(6, 9)}
    templo = {(a, b) for a in range(7, 15) for b in range(1, 6)}
    for _ in range(16):
        w = r.randint(3, 6); h = r.randint(2, 3); xx = r.randint(2, W-2-w); yy = r.randint(9, H-2-h)
        for a in range(yy, yy+h):
            for b in range(xx, xx+w):
                if g[a][b] == suelo and (b, a) not in path: g[a][b] = pasto
    for _ in range(12):
        xx = r.randint(2, W-4); yy = r.randint(2, H-4); o = r.choice(obst)
        cells = [(xx, yy), (xx+1, yy), (xx, yy+1), (xx+1, yy+1)]
        if all(g[b][a] in (suelo, pasto) and (a, b) not in plaza and (a, b) not in templo and all((a+dx, b+dy) not in path for dx in (-1, 0, 1) for dy in (-1, 0, 1)) for a, b in cells):
            for a, b in cells: g[b][a] = o
    for (a, b) in path: g[b][a] = camino
    for a in range(8, 14):
        for b in range(2, 6): g[b][a] = borde
    g[5][10] = camino
    return g
specs = {
  'mente':    dict(seed=21, borde='R', suelo='.', pasto=',', obst=['R', 'T'], camino='='),
  'alma':     dict(seed=22, borde='Y', suelo='.', pasto=',', obst=['Y'], camino='='),
  'poder':    dict(seed=23, borde='Y', suelo='.', pasto=',', obst=['Y'], camino='q'),
  'realidad': dict(seed=24, borde='T', suelo='-', pasto=',', obst=['T'], camino='='),
  'espacio':  dict(seed=25, borde='T', suelo='.', pasto=',', obst=['T'], camino='='),
  'tiempo':   dict(seed=26, borde='R', suelo='-', pasto='u', obst=['R'], camino='='),
}
out = ['const TEMPLOS_GRILLAS = {']
for k, s in specs.items():
    g = camino_templo(**s)
    out.append('  %s: [\n%s\n  ],' % (k, '\n'.join("    '%s'," % ''.join(r) for r in g)))
out.append('};')
print('\n'.join(out))
