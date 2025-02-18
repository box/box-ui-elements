import { isThumbnailAvailable } from '../utils';
import { BoxItem } from '../../../common/types/core';

describe('elements/common/theming/utils', () => {
    describe('isThumbnailAvailable()', () => {
        test('returns `true` when the representation status is `success`', () => {
            const item: BoxItem = {
                id: '123',
                representations: {
                    entries: [{ status: { state: 'success' } }],
                },
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(true);
        });

        test('returns `true` when the representation status is `viewable`', () => {
            const item: BoxItem = {
                id: '456',
                representations: {
                    entries: [{ status: { state: 'viewable' } }],
                },
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(true);
        });

        test('returns `false` when the representation response is not ready', () => {
            const item: BoxItem = {
                id: '789',
                representations: {
                    entries: [{ status: { state: 'pending' } }],
                },
            };
            const result = isThumbnailAvailable(item);
            expect(result).toBe(false);
        });
    });
});
