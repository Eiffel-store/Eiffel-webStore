/**
 * Ultra-lightweight Web Audio API luxury chime generator.
 * Produces a warm, elegant two-tone chime without external audio assets.
 * 
 * Features:
 * - Singleton AudioContext with lazy initialization.
 * - Automatic background unlock on first user gesture.
 * - Anti-spam throttling (max 1 chime every 1.2s) to prevent audio clutter during load tests.
 * - Silent error handling for browser autoplay policies.
 */

let sharedAudioCtx: AudioContext | null = null;
let lastChimeTime = 0;
let userGestureUnlocked = false;

// Auto-register listener to unlock AudioContext on the first user interaction
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    userGestureUnlocked = true;
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    window.removeEventListener('click', unlockAudio, true);
    window.removeEventListener('touchstart', unlockAudio, true);
    window.removeEventListener('keydown', unlockAudio, true);
  };

  window.addEventListener('click', unlockAudio, { once: true, capture: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, capture: true });
  window.addEventListener('keydown', unlockAudio, { once: true, capture: true });
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  try {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      sharedAudioCtx = new AudioCtx();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export const playLuxuryOrderChime = () => {
  try {
    // Throttle: Max 1 chime per 1.2s to avoid cacophony when multiple orders arrive in burst
    const now = Date.now();
    if (now - lastChimeTime < 1200) {
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    // If context is suspended and user hasn't interacted yet, don't trigger browser autoplay warning
    if (ctx.state === 'suspended') {
      if (!userGestureUnlocked) {
        return; // Silently defer until user clicks anywhere
      }
      ctx.resume().catch(() => {});
    }

    lastChimeTime = now;
    const audioTime = ctx.currentTime;

    // First tone (Warm Bell D5: 587.33Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, audioTime);
    gain1.gain.setValueAtTime(0, audioTime);
    gain1.gain.linearRampToValueAtTime(0.18, audioTime + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.0001, audioTime + 0.9);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(audioTime);
    osc1.stop(audioTime + 0.9);

    // Second tone (Crystal Chime A5: 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, audioTime + 0.12);
    gain2.gain.setValueAtTime(0, audioTime + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, audioTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.0001, audioTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(audioTime + 0.12);
    osc2.stop(audioTime + 1.2);

  } catch {
    // Graceful no-op on unsupported environments
  }
};
