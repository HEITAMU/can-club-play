#!/usr/bin/env python3
"""Original 40-second circular score: 48 BPM, 8 bars, warm keys and soft pad."""
from pathlib import Path
import numpy as np
from scipy.signal import butter,sosfilt
import subprocess,json,hashlib
R=Path(__file__).resolve().parents[2];SR=44100;D=40;N=SR*D
rng=np.random.default_rng(33001);mix=np.zeros(N)
def hz(m):return 440*2**((m-69)/12)
def put(s,at,g):
 idx=(round(at*SR)+np.arange(len(s)))%N
 np.add.at(mix,idx,s*g)
def key(m,d=4):
 t=np.arange(round(d*SR))/SR;f=hz(m)
 # Soft struck tine: rapidly decaying upper modes above a warm sustained body.
 s=np.sin(2*np.pi*f*t+.65*np.exp(-t/.22)*np.sin(2*np.pi*f*2*t))*np.exp(-t/1.5)
 s+=.16*np.sin(2*np.pi*f*3.01*t)*np.exp(-t/.35)
 s+=.04*np.sin(2*np.pi*f*6.07*t)*np.exp(-t/.08)
 s*=np.minimum(t/.007,1)*(1-np.clip((t-d+.3)/.3,0,1))
 return s
chords=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,57,62],[40,47,55,62],[45,52,59,60],[41,50,57,60],[43,50,55,59]]
melodies=[[76,79,74],[72,76,71],[69,72,76],[74,71,67],[71,74,79],[76,72,71],[69,74,72],[71,67,74]]
for bar,chord in enumerate(chords):
 at=bar*5
 for j,m in enumerate(chord):
  t=np.arange(round(6.8*SR))/SR;f=hz(m)
  pad=(np.sin(2*np.pi*f*t)+.35*np.sin(2*np.pi*(f*1.0017)*t+.8)+.12*np.sin(4*np.pi*f*t))
  env=np.sin(np.pi*np.clip(t/6.8,0,1))**2
  put(pad*env,at-.9,.022)
  put(key(m+12,4.8),at+[0,1.25,2.5,3.75][j],.025 if j else .035)
 for j,m in enumerate(melodies[bar]):put(key(m),at+[.625,2.5,4.375][j],.041 if j!=1 else .033)
# Circular, quiet diffuse echoes retain tails across the loop boundary.
dry=mix.copy()
for delay,gain in [(.173,.13),(.291,.10),(.427,.07),(.613,.045)]:mix+=np.roll(dry,round(delay*SR))*gain
mix=sosfilt(butter(2,4200,fs=SR,output='sos'),mix)
mix-=mix.mean();mix*=10**(-27/20)/np.sqrt(np.mean(mix*mix))
# Circular construction; smooth the tiny filter initial-condition seam.
e=round(.005*SR);join=(mix[0]+mix[-1])/2
mix[:e]=join+(mix[:e]-join)*np.linspace(0,1,e);mix[-e:]=join+(mix[-e:]-join)*np.linspace(1,0,e)
assert np.max(np.abs(mix))<.4
path=R/'assets/audio/starlight-loop-v1.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','64k','-write_xing','1',str(path)],input=mix.astype('<f4').tobytes(),check=True)
data=path.read_bytes();(R/'cocos/assets/resources/audio'/path.name).write_bytes(data)
meta={'title':'星图微光','origin':'Original procedural composition and synthesis','durationSeconds':D,'bpm':48,'bars':8,'masterRmsDbFS':-27,'mp3Bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'seed':33001}
(Path(__file__).parent/'music-manifest-v1.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print(meta)
