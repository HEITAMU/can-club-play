#!/usr/bin/env python3
"""Three distinct original procedural foley cues, not real recordings."""
from pathlib import Path
import importlib.util,json,sys
import numpy as np
from scipy.signal import butter,sosfilt,iirpeak,lfilter
sys.dont_write_bytecode=True
S=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('base',S/'build-stone-audio.py');b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
SR=b.SR

def impact(d,rng,modes,attack=.001):
 t=np.arange(round(d*SR))/SR
 # Impulsive contact excites damped, inharmonic material modes; unlike v4's
 # sustained filtered noise this gives a defined contact and decaying body.
 excitation=rng.standard_normal(len(t))*np.exp(-t/.0012)
 out=np.zeros(len(t))
 for freq,q,weight in modes:
  a,c=iirpeak(freq,q,fs=SR);out+=b.normalized(lfilter(a,c,excitation))*weight
 out*=np.exp(-t/.045)*b.smoothstep(t/attack)*(1-b.smoothstep((t-d+.02)/.02))
 return out

def make(kind):
 rng=np.random.default_rng({'ui':5101,'knob':5102,'seat':5103}[kind]);d={'ui':.15,'knob':.22,'seat':.30}[kind];out=np.zeros(round(d*SR))
 if kind=='ui':
  b.add_at(out,impact(.11,rng,[(720,1.8,.6),(1430,1.5,.18)],.002),.008,.32)
 elif kind=='knob':
  modes=[(245,2.7,.38),(410,3.8,.48),(835,3.0,.19),(1760,1.5,.08)]
  b.add_at(out,impact(.15,rng,modes),.008,.6)
  b.add_at(out,impact(.105,rng,[(365,2,.4),(1060,2,.18)]),.032,.17)
 else:
  modes=[(145,2.5,.3),(275,3.4,.55),(465,3.1,.35),(930,2,.11)]
  b.add_at(out,impact(.23,rng,modes,.0015),.008,.6)
  b.add_at(out,impact(.12,rng,[(235,2,.5),(590,2.2,.23)]),.049,.11)
 # Small air/contact edge with defined decay, never a continuous noise bed.
 t=np.arange(len(out))/SR;edge=b.filtered_noise(len(t),1200,3200,rng)
 out+=edge*b.smoothstep((t-.008)/.001)*np.exp(-np.maximum(t-.008,0)/.006)*{'ui':.015,'knob':.06,'seat':.025}[kind]
 out=sosfilt(butter(2,[90,3900],btype='bandpass',fs=SR,output='sos'),out)
 return b.master(out,{'ui':-12,'knob':-5,'seat':-5.5}[kind])
records=[]
for k,n in [('ui','ui-tap-v5'),('knob','knob-click-v5'),('seat','stone-seat-v5')]: records.append(b.write_sound(n,make(k)))
(S/'manifest-v5.json').write_text(json.dumps({'version':5,'source':'Original procedural impulse-excited foley. No generated-model audio or recordings.','sounds':records},indent=2)+'\n')
print(json.dumps(records,indent=2))
