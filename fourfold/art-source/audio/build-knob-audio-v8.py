#!/usr/bin/env python3
"""Original procedural rotary detent foley. Rebuilds the knob only."""
from pathlib import Path
import importlib.util,json,sys
import numpy as np
from scipy.signal import butter,sosfilt,iirpeak,lfilter,resample_poly
sys.dont_write_bytecode=True
S=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('base',S/'build-stone-audio.py')
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
SR=b.SR

def detent(rng, pitch=1):
    t=np.arange(round(.083*SR))/SR
    # A sprung pawl hitting an enclosed rotor: one rounded housing knock plus
    # the much shorter, higher contact edge. Low-Q modes avoid a musical bell.
    excitation=rng.standard_normal(len(t))*np.exp(-t/.00065)
    body=np.zeros(len(t))
    for f,q,gain in [(320,2.4,.42),(645,3.2,.35),(1330,2.7,.16),(2640,1.7,.045)]:
        num,den=iirpeak(f*pitch,q,fs=SR)
        body+=b.normalized(lfilter(num,den,excitation))*gain
    body*=np.exp(-t/.016)*b.smoothstep(t/.0008)
    body*=1-b.smoothstep((t-.058)/.025)
    # A small spring returning against the next flank, not a second UI beep.
    rebound=b.filtered_noise(len(t),850,2900,rng)
    rt=np.maximum(t-.009,0)
    rebound*=b.smoothstep((t-.009)/.0012)*np.exp(-rt/.0028)
    return body+.035*rebound

rng=np.random.default_rng(6101)
out=np.zeros(round(.250*SR))
# One contact marks the knob activation;
# the final notch seats firmly. All sound decays before the separate tile cue.
for at,gain,pitch in [(.009,1.0,.94)]:
    b.add_at(out,detent(rng,pitch),at,gain)
# Low-level shaft resistance bridges the notches, below the contact heads.
t=np.arange(len(out))/SR
friction=b.filtered_noise(len(t),300,1250,rng)
env=b.smoothstep((t-.012)/.012)*(1-b.smoothstep((t-.135)/.025))
out+=friction*env*0
signal=b.master(out,-6.0)
record=b.write_sound('rotary-detent-v8',signal)
decoded=np.frombuffer(b.run(['ffmpeg','-v','error','-i',str(b.WEB/'rotary-detent-v8.mp3'),'-f','f32le','-ar',str(SR),'-ac','1','pipe:1']),dtype='<f4')
record['truePeakDbFS']=float(20*np.log10(np.max(np.abs(resample_poly(decoded,4,1)))))
record['detentOnsetsMs']=[9]
assert record['truePeakDbFS'] < -4.5
# Each designed notch has signal; the sample must end well before 600ms landing.
for start,end in [(.009,.065)]:
    assert b.rms(decoded[round(start*SR):round(end*SR)])>.005
assert len(decoded)==12000
(S/'manifest-v8.json').write_text(json.dumps({'version':8,'source':'Original deterministic procedural rotary detent foley, not a recording. Only the knob changes.','sounds':[record]},indent=2)+'\n')
print(json.dumps(record,indent=2))
