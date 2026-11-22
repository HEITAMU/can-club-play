# Three independent tactile cues (0.8.30)

UI uses ui-tap-v5, rotation press uses knob-click-v5, and completed rotation uses
stone-seat-v5. All three are separate original procedural samples with distinct
modal frequencies, attack/rebound timing, duration and gain. The knob and landing
use impulsively excited, damped material resonances instead of v4's sustained
filtered noise. These are not field recordings or model-generated audio.

Rebuild: python3 fourfold/art-source/audio/build-tactile-audio-v5.py
Requirements: NumPy, SciPy, ffmpeg. Original WAV masters, MP3s and hashes retained.

Validation: 118 tests pass, including independent sample routing through Web
Audio, media compatibility and native Cocos sources; full/gentle rotation commits
at 600ms. Decode, headroom, boundary silence and matching web/native bytes checked.
No subjective listening approval, iPhone playback or Creator build is claimed.
