import * as React from 'react';
import { mount } from 'enzyme';

import CommentMenu from '../CommentMenu';

describe('elements/content-sidebar/ActivityFeed/comment/CommentMenu', () => {
    test('should allow user to delete if they have delete permissions on the comment and delete handler is defined', () => {
        const comment = {
            permissions: { can_delete: true },
            onDelete: jest.fn(),
        };

        const wrapper = mount(<CommentMenu {...comment} />);

        wrapper.find('PlainButton').simulate('click');
        expect(wrapper.find('MenuItem.bcs-comment-menu-delete').length).toBe(1);
    });

    test('should not allow user to delete if they lack delete permissions on the comment', () => {
        const comment = {
            permissions: { can_delete: false },
            onDelete: jest.fn(),
        };

        const wrapper = mount(<CommentMenu {...comment} />);

        wrapper.find('PlainButton').simulate('click');
        expect(wrapper.find('MenuItem.bcs-comment-menu-delete').length).toBe(0);
    });

    test('should not allow comment creator to delete if onDelete handler is undefined', () => {
        const comment = {
            permissions: { can_delete: true },
        };

        const wrapper = mount(<CommentMenu {...comment} />);

        wrapper.find('PlainButton').simulate('click');
        expect(wrapper.find('MenuItem.bcs-comment-menu-delete').length).toBe(0);
    });

    test('should allow user to edit if they have edit permissions on the comment and edit handler is defined', () => {
        const comment = {
            permissions: { can_edit: true },
            onEdit: jest.fn(),
        };

        const wrapper = mount(<CommentMenu {...comment} />);

        wrapper.find('PlainButton').simulate('click');
        expect(wrapper.find('MenuItem.bcs-comment-menu-edit').length).toBe(1);
    });

    test('should not allow comment creator to edit if they lack edit permissions on the comment', () => {
        const comment = {
            permissions: { can_edit: false },
            onEdit: jest.fn(),
        };

        const wrapper = mount(<CommentMenu {...comment} />);

        wrapper.find('PlainButton').simulate('click');
        expect(wrapper.find('MenuItem.bcs-comment-menu-edit').length).toBe(0);
    });

    test('should not allow task creator to edit if onEdit handler is undefined', () => {
        const comment = {
            permissions: { can_edit: true },
        };

        const wrapper = mount(<CommentMenu {...comment} />);

        wrapper.find('PlainButton').simulate('click');
        expect(wrapper.find('MenuItem.bcs-comment-menu-edit').length).toBe(0);
    });
});
