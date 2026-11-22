# Soft contact audio v4

Original deterministic procedural foley; not a recorded ASMR sample. Build with
`python3 fourfold/art-source/audio/build-soft-audio-v4.py` (NumPy, SciPy, ffmpeg).

Two independent cues: 230ms rounded button contact and 300ms damped seating.
Broad filtered noise replaces the previous brighter resonant contact; a quiet
rebound adds a cushioned release. No continuous friction, music or long reverb.
New filenames prevent reuse of cached v3 samples. Web and Cocos receive identical MP3 bytes.

Validation: decoded frame counts, finite samples, boundary silence, headroom,
web/native hashes and high-frequency energy checked by the build script.
115 existing gameplay, motion and audio lifecycle tests passed with the 800ms
contract, including both full/gentle modes and cancellation before landing.
Local browser launch was blocked by runtime socket restrictions. No iPhone,
WeChat-device, Creator-editor or subjective listening acceptance is claimed.
