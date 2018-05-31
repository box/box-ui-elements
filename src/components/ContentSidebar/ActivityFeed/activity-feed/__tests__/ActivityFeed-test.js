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

        approvalCommentForm.prop('createComment')({ text: 'foo' });
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

        approvalCommentForm.prop('createTask')({ text: 'foo', dueAt: 12333445558585, assignees: [] });
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

    describe('updateFeedItems()', () => {
        let wrapper;
        let instance;
        const file = {
            id: '12345'
        };
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} file={file} />);
            instance = wrapper.instance();
            instance.sortFeedItems = jest.fn();
        });

        it('should not invoke sortFeedItems() if the feed item types required are missing', () => {
            instance.updateFeedItems(); // no params means missing items

            expect(instance.sortFeedItems).not.toBeCalled();
        });

        it('should not invoke sortFeedItems() if the current feed has not been emptied', () => {
            instance.setState({ feedItems: [...comments.entries, ...tasks.entries] });
            instance.clearFeedItems = jest.fn().mockReturnValue(false);
            instance.shouldSortFeedItems = jest.fn().mockReturnValue(true);
            instance.updateFeedItems(comments, tasks, versions);

            expect(instance.sortFeedItems).not.toBeCalled();
        });

        it('should not invoke sortFeedItems() if there are items in the feed', () => {
            instance.setState({ feedItems: [...comments.entries, ...tasks.entries] });
            instance.clearFeedItems = jest.fn().mockReturnValue(false);
            instance.shouldSortFeedItems = jest.fn().mockReturnValue(true);

            instance.updateFeedItems(comments, tasks, versions);

            expect(instance.sortFeedItems).not.toBeCalled();
        });

        it('should invoke sortFeedItems() if all conditions are met', () => {
            instance.clearFeedItems = jest.fn().mockReturnValue(true);
            instance.shouldSortFeedItems = jest.fn().mockReturnValue(true);

            instance.updateFeedItems(comments, tasks, versions);

            expect(instance.sortFeedItems).toBeCalledWith(comments, tasks, versions);
        });
    });

    describe('shouldSortFeedItems()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed inputState={{ currentUser }} />);
            instance = wrapper.instance();
        });

        it('should return false if missing comments', () => {
            const result = instance.shouldSortFeedItems(undefined, tasks, versions);
            expect(result).toBe(false);
        });

        it('should return false if missing tasks', () => {
            const result = instance.shouldSortFeedItems(comments, undefined, versions);
            expect(result).toBe(false);
        });

        it('should return false if missing versions', () => {
            const result = instance.shouldSortFeedItems(comments, tasks, undefined);
            expect(result).toBe(false);
        });

        it('should return true if all feed items are available', () => {
            const result = instance.shouldSortFeedItems(comments, tasks, versions);
            expect(result).toBe(true);
        });
    });

    describe('clearFeedItems()', () => {
        let wrapper;
        let instance;
        const file = {
            id: '12345'
        };
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} file={file} />);
            instance = wrapper.instance();
        });

        it('should not clear feed items if using the same file', () => {
            instance.setState({ feedItems: [...comments.entries] });
            instance.clearFeedItems(file);
            const { feedItems } = instance.state;
            expect(feedItems.length).toBe(comments.entries.length);
        });

        it('should return false if feedItems was not emptied', () => {
            instance.setState({ feedItems: [...comments.entries] });
            const wasEmptied = instance.clearFeedItems(file);

            expect(wasEmptied).toBe(false);
        });

        it('should clear feed items if a new file', () => {
            instance.setState({ feedItems: [...comments.entries] });
            instance.clearFeedItems({ id: 'abcdef' });

            const { feedItems } = instance.state;
            expect(feedItems.length).toBe(0);
        });

        it('should return true if feedItems was emptied', () => {
            instance.setState({ feedItems: [...comments.entries] });
            const wasEmptied = instance.clearFeedItems({ id: 'abcdef' });

            expect(wasEmptied).toBe(true);
        });
    });

    describe('componentWillReceiveProps()', () => {
        test('should invoke sortFeedItems() with new props', () => {
            const props = { comments, tasks, versions };
            const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            const instance = wrapper.instance();
            instance.clearFeedItems = jest.fn().mockReturnValue(true);
            instance.sortFeedItems = jest.fn();
            instance.componentWillReceiveProps(props);

            expect(instance.sortFeedItems).toBeCalledWith(comments, tasks, versions);
        });

        test('should not invoke sortFeedItems() once feedItems has already been set', () => {
            const props = { comments, tasks, versions };
            const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            const instance = wrapper.instance();
            instance.componentWillReceiveProps(props);

            instance.sortFeedItems = jest.fn();
            instance.componentWillReceiveProps(props);

            expect(instance.sortFeedItems).not.toBeCalled();
        });

        test('should not invoke sortFeedItems() if all feed items are not present', () => {
            const props = { comments, tasks };
            const wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            const instance = wrapper.instance();
            instance.clearFeedItems = jest.fn().mockReturnValue(true);
            instance.sortFeedItems = jest.fn();
            instance.componentWillReceiveProps(props);

            expect(instance.sortFeedItems).not.toBeCalled();
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

        test('should mark the item with matching item as longer pending', () => {
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
            expect(feedItems[0].isPending).toBe(false);
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

    describe('createCommentSuccessCallback()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            instance = wrapper.instance();
            instance.updateFeedItem = jest.fn();
        });

        it('should invoke updateFeedItem() with the new API returned comment, and the id to replace', () => {
            const text = 'yay';
            const id = '0987654321';
            instance.createCommentSuccessCallback({ tagged_message: text }, id);

            expect(instance.updateFeedItem).toBeCalledWith({ tagged_message: text }, id);
        });

        it('should assign tagged_message of the comment with tagged_message value if it exists', (done) => {
            const text = 'yay';
            const id = '0987654321';
            instance.updateFeedItem = (comment) => {
                const { tagged_message } = comment;
                expect(tagged_message).toEqual(text);
                done();
            };
            instance.createCommentSuccessCallback({ tagged_message: text }, id);
        });

        it('should assign tagged_message of the comment with message value if it exists', (done) => {
            const text = 'yay';
            const id = '0987654321';
            instance.updateFeedItem = (comment) => {
                const { tagged_message } = comment;
                expect(tagged_message).toEqual(text);
                done();
            };
            instance.createCommentSuccessCallback({ message: text }, id);
        });
    });

    describe('createComment()', () => {
        let wrapper;
        let instance;
        const create = jest.fn();
        const message = 'message';
        const handlers = {
            comments: {
                create
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

        test('should invoke the handler prop create() function with data to create comment and callbacks', () => {
            const hasMention = true;
            instance.createComment({ text: message, hasMention });

            expect(create).toBeCalledWith(message, hasMention, expect.any(Function), expect.any(Function));
        });

        test('should invoke createCommentSuccessCallback() with new comment and id on success creating', () => {
            const createComment = (text, hasMention, onSuccess) => {
                const comment = {
                    message,
                    hasMention
                };
                onSuccess(comment);
            };
            const newHandlers = {
                comments: {
                    create: createComment
                }
            };
            wrapper.setProps({ handlers: newHandlers });
            instance.createCommentSuccessCallback = jest.fn();

            const hasMention = true;
            instance.createComment({ text: message, hasMention });

            // Should be called with new comment and the 'uniqueId' returned from lodash/uniqueId
            expect(instance.createCommentSuccessCallback).toBeCalledWith({ message, hasMention }, 'uniqueId');
        });

        test('should invoke createCommentErrorCallback() with error and id on fail to create', () => {
            const createComment = (text, hasMention, onSuccess, onFail) => {
                onFail(new Error('You fail!'));
            };
            const newHandlers = {
                comments: {
                    create: createComment
                }
            };
            wrapper.setProps({ handlers: newHandlers });
            instance.createCommentErrorCallback = jest.fn();

            instance.createComment({ text: message });

            // Should be called with new comment and the 'uniqueId' returned from lodash/uniqueId
            expect(instance.createCommentErrorCallback).toBeCalledWith(expect.any(Error), 'uniqueId');
        });
    });

    describe('createTaskSuccessCallback()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} />);
            instance = wrapper.instance();
        });

        it('should invoke updateFeedItem() with task and id to update', () => {
            const task = {
                message: 'a message'
            };
            const id = 'uniqueId';
            instance.updateFeedItem = jest.fn();
            instance.createTaskSuccessCallback(task, id);

            expect(instance.updateFeedItem).toBeCalledWith(task, id);
        });
    });

    describe('createTask()', () => {
        let wrapper;
        let instance;
        const create = jest.fn();
        const text = 'message';
        const handlers = {
            tasks: {
                create
            }
        };
        beforeEach(() => {
            wrapper = shallow(<ActivityFeed currentUser={currentUser} handlers={handlers} />);
            instance = wrapper.instance();
            instance.addPendingItem = jest.fn();
            instance.updateFeedItem = jest.fn();
        });

        test('should creating a pending item', () => {
            const dueAt = 123456;
            const dueDateString = new Date(dueAt).toISOString();
            instance.createTask({ text, dueAt });

            expect(instance.addPendingItem).toBeCalledWith({
                due_at: dueDateString,
                id: 'uniqueId',
                is_completed: false,
                message: text,
                task_assignment_collection: [],
                type: 'task'
            });
        });

        test('should invoke the handler prop create() function with data to create comment and callbacks', () => {
            const assignees = [{ name: 'voldemort' }];
            const dueAt = 1123456;
            instance.createTask({ text, assignees, dueAt });

            expect(create).toBeCalledWith(
                text,
                assignees,
                new Date(dueAt).toISOString(),
                expect.any(Function),
                expect.any(Function)
            );
        });

        test('should invoke createCommentSuccessCallback() with new comment and id on success creating', () => {
            const createTask = (textContent, assignees, dueAt, onSuccess) => {
                const task = {
                    assignees,
                    due_at: dueAt,
                    message: textContent
                };
                onSuccess(task);
            };
            const newHandlers = {
                tasks: {
                    create: createTask
                }
            };
            wrapper.setProps({ handlers: newHandlers });
            instance.createTaskSuccessCallback = jest.fn();

            const assignees = [];
            const dueAt = 123456789;
            instance.createTask({ text, assignees, dueAt });

            // Should be called with new task and the 'uniqueId' returned from lodash/uniqueId
            expect(instance.createTaskSuccessCallback).toBeCalledWith(
                {
                    message: text,
                    assignees,
                    due_at: new Date(dueAt).toISOString()
                },
                'uniqueId'
            );
        });

        test('should invoke createCommentErrorCallback() with error and id on fail to create', () => {
            const createTask = (textContent, assignees, dueAt, onSuccess, onFail) => {
                onFail(new Error('You fail!'));
            };
            const newHandlers = {
                tasks: {
                    create: createTask
                }
            };
            wrapper.setProps({ handlers: newHandlers });
            instance.createTaskErrorCallback = jest.fn();

            instance.createTask({ text });

            // Should be called with new comment and the 'uniqueId' returned from lodash/uniqueId
            expect(instance.createTaskErrorCallback).toBeCalledWith(expect.any(Error), 'uniqueId');
        });
    });
});
