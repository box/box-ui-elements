import type { BoxItem } from '../../../common/types/core';
import { isThumbnailAvailable } from '../utils';

describe('elements/common/theming/utils', () => {
    describe('isThumbnailAvailable()', () => {
        test.each([
            { expected: true, state: 'success' },
            { expected: true, state: 'viewable' },
            { expected: false, state: 'pending' },
        ])('returns `$expected` when the representation status is `$state`', ({ expected, state }) => {
            const item: BoxItem = {
                id: '1',
                representations: {
                    entries: [{ status: { state } }],
                },
            };
            expect(isThumbnailAvailable(item)).toBe(expected);
        });
    });
});
