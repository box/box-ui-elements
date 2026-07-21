/**
 * Upload speed / ETA tracking for the modernized uploads manager.
 *
 * XHR progress events give us `loaded` / `total` bytes but no speed, and the
 * raw per-event rate is jittery (chunks land in bursts). We keep a small piece
 * of per-item state and smooth the speed with an exponential moving average so
 * the "time left" figure doesn't jump around.
 */

const SMOOTHING = 0.3;

export interface EtaState {
    lastTimestampMs: number;
    lastBytes: number;
    /** Smoothed transfer rate in bytes/sec. 0 until we have a usable sample. */
    speedBytesPerSec: number;
}

/**
 * Folds a new progress sample into the running speed estimate.
 *
 * The first sample only seeds the baseline (no speed yet). Non-positive time
 * deltas (duplicate/out-of-order events) update the byte cursor but leave the
 * speed untouched to avoid division blow-ups.
 */
export function updateEta(prev: EtaState | undefined, loaded: number, nowMs: number): EtaState {
    if (!prev) {
        return { lastTimestampMs: nowMs, lastBytes: loaded, speedBytesPerSec: 0 };
    }

    const dtSec = (nowMs - prev.lastTimestampMs) / 1000;
    if (dtSec <= 0) {
        return { ...prev, lastBytes: loaded };
    }

    const instant = Math.max(0, (loaded - prev.lastBytes) / dtSec);
    const speedBytesPerSec =
        prev.speedBytesPerSec === 0 ? instant : SMOOTHING * instant + (1 - SMOOTHING) * prev.speedBytesPerSec;

    return { lastTimestampMs: nowMs, lastBytes: loaded, speedBytesPerSec };
}

/**
 * Estimated seconds until the transfer completes, or `undefined` when we can't
 * yet estimate (no speed sample). Callers treat `undefined` as "hide the ETA".
 */
export function getRemainingSeconds(state: EtaState, loaded: number, total: number): number | undefined {
    if (state.speedBytesPerSec <= 0) {
        return undefined;
    }

    return Math.max(0, total - loaded) / state.speedBytesPerSec;
}
