import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import selectors from '../../../../common/selectors/version';
import { VersionBase as Version } from '../Version';
import { FILE_REQUEST_NAME, PLACEHOLDER_USER, VERSION_UPLOAD_ACTION } from '../../../../../constants';
import messages from '../../../../common/messages';

const translationProps = {
    intl: { formatMessage: anyString => anyString },
};

const priorCollaborator = <FormattedMessage {...messages.priorCollaborator} />;

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
    const getWrapper = (props = {}) => shallow(<Version {...defaults} {...props} />);

    beforeEach(() => {
        selectors.getVersionAction = jest.fn().mockReturnValueOnce(VERSION_UPLOAD_ACTION);
        selectors.getVersionUser = jest.fn().mockReturnValueOnce(defaultUser);
    });

    test('should correctly render version', () => {
        const version = {
            id: '148953',
            modified_at: Date.now(),
            modified_by: defaultUser,
            version_number: '1',
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.hasClass('bcs-Version')).toBe(true);
    });

    test('should correctly render info icon if onInfo is passed', () => {
        const version = {
            id: '148953',
            modified_at: Date.now(),
            modified_by: defaultUser,
            onInfo: () => {},
            version_number: '1',
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.exists('IconInfo')).toBe(true);
        expect(wrapper.hasClass('bcs-Version')).toBe(true);
    });

    test.each`
        versionUser         | expected
        ${defaultUser}      | ${defaultUser.name}
        ${restoreUser}      | ${restoreUser.name}
        ${trashedUser}      | ${trashedUser.name}
        ${PLACEHOLDER_USER} | ${priorCollaborator}
    `('should render the correct user name', ({ expected, versionUser }) => {
        selectors.getVersionUser = jest.fn().mockReturnValueOnce(versionUser);

        const wrapper = getWrapper();

        expect(wrapper.find('FormattedMessage').prop('values')).toEqual({
            name: <strong>{expected}</strong>,
            version_number: '1',
        });
    });

    test.each`
        versionUser                                         | expected
        ${defaultUser}                                      | ${defaultUser.name}
        ${restoreUser}                                      | ${restoreUser.name}
        ${trashedUser}                                      | ${trashedUser.name}
        ${{ ...PLACEHOLDER_USER, name: FILE_REQUEST_NAME }} | ${messages.fileRequestDisplayName}
    `('should render the correct user name if uploader_user_name present', ({ expected, versionUser }) => {
        selectors.getVersionUser = jest.fn().mockReturnValueOnce(versionUser);

        const wrapper = getWrapper({ ...translationProps, uploader_display_name: FILE_REQUEST_NAME });

        expect(wrapper.find('FormattedMessage').prop('values')).toEqual({
            name: <strong>{expected}</strong>,
            version_number: '1',
        });
    });

    test('should correctly render promoted version', () => {
        selectors.getVersionUser = jest.fn().mockReturnValueOnce(defaultUser);

        const version = {
            id: '14',
            modified_at: Date.now(),
            modified_by: defaultUser,
            version_number: '10',
            version_promoted: '2',
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.hasClass('bcs-Version')).toBe(true);
        expect(wrapper.find('FormattedMessage').prop('values')).toEqual({
            name: <strong>{defaultUser.name}</strong>,
            version_number: '10',
            version_promoted: '2',
        });
    });
});
