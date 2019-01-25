import React from 'react';

import IconReturnToAdminConsole from '../IconReturnToAdminConsole';

describe('icons/left-sidebar', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconReturnToAdminConsole />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const color = '#abcdef';
        const wrapper = shallow(<IconReturnToAdminConsole color={color} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const wrapper = shallow(<IconReturnToAdminConsole width={width} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconReturnToAdminConsole title={title} />);

        expect(wrapper).toMatchSnapshot();
    });
});
