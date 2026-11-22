# 星图微光 / Starlight

Original 40-second composition and deterministic synthesis, 48 BPM, eight bars.
Soft electric-key style melody, arpeggiated harmony and slow pads; circular tails
and short diffuse echoes. No external recordings, model-generated music or samples.
Rebuild with build-starlight-music.py (NumPy, SciPy, ffmpeg). Seed and note choices
are in source. Mono 64kbps MP3 is 320617 bytes; both runtimes use identical bytes.
The master is -27 dBFS RMS so even iOS media playback at fixed unity gain remains
below the knob/landing transients. Decoded duration 40s, peak 0.188, RMS -27.45dBFS.
Browser media looping depends on its gapless MP3 handling; device listening is
still needed. This is not an assertion of subjective audio quality.

Knob v8 has one contact at 9ms and a short internal rebound, no bridging friction.
Its 250ms container and the separate tile landing remain unchanged.

123 tests passed before release. Music tests cover activation, independent saved
preference, repeated gestures without restart, backgrounding, stale asynchronous
play, failed autoplay retry, native loading and resource cleanup. Creator/WeChat
and iPhone device validation are not implied by these tests.
