import React from 'react';
import { shallow } from 'enzyme';
import IconChatBubble from '../IconChatBubble';

describe('icons/two-toned/IconChatBubble', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconChatBubble />);
        expect(wrapper.hasClass('icon-chat-bubble')).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconChatBubble height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'test';
        const wrapper = shallow(<IconChatBubble title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
