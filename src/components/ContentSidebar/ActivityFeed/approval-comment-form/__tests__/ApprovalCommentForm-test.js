import React from 'react';
import { mount } from 'enzyme';
import { EditorState, convertFromRaw } from 'draft-js';
import { withData } from 'leche';
import sinon from 'sinon';

import { ApprovalCommentFormUnwrapped as ApprovalCommentForm } from '../ApprovalCommentForm';

const sandbox = sinon.sandbox.create();
const intlFake = {
    formatMessage: (message) => message.id
};

describe('features/activity-feed/approval-comment-form/ApprovalCommentForm', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const render = (props) =>
        mount(
            <ApprovalCommentForm
                getMentionContactsWithQuery={() => {}}
                user={{ id: 123, name: 'foo bar' }}
                intl={intlFake}
                {...props}
            />
        );

    test('should correctly render initial state', () => {
        const wrapper = render();

        expect(wrapper.find('[contentEditable]').length).toEqual(1);
        expect(wrapper.find('.comment-input-controls').length).toEqual(1);
        expect(wrapper.find('.comment-input-controls').find('button').length).toEqual(2);
        expect(wrapper.find('.at-mention-tip').hasClass('accessibility-hidden')).toBe(false);
    });

    test('should call onFocus handler when input is focused', () => {
        const onFocusSpy = sinon.spy();

        const wrapper = render({ onFocus: onFocusSpy });

        const mentionSelector = wrapper.find('[contentEditable]');
        mentionSelector.simulate('focus');
        expect(onFocusSpy.calledOnce).toBe(true);
    });

    test('should call oncancel handler when input is canceled', () => {
        const onCancelSpy = sinon.spy();

        const wrapper = render({ onCancel: onCancelSpy });

        const cancelButton = wrapper.find('Button.comment-input-cancel-btn');
        cancelButton.simulate('click');
        expect(onCancelSpy.calledOnce).toBe(true);
    });

    test('should render open comment input and hidden tip when isOpen is true', () => {
        const wrapper = render({ isOpen: true });

        expect(wrapper.find('.comment-input-is-open').length).toEqual(1);
        expect(wrapper.find('.at-mention-tip').hasClass('accessibility-hidden')).toBe(true);
    });

    test('should set required to false on comment input when not open', () => {
        const wrapper = render();

        expect(
            wrapper
                .find('DraftJSMentionSelector')
                .at(0)
                .prop('isRequired')
        ).toEqual(false);
    });

    test('should set required to true on comment input when isOpen is true', () => {
        const wrapper = render({ isOpen: true });

        expect(
            wrapper
                .find('DraftJSMentionSelector')
                .at(0)
                .prop('isRequired')
        ).toEqual(true);
    });

    test('should render add approval ui when createTask handler is defined', () => {
        const wrapper = render({ createTask: sinon.stub() });

        expect(wrapper.find('.comment-add-approver').length).toEqual(1);
    });

    test('should render add approval fields when add approver is checked', () => {
        const wrapper = render({ createTask: sinon.stub() });

        wrapper.instance().onFormChangeHandler({ addApproval: 'on' });
        wrapper.update();

        expect(wrapper.find('.comment-add-approver-fields-container').length).toEqual(1);
    });

    withData(
        {
            'empty comment box': ['', 0],
            'non-empty comment box': ['hey', 1]
        },
        (commentText, expectedCallCount) => {
            test(`should call createComment ${expectedCallCount} times`, () => {
                const createCommentSpy = sinon.spy();

                const wrapper = render({ createComment: createCommentSpy });
                const instance = wrapper.instance();

                sandbox.stub(instance, 'getFormattedCommentText').returns(commentText);

                const submitBtn = wrapper.find('PrimaryButton.comment-input-submit-btn');
                const formEl = wrapper.find('form').getDOMNode();
                formEl.checkValidity = () => !!expectedCallCount;
                submitBtn.simulate('submit', { target: formEl });

                expect(createCommentSpy.callCount).toEqual(expectedCallCount);
            });
        }
    );

    test('should call createTask handler when approver has been added', () => {
        const createTaskSpy = sinon.spy();
        const createCommentSpy = sinon.spy();
        const wrapper = render({
            createComment: createCommentSpy,
            createTask: createTaskSpy
        });

        const instance = wrapper.instance();

        sandbox.stub(instance, 'getFormattedCommentText').returns('hey');

        wrapper.setState({
            approvers: [{ text: '123', value: '123' }],
            isAddApprovalVisible: true
        });

        instance.onFormValidSubmitHandler({ addApproval: 'on' });

        expect(createTaskSpy.calledOnce).toBe(true);
        expect(createCommentSpy.notCalled).toBe(true);
    });

    test('should call createTask with correct args on task submit', () => {
        const createTaskSpy = sinon.spy();
        const createCommentStub = sinon.stub();
        const commentText = 'a comment';
        const addApproval = 'on';
        const approverDateInput = '2014-04-12';

        const wrapper = render({
            createComment: createCommentStub,
            createTask: createTaskSpy
        });

        const instance = wrapper.instance();
        sandbox
            .mock(instance)
            .expects('getFormattedCommentText')
            .returns(commentText);

        wrapper.setState({
            approvers: [{ text: '123', value: 123 }, { text: '124', value: 124 }]
        });

        wrapper.find('Form').prop('onValidSubmit')({
            addApproval,
            approverDateInput
        });

        expect(
            createTaskSpy.calledWith({
                text: commentText,
                approvers: [123, 124],
                dueDate: approverDateInput
            })
        ).toBe(true);
    });

    test('should set error and not call createTask() when no approvers have been selected', () => {
        const wrapper = render({ createTask: sandbox.mock().never() });

        const instance = wrapper.instance();
        sandbox
            .mock(instance)
            .expects('getFormattedCommentText')
            .returns('a comment');

        wrapper.find('Form').prop('onValidSubmit')({
            addApproval: 'on',
            approverDateInput: '2014-04-12'
        });

        expect(wrapper.state('approverSelectorError')).toBeTruthy();
    });

    test('should filter approver selector options correctly', () => {
        const wrapper = render({
            approverSelectorContacts: [
                { id: 123, item: { name: 'name' }, name: 'name' },
                { id: 234, item: { name: 'test' }, name: 'test' }
            ],
            createTask: sandbox.stub()
        });
        wrapper.setState({
            approvers: [{ text: 'name', value: 123 }],
            isAddApprovalVisible: true
        });
        expect(wrapper.find('PillSelectorDropdown').prop('selectorOptions').length).toBe(1);
    });

    test('should reset approvers after submitting the form', () => {
        const commentText = 'a comment';
        const addApproval = 'on';
        const approverDateInput = '2014-04-12';
        const wrapper = render({
            createComment: sandbox.stub(),
            createTask: sandbox.stub()
        });
        const instance = wrapper.instance();
        sandbox.stub(instance, 'getFormattedCommentText').returns(commentText);

        wrapper.setState({
            approvers: [{ text: '123', value: 123 }, { text: '124', value: 124 }]
        });

        wrapper.find('Form').prop('onValidSubmit')({
            addApproval,
            approverDateInput
        });

        expect(wrapper.state('approvers').length).toBe(0);
    });

    describe('getFormattedCommentText()', () => {
        const rawContentNoEntities = {
            blocks: [
                {
                    text: 'Hey there',
                    type: 'unstyled',
                    entityRanges: []
                }
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE'
                }
            }
        };

        const rawContentOneEntity = {
            blocks: [
                {
                    text: 'Hey @Becky',
                    type: 'unstyled',
                    entityRanges: [{ offset: 4, length: 6, key: 'first' }]
                }
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 }
                }
            }
        };

        const rawContentTwoEntities = {
            blocks: [
                {
                    text: 'I hung out with @Becky and @Shania',
                    type: 'unstyled',
                    entityRanges: [{ offset: 16, length: 6, key: 'first' }, { offset: 27, length: 7, key: 'second' }]
                }
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 }
                },
                second: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 2 }
                }
            }
        };

        const rawContentTwoEntitiesOneLineBreak = {
            blocks: [
                {
                    text: 'I hung out with @Becky and',
                    type: 'unstyled',
                    entityRanges: [{ offset: 16, length: 6, key: 'first' }]
                },
                {
                    text: '@Shania yesterday',
                    type: 'unstyled',
                    entityRanges: [{ offset: 0, length: 7, key: 'second' }]
                }
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 }
                },
                second: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 2 }
                }
            }
        };

        withData(
            {
                'no entities in the editor': [rawContentNoEntities, 'Hey there'],
                'one entity in the editor': [rawContentOneEntity, 'Hey @[1:Becky]'],
                'two entities in the editor': [rawContentTwoEntities, 'I hung out with @[1:Becky] and @[2:Shania]'],
                'two entities and a linebreak in the editor': [
                    rawContentTwoEntitiesOneLineBreak,
                    'I hung out with @[1:Becky] and\n@[2:Shania] yesterday'
                ]
            },
            (rawContent, expected) => {
                test('should return the correct result', () => {
                    const blocks = convertFromRaw(rawContent);

                    const dummyEditorState = EditorState.createWithContent(blocks);

                    const wrapper = render();
                    const instance = wrapper.instance();
                    wrapper.setState({ commentEditorState: dummyEditorState });

                    const result = instance.getFormattedCommentText();

                    expect(result).toEqual(expected);
                });
            }
        );
    });

    describe('handleApproverSelectorInput()', () => {
        test('should call getApproverContactsWithQuery() when called', () => {
            const value = 'test';
            const wrapper = render({
                getApproverContactsWithQuery: sandbox.mock().withExactArgs(value)
            });
            wrapper.instance().handleApproverSelectorInput(value);
        });

        test('should clear approver selector error when called', () => {
            const wrapper = render({
                getApproverContactsWithQuery: sandbox.stub()
            });
            wrapper.setState({ approverSelectorError: 'test' });
            wrapper.instance().handleApproverSelectorInput('hi');
            expect(wrapper.state('approverSelectorError')).toEqual('');
        });
    });

    describe('handleApproverSelectorSelect()', () => {
        test('should update approvers when called', () => {
            const wrapper = render();
            wrapper.setState({ approvers: [{ value: 123 }] });
            wrapper.instance().handleApproverSelectorSelect([{ value: 234 }]);
            expect(wrapper.state('approvers')).toEqual([{ value: 123 }, { value: 234 }]);
        });
    });

    describe('handleApproverSelectorRemove()', () => {
        test('should update approvers when called', () => {
            const wrapper = render();
            wrapper.setState({ approvers: [{ value: 123 }, { value: 234 }] });
            wrapper.instance().handleApproverSelectorRemove({ value: 123 }, 0);
            expect(wrapper.state('approvers')).toEqual([{ value: 234 }]);
        });
    });
});
