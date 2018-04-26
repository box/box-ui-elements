import * as React from 'react';
import { shallow } from 'enzyme';

import { VersionBase as Version } from '../Version';

const translationProps = {
    intl: { formatMessage: () => {} }
};

describe('components/ContentSidebar/ActivityFeed/version/Version', () => {
    test('should correctly render version', () => {
        const version = {
            createdAt: Date.now(),
            id: '148953',
            versionNumber: 1,
            createdBy: { name: '50 Cent', id: 10 },
            action: 'upload'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.hasClass('bcs-version')).toBe(true);
    });

    test('should correctly render info icon if onInfo is passed', () => {
        const version = {
            createdAt: Date.now(),
            id: '148953',
            onInfo: () => {},
            versionNumber: 1,
            createdBy: { name: '50 Cent', id: 10 },
            action: 'upload'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.hasClass('bcs-version')).toBe(true);
        expect(wrapper.find('IconInfoInverted').length).toBe(1);
    });

    test('should correctly render delete version', () => {
        const version = {
            createdAt: Date.now(),
            id: '148953',
            versionNumber: 1,
            createdBy: { name: '50 Cent', id: 10 },
            action: 'delete'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.find('FormattedMessage').length).toEqual(1);
    });

    test('should correctly render restore version', () => {
        const version = {
            createdAt: Date.now(),
            id: '148953',
            versionNumber: 1,
            createdBy: { name: '50 Cent', id: 10 },
            action: 'restore'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.find('FormattedMessage').length).toEqual(1);
    });

    test('should correctly render restore version', () => {
        const version = {
            createdAt: Date.now(),
            id: '148953',
            versionNumber: 1,
            createdBy: { name: '50 Cent', id: 10 },
            action: 'restore'
        };

        const wrapper = shallow(<Version {...version} {...translationProps} />);

        expect(wrapper.find('FormattedMessage').length).toEqual(1);
    });
});
