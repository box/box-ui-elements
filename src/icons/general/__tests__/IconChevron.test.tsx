import React from 'react';
import { shallow } from 'enzyme';

import IconChevron, { DirectionType } from '../IconChevron';

describe('icons/general/IconChevron', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconChevron />);

        expect(wrapper.is('span')).toBe(true);
        expect(wrapper.hasClass('icon-chevron')).toBe(true);
        expect(wrapper.hasClass('icon-chevron-up')).toBe(true);
        expect(wrapper.prop('style')).toEqual({
            borderColor: '#000',
            borderStyle: 'solid solid none none',
            borderWidth: '2px',
            display: 'inline-block',
            height: '9px',
            transform: 'rotate(315deg)',
            width: '9px',
        });
    });

    test('should correctly render icon with specified class', () => {
        const className = 'test';
        const wrapper = shallow(<IconChevron className={className} />);

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#fff';
        const wrapper = shallow(<IconChevron color={color} />);

        expect(wrapper.prop('style').borderColor).toEqual(color);
    });

    [
        {
            direction: 'down' as DirectionType,
            rotation: 135,
        },
        {
            direction: 'left' as DirectionType,
            rotation: 225,
        },
        {
            direction: 'right' as DirectionType,
            rotation: 45,
        },
        {
            direction: 'up' as DirectionType,
            rotation: 315,
        },
    ].forEach(({ direction, rotation }) => {
        test('should correctly render icon with specified direction', () => {
            const wrapper = shallow(<IconChevron direction={direction} />);
            expect(wrapper.hasClass(`icon-chevron-${direction}`)).toBe(true);
            expect(wrapper.prop('style').transform).toEqual(`rotate(${rotation}deg)`);
        });
    });

    test('should correctly render icon with specified size', () => {
        const size = '5px';
        const wrapper = shallow(<IconChevron size={size} />);

        expect(wrapper.prop('style').height).toEqual(size);
        expect(wrapper.prop('style').width).toEqual(size);
    });

    test('should correctly render icon with specified thickness', () => {
        const thickness = '2px';
        const wrapper = shallow(<IconChevron thickness={thickness} />);

        expect(wrapper.prop('style').borderWidth).toEqual(thickness);
    });
});
