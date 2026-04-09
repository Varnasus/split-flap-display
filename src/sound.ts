import type { SoundOptions } from "./types";

export type SoundVariant = "clack" | "click" | "soft";

let audioCtx: AudioContext | null = null;
let customAudio: HTMLAudioElement | null = null;

/**
 * Lazily initializes the Web Audio API context.
 * Only created on first call to playSound(). SSR-safe.
 */
function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    try {
      audioCtx = new Ctx();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** Create a buffer of white noise for the given duration. */
function makeNoise(ctx: AudioContext, duration: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/**
 * "clack" — sharp mechanical snap.
 * Three layered components: noise burst, low thump, latch click.
 */
function synthClack(ctx: AudioContext, volume: number, t: number, pitch: number, decay: number): void {
  // 1. Noise burst (the snap)
  const noiseBuf = makeNoise(ctx, 0.04 * decay);
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 3500 * pitch;
  bandpass.Q.value = 1.2;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.7, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035 * decay);
  noiseSrc.connect(bandpass).connect(noiseGain).connect(ctx.destination);
  noiseSrc.start(t);
  noiseSrc.stop(t + 0.04 * decay);

  // 2. Low thump (mechanical body)
  const thump = ctx.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(180 * pitch, t);
  thump.frequency.exponentialRampToValueAtTime(60 * pitch, t + 0.04 * decay);
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(volume * 0.5, t);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 * decay);
  thump.connect(thumpGain).connect(ctx.destination);
  thump.start(t);
  thump.stop(t + 0.05 * decay);

  // 3. Latch click
  const latch = ctx.createOscillator();
  latch.type = "square";
  latch.frequency.value = 2800 * pitch;
  const latchGain = ctx.createGain();
  latchGain.gain.setValueAtTime(volume * 0.15, t);
  latchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.008 * decay);
  latch.connect(latchGain).connect(ctx.destination);
  latch.start(t);
  latch.stop(t + 0.01 * decay);
}

/**
 * "click" — lighter keyboard switch feel.
 * Two components: noise burst through highpass, sine tick.
 */
function synthClick(ctx: AudioContext, volume: number, t: number, pitch: number, decay: number): void {
  // 1. Noise burst
  const noiseBuf = makeNoise(ctx, 0.025 * decay);
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 4000 * pitch;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.45, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02 * decay);
  noiseSrc.connect(highpass).connect(noiseGain).connect(ctx.destination);
  noiseSrc.start(t);
  noiseSrc.stop(t + 0.025 * decay);

  // 2. Tick
  const tick = ctx.createOscillator();
  tick.type = "sine";
  tick.frequency.value = 4200 * pitch;
  const tickGain = ctx.createGain();
  tickGain.gain.setValueAtTime(volume * 0.2, t);
  tickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.006 * decay);
  tick.connect(tickGain).connect(ctx.destination);
  tick.start(t);
  tick.stop(t + 0.008 * decay);
}

/**
 * "soft" — muted thud for ambient/background use.
 * Two components: lowpass noise, sub thump.
 */
function synthSoft(ctx: AudioContext, volume: number, t: number, pitch: number, decay: number): void {
  // 1. Noise burst
  const noiseBuf = makeNoise(ctx, 0.05 * decay);
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 800 * pitch;
  lowpass.Q.value = 0.5;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.35, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045 * decay);
  noiseSrc.connect(lowpass).connect(noiseGain).connect(ctx.destination);
  noiseSrc.start(t);
  noiseSrc.stop(t + 0.05 * decay);

  // 2. Sub thump
  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(100 * pitch, t);
  sub.frequency.exponentialRampToValueAtTime(40 * pitch, t + 0.05 * decay);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(volume * 0.3, t);
  subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06 * decay);
  sub.connect(subGain).connect(ctx.destination);
  sub.start(t);
  sub.stop(t + 0.06 * decay);
}

/**
 * Play a flip sound. Non-blocking, fire-and-forget.
 * Each call creates short-lived Web Audio nodes that get garbage collected.
 *
 * @param variant   Which sound to synthesize: "clack", "click", or "soft"
 * @param volume    Volume from 0 to 1. Default: 0.5
 * @param customSrc Optional URL to an external audio file (overrides synthesis)
 * @param options   Optional pitch/decay multipliers (ignored when customSrc is set)
 */
export function playSound(
  variant: SoundVariant,
  volume: number,
  customSrc?: string,
  options?: SoundOptions
): void {
  // Custom audio source path — use HTML Audio element
  if (customSrc) {
    if (typeof window === "undefined") return;
    // Normalize to absolute URL so comparison works with relative paths
    const resolved = new URL(customSrc, window.location.href).href;
    if (!customAudio || customAudio.src !== resolved) {
      customAudio = new Audio(resolved);
    }
    customAudio.volume = Math.max(0, Math.min(1, volume));
    customAudio.currentTime = 0;
    try {
      const p = customAudio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch { /* ignore in non-standard environments */ }
    return;
  }

  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const pitch = options?.pitch ?? 1;
  const decay = options?.decay ?? 1;

  switch (variant) {
    case "clack":
      synthClack(ctx, volume, t, pitch, decay);
      break;
    case "click":
      synthClick(ctx, volume, t, pitch, decay);
      break;
    case "soft":
      synthSoft(ctx, volume, t, pitch, decay);
      break;
  }
}

/**
 * Manually resume the AudioContext. Call this from a user gesture (e.g. onClick)
 * to unlock audio on iOS/Safari where autoplay is restricted.
 */
export function resumeAudio(): void {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}
