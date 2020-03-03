import React from 'react';
import { shallow } from 'enzyme';

import IconDrag from '../IconDrag';

describe('icons/general/IconDrag', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconDrag />);

        expect(wrapper.hasClass('icon-drag')).toEqual(true);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconDrag height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'drag me';
        const wrapper = shallow(<IconDrag title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
