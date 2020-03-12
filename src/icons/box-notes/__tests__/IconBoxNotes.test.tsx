import React from 'react';
import { shallow } from 'enzyme';

import IconBoxNotes from '../IconBoxNotes';

describe('icons/box-notes/IconBoxNotes', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconBoxNotes />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified class', () => {
        const wrapper = shallow(<IconBoxNotes className="foo" />);

        expect(wrapper.hasClass('foo')).toEqual(true);
        expect(wrapper.hasClass('icon-boxnotes')).toEqual(true);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconBoxNotes height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconBoxNotes title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
