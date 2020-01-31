import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import messages from '../messages';
import VersionsItemRetention from '../VersionsItemRetention';
import {
    VERSION_RETENTION_DELETE_ACTION,
    VERSION_RETENTION_REMOVE_ACTION,
    VERSION_RETENTION_INDEFINITE,
} from '../../../../constants';

describe('elements/content-sidebar/versions/VersionsItemRetention', () => {
    const defaultDate = new Date('2019-03-01T00:00:00');
    const dispositionAt = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000); // Future time
    const getWrapper = (props = {}) => shallow(<VersionsItemRetention {...props} />);

    test.each`
        action                             | date             | expected
        ${VERSION_RETENTION_DELETE_ACTION} | ${dispositionAt} | ${messages.versionRetentionDelete.id}
        ${VERSION_RETENTION_REMOVE_ACTION} | ${dispositionAt} | ${messages.versionRetentionRemove.id}
        ${VERSION_RETENTION_REMOVE_ACTION} | ${null}          | ${messages.versionRetentionIndefinite.id}
    `('should show the correct message given the disposition action $action', ({ action, date, expected }) => {
        const wrapper = getWrapper({
            retention: {
                applied_at: defaultDate,
                disposition_at: date,
                winning_retention_policy: {
                    disposition_action: action,
                },
            },
        });

        expect(wrapper.find(FormattedMessage).prop('id')).toBe(expected);
    });

    test.each`
        length                          | expected
        ${'5'}                          | ${messages.versionRetentionDelete.id}
        ${VERSION_RETENTION_INDEFINITE} | ${messages.versionRetentionIndefinite.id}
    `('should show the correct message given the retention length $length', ({ length, expected }) => {
        const wrapper = getWrapper({
            retention: {
                applied_at: defaultDate,
                disposition_at: dispositionAt,
                winning_retention_policy: {
                    disposition_action: VERSION_RETENTION_DELETE_ACTION,
                    retention_length: length,
                },
            },
        });

        expect(wrapper.find(FormattedMessage).prop('id')).toBe(expected);
    });
});
