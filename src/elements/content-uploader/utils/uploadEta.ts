/** Window the speed is measured over */
const SAMPLING_WINDOW_MS = 3000;
/** Minimum spacing between recorded samples */
const SAMPLING_RATE_MS = 50;
/** How long to wait before surfacing an ETA at all */
const GRACE_PERIOD_MS = 1000;
/**
 * EMA weight kept from the previous smoothed ETA (yt-dlp: 0.9). Higher = more
 * inertia = steadier countdown. New raw ETA gets weight `1 - ETA_SMOOTHING`.
 */
const ETA_SMOOTHING = 0.9;

export interface EtaState {
    /** Timestamp of the first sample — used for the grace period. */
    startMs: number;
    /** Timestamp of the last recorded sample — used to throttle sampling. */
    lastSampleMs: number;
    /** Sample timestamps within the sliding window, oldest first. */
    times: number[];
    /** Loaded-byte counts matching `times`, oldest first. */
    loaded: number[];
    /** EMA(explonential moving average)-smoothed ETA, or `null` when no reliable estimate exists. */
    etaMs: number | null;
}

export function updateEta(prev: EtaState | undefined, loaded: number, total: number, nowMs: number): EtaState {
    if (!prev) {
        return { startMs: nowMs, lastSampleMs: nowMs, times: [nowMs], loaded: [loaded], etaMs: null };
    }

    // Throttle: ignore samples that arrive faster than the sampling rate so the
    // window is built from evenly spaced points.
    if (nowMs - prev.lastSampleMs < SAMPLING_RATE_MS) {
        return prev;
    }

    const times = [...prev.times, nowMs];
    const loadedSamples = [...prev.loaded, loaded];

    // Drop samples that have aged out of the trailing window.
    const cutoff = nowMs - SAMPLING_WINDOW_MS;
    let offset = 0;
    while (offset < times.length && times[offset] < cutoff) {
        offset += 1;
    }

    const base = {
        startMs: prev.startMs,
        lastSampleMs: nowMs,
        times: times.slice(offset),
        loaded: loadedSamples.slice(offset),
    };

    // Need at least two points to measure a rate.
    if (base.times.length < 2) {
        return { ...base, etaMs: null };
    }

    const spanMs = nowMs - base.times[0];
    if (spanMs <= 0) {
        return { ...base, etaMs: prev.etaMs };
    }

    const speedBytesPerMs = (loaded - base.loaded[0]) / spanMs;
    const elapsedMs = nowMs - prev.startMs;

    // Only estimate once we have positive speed and the warm-up grace has passed.
    if (total > 0 && speedBytesPerMs > 0 && elapsedMs >= GRACE_PERIOD_MS) {
        const rawEtaMs = Math.max(0, total - loaded) / speedBytesPerMs;
        const etaMs = prev.etaMs == null ? rawEtaMs : (1 - ETA_SMOOTHING) * rawEtaMs + ETA_SMOOTHING * prev.etaMs;
        return { ...base, etaMs };
    }

    // No reliable estimate right now (warming up, or a full-window stall).
    return { ...base, etaMs: null };
}

export function getRemainingMs(state: EtaState): number | undefined {
    return state.etaMs == null ? undefined : state.etaMs;
}
