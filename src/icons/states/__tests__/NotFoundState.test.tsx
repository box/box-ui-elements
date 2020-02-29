import React from 'react';
import { shallow } from 'enzyme';
import NotFoundState from '../NotFoundState';

describe('icons/states/NotFoundState', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<NotFoundState />);
        expect(wrapper.hasClass('not-found-state')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<NotFoundState className={className} />);

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<NotFoundState height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<NotFoundState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
