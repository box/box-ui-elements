import React from 'react';
import { shallow } from 'enzyme';

import IconInviteCollaborators from '../IconInviteCollaborators';

describe('icons/general/IconInviteCollaborators', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<IconInviteCollaborators />);

        expect(wrapper.hasClass('icon-invite-collaborators')).toBe(true);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconInviteCollaborators color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('stroke'),
        ).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconInviteCollaborators height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<IconInviteCollaborators title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
