#!/usr/bin/env python3
"""Build Fourfold's original, deterministic stone-foley sound effects.

No recorded or third-party audio is used. Broad-band contact excitation,
inharmonic resonances and shaped granular friction model a stone surface.
Requires Python 3, NumPy, SciPy and ffmpeg (libmp3lame).
"""
from pathlib import Path
import hashlib
import json
import subprocess

import numpy as np
from scipy.signal import butter, iirpeak, lfilter, sosfilt

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(__file__).resolve().parent
WEB = ROOT / "assets/audio"
NATIVE = ROOT / "cocos/assets/resources/audio"
SR = 48000


def rms(signal):
    return float(np.sqrt(np.mean(np.square(signal), dtype=np.float64)))


def normalized(signal):
    return signal / max(rms(signal), 1e-12)


def filtered_noise(length, low, high, rng, order=2):
    noise = rng.standard_normal(length)
    sos = butter(order, [low, high], btype="bandpass", fs=SR, output="sos")
    return normalized(sosfilt(sos, noise))


def smoothstep(x):
    v = np.clip(x, 0.0, 1.0)
    return v * v * (3.0 - 2.0 * v)


def add_at(target, sound, at, gain=1.0):
    start = int(round(at * SR))
    stop = min(len(target), start + len(sound))
    if stop > start:
        target[start:stop] += sound[:stop-start] * gain


def stone_contact(duration, rng, force=1.0):
    """Dry noise-excited contact body, deliberately without musical oscillators."""
    size = int(round(duration * SR))
    time = np.arange(size) / SR
    excitation = rng.standard_normal(size) * np.exp(-time / .0017)
    body = np.zeros(size)
    # Inharmonic, low-Q material resonances avoid a pitched click or a bell.
    for frequency, quality, weight in [
        (166, 3.9, .50), (283, 4.4, .32), (461, 4.8, .22),
        (773, 4.2, .12), (1277, 3.5, .055), (2191, 2.5, .025),
    ]:
        b, a = iirpeak(frequency, quality, fs=SR)
        response = lfilter(b, a, excitation)
        body += normalized(response) * weight
    body *= np.exp(-time / .050)
    grit = filtered_noise(size, 680, 5000, rng) * np.exp(-time / .012)
    # A soft start suppresses digital edges while retaining a tactile contact.
    edge = smoothstep(time / .0015) * (1.0 - smoothstep((time-duration+.015)/.015))
    return (body + grit * .14) * edge * force


def button_sound():
    rng = np.random.default_rng(480187)
    duration = .28
    size = int(duration * SR)
    time = np.arange(size) / SR
    out = np.zeros(size)
    add_at(out, stone_contact(.22, rng), .006, .58)
    # Very short dry press travel and a lower contact close, not a second click.
    rub_env = smoothstep((time-.005)/.012) * (1.0-smoothstep((time-.055)/.045))
    rub = filtered_noise(size, 240, 2100, rng) * .045
    out += rub * rub_env
    add_at(out, stone_contact(.14, rng), .043, .12)
    return out


def rotation_sound():
    rng = np.random.default_rng(480188)
    duration = 1.2
    size = int(round(duration * SR))
    time = np.arange(size) / SR
    out = np.zeros(size)
    # The turn uses the game's 120ms focus, 960ms travel, 120ms landing timing.
    travel = np.clip((time-.12)/.96, 0, 1)
    speed = np.sin(np.pi * travel) ** .82
    gate = smoothstep((time-.090)/.055) * (1-smoothstep((time-.990)/.095))
    friction_env = gate * (.19 + .81 * speed)

    # Aperiodic pressure variations create dry drag, rather than a steady hiss.
    knots = np.linspace(0, duration, 52)
    pressure = np.interp(time, knots, rng.uniform(.43, 1.0, len(knots)))
    pressure = .68 + .32 * pressure
    low_drag = filtered_noise(size, 85, 430, rng) * .13
    stone_grain = filtered_noise(size, 360, 1900, rng) * .105
    fine_grain = filtered_noise(size, 1500, 4300, rng) * .024
    out += (low_drag + stone_grain + fine_grain) * friction_env * pressure

    # Tiny separate surface catches add texture without sounding like impacts.
    for at in rng.uniform(.13, 1.055, 105):
        length = rng.uniform(.002, .009)
        n = max(8, int(length*SR))
        gt = np.arange(n) / SR
        grain = filtered_noise(n, rng.uniform(550, 1200), rng.uniform(2800, 5200), rng)
        grain *= np.exp(-gt / (length*.23)) * smoothstep(gt/.00055)
        gain = rng.uniform(.006, .034) * float(friction_env[min(size-1, int(at*SR))])
        add_at(out, grain, at, gain)

    # Broad contact at pickup; one heavier landing as the four tiles seat.
    add_at(out, stone_contact(.18, rng), .012, .23)
    add_at(out, stone_contact(.125, rng), 1.067, .66)
    # A short granular tail follows the landing and fully decays inside 1.2s.
    tail = filtered_noise(size, 360, 2700, rng)
    tail_env = smoothstep((time-1.075)/.004) * np.exp(-np.maximum(time-1.079, 0)/.024)
    out += tail * tail_env * .022
    return out


def master(signal, peak_db):
    # DC/sub-bass removal and a gentle top roll-off suit small phone speakers.
    sos = butter(2, [65, 5900], btype="bandpass", fs=SR, output="sos")
    signal = sosfilt(sos, signal)
    signal -= np.mean(signal)
    signal = np.tanh(signal * 1.15) / 1.15
    peak = max(float(np.max(np.abs(signal))), 1e-12)
    signal *= 10**(peak_db/20) / peak
    edge = max(1, int(.003*SR))
    signal[:edge] *= smoothstep(np.arange(edge)/edge)
    signal[-edge:] *= 1-smoothstep(np.arange(edge)/edge)
    signal[0] = signal[-1] = 0
    return signal.astype("<f4")


def run(args, data=None):
    return subprocess.run(args, input=data, check=True, capture_output=True).stdout


def write_sound(name, signal):
    source_path = SOURCE / (name + ".wav")
    mp3_path = WEB / (name + ".mp3")
    pcm = signal.tobytes()
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ar", str(SR),
         "-ac", "1", "-i", "pipe:0", "-c:a", "pcm_s24le", "-map_metadata", "-1", str(source_path)], pcm)
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source_path),
         "-c:a", "libmp3lame", "-b:a", "192k", "-ar", str(SR), "-ac", "1", "-write_xing", "1",
         "-map_metadata", "-1", str(mp3_path)])
    data = mp3_path.read_bytes()
    (NATIVE / mp3_path.name).write_bytes(data)
    decoded = np.frombuffer(run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(mp3_path),
                                  "-f", "f32le", "-ar", str(SR), "-ac", "1", "pipe:1"]), dtype="<f4")
    assert len(decoded) == len(signal), (name, len(decoded), len(signal))
    assert np.isfinite(decoded).all()
    assert np.max(np.abs(decoded)) < .95, (name, "clipping")
    assert data == (NATIVE / mp3_path.name).read_bytes()
    assert np.max(np.abs(decoded[:48])) < .0015, (name, "leading boundary")
    assert np.max(np.abs(decoded[-48:])) < .0015, (name, "trailing boundary")
    return {
        "name": name, "origin": "original deterministic procedural stone foley",
        "sampleRate": SR, "channels": 1, "decodedFrames": len(decoded),
        "decodedDurationSeconds": len(decoded)/SR,
        "decodedPeakDbFS": round(float(20*np.log10(np.max(np.abs(decoded)))), 3),
        "decodedRmsDbFS": round(float(20*np.log10(rms(decoded))), 3),
        "sha256": hashlib.sha256(data).hexdigest(), "mp3Bytes": len(data),
        "sourceMaster": str(source_path.relative_to(ROOT)),
        "web": str(mp3_path.relative_to(ROOT)),
        "native": str((NATIVE / mp3_path.name).relative_to(ROOT)),
    }


def main():
    SOURCE.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    NATIVE.mkdir(parents=True, exist_ok=True)
    manifest = {
        "version": 1,
        "notes": "MP3 container duration includes encoder padding; decoded frame count is authoritative. No captured real-world recording or external sample is used.",
        "sounds": [
            write_sound("ui-stone-press-v1", master(button_sound(), -7.0)),
            write_sound("stone-turn-v1", master(rotation_sound(), -5.0)),
        ],
    }
    (SOURCE / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
