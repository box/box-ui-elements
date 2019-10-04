import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import messages from '../messages';
import VersionsItemRetention from '../VersionsItemRetention';

describe('elements/content-sidebar/versions/VersionsItemRetention', () => {
    const defaultDate = new Date('2019-03-01T00:00:00');
    const dispositionAt = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000); // Future time
    const getWrapper = (props = {}) => shallow(<VersionsItemRetention {...props} />);

    test.each`
        action                  | date             | expected
        ${'permanently_delete'} | ${dispositionAt} | ${messages.versionRetentionDelete.id}
        ${'remove_retention'}   | ${dispositionAt} | ${messages.versionRetentionRemove.id}
        ${'remove_retention'}   | ${null}          | ${messages.versionRetentionIndefinite.id}
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
});
