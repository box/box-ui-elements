import * as React from 'react';
import { mount } from 'enzyme';
import { COMMENT_TYPE_DEFAULT, COMMENT_TYPE_TASK } from '../../../../../constants';
import CommentMenuItems from '../CommentMenuItems';

describe('elements/content-sidebar/ActivityFeed/comment/CommentMenuItems', () => {
    test('should allow user to delete if they have delete permissions on the comment and delete handler is defined', () => {
        const comment = {
            permissions: { can_delete: true },
            onDeleteClick: jest.fn(),
        };

        const wrapper = mount(<CommentMenuItems {...comment} />);

        expect(wrapper.find('MenuItem.bcs-comment-menu-delete').length).toBe(1);
    });

    test('should not allow user to delete if they lack delete permissions on the comment', () => {
        const comment = {
            permissions: { can_delete: false },
            onDeleteClick: jest.fn(),
        };

        const wrapper = mount(<CommentMenuItems {...comment} />);

        expect(wrapper.find('MenuItem.bcs-comment-menu-delete').length).toBe(0);
    });

    test('should not allow comment creator to delete if onDeleteClick handler is undefined', () => {
        const comment = {
            permissions: { can_delete: true },
        };

        const wrapper = mount(<CommentMenuItems {...comment} />);

        expect(wrapper.find('MenuItem.bcs-comment-menu-delete').length).toBe(0);
    });

    test('should allow user to edit if they have edit permissions on the comment and edit handler is defined', () => {
        const comment = {
            permissions: { can_edit: true },
            onEditClick: jest.fn(),
            type: COMMENT_TYPE_TASK,
        };

        const wrapper = mount(<CommentMenuItems {...comment} />);

        expect(wrapper.find('MenuItem.bcs-comment-menu-edit').length).toBe(1);
    });

    test('should not allow comment creator to edit if they lack edit permissions on the comment', () => {
        const comment = {
            permissions: { can_edit: false },
            onEditClick: jest.fn(),
        };

        const wrapper = mount(<CommentMenuItems {...comment} />);

        expect(wrapper.find('MenuItem.bcs-comment-menu-edit').length).toBe(0);
    });

    test('should not allow comment creator to edit if onEditClick handler is undefined', () => {
        const comment = {
            permissions: { can_edit: true },
        };

        const wrapper = mount(<CommentMenuItems {...comment} />);

        expect(wrapper.find('MenuItem.bcs-comment-menu-edit').length).toBe(0);
    });

    test('should not allow comment creator to edit if the type is not task type', () => {
        const comment = {
            permissions: { can_edit: true },
            onEditClick: jest.fn(),
            type: COMMENT_TYPE_DEFAULT,
        };

        const wrapper = mount(<CommentMenuItems {...comment} />);

        expect(wrapper.find('MenuItem.bcs-comment-menu-edit').length).toBe(0);
    });
});
