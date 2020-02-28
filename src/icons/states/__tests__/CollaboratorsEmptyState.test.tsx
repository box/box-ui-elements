import React from 'react';
import { shallow } from 'enzyme';
import { bdlBoxBlue } from '../../../styles/variables';

import CollaboratorsEmptyState from '../CollaboratorsEmptyState';

describe('icons/states/CollaboratorsEmptyState', () => {
    test('should correctly render default svg', () => {
        const wrapper = shallow(<CollaboratorsEmptyState />);
        expect(wrapper.is('AccessibleSVG')).toBe(true);
        expect(wrapper.hasClass('collaborators-empty-state')).toBe(true);
        expect(wrapper.prop('height')).toEqual(64);
        expect(wrapper.prop('width')).toEqual(90);
        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
    });

    test('should correctly render svg with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<CollaboratorsEmptyState className={className} />);

        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should correctly render svg with specified color', () => {
        const color = '#123456';
        const wrapper = shallow(<CollaboratorsEmptyState color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
    });

    test('should correctly render svg with specified width and height', () => {
        const width = 17;
        const height = 21;
        const wrapper = shallow(<CollaboratorsEmptyState height={height} width={width} />);

        expect(wrapper.prop('height')).toEqual(height);
        expect(wrapper.prop('width')).toEqual(width);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<CollaboratorsEmptyState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });
});
