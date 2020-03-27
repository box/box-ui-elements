import React from 'react';
import { shallow } from 'enzyme';

import IconCreditCardDiscover from '../IconCreditCardDiscover';

describe('icons/general/IconCreditCardDiscover', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconCreditCardDiscover />);

        expect(wrapper.hasClass('icon-credit-card-discover')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconCreditCardDiscover color={color} />);

        expect(
            wrapper
                .find('g')
                .find('rect')
                .prop('stroke'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconCreditCardDiscover height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with specified opacity', () => {
        const opacity = 0.5;
        const wrapper = shallow(<IconCreditCardDiscover opacity={opacity} />);

        expect(wrapper.find('AccessibleSVG').prop('opacity')).toEqual(opacity);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconCreditCardDiscover title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
