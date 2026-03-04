import {
    ACCESS_OPEN,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_EDIT,
    PERMISSION_CAN_PREVIEW,
    TYPE_FILE,
} from '../../../../constants';

import { getAllowedPermissionLevels } from '../getAllowedPermissionLevels';

describe('getAllowedPermissionLevels', () => {
    const defaultParams = {
        access: ACCESS_OPEN,
        canChangeAccessLevel: true,
        extension: 'pdf',
        isDownloadSettingAvailable: true,
        itemType: TYPE_FILE,
        permission: PERMISSION_CAN_DOWNLOAD,
    };

    test('should return all permission levels when all conditions are met', () => {
        const result = getAllowedPermissionLevels(defaultParams);
        expect(result).toEqual([PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW, PERMISSION_CAN_EDIT]);
    });

    test.each([PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW, PERMISSION_CAN_EDIT])(
        'should return only current permission when cannot change access level',
        permission => {
            const result = getAllowedPermissionLevels({
                ...defaultParams,
                canChangeAccessLevel: false,
                permission,
            });
            expect(result).toEqual([permission]);
        },
    );

    test('should exclude download permission when download setting is not available', () => {
        const result = getAllowedPermissionLevels({
            ...defaultParams,
            isDownloadSettingAvailable: false,
        });
        expect(result).toEqual([PERMISSION_CAN_PREVIEW, PERMISSION_CAN_EDIT]);
    });

    test('should return empty array for unknown permission values when cannot change access level', () => {
        const result = getAllowedPermissionLevels({
            ...defaultParams,
            canChangeAccessLevel: false,
            permission: 'unknown_permission',
        });
        expect(result).toEqual([]);
    });

    test.each([
        [true, true, PERMISSION_CAN_PREVIEW],
        [true, true, PERMISSION_CAN_DOWNLOAD],
        [false, true, PERMISSION_CAN_PREVIEW],
    ])(
        'should exclude edit permission for webdocs when canChangeAccessLevel=%s, isDownloadSettingAvailable=%s, permission=%s',
        (canChangeAccessLevel, isDownloadSettingAvailable, permission) => {
            const result = getAllowedPermissionLevels({
                ...defaultParams,
                canChangeAccessLevel,
                extension: 'webdoc',
                isDownloadSettingAvailable,
                permission,
            });
            expect(result).not.toContain(PERMISSION_CAN_EDIT);
        },
    );
});
