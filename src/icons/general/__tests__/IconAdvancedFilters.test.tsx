import React from 'react';
import { shallow } from 'enzyme';

import IconAdvancedFilters from '../IconAdvancedFilters';

describe('icons/general/IconAdvancedFilters', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconAdvancedFilters />);

        expect(wrapper.hasClass('icon-advanced-filters')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconAdvancedFilters color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconAdvancedFilters height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconAdvancedFilters title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
