import React from 'react';
import { shallow } from 'enzyme';

import IconCreditCardVisa from '../IconCreditCardVisa';

describe('icons/general/IconCreditCardVisa', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconCreditCardVisa />);

        expect(wrapper.hasClass('icon-credit-card-visa')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconCreditCardVisa color={color} />);

        expect(
            wrapper
                .find('path')
                .find({ opacity: '.5' })
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconCreditCardVisa height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with specified opacity', () => {
        const opacity = 0.5;
        const wrapper = shallow(<IconCreditCardVisa opacity={opacity} />);

        expect(wrapper.find('AccessibleSVG').prop('opacity')).toEqual(opacity);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconCreditCardVisa title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
