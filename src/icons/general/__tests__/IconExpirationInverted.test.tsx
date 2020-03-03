import React from 'react';
import { shallow } from 'enzyme';
import IconExpirationInverted from '../IconExpirationInverted';

describe('icons/general/IconExpirationInverted', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconExpirationInverted />);

        expect(wrapper.hasClass('icon-expiration-inverted')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconExpirationInverted color={color} />);

        expect(wrapper.find('g').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconExpirationInverted height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconExpirationInverted title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
