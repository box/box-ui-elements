import * as React from 'react';
import { shallow } from 'enzyme';
import { VersionBase as Version } from '../Version';

const translationProps = {
    intl: { formatMessage: () => {} },
};

describe('elements/content-sidebar/ActivityFeed/version/Version', () => {
    const defaultDate = new Date('2019-03-01T00:00:00');
    const defaultUser = { name: 'Test User', id: 10 };
    const restoreUser = { name: 'Restore User', id: 12 };
    const trashedUser = { name: 'Delete User', id: 11 };
    const defaults = {
        id: '12345',
        action: 'upload',
        created_at: defaultDate,
        is_download_available: true,
        modified_at: defaultDate,
        modified_by: defaultUser,
        permissions: {
            can_delete: true,
            can_preview: true,
        },
        size: 10240,
        version_number: '1',
    };
    const getVersion = (overrides = {}) => ({
        ...defaults,
        ...overrides,
    });
    const getWrapper = (props = {}) => shallow(<Version {...defaults} {...props} />);

    test('should correctly render version', () => {
        const version = {
            modified_at: Date.now(),
            id: '148953',
            version_number: 1,
            modified_by: defaultUser,
            action: 'upload',
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.hasClass('bcs-Version')).toBe(true);
    });

    test('should correctly render info icon if onInfo is passed', () => {
        const version = {
            modified_at: Date.now(),
            id: '148953',
            onInfo: () => {},
            version_number: 1,
            modified_by: defaultUser,
            action: 'upload',
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.exists('IconInfoInverted')).toBe(true);
        expect(wrapper.hasClass('bcs-Version')).toBe(true);
    });

    test.each`
        modified_by    | restored_by    | trashed_by     | expected
        ${defaultUser} | ${null}        | ${null}        | ${defaultUser.name}
        ${defaultUser} | ${restoreUser} | ${null}        | ${restoreUser.name}
        ${defaultUser} | ${restoreUser} | ${trashedUser} | ${restoreUser.name}
        ${defaultUser} | ${null}        | ${trashedUser} | ${trashedUser.name}
    `('should render the correct user name', ({ expected, modified_by, restored_by, trashed_by }) => {
        const version = getVersion({
            modified_by,
            restored_by,
            trashed_by,
        });
        const wrapper = getWrapper(version);
        expect(wrapper.find('FormattedMessage').prop('values')).toEqual({
            name: <strong>{expected}</strong>,
            version_number: '1',
        });
    });
});
