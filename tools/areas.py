import random, json
def area(seed, borde, suelo, pasto, obst, camino, W=22, H=24, agua=None, deco=None, lago=False):
    r = random.Random(seed)
    g = [[suelo]*W for _ in range(H)]
    for y in range(H):
        for x in (0,1,W-2,W-1): g[y][x]=borde
    for x in range(W): g[0][x]=borde; g[H-1][x]=borde; g[H-2][x]=borde
    path=set()
    # camino: baja serpenteando de arriba (x=10,11) hasta el claro del fondo
    x=10; y=0
    tramos=[(10,0)]
    ys=[5,10,15]
    for yy in ys:
        nx=r.choice([4,5,15,16]) if x==10 else 10
        for k in range(y,yy+1): path.add((x,k)); path.add((x+1,k))
        for k in range(min(x,nx),max(x,nx)+2): path.add((k,yy)); path.add((k,yy+1))
        x=nx; y=yy
    for k in range(y,H-5): path.add((x,k)); path.add((x+1,k))
    for k in range(min(x,10),max(x,10)+2): path.add((k,H-5))
    # claro del fondo
    for yy in range(H-7,H-3):
        for xx in range(6,16): g[yy][xx]=suelo
    if lago:
        for yy in range(H-5,H-2):
            for xx in range(2,W-2): g[yy][xx]='~'
        g[H-2]=[borde]*W
    for _ in range(14):
        w=r.randint(3,6); h=r.randint(2,3); xx=r.randint(2,W-2-w); yy=r.randint(1,H-8-h)
        for a in range(yy,yy+h):
            for b in range(xx,xx+w):
                if g[a][b]==suelo and (b,a) not in path: g[a][b]=pasto
    for _ in range(9):
        xx=r.randint(2,W-4); yy=r.randint(2,H-9); o=r.choice(obst)
        cells=[(xx,yy),(xx+1,yy),(xx,yy+1),(xx+1,yy+1)]
        if all(g[b][a] in (suelo,pasto) and all((a+dx,b+dy) not in path for dx in (-1,0,1) for dy in (-1,0,1)) for a,b in cells):
            for a,b in cells: g[b][a]=o
    if agua:
        for yy in range(3,H-9):
            pass
    if deco:
        for _ in range(8):
            xx=r.randint(2,W-3); yy=r.randint(1,H-8)
            if g[yy][xx]==suelo and all((xx+dx,yy+dy) not in path for dx in (-1,0,1) for dy in (-1,0,1)): g[yy][xx]=r.choice(deco)
    for (a,b) in path:
        if 0<=b<H: g[b][a]=camino
    g[0][10]=g[0][11]=camino
    return g
def girar(g, lado):
    H=len(g); W=len(g[0])
    if lado=='N': return g
    if lado=='S': return [row[::-1] for row in g[::-1]]
    if lado=='E': # arriba pasa a ser el este: nueva(x,y) = vieja(y, W-1-x)?  -> rotar 90 horario
        return [[g[H-1-x][y] for x in range(H)] for y in range(W)][::1] if False else [list(r) for r in zip(*g[::-1])]
    if lado=='O':
        return [list(r) for r in zip(*g)][::-1]
specs = {
 'quebrada': dict(seed=11, borde='R', suelo='.', pasto=',', obst=['R','T'], camino='=', deco=['F'], lado='N'),
 'quilmes':  dict(seed=12, borde='C', suelo='-', pasto='u', obst=['R','K','C'], camino='=', deco=['K'], lado='O'),
 'mocona':   dict(seed=13, borde='Y', suelo='.', pasto=',', obst=['Y'], camino='q', deco=['F'], lado='N', lago=True),
 'nahuel':   dict(seed=14, borde='T', suelo='.', pasto=',', obst=['T'], camino='=', deco=['F'], lado='E', lago=True),
 'glaciar':  dict(seed=15, borde='N', suelo='w', pasto='u', obst=['N'], camino='=', lado='E'),
 'pomez':    dict(seed=16, borde='C', suelo='-', pasto='u', obst=['R','C'], camino='=', deco=['K'], lado='S'),
}
out={}
for k,s in specs.items():
    lado=s.pop('lado'); g=girar(area(**s), lado); s=specs[k]
    H=len(g); W=len(g[0]); cam=s['camino']
    ent=[(x,y) for y in range(H) for x in range(W) if g[y][x]==cam and (x in (0,W-1) or y in (0,H-1))]
    from collections import deque
    pis=set(s['suelo']+s['pasto']+cam+'F')
    dist={ent[0]:0}; q=deque([ent[0]])
    while q:
        x,y=q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+dx,y+dy)
            if 0<=n[0]<W and 0<=n[1]<H and n not in dist and g[n[1]][n[0]] in pis: dist[n]=dist[(x,y)]+1; q.append(n)
    camino=[c for c in dist if g[c[1]][c[0]]==cam]
    fondo=max(camino,key=lambda c:dist[c])
    # lugares para NPCs: piso (no camino) pegado al camino, ordenados por distancia
    lug=[c for c in dist if g[c[1]][c[0]]==s['suelo'] and any((c[0]+dx,c[1]+dy) in camino for dx,dy in ((1,0),(-1,0),(0,1),(0,-1))) and dist[c]>3]
    lug.sort(key=lambda c:dist[c])
    elegidos=[]
    for f in (0.2,0.45,0.7,0.95):
        c=lug[min(len(lug)-1,int(len(lug)*f))]
        elegidos.append(c)
    out[k]=dict(lado=lado, filas=[''.join(r) for r in g], entrada=ent, fondo=fondo, lugares=elegidos, alcanzable=len(dist))
json.dump(out, open('areas.json','w'), indent=0)
for k,v in out.items():
    print(k, v['lado'], len(v['filas'][0]),'x',len(v['filas']), v['entrada'], v['fondo'], v['lugares'])
    print('\n'.join(v['filas']))
