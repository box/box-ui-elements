import * as React from 'react';
import { mount } from 'enzyme';

import AnnotationActivity from '../AnnotationActivity';
import AnnotationActivityMenu from '../AnnotationActivityMenu';
import CommentForm from '../../comment-form/CommentForm';
import DeleteConfirmation from '../../common/delete-confirmation';
import Media from '../../../../../components/media';
import messages from '../messages';
import SelectableActivityCard from '../../SelectableActivityCard';

jest.mock('../../Avatar', () => () => 'Avatar');

const currentUser = {
    name: 'testuser',
    id: 11,
};
const mentionSelectorContacts = [];
const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';
const TIME_STRING_SEPT_28_2017 = '2017-09-28T10:40:41-07:00';

const allHandlers = {
    contacts: {
        getMentionWithQuery: jest.fn(),
    },
};

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivity', () => {
    const mockAnnotation = {
        created_at: TIME_STRING_SEPT_27_2017,
        created_by: { name: 'Jane Doe', id: 10 },
        description: { message: 'test' },
        file_version: {
            id: '456',
            version_number: '2',
        },
        id: '123',
        target: { location: { value: 1 } },
    };
    const mockActivity = {
        currentUser,
        handlers: allHandlers,
        hasVersions: true,
        isCurrentVersion: true,
        item: mockAnnotation,
        mentionSelectorContacts,
    };

    const getWrapper = (props = {}) => mount(<AnnotationActivity {...mockActivity} {...props} />);

    beforeEach(() => {
        CommentForm.default = jest.fn().mockReturnValue(<div />);
    });

    test('should not render annotation activity menu when can_delete is false and can_edit is false and can_resolve is false', () => {
        const item = {
            ...mockAnnotation,
            permissions: { can_delete: false, can_edit: false, can_resolve: false },
        };

        const wrapper = getWrapper({ item });

        expect(wrapper.exists(AnnotationActivityMenu)).toBe(false);
    });

    test.each`
        canDelete | canEdit  | canResolve
        ${false}  | ${false} | ${true}
        ${true}   | ${false} | ${false}
        ${false}  | ${true}  | ${false}
        ${false}  | ${true}  | ${true}
        ${true}   | ${true}  | ${false}
        ${true}   | ${false} | ${true}
        ${true}   | ${true}  | ${true}
    `(
        'should correctly render annotation activity when canDelete: $canDelete and canEdit: $canEdit and canResolve: $canResolve',
        ({ canDelete, canEdit, canResolve }) => {
            const unixTime = new Date(TIME_STRING_SEPT_27_2017).getTime();
            const item = {
                ...mockAnnotation,
                permissions: { can_delete: canDelete, can_edit: canEdit, can_resolve: canResolve },
            };

            const wrapper = getWrapper({ item });

            expect(wrapper.find('ActivityTimestamp').prop('date')).toEqual(unixTime);
            expect(wrapper.find('AnnotationActivityLink').first().props()).toMatchObject({
                'data-resin-target': 'annotationLink',
                message: {
                    ...messages.annotationActivityPageItem,
                    values: { number: 1 },
                },
            });
            expect(wrapper.exists(AnnotationActivityMenu)).toBe(true);
            expect(wrapper.find('ForwardRef(withFeatureConsumer(ActivityMessage))').prop('tagged_message')).toEqual(
                mockActivity.item.description.message,
            );
        },
    );

    test('should render CommentForm if user clicks on the Modify menu item', () => {
        const activity = {
            item: {
                ...mockAnnotation,
                isPending: false,
                permissions: { can_edit: true },
            },
        };

        const wrapper = getWrapper({ ...mockActivity, ...activity });

        React.act(() => {
            wrapper.find(AnnotationActivityMenu).prop('onEdit')();
        });
        wrapper.update();
        expect(wrapper.exists('ForwardRef(withFeatureConsumer(CommentForm))')).toBe(true);

        // Firing the onCancel prop will remove the CommentForm
        React.act(() => {
            wrapper.find('ForwardRef(withFeatureConsumer(CommentForm))').props().onCancel();
        });
        wrapper.update();
        expect(wrapper.exists('ForwardRef(withFeatureConsumer(CommentForm))')).toBe(false);
    });

    test('should correctly render annotation activity of another file version', () => {
        const wrapper = getWrapper({ isCurrentVersion: false });

        expect(wrapper.find('AnnotationActivityLink').first().prop('message')).toEqual({
            ...messages.annotationActivityVersionLink,
            values: { number: '2' },
        });
    });

    test('should render version unavailable if file version is null', () => {
        const wrapper = getWrapper({ item: { ...mockAnnotation, file_version: null } });
        const activityLink = wrapper.find('AnnotationActivityLink').first();

        expect(activityLink.prop('message')).toEqual({
            ...messages.annotationActivityVersionUnavailable,
        });
        expect(activityLink.prop('isDisabled')).toBe(true);
    });

    test('should not render file version link if hasVersions is false', () => {
        const wrapper = getWrapper({ hasVersions: false });
        expect(wrapper.exists('AnnotationActivityLink')).toBe(false);
    });

    test('should render commenter as a link', () => {
        const wrapper = getWrapper();
        expect(wrapper.find('UserLink').prop('name')).toEqual(mockActivity.item.created_by.name);
    });

    test('should not show actions menu when annotation activity is pending', () => {
        const item = {
            ...mockAnnotation,
            permissions: { can_delete: true },
            isPending: true,
        };

        const wrapper = getWrapper({ item });

        expect(wrapper.exists(AnnotationActivityMenu)).toBe(false);
        expect(wrapper.find(Media).hasClass('bcs-is-pending')).toBe(true);
    });

    test('should render an error when one is defined', () => {
        const activity = {
            item: {
                ...mockAnnotation,
                error: {
                    title: 'error',
                    message: 'This is an error message',
                },
            },
            onDelete: jest.fn(),
        };

        const wrapper = getWrapper(activity);
        expect(wrapper.find('ActivityError').length).toEqual(1);
    });

    test('should render an error cta when an action is defined', () => {
        const onActionSpy = jest.fn();
        const activity = {
            item: {
                ...mockAnnotation,
                error: {
                    title: 'error',
                    message: 'This is an error message',
                    action: {
                        text: 'click',
                        onAction: onActionSpy,
                    },
                },
            },
            onDelete: jest.fn(),
        };

        const wrapper = mount(<AnnotationActivity {...mockActivity} {...activity} />);

        const inlineErrorActionLink = wrapper.find('InlineError').find('button.bcs-ActivityError-action');
        expect(inlineErrorActionLink.length).toEqual(1);

        const inlineErrorActionOnClick = inlineErrorActionLink.prop('onClick');

        inlineErrorActionOnClick();

        expect(onActionSpy).toHaveBeenCalledTimes(1);
    });

    test.each`
        created_at                  | modified_at                 | status        | expectedIsEdited
        ${TIME_STRING_SEPT_27_2017} | ${undefined}                | ${'open'}     | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_27_2017} | ${'open'}     | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_28_2017} | ${'open'}     | ${true}
        ${TIME_STRING_SEPT_27_2017} | ${undefined}                | ${'resolved'} | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_27_2017} | ${'resolved'} | ${false}
        ${TIME_STRING_SEPT_27_2017} | ${TIME_STRING_SEPT_28_2017} | ${'resolved'} | ${false}
    `(
        `given created_at = $created_at, modified_at = $modified_at and status = $status, isEdited prop on ActivityMessage should be: $expectedIsEdited`,
        ({ created_at, modified_at, status, expectedIsEdited }) => {
            const wrapper = getWrapper({ item: { ...mockAnnotation, created_at, modified_at, status } });

            expect(wrapper.find('ForwardRef(withFeatureConsumer(ActivityMessage))').prop('isEdited')).toEqual(
                expectedIsEdited,
            );
        },
    );

    describe('delete confirmation behavior', () => {
        test('should render the DeleteConfirmation when delete menu item is selected', () => {
            const item = {
                ...mockAnnotation,
                permissions: { can_delete: true },
            };

            const wrapper = getWrapper({ item });

            React.act(() => {
                wrapper.find(AnnotationActivityMenu).prop('onDelete')();
            });

            expect(wrapper.exists(DeleteConfirmation));
        });

        test('should close the DeleteConfirmation when cancel is selected', () => {
            const item = {
                ...mockAnnotation,
                permissions: { can_delete: true },
            };

            const wrapper = getWrapper({ item });

            React.act(() => {
                wrapper.find(AnnotationActivityMenu).prop('onDelete')();
            });
            wrapper.update();
            React.act(() => {
                wrapper.find(DeleteConfirmation).prop('onDeleteCancel')();
            });
            wrapper.update();

            expect(wrapper.exists(DeleteConfirmation)).toBe(false);
        });

        test('should call onDelete when confirm delete is selected', () => {
            const onDelete = jest.fn();
            const permissions = { can_delete: true };
            const item = {
                ...mockAnnotation,
                permissions,
            };

            const wrapper = getWrapper({ item, onDelete });

            React.act(() => {
                wrapper.find(AnnotationActivityMenu).prop('onDelete')();
            });
            wrapper.update();
            React.act(() => {
                wrapper.find(DeleteConfirmation).prop('onDeleteConfirm')();
            });
            wrapper.update();

            expect(onDelete).toHaveBeenCalledWith({ id: mockAnnotation.id, permissions });
            expect(wrapper.exists(DeleteConfirmation)).toBe(false);
        });
    });

    describe('SelectableActivityCard', () => {
        const getActivityItem = overrides => ({
            ...mockAnnotation,
            permissions: { can_delete: true, can_edit: true },
            ...overrides,
        });

        test('should render as SelectableActivityCard', () => {
            const wrapper = getWrapper();

            expect(wrapper.exists(SelectableActivityCard)).toBe(true);
            expect(wrapper.find(SelectableActivityCard).props()).toMatchObject({
                className: 'bcs-AnnotationActivity',
                'data-resin-iscurrent': true,
                'data-resin-itemid': mockAnnotation.id,
                'data-resin-feature': 'annotations',
                'data-resin-target': 'annotationButton',
                isDisabled: false,
                onMouseDown: expect.any(Function),
                onSelect: expect.any(Function),
            });
        });

        test('should disable card if there is an error', () => {
            const activity = {
                item: {
                    ...mockAnnotation,
                    error: {
                        title: 'error',
                        message: 'This is an error message',
                        action: {
                            text: 'click',
                        },
                    },
                },
            };
            const wrapper = getWrapper(activity);

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(true);
        });

        test('should disable card if the overflow menu is open', () => {
            const wrapper = getWrapper({ item: getActivityItem() });

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(false);

            React.act(() => {
                wrapper.find(AnnotationActivityMenu).prop('onMenuOpen')();
            });
            wrapper.update();

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(true);
        });

        test('should disable card if editing the comment', () => {
            const wrapper = getWrapper({ item: getActivityItem() });

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(false);

            React.act(() => {
                wrapper.find(AnnotationActivityMenu).prop('onEdit')();
            });
            wrapper.update();

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(true);
        });

        test('should disable card if file version is unavailable', () => {
            const wrapper = getWrapper({ item: getActivityItem({ file_version: null }) });

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(true);
        });

        test('should disable card if the delete confirmation is open', () => {
            const wrapper = getWrapper({ item: getActivityItem() });

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(false);

            React.act(() => {
                wrapper.find(AnnotationActivityMenu).prop('onDelete')();
            });
            wrapper.update();

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(true);
        });

        test('should stop propagation of mousedown event from SelectableActivityCard', () => {
            const event = { stopPropagation: jest.fn() };
            const wrapper = getWrapper({ item: getActivityItem() });

            wrapper.find(SelectableActivityCard).simulate('mousedown', event);

            expect(event.stopPropagation).toHaveBeenCalled();
        });

        test('should not stop propagation of mousedown event from SelectableActivityCard when disabled', () => {
            const event = { stopPropagation: jest.fn() };
            const wrapper = getWrapper({ item: getActivityItem({ file_version: null }) });

            expect(wrapper.find(SelectableActivityCard).prop('isDisabled')).toBe(true);

            wrapper.find(SelectableActivityCard).simulate('mousedown', event);

            expect(event.stopPropagation).not.toHaveBeenCalled();
        });
    });
});
