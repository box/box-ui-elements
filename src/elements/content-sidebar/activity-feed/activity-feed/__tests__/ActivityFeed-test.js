import * as React from 'react';
import { shallow } from 'enzyme';
import ActivityFeed from '../ActivityFeed';
import { scrollIntoView } from '../../../../../utils/dom';

jest.mock('lodash/uniqueId', () => () => 'uniqueId');
jest.mock('../../../../../utils/dom');
jest.mock('../../Avatar', () => 'Avatar');
jest.mock('../ActiveState', () => 'ActiveState');

const comments = {
    total_count: 1,
    entries: [
        {
            type: 'comment',
            id: '123',
            created_at: 'Thu Sep 26 33658 19:46:39 GMT-0600 (CST)',
            tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
            created_by: { name: 'Akon', id: 11 },
        },
    ],
};

const first_version = {
    action: 'upload',
    type: 'file_version',
    id: 123,
    created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
    trashed_at: 1234567891,
    modified_at: 1234567891,
    modified_by: { name: 'Akon', id: 11 },
    version_number: '1',
};

const file = {
    id: '12345',
    permissions: {
        can_comment: true,
    },
    modified_at: 2234567891,
    file_version: {
        id: 987,
        type: 'file_version',
    },
    restored_from: {
        id: first_version.id,
        type: first_version.type,
    },
    version_number: '3',
};

const feedItems = [...comments.entries];
const currentUser = { name: 'Kanye West', id: 10 };
const getWrapper = props => shallow(<ActivityFeed currentUser={currentUser} file={file} {...props} />);

describe('elements/content-sidebar/ActivityFeed/activity-feed/ActivityFeed', () => {
    test('should correctly render loading state', () => {
        const wrapper = getWrapper({
            currentUser: undefined,
            feedItems: undefined,
        });

        expect(wrapper.find('EmptyState').exists()).toBe(false);
        expect(wrapper.find('LoadingIndicator').exists()).toBe(true);
    });

    test('should correctly render empty state', () => {
        const wrapper = getWrapper({
            feedItems: [],
        });

        expect(wrapper.find('EmptyState').exists()).toBe(true);
    });

    test('should render empty state when there is 1 version (current version from file)', () => {
        const wrapper = getWrapper({
            currentUser,
            feedItems: [first_version],
        });
        expect(wrapper.find('EmptyState').exists()).toBe(true);
    });

    test('should render approval comment form if comment submit handler is passed in and comment permissions', () => {
        const wrapper = getWrapper({
            onCommentCreate: jest.fn(),
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render approval comment form if only comment submit handler is not passed in', () => {
        file.permissions.can_comment = true;
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render approval comment form if comment permissions are not present', () => {
        file.permissions.can_comment = false;
        const wrapper = getWrapper({
            onCommentCreate: jest.fn(),
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render active state', () => {
        const wrapper = getWrapper({
            feedItems,
        });
        expect(wrapper.find('ActiveState')).toHaveLength(1);
    });

    test('should not expose add approval ui if task submit handler is not passed', () => {
        file.permissions.can_comment = true;
        const wrapper = getWrapper({
            onCommentCreate: jest.fn(),
        });

        expect(wrapper.find('[name="addApproval"]').length).toEqual(0);
    });

    test('should set scrollTop to be the scrollHeight if feedContainer ref is set', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        instance.feedContainer = {
            scrollTop: 0,
            scrollHeight: 100,
        };
        instance.componentDidMount();

        expect(instance.feedContainer.scrollTop).toEqual(100);
    });

    test('should set scrollTop to be the scrollHeight if feedContainer exists and prevProps feedItems is undefined and this.props.feedItems is defined', () => {
        const wrapper = getWrapper({
            feedItems: [{ type: 'comment' }],
        });
        const instance = wrapper.instance();
        instance.feedContainer = {
            scrollTop: 0,
            scrollHeight: 100,
        };

        instance.componentDidUpdate(
            {
                feedItems: undefined,
                currentUser,
            },
            { isInputOpen: false },
        );

        expect(instance.feedContainer.scrollTop).toEqual(100);
    });

    test('should set scrollTop to be the scrollHeight if more feedItems are added', () => {
        const wrapper = getWrapper({
            feedItems: [{ type: 'comment' }, { type: 'comment' }],
        });

        const instance = wrapper.instance();
        instance.feedContainer = {
            scrollTop: 0,
            scrollHeight: 100,
        };

        instance.componentDidUpdate(
            {
                feedItems: [{ type: 'comment' }],
                currentUser,
            },
            { isInputOpen: false },
        );

        expect(instance.feedContainer.scrollTop).toEqual(100);
    });

    test('should set scrollTop to be the scrollHeight if the user becomes defined', () => {
        const wrapper = getWrapper({
            feedItems: [{ type: 'comment' }],
        });
        const instance = wrapper.instance();
        instance.feedContainer = {
            scrollTop: 0,
            scrollHeight: 100,
        };

        instance.componentDidUpdate(
            {
                feedItems: [{ type: 'comment' }],
                currentUser: undefined,
            },
            { isInputOpen: false },
        );

        expect(instance.feedContainer.scrollTop).toEqual(100);
    });

    test('should set scrollTop to be the scrollHeight if input opens', () => {
        const wrapper = getWrapper({
            feedItems: [{ type: 'comment' }],
        });
        wrapper.setState({
            isInputOpen: true,
        });
        const instance = wrapper.instance();
        instance.feedContainer = {
            scrollTop: 0,
            scrollHeight: 100,
        };

        instance.componentDidUpdate(
            {
                feedItems: [{ type: 'comment' }],
                currentUser,
            },
            { isInputOpen: false },
        );

        expect(instance.feedContainer.scrollTop).toEqual(100);
    });

    test('should pass activeFeedItemRef to the ActiveState', () => {
        const wrapper = getWrapper({
            activeFeedEntryId: comments.entries[0].id,
        });
        const instance = wrapper.instance();
        wrapper.setProps({
            feedItems: [{ type: 'comment' }],
        });

        expect(wrapper.find('ActiveState').prop('activeFeedItemRef')).toEqual(instance.activeFeedItemRef);
    });

    test('should scroll to active feed item when activeFeedItemRef has a value', () => {
        const wrapper = getWrapper({
            activeFeedEntryId: comments.entries[0].id,
        });
        const instance = wrapper.instance();
        const li = document.createElement('li');
        instance.activeFeedItemRef.current = li;
        wrapper.setProps({
            feedItems: [{ type: 'comment' }],
        });
        expect(scrollIntoView).toHaveBeenCalledWith(li);
    });

    test('should not scroll to active feed item when activeFeedItemRef is null', () => {
        const wrapper = getWrapper({
            activeFeedEntryId: comments.entries[0].id,
        });
        const instance = wrapper.instance();

        instance.activeFeedItemRef.current = null;
        wrapper.setProps({
            feedItems: [{ type: 'comment' }],
        });
        expect(scrollIntoView).not.toHaveBeenCalled();
    });

    test('should show input when commentFormFocusHandler is called', () => {
        const wrapper = getWrapper();

        const instance = wrapper.instance();
        instance.commentFormFocusHandler();

        expect(wrapper.state('isInputOpen')).toBe(true);
    });

    test('should hide input when commentFormCancelHandler is called', () => {
        const wrapper = getWrapper({
            onCommentCreate: jest.fn(),
        });

        const instance = wrapper.instance();
        instance.commentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        instance.commentFormCancelHandler();
        expect(wrapper.state('isInputOpen')).toBe(false);
    });

    test('should call create comment handler and close input on valid comment submit', () => {
        const createCommentSpy = jest.fn().mockReturnValue(Promise.resolve({}));
        const wrapper = getWrapper({
            feedItems,
            onCommentCreate: createCommentSpy,
        });

        const instance = wrapper.instance();
        const commentForm = wrapper.find('CommentForm').first();

        instance.commentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        commentForm.prop('createComment')({ text: 'foo' });
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createCommentSpy).toHaveBeenCalledTimes(1);
    });

    test('should stop event propagation onKeyDown', () => {
        const wrapper = getWrapper({
            onCommentCreate: jest.fn(),
        });
        const stopPropagationSpy = jest.fn();
        wrapper.find('.bcs-activity-feed').simulate('keydown', {
            nativeEvent: {
                stopImmediatePropagation: stopPropagationSpy,
            },
        });
        expect(stopPropagationSpy).toHaveBeenCalled();
    });
});
