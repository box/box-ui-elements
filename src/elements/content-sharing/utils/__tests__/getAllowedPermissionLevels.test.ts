import { PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../../../constants';
import { getAllowedPermissionLevels } from '../getAllowedPermissionLevels';

describe('getAllowedPermissionLevels', () => {
    test('should return both permission levels when all conditions are met', () => {
        const result = getAllowedPermissionLevels(true, true, PERMISSION_CAN_DOWNLOAD);
        expect(result).toEqual([PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW]);
    });

    test.each([PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW])(
        'should return only current permission when cannot change access level',
        permission => {
            const result = getAllowedPermissionLevels(false, true, permission);
            expect(result).toEqual([permission]);
        },
    );

    test('should exclude download permission when download setting is not available', () => {
        const result = getAllowedPermissionLevels(true, false, PERMISSION_CAN_DOWNLOAD);
        expect(result).toEqual([PERMISSION_CAN_PREVIEW]);
    });

    test('should return empty array for unknown permission values when cannot change access level', () => {
        const unknownPermission = 'unknown_permission';
        const result = getAllowedPermissionLevels(false, true, unknownPermission);
        expect(result).toEqual([]);
    });
});
