import * as React from 'react';
import { shallow } from 'enzyme';

import { VersionBase as Version } from '../Version';

const translationProps = {
    intl: { formatMessage: () => {} }
};

describe('components/ContentSidebar/ActivityFeed/version/Version', () => {
    test('should correctly render version', () => {
        const version = {
            modified_at: Date.now(),
            id: '148953',
            version_number: 1,
            modified_by: { name: '50 Cent', id: 10 },
            action: 'upload'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.hasClass('bcs-version')).toBe(true);
    });

    test('should correctly render info icon if onInfo is passed', () => {
        const version = {
            modified_at: Date.now(),
            id: '148953',
            onInfo: () => {},
            version_number: 1,
            modified_by: { name: '50 Cent', id: 10 },
            action: 'upload'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.hasClass('bcs-version')).toBe(true);
        expect(wrapper.find('IconInfoInverted').length).toBe(1);
    });

    test('should correctly render delete version', () => {
        const version = {
            modified_at: Date.now(),
            id: '148953',
            version_number: 1,
            modified_by: { name: '50 Cent', id: 10 },
            action: 'delete'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.find('FormattedMessage').length).toEqual(1);
    });

    test('should correctly render restore version', () => {
        const version = {
            modified_at: Date.now(),
            id: '148953',
            version_number: 1,
            modified_by: { name: '50 Cent', id: 10 },
            action: 'restore'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.find('FormattedMessage').length).toEqual(1);
    });

    test('should correctly render restore version', () => {
        const version = {
            modified_at: Date.now(),
            id: '148953',
            version_number: 1,
            modified_by: { name: '50 Cent', id: 10 },
            action: 'restore'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.find('FormattedMessage').length).toEqual(1);
    });
});
