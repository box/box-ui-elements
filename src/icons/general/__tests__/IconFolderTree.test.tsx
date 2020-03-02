import React from 'react';
import { shallow } from 'enzyme';

import IconFolderTree from '../IconFolderTree';

describe('icons/general/IconFolderTree', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconFolderTree />);

        expect(wrapper.hasClass('bdl-IconFolderTree')).toEqual(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconFolderTree color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 20;
        const height = 20;
        const wrapper = shallow(<IconFolderTree height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'Folder tree';
        const wrapper = shallow(<IconFolderTree title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
