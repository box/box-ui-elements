import React from 'react';
import { shallow } from 'enzyme';
import UnknownUserAvatar from '../UnknownUserAvatar';

describe('icons/avatars/UnknownUserAvatar', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<UnknownUserAvatar />);

        expect(wrapper.hasClass('unknown-user-avatar')).toEqual(true);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<UnknownUserAvatar height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<UnknownUserAvatar title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
