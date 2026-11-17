import random, sys
def ruta(seed, H, borde, suelo, pasto, obst, agua=None, deco=None, W=22, puentes='h'):
    r = random.Random(seed)
    g = [[suelo]*W for _ in range(H)]
    for y in range(H):
        for x in (0,1,W-2,W-1): g[y][x]=borde
    for x in range(W): g[0][x]=borde; g[H-1][x]=borde
    g[0][10]=g[0][11]=g[H-1][10]=g[H-1][11]='='
    # path breakpoints
    ys = sorted(r.sample(range(4, H-4), 4))
    ys = [y for i,y in enumerate(ys) if i==0 or y-ys[i-1]>=4]
    xs=[10]
    for _ in ys: xs.append(r.choice([3,4,5,6,13,14,15,16]) if xs[-1]==10 else 10)
    xs[-1]=10 if len(xs)>1 else 10
    # segments from bottom (H-1) to top (0)
    bps = [H-1] + sorted(ys, reverse=True) + [0]
    path=set()
    cx = 10
    segs=[]
    for i in range(len(bps)-1):
        y0, y1 = bps[i], bps[i+1]
        x = xs[i] if i < len(xs) else 10
        if i==len(bps)-2: x=10
        segs.append((x,y1,y0))
    for i,(x,y1,y0) in enumerate(segs):
        for y in range(y1, y0+1):
            path.add((x,y)); path.add((x+1,y))
        if i+1 < len(segs):
            nx = segs[i+1][0]
            for xx in range(min(x,nx), max(x,nx)+2): path.add((xx,y1))
    # water band
    if agua:
        cand=[y for y in range(5,H-5) if all(((x,y) in path)==((x,y-0) in path) for x in range(2,W-2))]
        for _ in range(50):
            y=r.randrange(5,H-6)
            row=[x for x in range(2,W-2) if (x,y) in path]; row2=[x for x in range(2,W-2) if (x,y+1) in path]
            if len(row)==2 and row==row2 and all((x,y-1) not in path or x in row for x in range(2,W-2)) and all((x,y+2) not in path or x in row for x in range(2,W-2)):
                for yy in (y,y+1):
                    for x in range(2,W-2): g[yy][x]= puentes if (x,yy) in path else agua
                break
    # grass patches
    for _ in range(int(H*0.5)):
        w=r.randint(3,6); h=r.randint(2,3); x=r.randint(2,W-2-w); y=r.randint(1,H-1-h)
        for yy in range(y,y+h):
            for xx in range(x,x+w):
                if g[yy][xx]==suelo and (xx,yy) not in path: g[yy][xx]=pasto
    # obstacles 2x2
    for _ in range(int(H*0.35)):
        x=r.randint(2,W-4); y=r.randint(2,H-4); o=r.choice(obst)
        cells=[(x,y),(x+1,y),(x,y+1),(x+1,y+1)]
        if all(g[yy][xx] in (suelo,pasto) and (xx,yy) not in path and all((xx+dx,yy+dy) not in path for dx in (-1,0,1) for dy in (-1,0,1)) for xx,yy in cells):
            for xx,yy in cells: g[yy][xx]=o
    # single deco
    if deco:
        for _ in range(int(H*0.4)):
            x=r.randint(2,W-3); y=r.randint(1,H-2)
            if g[y][x]==suelo and (x,y) not in path and all((x+dx,y+dy) not in path for dx in (-1,0,1) for dy in (-1,0,1)): g[y][x]=r.choice(deco)
    for (x,y) in path:
        if g[y][x] not in ('h',): g[y][x]='='
    # signs: near path at ~ y=3 and y=H-4
    signs=[]
    for ty in (H-4, 3):
        for x in range(2,W-2):
            if g[ty][x]==suelo or g[ty][x]==pasto:
                if (x-1,ty) in path or (x+1,ty) in path:
                    g[ty][x]='S'; signs.append((x,ty)); break
    return [''.join(row) for row in g], signs
