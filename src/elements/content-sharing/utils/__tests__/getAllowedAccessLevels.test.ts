import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN } from '../../../../constants';
import { getAllowedAccessLevels } from '../getAllowedAccessLevels';

describe('getAllowedAccessLevels', () => {
    test('should return default access levels when no levels parameter is provided', () => {
        const result = getAllowedAccessLevels();
        expect(result).toEqual([ACCESS_OPEN, ACCESS_COMPANY, ACCESS_COLLAB]);
    });

    test('should return empty array when levels parameter is empty array', () => {
        const result = getAllowedAccessLevels([]);
        expect(result).toEqual([]);
    });

    test.each([
        [[ACCESS_OPEN, ACCESS_COMPANY, ACCESS_COLLAB]],
        [[ACCESS_OPEN, ACCESS_COMPANY]],
        [[ACCESS_OPEN]],
        [[ACCESS_COMPANY]],
    ])('should return the same levels as provided', levels => {
        const result = getAllowedAccessLevels(levels);
        expect(result).toEqual(levels);
    });

    describe('when disabled reasons are provided', () => {
        test('should return the disabled reasons', () => {
            const result = getAllowedAccessLevels([ACCESS_OPEN], {
                peopleWithTheLink: 'access_policy',
            });
            expect(result).toEqual([{ id: ACCESS_OPEN, disabledReason: 'access_policy' }]);
        });

        test('should return the disabled reason for the associated level', () => {
            const result = getAllowedAccessLevels([ACCESS_OPEN, ACCESS_COMPANY, ACCESS_COLLAB], {
                peopleInThisItem: 'access_policy',
            });
            expect(result).toEqual([
                ACCESS_OPEN,
                ACCESS_COMPANY,
                { id: ACCESS_COLLAB, disabledReason: 'access_policy' },
            ]);
        });
    });
});
