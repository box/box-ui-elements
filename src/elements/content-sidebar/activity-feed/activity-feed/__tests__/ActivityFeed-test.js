import * as React from 'react';
import { shallow } from 'enzyme';

import ActivityFeed from '../ActivityFeed';

jest.mock('../../Avatar', () => 'Avatar');
jest.mock('../ActiveState', () => 'ActiveState');
jest.mock('lodash/uniqueId', () => () => 'uniqueId');

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
const getWrapper = props => shallow(<ActivityFeed file={file} currentUser={currentUser} {...props} />);

describe('elements/content-sidebar/ActivityFeed/activity-feed/ActivityFeed', () => {
    test('should correctly render empty loading state', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render empty state', () => {
        const items = {
            total_count: 0,
            entries: [],
        };
        const wrapper = shallow(
            <ActivityFeed file={file} currentUser={currentUser} comments={items} tasks={items} versions={items} />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty state when there is 1 version (current version from file)', () => {
        const oneVersion = {
            total_count: 1,
            entries: [first_version],
        };

        const wrapper = getWrapper({
            versions: oneVersion,
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
        const wrapper = shallow(<ActivityFeed file={file} currentUser={currentUser} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should not render approval comment form if comment permissions are not present', () => {
        file.permissions.can_comment = false;
        const wrapper = shallow(<ActivityFeed file={file} currentUser={currentUser} onCommentCreate={jest.fn()} />);
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
        const wrapper = shallow(<ActivityFeed file={file} currentUser={currentUser} onCommentCreate={jest.fn()} />);

        expect(wrapper.find('[name="addApproval"]').length).toEqual(0);
    });

    test('should set scrollTop to be the scrollHeight if feedContainer ref is set', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
        const instance = wrapper.instance();
        instance.feedContainer = {
            scrollTop: 0,
            scrollHeight: 100,
        };
        instance.componentDidMount();

        expect(instance.feedContainer.scrollTop).toEqual(100);
    });

    test('should set scrollTop to be the scrollHeight if feedContainer exists and prevProps feedItems is undefined and this.props.feedItems is defined', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} feedItems={[{ type: 'comment' }]} />);
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
        const wrapper = shallow(
            <ActivityFeed currentUser={currentUser} feedItems={[{ type: 'comment' }, { type: 'comment' }]} />,
        );
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
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} feedItems={[{ type: 'comment' }]} />);
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
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} feedItems={[{ type: 'comment' }]} />);
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

    test('should show input when approvalCommentFormFocusHandler is called', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();

        expect(wrapper.state('isInputOpen')).toBe(true);
    });

    test('should hide input when approvalCommentFormCancelHandler is called', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} onCommentCreate={jest.fn()} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        instance.approvalCommentFormCancelHandler();
        expect(wrapper.state('isInputOpen')).toBe(false);
    });

    test('should call create comment handler and close input on valid comment submit', () => {
        const createCommentSpy = jest.fn().mockReturnValue(Promise.resolve({}));
        const wrapper = shallow(
            <ActivityFeed
                file={file}
                feedItems={feedItems}
                currentUser={currentUser}
                onCommentCreate={createCommentSpy}
            />,
        );

        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').first();

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createComment')({ text: 'foo' });
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createCommentSpy).toHaveBeenCalledTimes(1);
    });

    test('should call create task handler and close input on valid task submit', () => {
        const createTaskSpy = jest.fn();
        const wrapper = shallow(
            <ActivityFeed
                file={file}
                feedItems={feedItems}
                currentUser={currentUser}
                onCommentCreate={jest.fn()}
                onTaskCreate={createTaskSpy}
            />,
        );
        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').first();

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createTask')({
            text: 'foo',
            dueAt: 12333445558585,
            assignees: [],
        });
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createTaskSpy).toHaveBeenCalledTimes(1);
    });

    test('should stop event propagation onKeyDown', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} onCommentCreate={jest.fn()} />);
        const stopPropagationSpy = jest.fn();
        wrapper.find('.bcs-activity-feed').simulate('keydown', {
            nativeEvent: {
                stopImmediatePropagation: stopPropagationSpy,
            },
        });
        expect(stopPropagationSpy).toHaveBeenCalled();
    });
});
