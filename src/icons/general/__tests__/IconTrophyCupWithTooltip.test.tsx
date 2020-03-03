import React from 'react';
import { shallow } from 'enzyme';

import IconTrophyCupWithTooltip from '../IconTrophyCupWithTooltip';

describe('icons/general/IconTrophyCupWithTooltip', () => {
    const getWrapper = (props = {}) => shallow(<IconTrophyCupWithTooltip {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const wrapper = getWrapper({
            className: 'test',
            height: 27,
            title: 'title',
            tooltipColor: '#6d83ff',
            tooltipText: 'text',
            width: 30,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
