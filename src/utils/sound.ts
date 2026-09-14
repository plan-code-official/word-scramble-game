/** Sound effects via Web Audio API — no external files needed */

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* silently ignore */ }
}

export function playClick() {
  playTone(600, 0.08, 'sine', 0.2);
}

export function playPlaceBack() {
  playTone(400, 0.08, 'sine', 0.15);
}

export function playCorrect() {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.18, 'sine', 0.35), i * 100)
  );
}

export function playWrong() {
  [350, 280].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.2, 'sawtooth', 0.25), i * 120)
  );
}

export function playWin() {
  [523, 659, 784, 880, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.25, 'sine', 0.4), i * 120)
  );
}
