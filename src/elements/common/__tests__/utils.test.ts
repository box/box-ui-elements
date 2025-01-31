import { isThumbnailAvailable } from '../utils';

describe('elements/common/theming/utils', () => {
    describe('isThumbnailAvailable()', () => {
        test('returns `true` when there is a thumbnail and the representation status is `success`', () => {
            const item = {
                representations: {
                    entries: [{ status: { state: 'success' } }],
                },
                thumbnailUrl: 'https://box.com',
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(true);
        });

        test('returns `true` when there is a thumbnail and the representation status is `viewable`', () => {
            const item = {
                representations: {
                    entries: [{ status: { state: 'viewable' } }],
                },
                thumbnailUrl: 'https://box.com',
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(true);
        });

        test('returns `false` when there is no thumbnail', () => {
            const item = {
                thumbnailUrl: undefined,
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(false);
        });

        test('returns `false` when there is a thumbnail but the representation is not ready', () => {
            const item = {
                representations: {
                    entries: [{ status: { state: 'pending' } }],
                },
                thumbnailUrl: 'https://box.com',
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(false);
        });
    });
});
