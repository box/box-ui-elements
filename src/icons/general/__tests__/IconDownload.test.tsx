import React from 'react';
import { shallow } from 'enzyme';
import IconDownload from '../IconDownload';

describe('icons/general/IconDownload', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconDownload />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(16);
        expect(wrapper.prop('width')).toEqual(16);
        const strokeColors = wrapper.find('.stroke-color');
        for (let i = 0; i < strokeColors.length; i += 1) {
            expect(strokeColors.at(i).prop('stroke')).toEqual('#444');
        }
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconDownload className="test" />);

        expect(wrapper.hasClass('icon-download')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconDownload color={color} />);

        const strokeColors = wrapper.find('.stroke-color');
        for (let i = 0; i < strokeColors.length; i += 1) {
            expect(strokeColors.at(i).prop('stroke')).toEqual(color);
        }
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconDownload height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconDownload title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
