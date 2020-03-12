import React from 'react';
import { shallow } from 'enzyme';
import { bdlBoxBlue } from '../../../styles/variables';
import RecentsEmptyState from '../RecentsEmptyState';

describe('icons/states/RecentsEmptyState', () => {
    test('should correctly render default svg', () => {
        const wrapper = shallow(<RecentsEmptyState />);
        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('recents-empty-state')).toBe(true);
        expect(wrapper.prop('height')).toEqual(150);
        expect(wrapper.prop('width')).toEqual(150);
        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('stroke'),
        ).toEqual(bdlBoxBlue);
    });

    test('should correctly render svg with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<RecentsEmptyState className={className} />);

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render svg with specified color', () => {
        const color = '#123456';
        const wrapper = shallow(<RecentsEmptyState color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('stroke'),
        ).toEqual(color);
    });

    test('should correctly render svg with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<RecentsEmptyState height={height} width={width} />);

        expect(wrapper.prop('height')).toEqual(height);
        expect(wrapper.prop('width')).toEqual(width);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<RecentsEmptyState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
