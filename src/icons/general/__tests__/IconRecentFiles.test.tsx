import React from 'react';
import { shallow } from 'enzyme';

import IconRecentFiles from '../IconRecentFiles';

describe('icons/general/IconRecentFiles', () => {
    const getWrapper = (props = {}) => shallow(<IconRecentFiles {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified props', () => {
        const className = 'fake-class';
        const height = 123;
        const title = 'Fake Title';
        const width = 987;

        const wrapper = getWrapper({ className, height, title, width });

        expect(wrapper.hasClass(`icon-recent-files ${className}`)).toBe(true);
        expect(wrapper.props().height).toBe(height);
        expect(wrapper.props().title).toBe(title);
        expect(wrapper.props().width).toBe(width);
    });
});
