import React from 'react';

import IconMoveCopy from '../IconMoveCopy';

describe('icons/general/IconMoveCopy', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconMoveCopy />);

        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.prop('height')).toEqual(14);
        expect(wrapper.prop('width')).toEqual(13);
        const fillColors = wrapper.find('.fill-color');
        for (let i = 0; i < fillColors.length; i++) {
            expect(fillColors.at(i).prop('fill')).toEqual('#444');
        }
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconMoveCopy className="test" />);

        expect(wrapper.hasClass('icon-move-copy')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconMoveCopy color={color} />);

        const fillColors = wrapper.find('.fill-color');
        for (let i = 0; i < fillColors.length; i++) {
            expect(fillColors.at(i).prop('fill')).toEqual(color);
        }
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconMoveCopy width={width} height={height} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconMoveCopy title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
