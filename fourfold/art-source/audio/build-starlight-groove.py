#!/usr/bin/env python3
"""Original looping hook with plucked keys, syncopated bass and soft drums."""
from pathlib import Path
import numpy as np
from scipy.signal import butter,sosfilt
import subprocess,json,hashlib
R=Path(__file__).resolve().parents[2]; SR=44100; BPM=108; B=60/BPM; N=round(64*B*SR)
rng=np.random.default_rng(34002); mix=np.zeros(N)
def hz(m):return 440*2**((m-69)/12)
def put(s,beat,g):np.add.at(mix,(round(beat*B*SR)+np.arange(len(s)))%N,s*g)
def pluck(m,d=.65):
 t=np.arange(round(d*SR))/SR; f=hz(m)
 s=np.sin(2*np.pi*f*t+.8*np.sin(2*np.pi*2*f*t)*np.exp(-t/.07))+.13*np.sin(2*np.pi*3*f*t)*np.exp(-t/.05)
 return s*np.minimum(t/.003,1)*np.exp(-t/.16)*np.minimum((d-t)/.025,1)
def bass(m):
 t=np.arange(round(.32*SR))/SR; f=hz(m)
 return (np.sin(2*np.pi*f*t)+.23*np.sin(4*np.pi*f*t))*np.minimum(t/.008,1)*np.exp(-t/.16)*np.minimum((.32-t)/.04,1)
def kick():
 t=np.arange(round(.22*SR))/SR
 return np.sin(2*np.pi*(48*t+4*(1-np.exp(-t/.025))))*np.minimum(t/.002,1)*np.exp(-t/.055)
def tick(d,f):
 t=np.arange(round(d*SR))/SR
 noise=sosfilt(butter(2,f,fs=SR,btype='highpass',output='sos'),rng.normal(size=len(t)))
 return noise*np.minimum(t/.002,1)*np.exp(-t/(d/5))*np.minimum((d-t)/.01,1)
# Two-bar hook returns four times per eight bars; final phrase answers the hook.
hook=[(0,76),(.75,79),(1.5,81),(2.5,79),(3,76),(3.5,74),(4,76),(4.75,79),(5.5,81),(6.5,83),(7,79)]
chords=[(45,[69,72,76]),(41,[69,72,77]),(48,[67,72,76]),(43,[67,71,74])]
for bar in range(16):
 root,chord=chords[(bar//2)%4]; at=bar*4
 for beat in [0,2]:put(kick(),at+beat,.12)
 for beat in [1,3]:put(tick(.10,1300),at+beat,.037)
 for j in range(8):put(tick(.035,6500),at+j*.5,.012 if j%2 else .008)
 for beat,m in [(0,root),(.75,root),(1.5,root+12),(2.5,root),(3.5,root+7)]:put(bass(m),at+beat,.083)
 for beat in [.5,2,3]:
  for m in chord:put(pluck(m,.45),at+beat,.019)
for phrase in range(8):
 for beat,m in hook:
  if phrase%4==3 and beat>=6.5:m={83:74,79:76}[m]
  put(pluck(m),phrase*8+beat,.105)
  put(pluck(m),phrase*8+beat+.75,.014)
# Quiet room reflections, circular so the repeating groove retains its tails.
dry=mix.copy()
for delay,g in [(.071,.07),(.137,.05),(.213,.025)]:mix+=np.roll(dry,round(delay*SR))*g
mix=np.tanh(mix*1.2)/1.2;mix-=mix.mean();mix*=10**(-23/20)/np.sqrt(np.mean(mix*mix))
assert np.max(np.abs(mix))<.85
p=R/'assets/audio/starlight-groove-v2.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','96k','-write_xing','1',str(p)],input=mix.astype('<f4').tobytes(),check=True)
data=p.read_bytes();(R/'cocos/assets/resources/audio'/p.name).write_bytes(data)
meta={'title':'星图回环','origin':'Original procedural composition and synthesis','bpm':BPM,'bars':16,'durationSeconds':N/SR,'rmsDbFS':-23,'peak':float(abs(mix).max()),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
Path(__file__).with_name('music-manifest-v2.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print(meta)
