import { isThumbnailAvailable } from '../utils';

describe('elements/common/theming/utils', () => {
    describe('isThumbnailAvailable()', () => {
        test('returns `true` when the representation status is `success`', () => {
            const item = {
                representations: {
                    entries: [{ status: { state: 'success' } }],
                },
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(true);
        });

        test('returns `true` when the representation status is `viewable`', () => {
            const item = {
                representations: {
                    entries: [{ status: { state: 'viewable' } }],
                },
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(true);
        });

        test('returns `false` when the representation response is not ready', () => {
            const item = {
                representations: {
                    entries: [{ status: { state: 'pending' } }],
                },
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(false);
        });
    });
});
