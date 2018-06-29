import * as React from 'react';
import { mount } from 'enzyme';
import { EditorState, convertFromRaw } from 'draft-js';
import { withData } from 'leche';

import { ApprovalCommentFormUnwrapped as ApprovalCommentForm } from '../ApprovalCommentForm';

jest.mock('../../Avatar', () => () => 'Avatar');

const intlFake = {
    formatMessage: (message) => message.id
};

describe('components/ContentSidebar/ActivityFeed/approval-comment-form/ApprovalCommentForm', () => {
    const render = (props) =>
        mount(
            <ApprovalCommentForm
                getMentionWithQuery={() => {}}
                user={{ id: 123, name: 'foo bar' }}
                intl={intlFake}
                {...props}
            />
        );

    test('should correctly render initial state', () => {
        const wrapper = render();

        expect(wrapper.find('[contentEditable]').length).toEqual(1);
        expect(wrapper.find('.bcs-comment-input-controls').length).toEqual(1);
        expect(wrapper.find('.bcs-comment-input-controls').find('button').length).toEqual(2);
        expect(wrapper.find('.bcs-at-mention-tip').hasClass('accessibility-hidden')).toBe(false);
    });

    test('should call onFocus handler when input is focused', () => {
        const onFocusSpy = jest.fn();

        const wrapper = render({ onFocus: onFocusSpy });

        const mentionSelector = wrapper.find('[contentEditable]');
        mentionSelector.simulate('focus');
        expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    test('should call oncancel handler when input is canceled', () => {
        const onCancelSpy = jest.fn();

        const wrapper = render({ onCancel: onCancelSpy });

        const cancelButton = wrapper.find('Button.bcs-comment-input-cancel-btn');
        cancelButton.simulate('click');
        expect(onCancelSpy).toHaveBeenCalledTimes(1);
    });

    test('should render open comment input and hidden tip when isOpen is true', () => {
        const wrapper = render({ isOpen: true });

        expect(wrapper.find('.bcs-comment-input-is-open').length).toEqual(1);
        expect(wrapper.find('.bcs-at-mention-tip').hasClass('accessibility-hidden')).toBe(true);
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
        const wrapper = render({ createTask: jest.fn() });

        expect(wrapper.find('.bcs-comment-add-approver').length).toEqual(1);
    });

    test('should render add approval fields when add approver is checked', () => {
        const wrapper = render({ createTask: jest.fn() });

        wrapper.instance().onFormChangeHandler({ addApproval: 'on' });
        wrapper.update();

        expect(wrapper.find('.bcs-comment-add-approver-fields-container').length).toEqual(1);
    });

    withData(
        {
            'empty comment box': [{ text: '', hasMention: false }, 0],
            'non-empty comment box': [{ text: 'hey', hasMention: false }, 1]
        },
        (commentText, expectedCallCount) => {
            test(`should call createComment ${expectedCallCount} times`, () => {
                const createCommentSpy = jest.fn();

                const wrapper = render({ createComment: createCommentSpy });
                const instance = wrapper.instance();

                instance.getFormattedCommentText = jest.fn().mockReturnValue(commentText);

                const submitBtn = wrapper.find('PrimaryButton.bcs-comment-input-submit-btn');
                const formEl = wrapper.find('form').getDOMNode();
                formEl.checkValidity = () => !!expectedCallCount;
                submitBtn.simulate('submit', { target: formEl });

                expect(createCommentSpy).toHaveBeenCalledTimes(expectedCallCount);
            });
        }
    );

    test('should call createTask handler when approver has been added', () => {
        const createTaskSpy = jest.fn();
        const createCommentSpy = jest.fn();
        const wrapper = render({
            createComment: createCommentSpy,
            createTask: createTaskSpy
        });

        const instance = wrapper.instance();
        instance.getFormattedCommentText = jest.fn().mockReturnValue({ text: 'hey', hasMention: false });

        wrapper.setState({
            approvers: [{ text: '123', value: '123' }],
            isAddApprovalVisible: true
        });

        instance.onFormValidSubmitHandler({ addApproval: 'on' });

        expect(createTaskSpy).toHaveBeenCalledTimes(1);
        expect(createCommentSpy).not.toHaveBeenCalled();
    });

    test('should call createTask with correct args on task submit', () => {
        const createTaskSpy = jest.fn();
        const createCommentStub = jest.fn();
        const commentText = { text: 'a comment', hasMention: false };
        const addApproval = 'on';
        const approvers = [{ text: '123', value: 123 }, { text: '124', value: 124 }];

        const wrapper = render({
            createComment: createCommentStub,
            createTask: createTaskSpy
        });

        const instance = wrapper.instance();
        instance.getFormattedCommentText = jest.fn().mockReturnValue(commentText);

        wrapper.setState({
            approvers,
            approvalDate: '2014-04-12'
        });

        wrapper.find('Form').prop('onValidSubmit')({
            addApproval
        });

        expect(createTaskSpy).toHaveBeenCalledWith({
            text: commentText.text,
            assignees: approvers,
            dueAt: '2014-04-12'
        });
        expect(instance.getFormattedCommentText).toHaveBeenCalledTimes(1);
    });

    test('should set error and not call createTask() when no approvers have been selected', () => {
        const createTaskSpy = jest.fn();
        const wrapper = render({ createTask: createTaskSpy });

        const instance = wrapper.instance();
        instance.getFormattedCommentText = jest.fn().mockReturnValue({ text: 'a comment', hasMention: false });

        wrapper.find('Form').prop('onValidSubmit')({
            addApproval: 'on',
            approverDateInput: '2014-04-12'
        });

        expect(wrapper.state('approverSelectorError')).toBeTruthy();
        expect(createTaskSpy).not.toHaveBeenCalled();
        expect(instance.getFormattedCommentText).toHaveBeenCalled();
    });

    test('should filter approver selector options correctly', () => {
        const wrapper = render({
            approverSelectorContacts: [
                { id: 123, item: { id: 123, name: 'name' }, name: 'name' },
                { id: 234, item: { id: 234, name: 'test' }, name: 'test' }
            ],
            createTask: jest.fn()
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
            createComment: jest.fn(),
            createTask: jest.fn()
        });
        const instance = wrapper.instance();
        instance.getFormattedCommentText = jest.fn().mockReturnValue({ text: commentText, hasMention: false });

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
                'no entities in the editor': [rawContentNoEntities, { text: 'Hey there', hasMention: false }],
                'one entity in the editor': [rawContentOneEntity, { text: 'Hey @[1:Becky]', hasMention: true }],
                'two entities in the editor': [
                    rawContentTwoEntities,
                    { text: 'I hung out with @[1:Becky] and @[2:Shania]', hasMention: true }
                ],
                'two entities and a linebreak in the editor': [
                    rawContentTwoEntitiesOneLineBreak,
                    { text: 'I hung out with @[1:Becky] and\n@[2:Shania] yesterday', hasMention: true }
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
        test('should call getApproverWithQuery() when called', () => {
            const value = 'test';
            const getApproverWithQuery = jest.fn();
            const wrapper = render({ getApproverWithQuery });
            wrapper.instance().handleApproverSelectorInput(value);

            expect(getApproverWithQuery).toHaveBeenCalledWith(value);
        });

        test('should clear approver selector error when called', () => {
            const wrapper = render({
                getApproverWithQuery: jest.fn()
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
