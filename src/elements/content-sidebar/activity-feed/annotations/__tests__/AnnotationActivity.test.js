import * as React from 'react';
import { mount, shallow } from 'enzyme';

import AnnotationActivity from '../AnnotationActivity';
import CommentForm from '../../comment-form/CommentForm';

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
    const mockActivity = {
        created_at: TIME_STRING_SEPT_27_2017,
        created_by: { name: '50 Cent', id: 10 },
        currentUser,
        description: { message: 'test' },
        handlers: allHandlers,
        id: '123',
        mentionSelectorContacts,
        target: { location: { value: 1 } },
    };

    const getWrapper = (props = {}) => shallow(<AnnotationActivity {...mockActivity} {...props} />);

    beforeEach(() => {
        CommentForm.default = jest.fn().mockReturnValue(<div />);
    });

    test('should correctly render annotation activity', () => {
        const unixTime = new Date(TIME_STRING_SEPT_27_2017).getTime();
        const activity = {
            permissions: { can_delete: true, can_edit: true },
        };

        const wrapper = getWrapper(activity);

        expect(wrapper.find('ActivityTimestamp').prop('date')).toEqual(unixTime);
        expect(wrapper.find('AnnotationActivityLink').length).toEqual(1);
        expect(wrapper.find('ActivityMessage').prop('tagged_message')).toEqual(mockActivity.description.message);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render commenter as a link', () => {
        const wrapper = getWrapper();
        expect(wrapper.find('UserLink').prop('name')).toEqual(mockActivity.created_by.name);

        expect(wrapper).toMatchSnapshot();
    });

    test('should not show actions menu when annotation activity is pending', () => {
        const activity = {
            permissions: { can_delete: true },
            isPending: true,
            onDelete: jest.fn(),
        };

        const wrapper = getWrapper(activity);

        expect(wrapper.find('[data-testid="annotation-activity-actions-menu"]').length).toEqual(0);
    });

    test('should render an error when one is defined', () => {
        const activity = {
            error: {
                title: 'error',
                message: 'This is an error message',
            },
            onDelete: jest.fn(),
        };

        const wrapper = getWrapper(activity);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render an error cta when an action is defined', () => {
        const onActionSpy = jest.fn();
        const activity = {
            error: {
                title: 'error',
                message: 'This is an error message',
                action: {
                    text: 'click',
                    onAction: onActionSpy,
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
