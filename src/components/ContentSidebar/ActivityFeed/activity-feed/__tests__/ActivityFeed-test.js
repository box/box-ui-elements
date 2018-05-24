import * as React from 'react';
import { shallow } from 'enzyme';

import ActivityFeed from '../ActivityFeed';

jest.mock('../../Avatar', () => () => 'Avatar');
jest.mock('lodash/uniqueId', () => () => 'uniqueId');
const comments = {
    total_count: 1,
    entries: [
        {
            type: 'comment',
            id: '123',
            created_at: 'Thu Sep 26 33658 19:46:39 GMT-0600 (CST)',
            tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
            created_by: { name: 'Akon', id: 11 }
        }
    ]
};

const tasks = {
    total_count: 1,
    entries: [
        {
            type: 'task',
            id: '1234',
            created_at: 'Thu Sep 25 33658 19:45:39 GMT-0600 (CST)',
            modified_at: 'Thu Sep 25 33658 19:46:39 GMT-0600 (CST)',
            tagged_message: 'test',
            modified_by: { name: 'Jay-Z', id: 10 },
            dueAt: 1234567891,
            task_assignment_collection: []
        }
    ]
};

const versions = {
    total_count: 1,
    entries: [
        {
            type: 'file_version',
            id: 123,
            created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
            trashed_at: 1234567891,
            modified_at: 1234567891,
            modified_by: { name: 'Akon', id: 11 }
        }
    ]
};

const currentUser = { name: 'Kanye West', id: 10 };

const allHandlers = {
    comments: {
        create: jest.fn()
    },
    tasks: {
        create: jest.fn()
    },
    contacts: {
        approver: jest.fn(),
        mention: jest.fn()
    }
};

describe('components/ContentSidebar/ActivityFeed/activity-feed/ActivityFeed', () => {
    test('should correctly render empty state', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render empty state with loading indicator', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} isLoading />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render approval comment form if comment submit handler is passed', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render activity state', () => {
        const wrapper = shallow(
            <ActivityFeed currentUser={currentUser} comments={comments} tasks={tasks} versions={versions} />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should not expose add approval ui if task submit handler is not passed', () => {
        const noTaskHandler = {
            ...allHandlers,
            tasks: null
        };
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={noTaskHandler} />);

        expect(wrapper.find('[name="addApproval"]').length).toEqual(0);
    });

    test('should show input when approvalCommentFormFocusHandler is called', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();

        expect(wrapper.state('isInputOpen')).toBe(true);
    });

    test('should hide input when approvalCommentFormCancelHandler is called', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);

        const instance = wrapper.instance();
        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        instance.approvalCommentFormCancelHandler();
        expect(wrapper.state('isInputOpen')).toBe(false);
    });

    test('should call create comment handler and close input on valid comment submit', () => {
        const createCommentSpy = jest.fn().mockReturnValue(Promise.resolve({}));
        allHandlers.comments.create = createCommentSpy;
        const file = {
            permissions: {
                can_comment: true
            }
        };
        const wrapper = shallow(<ActivityFeed file={file} currentUser={currentUser} handlers={allHandlers} />);

        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').at(0);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createComment')('foo');
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createCommentSpy).toHaveBeenCalledTimes(1);
    });

    test('should call create task handler and close input on valid task submit', () => {
        const createTaskSpy = jest.fn();
        allHandlers.tasks.create = createTaskSpy;
        const file = {
            permissions: {
                can_comment: true
            }
        };
        const wrapper = shallow(<ActivityFeed file={file} currentUser={currentUser} handlers={allHandlers} />);

        const instance = wrapper.instance();
        const approvalCommentForm = wrapper.find('ApprovalCommentForm').at(0);

        instance.approvalCommentFormFocusHandler();
        expect(wrapper.state('isInputOpen')).toBe(true);

        approvalCommentForm.prop('createTask')();
        expect(wrapper.state('isInputOpen')).toBe(false);
        expect(createTaskSpy).toHaveBeenCalledTimes(1);
    });

    test('should stop event propagation onKeyDown', () => {
        const wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={allHandlers} />);
        const stopPropagationSpy = jest.fn();
        wrapper.find('.bcs-activity-feed').simulate('keydown', {
            nativeEvent: {
                stopImmediatePropagation: stopPropagationSpy
            }
        });
        expect(stopPropagationSpy).toHaveBeenCalled();
    });

    describe('componentWillReceiveProps()', () => {
        test('should invoke sortFeedItems() with new props', () => {
            const props = { comments, tasks };
            const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            const instance = wrapper.instance();
            instance.sortFeedItems = jest.fn();
            instance.componentWillReceiveProps(props);

            expect(instance.sortFeedItems).toBeCalledWith(comments, tasks, undefined);
        });
    });

    describe('sortFeedItems()', () => {
        test('should sort items based on date', () => {
            const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            const instance = wrapper.instance();

            instance.sortFeedItems(comments, tasks);

            const { feedItems } = instance.state;
            expect(feedItems[0].id).toEqual(comments.entries[0].id);
            expect(feedItems[1].id).toEqual(tasks.entries[0].id);
        });
    });

    describe('addPendingItem()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            instance = wrapper.instance();
        });

        test('should create an item and add it to the feed', () => {
            const itemBase = {
                my_prop: 'yay'
            };

            instance.addPendingItem(itemBase);
            const { feedItems } = instance.state;
            expect(feedItems.length).toEqual(1);
        });

        test('should create pending item with correct properties', () => {
            const itemBase = {};

            instance.addPendingItem(itemBase);
            const { feedItems } = instance.state;
            const item = feedItems[0];
            expect(typeof item.created_at).toBe('string');
            expect(typeof item.created_by).toBe('object');
            expect(typeof item.modified_at).toBe('string');
            expect(typeof item.isPending).toBe('boolean');
        });

        test('should add base properties into item added to feed', () => {
            const itemBase = {
                my_prop: 'supercalifragilisticexpialidocious'
            };

            instance.addPendingItem(itemBase);
            const { feedItems } = instance.state;
            const item = feedItems[0];
            expect(item.my_prop).toBe(itemBase.my_prop);
        });
    });

    describe('updateFeedItem()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            instance = wrapper.instance();
        });

        test('should replace the item with matching uuid in feedItems', () => {
            const uuid = 'a1b2c3d4e5f6';
            const message = 'This is missing in the pending item';
            const oldFeedItems = [
                {
                    id: uuid
                }
            ];
            const item = {
                message
            };
            instance.setState({ feedItems: oldFeedItems });

            // New item details
            instance.updateFeedItem(item, uuid);

            const { feedItems } = instance.state;
            expect(feedItems[0].message).toBe(message);
        });

        test('should do nothing if it can\'t find an item with matching uuid', () => {
            const uuid = 'a1b2c3d4e5f6';
            const message = 'This is missing in the pending item';
            const oldFeedItems = [
                {
                    id: uuid
                }
            ];
            const item = {
                message
            };
            instance.setState({ feedItems: oldFeedItems });

            // New item details
            instance.updateFeedItem(item, 'some_other_id');

            const { feedItems } = instance.state;
            expect(feedItems[0].message).not.toBe(message);
        });
    });

    describe('createComment()', () => {
        let wrapper;
        let instance;
        const message = 'message';
        const tagged_message = 'tagged_message';
        const handlers = {
            comments: {
                create: () =>
                    Promise.resolve({
                        message,
                        tagged_message
                    })
            }
        };
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={handlers} />);
            instance = wrapper.instance();
            instance.addPendingItem = jest.fn();
            instance.updateFeedItem = jest.fn();
        });

        test('should creating a pending item', () => {
            instance.createComment({ text: message });

            expect(instance.addPendingItem).toBeCalledWith({
                id: 'uniqueId',
                tagged_message: 'message',
                type: 'comment'
            });
        });

        test('should invoke updateFeedItem item to finalize comment', (done) => {
            instance.createComment({ text: 'irrelevant text', hasMention: true });
            instance.updateFeedItem = () => {
                done();
            };
        });

        test('should set tagged_message prop of finalized item if it contains mentions', (done) => {
            instance.updateFeedItem = (data) => {
                expect(data.tagged_message).toBe(tagged_message);
                done();
            };
            instance.createComment({ text: 'irrelevant text', hasMention: true });
        });

        test('should set message prop of finalized item if it does not contains mentions', (done) => {
            instance.updateFeedItem = (data) => {
                expect(data.tagged_message).toBe(message);
                done();
            };
            instance.createComment({ text: 'irrelevant text', hasMention: false });
        });
    });
});

// createComment = ({ text, hasMention }: { text: string, hasMention: boolean }): void => {
//     const uuid = uniqueId();
//     const comment = {
//         id: uuid,
//         tagged_message: text,
//         type: 'comment'
//     };

//     this.addPendingItem(comment);

//     const createComment = getProp(this.props, 'handlers.comments.create', Promise.resolve({}));
//     createComment(text, hasMention).then((commentData) => {
//         const { message, tagged_message } = commentData;
//         // Comment component uses tagged_message only
//         commentData.tagged_message = hasMention ? tagged_message : message;

//         this.updatePendingItem(commentData, uuid);
//     });

//     this.approvalCommentFormSubmitHandler();
// };
