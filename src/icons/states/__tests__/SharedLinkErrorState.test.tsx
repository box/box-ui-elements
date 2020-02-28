import React from 'react';
import { shallow } from 'enzyme';
import SharedLinkErrorState from '../SharedLinkErrorState';

describe('icons/states/SharedLinkErrorState', () => {
    test('should correctly render default svg', () => {
        const wrapper = shallow(<SharedLinkErrorState />);
        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('shared-link-error-state')).toBe(true);
        expect(wrapper.prop('height')).toEqual(173);
        expect(wrapper.prop('width')).toEqual(175);
    });

    test('should correctly render svg with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<SharedLinkErrorState className={className} />);

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render svg with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<SharedLinkErrorState height={height} width={width} />);

        expect(wrapper.prop('height')).toEqual(height);
        expect(wrapper.prop('width')).toEqual(width);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<SharedLinkErrorState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
