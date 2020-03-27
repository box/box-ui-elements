import React from 'react';
import { shallow } from 'enzyme';

import IconRelayFlag from '../IconRelayFlag';

describe('icons/general/IconRelayFlag', () => {
    const getWrapper = (props = {}) => shallow(<IconRelayFlag {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconRelayFlag height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'relay-flag';
        const wrapper = shallow(<IconRelayFlag title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
