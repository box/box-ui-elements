import React from 'react';

import ClassifiedBadge from '../ClassifiedBadge';

describe('features/classification/ClassifiedBadge', () => {
    const getWrapper = (props = {}) => shallow(<ClassifiedBadge {...props} />);

    test('should render a classified badge with tooltip disabled', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with a tooltip', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            tooltipText: 'fubar',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge within a button when onClick is provided', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            tooltipText: 'fubar',
            onClick: () => {},
        });
        expect(wrapper).toMatchSnapshot();
    });
});
