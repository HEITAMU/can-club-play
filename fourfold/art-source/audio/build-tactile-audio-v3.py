#!/usr/bin/env python3
"""Original deterministic short tactile foley for Fourfold.

No recordings, external samples, or generated-model audio. v1/v2 are preserved.
Requires Python 3, NumPy, SciPy and ffmpeg with libmp3lame.
"""
from pathlib import Path
import importlib.util
import json
import sys

import numpy as np
from scipy.signal import butter, iirpeak, lfilter, resample_poly, sosfilt

sys.dont_write_bytecode = True
SOURCE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("stone_v1", SOURCE / "build-stone-audio.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
SR = base.SR


def contact(duration, rng, *, heavy=False):
    """Extended noise excitation, a broad contact head and dry material body.

    Unlike the impulse-excited v2 body, the excitation has a short pressure
    shoulder. Low-Q, inharmonic resonances thus carry material energy through
    the contact instead of spending nearly all the peak on a few samples.
    """
    size = round(duration * SR)
    t = np.arange(size) / SR
    shoulder = .022 if heavy else .016
    decay = .038 if heavy else .031
    pressure = base.smoothstep(t / .0025) * np.exp(-np.maximum(t - shoulder, 0) / decay)
    pressure *= 1 - base.smoothstep((t - duration + .025) / .025)
    excitation = base.filtered_noise(size, 120, 4200, rng)
    excitation *= pressure
    modes = (
        [(211, 2.7, .20), (367, 3.0, .33), (619, 3.0, .37),
         (1021, 2.8, .25), (1673, 2.3, .11)] if heavy else
        [(293, 2.8, .14), (487, 3.0, .31), (809, 3.1, .37),
         (1297, 2.5, .25), (2161, 2.0, .10)]
    )
    body = np.zeros(size)
    for frequency, quality, weight in modes:
        b, a = iirpeak(frequency, quality, fs=SR)
        response = lfilter(b, a, excitation)
        # Match energy between bands, not their individual transient peaks.
        body += base.normalized(response) * weight
    # The body remains dry and broad, with no oscillator or long modal ring.
    body *= 1 - base.smoothstep((t - duration + .025) / .025)
    head = base.filtered_noise(size, 650, 3700, rng)
    head *= base.smoothstep(t / .0013) * np.exp(-t / .010)
    return body + head * (.20 if heavy else .28)


def press_sound():
    rng = np.random.default_rng(482601)
    out = np.zeros(round(.240 * SR))
    # 10 ms leaves the lossy encoder space for its short pre-echo while keeping
    # the control response prompt. A low rebound is part of one physical press.
    base.add_at(out, contact(.150, rng), .010, .47)
    base.add_at(out, contact(.095, rng, heavy=True), .047, .105)
    return out


def seat_sound():
    rng = np.random.default_rng(482602)
    out = np.zeros(round(.320 * SR))
    base.add_at(out, contact(.195, rng, heavy=True), .010, .51)
    base.add_at(out, contact(.115, rng, heavy=True), .040, .115)
    # Sparse, quiet seating grains, not a continuous sliding/friction bed.
    for onset, gain in [(.076, .035), (.094, .021), (.122, .012)]:
        length = round(.018 * SR)
        t = np.arange(length) / SR
        grain = base.filtered_noise(length, 730, 2700, rng)
        grain *= base.smoothstep(t / .0018) * np.exp(-t / .0045)
        grain *= 1 - base.smoothstep((t - .011) / .007)
        base.add_at(out, grain, onset, gain)
    return out


def master(signal, *, heavy=False):
    # A broad phone-readable middle carries both sounds. No sub-bass rumble,
    # piercing top end, long convolution reverb, or tonal music layer.
    signal = sosfilt(butter(2, [110 if heavy else 150, 4200],
                            btype="bandpass", fs=SR, output="sos"), signal)
    signal -= np.mean(signal)
    # Local soft compression prevents rare noise peaks from dictating the
    # audible level. There is still substantial transient headroom.
    active = signal[np.abs(signal) > np.max(np.abs(signal)) * .015]
    drive = (.28 if heavy else .18) / max(base.rms(active), 1e-12)
    signal = np.tanh(signal * drive)
    signal *= 10 ** (-3.5 / 20) / max(np.max(np.abs(signal)), 1e-12)
    edge = round(.004 * SR)
    signal[:edge] *= base.smoothstep(np.arange(edge) / edge)
    signal[-edge:] *= 1 - base.smoothstep(np.arange(edge) / edge)
    signal[0] = signal[-1] = 0
    return signal.astype("<f4")


def analyse(name, record):
    decoded = np.frombuffer(base.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-i",
        str(base.WEB / (name + ".mp3")), "-f", "f32le", "-ar", str(SR),
        "-ac", "1", "pipe:1"],), dtype="<f4").astype(np.float64)
    energy = decoded * decoded
    cdf = np.cumsum(energy) / max(np.sum(energy), 1e-20)
    percentiles = {str(p): round(np.searchsorted(cdf, p / 100) * 1000 / SR, 3)
                   for p in [5, 50, 90, 95, 99]}
    bins = [(0, 30), (30, 70), (70, 130), (130, 200), (200, len(decoded) / SR * 1000)]
    energy_bins = {f"{start:g}-{stop:g}": round(float(np.sum(
        energy[round(start * SR / 1000):round(stop * SR / 1000)]) / np.sum(energy) * 100), 3)
        for start, stop in bins if stop > start}
    mid = sosfilt(butter(3, [300, 3500], btype="bandpass", fs=SR, output="sos"), decoded)
    low = sosfilt(butter(3, 300, btype="lowpass", fs=SR, output="sos"), decoded)
    active_frames = round(.130 * SR)
    true_peak = np.max(np.abs(resample_poly(decoded, 4, 1)))
    record.update({
        "role": "knob/button press" if "press" in name else "rotation completed: stone seated",
        "energyPercentileTimeMs": percentiles,
        "energyByTimeBinPercent": energy_bins,
        "first130msRmsDbFS": round(float(20 * np.log10(base.rms(decoded[:active_frames]))), 3),
        "mid300to3500HzRmsDbFS": round(float(20 * np.log10(base.rms(mid))), 3),
        "below300HzEnergyPercent": round(float(np.sum(low * low) / np.sum(energy) * 100), 3),
        "estimated4xTruePeakDbFS": round(float(20 * np.log10(true_peak)), 3),
        "first1msPeak": float(np.max(np.abs(decoded[:48]))),
        "last1msPeak": float(np.max(np.abs(decoded[-48:]))),
        "boundaryStep": float(max(abs(decoded[0]), abs(decoded[-1]))),
    })
    assert true_peak < .90, (name, "inter-sample headroom")
    assert -20.3 < record["decodedRmsDbFS"] < -18.0, (name, "unexpected whole-sample energy")
    return record


def main():
    base.WEB.mkdir(parents=True, exist_ok=True)
    base.NATIVE.mkdir(parents=True, exist_ok=True)
    sounds = []
    for name, signal in [
        ("ui-stone-press-v3", master(press_sound())),
        ("stone-seat-v3", master(seat_sound(), heavy=True)),
    ]:
        sounds.append(analyse(name, base.write_sound(name, signal)))
    manifest = {
        "version": 3,
        "source": "original deterministic local procedural foley; no recordings, external samples or model-generated audio",
        "seeds": {"ui-stone-press-v3": 482601, "stone-seat-v3": 482602},
        "notes": "Separate short press and completion cues. No ongoing rotation friction. MP3 container duration includes padding; decoded frames are authoritative. Numeric checks do not establish perceived quality or device audibility.",
        "sounds": sounds,
    }
    (SOURCE / "manifest-v3.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
