"""Draw the four original vector specimen plates. Uses only the Python standard library."""
from pathlib import Path
from math import sin, cos, pi
from random import Random
out=Path(__file__).resolve().parents[1]/'public/art'
rng=Random(81)
s=[]
def path(d,fill='none',stroke='none',w=.55,op=1):
    s.append(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" opacity="{op}"/>')
def save(n):
    (out/f'{n}.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 150" stroke-linecap="round" stroke-linejoin="round">'+''.join(s)+'</svg>')
    s.clear()
def frond(start,end,bend,size):
    x,y=start; dx=end[0]-x; dy=end[1]-y; l=(dx*dx+dy*dy)**.5; nx=-dy/l; ny=dx/l
    pts=[]
    for i in range(30):
        t=i/29; cx=x+dx*t+nx*sin(t*pi)*bend; cy=y+dy*t+ny*sin(t*pi)*bend;pts.append((cx,cy))
        width=(sin(t*pi)**.8*size+1.0)*(1-.31*t)
        if i<2 or i==29:continue
        for side in [-1,1]:
            w=width*side*rng.uniform(.91,1.1)
            tipx=cx+nx*w+dx/l*width*.7; tipy=cy+ny*w+dy/l*width*.7
            midx=(cx+tipx)*.5; midy=(cy+tipy)*.5
            c=['#61824b','#7c9955','#9db965','#547849','#86a65a'][(i+side)%5]
            path(f'M{cx:.2f},{cy:.2f} Q{midx+nx*w*.2:.2f},{midy+ny*w*.2:.2f} {tipx:.2f},{tipy:.2f} Q{midx-dx/l*2:.2f},{midy-dy/l*2:.2f} {cx:.2f},{cy:.2f}',c)
            path(f'M{cx},{cy} L{tipx},{tipy}','none','#c6d58b',.34,.65)
            for j in range(1,5):
                u=j/6; a=cx+(tipx-cx)*u;b=cy+(tipy-cy)*u
                path(f'M{a},{b} l{nx*w*.17},{ny*w*.17} l{-dx/l*2.3},{-dy/l*2.3}',c,c,.5)
    path('M'+' L'.join(f'{a:.2f},{b:.2f}' for a,b in pts),'none','#a7b877',.85)
frond((82,155),(32,48),-9,13);frond((83,149),(133,15),-15,20);frond((86,151),(171,62),5,13);frond((80,156),(68,17),12,14)
save('fern')
def leaf(x,y,dx,dy,w,col):
    length=(dx*dx+dy*dy)**.5; nx=-dy/length*w;ny=dx/length*w
    path(f'M{x},{y} Q{x+dx*.36+nx},{y+dy*.36+ny} {x+dx},{y+dy} Q{x+dx*.47-nx*.6},{y+dy*.47-ny*.6} {x},{y}',col,'#95a577',.5)
    path(f'M{x},{y} L{x+dx},{y+dy}','none','#d1c6a0',.5,.68)
def flower(x,y,w,ang):
    s.append(f'<g transform="translate({x} {y}) rotate({ang}) scale({w})">')
    for i,c in enumerate(['#a85d38','#d37d48','#ed9b63','#d68455','#f0a76d','#eaa06f']):
        a=i*60+10
        s.append(f'<g transform="rotate({a})">')
        path('M0,1 C-9,-3 -23,-13 -14,-23 C-10,-29 -5,-29 0,-27 C7,-32 16,-27 16,-18 C16,-12 8,-3 0,1',c,'#f1b785',.7)
        for j in range(-3,4):
            path(f'M0,-1 Q{j*1.5},-10 {j*3.7},-23','none','#925c47',.45,.64)
        s.append('</g>')
    for j in range(34):
        a=j*2.399;r=j**.5*.91
        s.append(f'<circle cx="{cos(a)*r}" cy="{sin(a)*r*.83}" r=".97" fill="{["#e6c170","#70583d","#9a773f"][j%3]}"/>')
    s.append('</g>')
path('M101,153 Q116,99 124,48 M103,144 Q85,104 63,79 M108,123 Q132,112 152,93','none','#8b9c67',1.8)
leaf(108,117,21,-36,5,'#63764f');leaf(97,121,-29,-19,6,'#849365');leaf(118,97,16,-23,4,'#73845e')
flower(124,47,1.08,15);flower(66,79,.66,-27);flower(151,93,.53,24);save('poppy')
for x,y,ex,ey,sz in [(90,152,64,54,.65),(96,154,112,17,1),(97,154,152,58,.65)]:
    path(f'M{x},{y} Q{x+7},{y-37} {ex},{ey}','none','#8b9776',1.4)
    for k in range(3):
        t=.16+k*.11; xx=x+(ex-x)*t;yy=y+(ey-y)*t
        leaf(xx,yy,(-1)**k*(14+3*k),-14,3.6,'#73886a')
    for k in reversed(range(14)):
        t=k/13; xx=ex+(x-ex)*.49*t;yy=ey+(y-ey)*.49*t
        for j in range(4):
            a=j*1.57+k*2.4; r=(2+6*t)*sz
            cx=xx+cos(a)*r;cy=yy+sin(a)*r*.54
            s.append(f'<g transform="translate({cx} {cy}) rotate({cos(a)*35}) scale({(.56+.48*t)*sz})">')
            path('M0,3 Q-7,3 -7,-4 Q-5,-9 0,-9 Q4,-9 5,-5 Q8,-1 0,3','#9989b1','#cfbbda',.6)
            path('M0,2 Q-4,-3 -2,-7 M0,2 Q2,-4 4,-5','none','#665e88',.54)
            s.append('</g>')
save('lupine')
for j in range(38):
    a=j*2.39996;u=1-j/43
    x,y=105,129
    ex=x+cos(a)*u*84;ey=y+sin(a)*u*30-(30+53*u)*(1-.35*abs(cos(a)))
    w=(7+9*u); dx=ex-x;dy=ey-y; l=(dx*dx+dy*dy)**.5;nx=-dy/l*w;ny=dx/l*w
    col=['#6e9291','#789b90','#609087','#80a79a','#4d7772'][j%5]
    path(f'M{x},{y} Q{x+dx*.23+nx},{y+dy*.23+ny} {ex},{ey} Q{x+dx*.4-nx},{y+dy*.4-ny} {x},{y}',col,'#adc1a8',.8)
    for k in range(-2,3):
        path(f'M{x},{y} Q{x+dx*.36+nx*k*.22},{y+dy*.36+ny*k*.22} {ex},{ey}','none','#b9ccaf',.4,.67)
save('agave')
