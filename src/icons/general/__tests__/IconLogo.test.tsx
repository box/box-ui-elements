import React from 'react';
import { shallow } from 'enzyme';

import IconLogo from '../IconLogo';
import { bdlBoxBlue } from '../../../styles/variables';

describe('icons/general/IconLogo', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconLogo />);

        expect(wrapper.hasClass('icon-logo')).toBe(true);
        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('width')).toEqual(45);
        expect(wrapper.prop('height')).toEqual(25);
        expect(wrapper.prop('viewBox')).toEqual('0 0 98 52');
        expect(wrapper.find('path').prop('fill')).toEqual(bdlBoxBlue);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconLogo color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconLogo height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = <div>Hi There</div>;
        const wrapper = shallow(<IconLogo title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
