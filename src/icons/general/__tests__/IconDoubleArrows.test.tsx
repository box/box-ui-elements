import React from 'react';
import { shallow } from 'enzyme';

import { bdlGray40 } from '../../../styles/variables';
import IconDoubleArrows from '../IconDoubleArrows';

describe('icons/general/IconDoubleArrows', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconDoubleArrows />);

        expect(wrapper.hasClass('icon-double-arrows')).toEqual(true);
    });

    test('should correctly render default icon with default color', () => {
        const wrapper = shallow(<IconDoubleArrows />);

        expect(wrapper.find('path').prop('fill')).toEqual(bdlGray40);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#bfbfbf';
        const wrapper = shallow(<IconDoubleArrows color={color} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 50;
        const height = 50;
        const wrapper = shallow(<IconDoubleArrows height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'whazzah';
        const wrapper = shallow(<IconDoubleArrows title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
