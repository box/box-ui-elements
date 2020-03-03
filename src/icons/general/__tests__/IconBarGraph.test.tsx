import React from 'react';
import { shallow } from 'enzyme';

import IconBarGraph from '../IconBarGraph';

describe('icons/general/IconBarGraph', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconBarGraph />);

        expect(wrapper.hasClass('icon-bar-graph')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconBarGraph color={color} />);

        expect(wrapper.find('g').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconBarGraph height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconBarGraph title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
