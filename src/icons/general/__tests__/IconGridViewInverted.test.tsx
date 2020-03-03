import React from 'react';
import { shallow } from 'enzyme';

import IconGridViewInverted from '../IconGridViewInverted';

describe('icons/general/IconGridViewInverted', () => {
    const getWrapper = (props = {}) => shallow(<IconGridViewInverted {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconGridViewInverted width={width} height={height} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'grid-view-inverted-icon';
        const wrapper = shallow(<IconGridViewInverted title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
