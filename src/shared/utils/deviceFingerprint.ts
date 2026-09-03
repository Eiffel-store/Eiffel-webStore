/**
 * Generates and retrieves a persistent hardware/browser device fingerprint.
 * Stored in localStorage so it survives session clearing and input changes.
 */
export const getDeviceFingerprint = (): string => {
  if (typeof window === 'undefined') return 'EFL-SERVER';

  const STORAGE_KEY = 'eiffel_device_fp';
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing && existing.startsWith('EFL-DEV-')) {
      return existing;
    }

    // Build raw hardware and client entropy
    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const lang = navigator.language || 'ar';
    const platform = (navigator as any).userAgentData?.platform || navigator.platform || 'Unknown';
    const raw = `${screenInfo}|${timeZone}|${lang}|${platform}`;

    // Simple robust hash
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }

    const salt = Math.random().toString(36).substring(2, 9).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    const newFingerprint = `EFL-DEV-${Math.abs(hash).toString(16).toUpperCase()}-${salt}-${timestamp}`;

    localStorage.setItem(STORAGE_KEY, newFingerprint);
    return newFingerprint;
  } catch (e) {
    return 'EFL-DEV-ANON';
  }
};
