import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(options?: MatchImageSnapshotOptions): R;
        }
    }
}
