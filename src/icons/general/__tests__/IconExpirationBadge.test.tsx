import React from 'react';
import { shallow } from 'enzyme';

import IconExpirationBadge from '../IconExpirationBadge';

describe('icons/general/IconExpirationBadge', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconExpirationBadge />);

        expect(wrapper.hasClass('icon-expiration-badge')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconExpirationBadge color={color} />);

        expect(wrapper.find('circle').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconExpirationBadge height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconExpirationBadge title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
