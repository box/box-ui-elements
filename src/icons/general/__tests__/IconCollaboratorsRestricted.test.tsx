import React from 'react';
import { shallow } from 'enzyme';

import IconCollaboratorsRestricted from '../IconCollaboratorsRestricted';

describe('icons/general/IconCollaboratorsRestricted', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconCollaboratorsRestricted />);

        expect(wrapper.hasClass('icon-collaborators-restricted')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconCollaboratorsRestricted color={color} />);

        expect(wrapper.find('g').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconCollaboratorsRestricted height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconCollaboratorsRestricted title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
