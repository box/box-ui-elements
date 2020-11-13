import * as React from 'react';
import { shallow } from 'enzyme';

import AnnotationActivity from '../AnnotationActivity';
import AnnotationActivityLink from '../AnnotationActivityLink';
import AnnotationActivityMenu from '../AnnotationActivityMenu';
import CommentForm from '../../comment-form/CommentForm';
import Media from '../../../../../components/media';
import messages from '../messages';

jest.mock('../../Avatar', () => () => 'Avatar');

const currentUser = {
    name: 'testuser',
    id: 11,
};
const mentionSelectorContacts = [];
const TIME_STRING_SEPT_27_2017 = '2017-09-27T10:40:41-07:00';

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
        isCurrentVersion: true,
        item: mockAnnotation,
        mentionSelectorContacts,
    };
    const generateReginTags = (isCurrentVersion = mockActivity.isCurrentVersion) => ({
        'data-resin-iscurrent': isCurrentVersion,
        'data-resin-itemid': mockAnnotation.id,
        'data-resin-target': 'annotationLink',
    });

    const getWrapper = (props = {}) => shallow(<AnnotationActivity {...mockActivity} {...props} />);

    beforeEach(() => {
        CommentForm.default = jest.fn().mockReturnValue(<div />);
    });

    test('should not render annotation activity menu when both can_delete is false and can_edit is false', () => {
        const item = {
            ...mockAnnotation,
            permissions: { can_delete: false, can_edit: false },
        };

        const wrapper = getWrapper({ item });

        expect(wrapper.exists(AnnotationActivityMenu)).toBe(false);
    });

    test.each`
        canDelete | canEdit
        ${false}  | ${true}
        ${true}   | ${false}
        ${true}   | ${true}
    `(
        'should correctly render annotation activity when canDelete: $canDelete and canEdit: $canEdit',
        ({ canDelete, canEdit }) => {
            const unixTime = new Date(TIME_STRING_SEPT_27_2017).getTime();
            const item = {
                ...mockAnnotation,
                permissions: { can_delete: canDelete, can_edit: canEdit },
            };

            const wrapper = getWrapper({ item });
            const activityLink = wrapper.find(AnnotationActivityLink);

            expect(wrapper.find('ActivityTimestamp').prop('date')).toEqual(unixTime);
            expect(activityLink.prop('message')).toEqual({
                ...messages.annotationActivityPageItem,
                values: { number: 1 },
            });
            expect(activityLink.props()).toMatchObject(generateReginTags());
            expect(wrapper.exists(AnnotationActivityMenu)).toBe(true);
            expect(wrapper.find('ActivityMessage').prop('tagged_message')).toEqual(
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

        wrapper
            .find(AnnotationActivityMenu)
            .dive()
            .simulate('click');
        wrapper
            .find(AnnotationActivityMenu)
            .dive()
            .find('MenuItem')
            .simulate('click');
        expect(wrapper.exists('CommentForm')).toBe(true);

        // Firing the onCancel prop will remove the CommentForm
        wrapper
            .find('CommentForm')
            .dive()
            .props()
            .onCancel();
        expect(wrapper.exists('CommentForm')).toBe(false);
    });

    test('should correctly render annotation activity of another file version', () => {
        const wrapper = getWrapper({ isCurrentVersion: false });

        expect(wrapper.find(AnnotationActivityLink).prop('message')).toEqual({
            ...messages.annotationActivityVersionLink,
            values: { number: '2' },
        });
        expect(wrapper.find(AnnotationActivityLink).props()).toMatchObject(generateReginTags(false));
    });

    test('should render version unavailable if file version is null', () => {
        const wrapper = getWrapper({ item: { ...mockAnnotation, file_version: null } });
        const activityLink = wrapper.find(AnnotationActivityLink);

        expect(activityLink.prop('message')).toEqual({
            ...messages.annotationActivityVersionUnavailable,
        });
        expect(activityLink.prop('isDisabled')).toBe(true);
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
});
