"""Build the original, tileable material and relief maps of an imaginary planet.
Optional artist tool: Python 3, numpy, scipy, Pillow. Not needed at runtime.
"""
from pathlib import Path
import numpy as np
from scipy.ndimage import map_coordinates
from PIL import Image

OUT = Path(__file__).resolve().parents[1] / 'public/atlas'
OUT.mkdir(exist_ok=True)
rng = np.random.default_rng(17041)
w, h = 1536, 768
lat, lon = np.meshgrid(np.linspace(np.pi/2, -np.pi/2, h), np.arange(w)*2*np.pi/w-np.pi, indexing='ij')
xyz = np.array([np.cos(lat)*np.sin(lon), np.sin(lat), np.cos(lat)*np.cos(lon)])
lattice = rng.standard_normal((64, 64, 64)).astype('f')

def noise(scale, offset=0):
    return map_coordinates(lattice, xyz*scale+np.array([19, 26, 30])[:,None,None]+offset,
                           order=1, mode='grid-wrap', prefilter=False)

def blend(a, b, t):
    t = np.clip(t, 0, 1)[..., None]
    return np.array(a)*(1-t)+np.array(b)*t

broad = noise(1.26, .7)*.51 + noise(2.7, 6)*.34 + noise(5.2, 10)*.16
small = noise(12, 13)*.09 + noise(30, 7)*.045 + noise(77)*.021
land = broad+small+.13
ridges = (1-np.minimum(1, np.abs(noise(4.1, 2)+noise(12)*.27+noise(33)*.10)))**3
mass = np.clip((land-.015)*2.8, 0, 1)
height = np.maximum(0, (.004+.021*mass+.089*ridges*mass+.013*noise(18)*mass+.005*noise(63)*mass)
                    *np.clip(land*36,0,1))
moist = noise(2.2, 14)*.66+noise(7.7,11)*.3
warm = noise(1.7, 1.9)*.53+noise(4.3,19)*.24 + xyz[0]*.17
stone = np.clip((height-.035)*15 + np.maximum(0, warm-.48)*1.3,0,1)
# Drowned shelves fade from blue-black depths to turquoise water and pale sand.
sea = blend([10,39,48],[45,111,105],np.exp(np.minimum(0,land)*6)*.84)
coast = np.exp(-np.abs(land)*95)
sea = blend(sea,[123,170,137],coast*.65)
green = blend([59,99,51],[141,151,69],np.clip(.35-moist*.8+noise(22)*.17,0,1))
green = blend(green,[143,139,80],np.clip(warm*.8,0,.7))
green = blend(green,[202,189,132],np.exp(-np.maximum(0,land)*52)*.77)
rock = blend([108,100,78],[191,183,147],ridges*.64+noise(35)*.14)
green = blend(green,rock,stone)
green = blend(green,[213,214,185],np.clip((height-.088)*20,0,.83))
color = np.where((land>0)[...,None],green,sea)
# Local relief shading stays attached to the terrain as the planet rotates.
dlon = (np.roll(height,-1,axis=1)-np.roll(height,1,axis=1))/(2*2*np.pi/w*np.maximum(.16,np.cos(lat)))
dlat = -np.gradient(height,axis=0)*h/np.pi
shade = np.clip((-.59*dlon+.66*dlat+1)/np.sqrt(1+dlon**2+dlat**2),-.6,1)
grain = noise(95)*5+noise(250)*4+rng.uniform(-2.3,2.3,(h,w))
color *= np.where(land>0, .75+.32*shade, 1)[...,None]
color += grain[...,None]*np.where(land>0,1,.31)[...,None]
Image.fromarray(np.uint8(np.clip(color,0,255))).save(OUT/'surface.webp', quality=92, method=5)
forest = np.clip(.68+moist*.6-warm*.17-stone*.95,0,1)*np.clip(land*38,0,1)
# Green = growth density, blue = flowering-patch selector, alpha unused.
biome = np.clip(.50+.37*noise(2.0,5.1)+.18*noise(6.4,14),0,1)
meta = np.uint8(np.clip(np.stack([height/.16,forest,biome],axis=-1),0,1)*255)
Image.fromarray(meta).save(OUT/'relief.png',optimize=True)
