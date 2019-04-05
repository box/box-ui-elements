import React from 'react';

import IconTaskGeneral from '../IconTaskGeneral';

describe('icons/general/IconTaskGeneral', () => {
    const getWrapper = (props = {}) => shallow(<IconTaskGeneral {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconTaskGeneral height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'task-icon';
        const wrapper = shallow(<IconTaskGeneral title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#fff';
        const wrapper = shallow(<IconTaskGeneral color={color} />);

        expect(wrapper.find('circle').prop('fill')).toEqual(color);
    });
});
