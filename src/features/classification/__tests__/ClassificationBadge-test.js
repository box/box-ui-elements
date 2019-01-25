import React from 'react';

import ClassificationBadge from '../ClassificationBadge';

describe('features/classification/ClassificationBadge', () => {
    const getWrapper = (props = {}) => shallow(<ClassificationBadge value="Confidential" {...props} />);

    test('should render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render tooltip when specified', () => {
        const wrapper = getWrapper({
            tooltip: 'Sensitive',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render tooltip with position when specified', () => {
        const wrapper = getWrapper({
            tooltip: 'Sensitive',
            tooltipPosition: 'middle-left',
        });

        expect(wrapper).toMatchSnapshot();
    });
});
