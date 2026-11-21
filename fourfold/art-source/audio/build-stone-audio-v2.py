#!/usr/bin/env python3
"""Original deterministic stone foley v2; no recordings or online model output.

Retains v1 and its provenance. More midrange contact detail and irregular
surface friction are intended to read better on small speakers. Listen on the
target device before treating that intent as a verified perceptual result.
"""
from pathlib import Path
import importlib.util
import json
import sys

import numpy as np
from scipy.signal import butter, iirpeak, lfilter, sosfilt

SOURCE = Path(__file__).resolve().parent
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("stone_v1", SOURCE / "build-stone-audio.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
SR = base.SR
smoothstep, noise, add_at, normalized = base.smoothstep, base.filtered_noise, base.add_at, base.normalized


def contact(duration, rng, weight=1.0):
    """Broad, quickly damped stone modes: audible body without a bell note."""
    size = round(duration * SR)
    t = np.arange(size) / SR
    excitation = noise(size, 130, 4800, rng) * np.exp(-t / .0023)
    body = np.zeros(size)
    for frequency, quality, gain in [
        (173, 2.8, .10), (317, 3.0, .24), (563, 3.5, .40),
        (937, 3.1, .34), (1511, 2.6, .21), (2543, 2.0, .065),
    ]:
        b, a = iirpeak(frequency, quality, fs=SR)
        body += normalized(lfilter(b, a, excitation)) * gain
    body *= np.exp(-t / .040)
    touch = noise(size, 500, 4300, rng) * np.exp(-t / .016)
    edge = smoothstep(t / .0018) * (1-smoothstep((t-duration+.012)/.012))
    return (body + .18*touch) * edge * weight


def button_sound():
    rng = np.random.default_rng(482501)
    size = round(.28 * SR)
    t = np.arange(size) / SR
    out = np.zeros(size)
    add_at(out, contact(.20, rng), .010, .40)
    # A tiny press travel connects the touch to its seating; it is not a second click.
    travel = smoothstep((t-.010)/.008) * (1-smoothstep((t-.070)/.060))
    pressure = np.interp(t, [0,.018,.039,.060,.090,.14,.28], [.5,.9,.65,1,.45,.25,0])
    out += (.068*noise(size, 320, 1800, rng)+.020*noise(size, 1400, 4000, rng))*travel*pressure
    add_at(out, contact(.16, rng), .042, .065)
    return out


def rotation_sound():
    rng = np.random.default_rng(482502)
    size = round(1.2 * SR)
    t = np.arange(size) / SR
    out = np.zeros(size)
    progress = np.clip((t-.12)/.96, 0, 1)
    speed = np.sin(np.pi*progress)**.85
    gate = smoothstep((t-.095)/.040)*(1-smoothstep((t-1.015)/.065))
    # Independent coarse pressure and fine friction avoid a steady noise sweep.
    knots = np.r_[0, np.sort(rng.uniform(.09,1.08,43)), 1.2]
    pressure = np.interp(t,knots,rng.uniform(.48,1.0,len(knots)))
    pressure = sosfilt(butter(2,45,fs=SR,output="sos"),pressure)
    friction = gate*(.26+.74*speed)*(.46+.54*pressure)
    drag = .075*noise(size,110,430,rng)
    body = .185*noise(size,350,1450,rng)
    grit = .100*noise(size,1000,3100,rng)
    dust = .018*noise(size,2500,4900,rng)
    out += (drag+body+grit+dust)*friction
    # Small aperiodic catches have broad spectra, not regularly spaced gear teeth.
    for at in rng.uniform(.13,1.07,135):
        duration = rng.uniform(.003,.016)
        n = max(12,round(duration*SR));gt=np.arange(n)/SR
        grain = noise(n,rng.uniform(450,1000),rng.uniform(2400,4400),rng)
        grain *= smoothstep(gt/.0008)*np.exp(-gt/(duration*.28))
        gain = rng.uniform(.009,.045)*friction[min(size-1,round(at*SR))]
        add_at(out,grain,at,gain)
    # Contact, travel and one final seating line up with the 120/960/120ms turn.
    add_at(out,contact(.17,rng),.008,.16)
    add_at(out,contact(.128,rng),1.064,.39)
    tail = smoothstep((t-1.068)/.004)*np.exp(-np.maximum(t-1.072,0)/.022)
    out += .020*noise(size,500,2400,rng)*tail
    return out


def master(signal, peak_db):
    signal = sosfilt(butter(2,[105,5500],btype="bandpass",fs=SR,output="sos"),signal)
    signal -= np.mean(signal)
    # Soft transient control leaves headroom and avoids using sub-bass as weight.
    signal = np.tanh(signal*1.15)/1.15
    signal *= 10**(peak_db/20)/max(float(np.max(np.abs(signal))),1e-12)
    edge=round(.003*SR)
    signal[:edge]*=smoothstep(np.arange(edge)/edge)
    signal[-edge:]*=1-smoothstep(np.arange(edge)/edge)
    signal[0]=signal[-1]=0
    return signal.astype('<f4')


def main():
    sounds=[base.write_sound('ui-stone-press-v2',master(button_sound(),-5.8)),
            base.write_sound('stone-turn-v2',master(rotation_sound(),-4.8))]
    manifest={
        'version':2,
        'origin':'Original deterministic procedural stone foley; no third-party recordings or online generated output.',
        'seeds':{'button':482501,'turn':482502},
        'intent':'Dry midrange contact and irregular granular friction; a single settling contact at 1.064s. Sound character still needs target-device listening.',
        'verification':'48kHz mono 24-bit WAV master; decoded MP3 timing and peak/boundary checks; web/native bytes identical.',
        'sounds':sounds,
    }
    (SOURCE/'manifest-v2.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(manifest,ensure_ascii=False,indent=2))


if __name__=='__main__':
    main()
