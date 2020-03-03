import React from 'react';
import { shallow } from 'enzyme';

import IconAnyTask from '../IconAnyTask';

describe('icons/general/IconAnyTask', () => {
    const getWrapper = (props = {}) => shallow(<IconAnyTask {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconAnyTask height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'any-task-icon';
        const wrapper = shallow(<IconAnyTask title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
