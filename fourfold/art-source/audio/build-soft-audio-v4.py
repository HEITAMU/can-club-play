#!/usr/bin/env python3
"""Deterministic soft, close-miked-style foley. Procedural, not a recording."""
from pathlib import Path
import importlib.util
import json
import sys
import numpy as np
from scipy.signal import butter, sosfilt, resample_poly
sys.dont_write_bytecode = True
SOURCE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('base', SOURCE / 'build-stone-audio.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
SR = base.SR

def contact(duration, rng, heavy=False):
    t = np.arange(round(duration * SR)) / SR
    # Broad, damped body: no narrow resonant notes or sharp gritty top.
    body = base.filtered_noise(len(t), 150 if heavy else 220, 780 if heavy else 1100, rng)
    touch = base.filtered_noise(len(t), 650, 1900, rng)
    env = base.smoothstep(t / .006) * np.exp(-t / (.038 if heavy else .026))
    env *= 1 - base.smoothstep((t-duration+.035)/.035)
    return (body + .075*touch) * env

def sound(heavy=False):
    rng = np.random.default_rng(482642 if heavy else 482641)
    out = np.zeros(round((.300 if heavy else .230) * SR))
    base.add_at(out, contact(.220 if heavy else .160, rng, heavy), .010)
    # Quiet cushioned rebound makes a single rounded 'tok', not a hard snap.
    base.add_at(out, contact(.130, rng, True), .043 if heavy else .036, .15)
    out = sosfilt(butter(3, 2100, fs=SR, output='sos'), out)
    out -= out.mean()
    out *= 10**(-7/20) / max(np.max(np.abs(out)), 1e-12)
    edge = round(.006*SR)
    out[:edge] *= base.smoothstep(np.arange(edge)/edge)
    out[-edge:] *= 1-base.smoothstep(np.arange(edge)/edge)
    out[0] = out[-1] = 0
    return out.astype('<f4')

def main():
    records=[]
    for name, heavy in [('ui-soft-press-v4',False),('soft-seat-v4',True)]:
        signal=sound(heavy)
        record=base.write_sound(name,signal)
        decoded=np.frombuffer(base.run(['ffmpeg','-v','error','-i',str(base.WEB/(name+'.mp3')),'-f','f32le','-ar',str(SR),'-ac','1','pipe:1']),dtype='<f4')
        high=sosfilt(butter(4,3000,btype='highpass',fs=SR,output='sos'),decoded)
        record['above3kHzEnergyPercent']=float(np.sum(high*high)/np.sum(decoded*decoded)*100)
        record['truePeakDbFS']=float(20*np.log10(np.max(np.abs(resample_poly(decoded,4,1)))))
        assert record['above3kHzEnergyPercent'] < 1
        assert record['truePeakDbFS'] < -5
        records.append(record)
    manifest={'version':4,'source':'Original deterministic procedural foley, no external samples or recordings. Softer contact and cushioned seating; subjective ASMR quality requires listening.','sounds':records}
    (SOURCE/'manifest-v4.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(manifest,ensure_ascii=False,indent=2))
if __name__=='__main__': main()
