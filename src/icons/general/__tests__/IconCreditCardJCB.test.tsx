import React from 'react';
import { shallow } from 'enzyme';

import IconCreditCardJCB from '../IconCreditCardJCB';

describe('icons/general/IconCreditCardJCB', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconCreditCardJCB />);

        expect(wrapper.hasClass('icon-credit-card-jcb')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconCreditCardJCB color={color} />);

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
        const wrapper = shallow(<IconCreditCardJCB height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with specified opacity', () => {
        const opacity = 0.5;
        const wrapper = shallow(<IconCreditCardJCB opacity={opacity} />);

        expect(wrapper.find('AccessibleSVG').prop('opacity')).toEqual(opacity);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconCreditCardJCB title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
