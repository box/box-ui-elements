import React from 'react';

import VersionHistoryLink from '../VersionHistoryLink';

describe('features/item-details/VersionHistoryLink', () => {
    const getWrapper = (props = {}) => shallow(<VersionHistoryLink versionCount={3} {...props} />);

    test('should render the formatted message', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render with PlainButton when onClick is passed, and render additional props', () => {
        const wrapper = getWrapper({
            className: 'test',
            onClick: () => {},
            'data-resin-target': 'versionhistory',
        });

        expect(wrapper).toMatchSnapshot();
    });
});
