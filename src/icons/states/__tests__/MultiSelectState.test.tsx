import React from 'react';
import { shallow } from 'enzyme';
import MultiSelectState from '../MultiSelectState';

describe('icons/states/MultiSelectState', () => {
    test('should correctly render state svg with default state class', () => {
        const wrapper = shallow(<MultiSelectState />);
        expect(wrapper.hasClass('multi-select-state')).toBe(true);
    });

    test('should correctly render state svg with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<MultiSelectState className={className} />);

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render state svg with specified color', () => {
        const color = '#123456';
        const wrapper = shallow(<MultiSelectState color={color} />);

        // All 4 paths should be colorized
        expect(wrapper.find(`path[fill="${color}"]`).length).toEqual(4);
    });

    test('should correctly render state svg with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<MultiSelectState height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<MultiSelectState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
