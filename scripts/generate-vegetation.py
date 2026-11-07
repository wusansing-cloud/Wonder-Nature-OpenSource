"""Original miniature botanical billboards, generated from 3D branch/crown clusters."""
from pathlib import Path
from PIL import Image, ImageDraw
import random, math
rng=random.Random(5107)
out=Path(__file__).resolve().parents[1]/'public/atlas'
S=96
atlas=Image.new('RGBA',(S*8,S*2))
colors=[(88,127,55),(124,147,65),(52,107,73),(214,140,148),(184,157,197),(196,163,78),(111,147,104),(68,106,65)]
for typ,base in enumerate(colors):
    # All coordinates are local to the root, height axis is y.
    spheres=[]; branches=[]
    for j in range(25 if typ!=7 else 34):
        angle=j*2.39996 + rng.uniform(-.3,.3)
        level=rng.uniform(.24,.95)
        spread=(math.sin(level*math.pi)*.27 if typ!=7 else (1-level)*.31)*rng.uniform(.35,1)
        x,z=math.sin(angle)*spread,math.cos(angle)*spread
        y=level*(1 if typ==7 else .78)+(.13 if typ!=7 else 0)
        r=rng.uniform(.075,.165)*(1 if typ!=7 else 1-level*.7)
        branches.append(((0, y*.45,0),(x,y,z)))
        spheres.append((x,y,z,r, rng.uniform(.76,1.17)))
    for row,tilt in enumerate([.86,.24]):
        im=Image.new('RGBA',(S,S)); d=ImageDraw.Draw(im)
        sn,cs=math.sin(tilt),math.cos(tilt)
        def pos(x,y,z):
            return (S*.5+x*S*.89, S*.89-(y*cs-z*sn)*S*.79)
        for a,b in branches:
            d.line([pos(*a),pos(*b)],fill=(83,68,46,255),width=2)
        for x,y,z,r,tone in sorted(spheres,key=lambda c:c[2]*cs+c[1]*sn):
            cx,cy=pos(x,y,z); rad=r*S*.9
            for k in range(8):
                f=k/8; rr=rad*(1-.8*f)
                dx,dy=-rad*.19*f,-rad*.40*f
                val=tone*(.58+.46*f+y*.10)
                color=tuple(min(255,int(c*val)) for c in base)+(255,)
                d.ellipse([cx+dx-rr,cy+dy-rr*.85,cx+dx+rr,cy+dy+rr*.85],fill=color)
            for k in range(18):
                theta=rng.random()*6.283; rho=rng.random()**.5*rad
                lx,ly=math.cos(theta)*rho,math.sin(theta)*rho*.77
                val=tone*(.75+.35*rng.random()-.17*(ly+lx*.5)/rad)
                c=tuple(min(255,int(v*val)) for v in base)+(250,)
                d.line([(cx+lx,cy+ly),(cx+lx+1.4,cy+ly-.7)],fill=c,width=1)
        atlas.paste(im,(typ*S,row*S))
atlas.save(out/'vegetation.webp',lossless=True,method=6)
