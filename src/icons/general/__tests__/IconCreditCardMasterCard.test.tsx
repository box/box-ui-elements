import React from 'react';
import { shallow } from 'enzyme';

import IconCreditCardMasterCard from '../IconCreditCardMasterCard';

describe('icons/general/IconCreditCardMasterCard', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconCreditCardMasterCard />);

        expect(wrapper.hasClass('icon-credit-card-mastercard')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconCreditCardMasterCard color={color} />);

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
        const wrapper = shallow(<IconCreditCardMasterCard height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with specified opacity', () => {
        const opacity = 0.5;
        const wrapper = shallow(<IconCreditCardMasterCard opacity={opacity} />);

        expect(wrapper.find('AccessibleSVG').prop('opacity')).toEqual(opacity);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconCreditCardMasterCard title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
