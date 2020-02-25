import React from 'react';
import { shallow } from 'enzyme';

import IconUpgradeCloud from '../IconUpgradeCloud';

describe('icons/general/IconUpgradeCloud', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconUpgradeCloud />);

        expect(wrapper.hasClass('icon-upgrade-cloud')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconUpgradeCloud color={color} />);

        expect(
            wrapper
                .find('rect')
                .first()
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 16;
        const wrapper = shallow(<IconUpgradeCloud height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconUpgradeCloud title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
