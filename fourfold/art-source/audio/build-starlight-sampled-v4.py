#!/usr/bin/env python3
"""Original sampled nylon guitar / electric piano / acoustic bass score.
Requires libfluidsynth and TimGM6mb.sf2 (see music-v4-LICENSE.txt).
"""
import ctypes as C, numpy as np, subprocess, json, hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[2];SR=44100;BPM=100;BEAT=60/BPM;D=64*BEAT;N=round(D*SR)
f=C.CDLL('libfluidsynth.so.3')
def bind(name,restype,args):
 fn=getattr(f,name);fn.restype=restype;fn.argtypes=args;return fn
ptr=C.c_void_p;I=C.c_int
settings=bind('new_fluid_settings',ptr,[])()
bind('fluid_settings_setnum',I,[ptr,C.c_char_p,C.c_double])(settings,b'synth.sample-rate',SR)
bind('fluid_settings_setnum',I,[ptr,C.c_char_p,C.c_double])(settings,b'synth.gain',.65)
bind('fluid_settings_setint',I,[ptr,C.c_char_p,I])(settings,b'synth.reverb.active',0)
bind('fluid_settings_setint',I,[ptr,C.c_char_p,I])(settings,b'synth.chorus.active',0)
syn=bind('new_fluid_synth',ptr,[ptr])(settings)
assert bind('fluid_synth_sfload',I,[ptr,C.c_char_p,I])(syn,b'/usr/share/sounds/sf2/TimGM6mb.sf2',1)>=0
program=bind('fluid_synth_program_change',I,[ptr,I,I]);cc=bind('fluid_synth_cc',I,[ptr,I,I,I])
for ch,prog,vol,pan in [(0,24,95,56),(1,4,65,76),(2,32,88,64),(9,0,48,64)]:
 program(syn,ch,prog);cc(syn,ch,7,vol);cc(syn,ch,10,pan)
on=bind('fluid_synth_noteon',I,[ptr,I,I,I]);off=bind('fluid_synth_noteoff',I,[ptr,I,I])
write=bind('fluid_synth_write_float',I,[ptr,I,ptr,I,I,ptr,I,I])
events=[];rng=np.random.default_rng(37004)
def note(ch,p,beat,dur,vel):
 at=round(beat*BEAT*SR);end=round((beat+dur)*BEAT*SR)
 events.extend([(at,1,ch,p,int(vel)),(end,0,ch,p,0)])
# Am9 - Fmaj7 - Cmaj9 - G6. Restrained offbeats support a four-bar question/answer.
chords=[(45,[55,59,60,64]),(41,[57,60,64,67]),(48,[55,59,62,64]),(43,[55,59,62,64])]
phrases=[[(.5,64,.65),(1.5,67,.4),(2.25,69,.7),(3.5,67,.8)],[(.5,64,.6),(1.5,62,.6),(2.5,60,1.1)],[(.5,64,.6),(1.25,67,.6),(2.5,71,.8),(3.5,69,.5)],[(.5,67,.8),(2,62,.6),(3,64,.7)]]
for bar in range(16):
 at=bar*4;root,chord=chords[bar%4]
 for t in [.5,2.5]:
  for j,p in enumerate(chord):note(1,p,at+t+j*.018,1.15,49+j*2)
 for t,p,d in [(0,root,.8),(1.75,root+7,.4),(2.5,root+12,.5),(3.5,root+7,.35)]:note(2,p,at+t,d,68)
 for t,p,d in phrases[bar%4]:
  if bar//4==2 and t==.5:continue
  if bar//4==3 and bar%4==3 and t==3:p=60
  note(0,p,at+t,d,77+int(rng.integers(-5,6)))
 for t in [0,2.5]:note(9,36,at+t,.15,51)
 for t in [1,3]:note(9,37,at+t,.12,43)
 # Quiet shaker only on offbeats, no bright hi-hat stream.
 for t in [.55,1.55,2.55,3.55]:note(9,70,at+t,.08,23)
# Render two passes; keep second so releases at the boundary already exist.
base=events.copy();events+= [(t+N,a,ch,p,v) for t,a,ch,p,v in base];events.sort()
audio=np.zeros((2*N,2),dtype=np.float32);cursor=0
def render(end):
 global cursor
 if end<=cursor:return
 out=np.zeros((end-cursor,2),dtype=np.float32)
 write(syn,len(out),out.ctypes.data,0,2,out.ctypes.data,1,2);audio[cursor:end]=out;cursor=end
for t,a,ch,p,v in events:
 if t>=2*N:break
 render(t)
 if a:on(syn,ch,p,v)
 else:off(syn,ch,p)
render(2*N);mix=audio[N:].astype(np.float64)
# Small stereo room, preserving full-band clarity; no master low-pass.
dry=mix.copy()
for sec,g in [(.047,.08),(.083,.05),(.131,.025)]:mix+=np.roll(dry[:,::-1],round(sec*SR),axis=0)*g
mix-=mix.mean(axis=0);mix*=10**(-24/20)/np.sqrt(np.mean(mix**2));assert abs(mix).max()<.9
p=R/'assets/audio/starlight-sampled-v4.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0','-c:a','libmp3lame','-b:a','160k','-write_xing','1',str(p)],input=mix.astype('<f4').tobytes(),check=True)
data=p.read_bytes();(R/'cocos/assets/resources/audio'/p.name).write_bytes(data)
meta={'title':'星夜漫步','bpm':BPM,'durationSeconds':D,'instruments':['sampled nylon guitar','sampled electric piano','sampled acoustic bass','light percussion'],'renderer':'FluidSynth / TimGM6mb','masterLowPass':False,'rmsDbFS':-24,'peak':float(abs(mix).max()),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
Path(__file__).with_name('music-manifest-v4.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print(meta)
