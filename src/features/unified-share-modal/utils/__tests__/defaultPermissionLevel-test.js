// @flow

import getDefaultPermissionLevel from '../defaultPermissionLevel';

describe('features/unified-share-modal/utils/defaultPermissionLevel', () => {
    test('should return the default permission level when available', () => {
        const input = [
            {
                value: 'Editor',
                default: false,
            },
            {
                value: 'Viewer',
                default: true,
            },
            {
                value: 'Uploader',
                default: false,
            },
        ];

        const expected = 'Viewer';

        expect(getDefaultPermissionLevel(input)).toStrictEqual(expected);
    });

    test('should return Editor when default permission level is not available', () => {
        const input = [
            {
                value: 'Editor',
                default: false,
            },
            {
                value: 'Viewer',
                default: false,
            },
            {
                value: 'Uploader',
                default: false,
            },
        ];

        const expected = 'Editor';
        expect(getDefaultPermissionLevel(input)).toStrictEqual(expected);
    });
});
