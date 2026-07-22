import { updateEta, getRemainingMs, type EtaState } from '../uploadEta';

describe('updateEta()', () => {
    test('first sample seeds the window with no ETA yet', () => {
        const state = updateEta(undefined, 0, 100, 1000);
        expect(state).toEqual({
            startMs: 1000,
            lastSampleMs: 1000,
            times: [1000],
            loaded: [0],
            etaMs: null,
        });
        expect(getRemainingMs(state)).toBeUndefined();
    });

    test('withholds the ETA during the grace period', () => {
        let state = updateEta(undefined, 0, 1000, 0);
        state = updateEta(state, 500, 1000, 500); // elapsed 500ms < 1s grace
        expect(getRemainingMs(state)).toBeUndefined();
    });

    test('produces an estimate once the grace period has passed', () => {
        let state = updateEta(undefined, 0, 1000, 0);
        state = updateEta(state, 200, 1000, 1000); // elapsed == grace -> still hidden
        expect(getRemainingMs(state)).toBeUndefined();
        state = updateEta(state, 400, 1000, 2000); // elapsed 2s > grace
        // window [0,1000,2000] / [0,200,400] -> 200 B/s, 600 B left -> ~3s -> 3000ms
        expect(getRemainingMs(state)).toBeCloseTo(3000, 5);
    });

    test('smooths the ETA with heavy inertia (does not jump)', () => {
        const prev: EtaState = {
            startMs: 0,
            lastSampleMs: 2000,
            times: [0, 2000],
            loaded: [0, 2000],
            etaMs: 10000,
        };
        // Window [0,2000,3000] / [0,2000,3000] -> 1000 B/s, 7000 B left -> raw ETA 7000ms.
        // Smoothed: 0.1 * 7000 + 0.9 * 10000 = 9700 (barely moves off the previous 10000).
        const next = updateEta(prev, 3000, 10000, 3000);
        expect(next.etaMs).toBeCloseTo(9700, 5);
    });

    test('throttles samples that arrive faster than the sampling rate', () => {
        const prev: EtaState = {
            startMs: 0,
            lastSampleMs: 1000,
            times: [0, 1000],
            loaded: [0, 1000],
            etaMs: 5000,
        };
        const next = updateEta(prev, 1010, 10000, 1030); // 30ms < 50ms sampling rate
        expect(next).toBe(prev);
    });

    test('hides the ETA when the whole window stalls (zero speed)', () => {
        const prev: EtaState = {
            startMs: 0,
            lastSampleMs: 3000,
            times: [1000, 3000],
            loaded: [5000, 5000],
            etaMs: 8000,
        };
        const next = updateEta(prev, 5000, 10000, 4000); // no bytes moved across the window
        expect(next.etaMs).toBeNull();
        expect(getRemainingMs(next)).toBeUndefined();
    });
});

describe('getRemainingMs()', () => {
    const emptyWindow = { startMs: 0, lastSampleMs: 0, times: [], loaded: [] };

    test('returns undefined when there is no estimate', () => {
        expect(getRemainingMs({ ...emptyWindow, etaMs: null })).toBeUndefined();
    });

    test('returns the smoothed estimate in milliseconds', () => {
        expect(getRemainingMs({ ...emptyWindow, etaMs: 12300 })).toBe(12300);
    });
});
