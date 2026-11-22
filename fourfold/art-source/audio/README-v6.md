# Rotary knob detent v6

Only the knob sample changes. Three short sprung-pawl contacts at 9/62/131ms
have differing pitch and strength, with a quiet shaft-resistance layer and short
rebound. The 250ms sound ends before the separate 600ms tile landing. This is
original procedural foley, not a recorded physical knob or model-generated audio.

Rebuild with python3 fourfold/art-source/audio/build-knob-audio-v6.py.
Requires NumPy, SciPy and ffmpeg. WAV master and measurements are retained.
Decoded duration, boundaries, true peak, three contact windows and identical
web/native MP3 bytes verified. 118 regression tests passed. Ordinary UI audio,
stone landing and animation duration unchanged. No iPhone listening acceptance
or Creator-editor build is claimed.
