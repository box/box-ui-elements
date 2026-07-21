import { updateEta, getRemainingSeconds } from '../uploadEta';

describe('updateEta()', () => {
    test('first sample seeds the baseline with no speed yet', () => {
        const state = updateEta(undefined, 0, 1000);
        expect(state).toEqual({ lastTimestampMs: 1000, lastBytes: 0, speedBytesPerSec: 0 });
    });

    test('computes instantaneous speed on the first usable delta', () => {
        const seed = updateEta(undefined, 0, 0);
        const next = updateEta(seed, 1000, 1000); // 1000 bytes in 1s
        expect(next.speedBytesPerSec).toBe(1000);
        expect(next.lastBytes).toBe(1000);
        expect(next.lastTimestampMs).toBe(1000);
    });

    test('smooths the speed with an EMA across samples', () => {
        let state = updateEta(undefined, 0, 0);
        state = updateEta(state, 1000, 1000); // instant 1000 -> speed 1000
        state = updateEta(state, 1500, 2000); // instant 500 -> 0.3*500 + 0.7*1000 = 850
        expect(state.speedBytesPerSec).toBeCloseTo(850, 5);
    });

    test('non-positive time delta advances bytes but keeps speed', () => {
        const seed = updateEta(undefined, 100, 5000);
        seed.speedBytesPerSec = 42;
        const next = updateEta(seed, 200, 5000); // dt = 0
        expect(next.speedBytesPerSec).toBe(42);
        expect(next.lastBytes).toBe(200);
    });

    test('clamps negative byte deltas to zero speed contribution', () => {
        let state = updateEta(undefined, 1000, 0);
        state = updateEta(state, 1000, 1000); // no progress -> instant 0, speed 0
        state = updateEta(state, 500, 2000); // bytes went backwards -> instant clamped to 0
        expect(state.speedBytesPerSec).toBe(0);
    });
});

describe('getRemainingSeconds()', () => {
    test('returns undefined when there is no speed sample yet', () => {
        const state = { lastTimestampMs: 0, lastBytes: 0, speedBytesPerSec: 0 };
        expect(getRemainingSeconds(state, 0, 100)).toBeUndefined();
    });

    test('estimates remaining time from the smoothed speed', () => {
        const state = { lastTimestampMs: 0, lastBytes: 500, speedBytesPerSec: 100 };
        // 500 bytes left at 100 B/s -> 5s
        expect(getRemainingSeconds(state, 500, 1000)).toBe(5);
    });

    test('never reports negative time once loaded exceeds total', () => {
        const state = { lastTimestampMs: 0, lastBytes: 1200, speedBytesPerSec: 100 };
        expect(getRemainingSeconds(state, 1200, 1000)).toBe(0);
    });
});
