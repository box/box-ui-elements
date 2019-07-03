import * as React from 'react';
import { mount } from 'enzyme';
import { EditorState, convertFromRaw } from 'draft-js';

import FeatureProvider from '../../../../common/feature-checking/FeatureProvider';
import { ApprovalCommentFormUnwrapped as ApprovalCommentForm } from '../ApprovalCommentForm';

jest.mock('../../Avatar', () => () => 'Avatar');

const intlFake = {
    formatMessage: message => message.id,
};

describe('elements/content-sidebar/ActivityFeed/approval-comment-form/ApprovalCommentForm', () => {
    const features = {
        activityFeed: {
            tasks: {
                createFromComment: true,
            },
        },
    };

    const render = props =>
        mount(
            <ApprovalCommentForm
                getMentionWithQuery={() => {}}
                intl={intlFake}
                user={{ id: 123, name: 'foo bar' }}
                {...props}
            />,
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
                .prop('isRequired'),
        ).toEqual(false);
    });

    test('should set required to true on comment input when isOpen is true', () => {
        const wrapper = render({ isOpen: true });

        expect(
            wrapper
                .find('DraftJSMentionSelector')
                .at(0)
                .prop('isRequired'),
        ).toEqual(true);
    });

    test('should render add approval ui when createTask handler is defined, and the feature is enabled', () => {
        const wrapper = mount(
            <FeatureProvider features={features}>
                <ApprovalCommentForm
                    createTask={jest.fn()}
                    getMentionWithQuery={() => {}}
                    intl={intlFake}
                    user={{ id: 123, name: 'foo bar' }}
                />
            </FeatureProvider>,
        );

        expect(wrapper.find('.bcs-comment-add-approver').length).toEqual(1);
    });

    test('should render add approval fields when add approver is checked', () => {
        const wrapper = mount(
            <FeatureProvider features={features}>
                <ApprovalCommentForm
                    createTask={jest.fn()}
                    getMentionWithQuery={() => {}}
                    intl={intlFake}
                    user={{ id: 123, name: 'foo bar' }}
                />
            </FeatureProvider>,
        );

        wrapper
            .find('ApprovalCommentForm')
            .instance()
            .onFormChangeHandler({ addApproval: 'on' });
        wrapper.update();

        expect(wrapper.find('.bcs-comment-add-approver-fields-container').length).toEqual(1);
    });

    // Test cases in order
    // empty comment box
    // non empty comment box
    test.each`
        commentText                           | expectedCallCount
        ${{ text: '', hasMention: false }}    | ${0}
        ${{ text: 'hey', hasMention: false }} | ${1}
    `(`should call createComment $expectedCallCount times`, ({ commentText, expectedCallCount }) => {
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

    test('should call createTask handler when approver has been added', () => {
        const createTaskSpy = jest.fn();
        const createCommentSpy = jest.fn();
        const wrapper = render({
            createComment: createCommentSpy,
            createTask: createTaskSpy,
        });

        const instance = wrapper.instance();
        instance.getFormattedCommentText = jest.fn().mockReturnValue({ text: 'hey', hasMention: false });

        wrapper.setState({
            approvers: [{ text: '123', value: '123' }],
            isAddApprovalVisible: true,
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
            createTask: createTaskSpy,
        });

        const instance = wrapper.instance();
        instance.getFormattedCommentText = jest.fn().mockReturnValue(commentText);

        wrapper.setState({
            approvers,
            approvalDate: '2014-04-12',
        });

        wrapper.find('Form').prop('onValidSubmit')({
            addApproval,
        });

        expect(createTaskSpy).toHaveBeenCalledWith({
            text: commentText.text,
            assignees: approvers,
            dueAt: '2014-04-12',
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
            approverDateInput: '2014-04-12',
        });

        expect(wrapper.state('approverSelectorError')).toBeTruthy();
        expect(createTaskSpy).not.toHaveBeenCalled();
        expect(instance.getFormattedCommentText).toHaveBeenCalled();
    });

    test('should filter approver selector options correctly', () => {
        const props = {
            approverSelectorContacts: [
                { id: 123, item: { id: 123, name: 'name' }, name: 'name' },
                { id: 234, item: { id: 234, name: 'test' }, name: 'test' },
            ],
            createTask: jest.fn(),
        };
        const wrapper = mount(
            <FeatureProvider features={features}>
                <ApprovalCommentForm
                    createTask={jest.fn()}
                    getMentionWithQuery={() => {}}
                    intl={intlFake}
                    user={{ id: 123, name: 'foo bar' }}
                    {...props}
                />
            </FeatureProvider>,
        );

        const approvalCommentForm = wrapper.find('ApprovalCommentForm');
        approvalCommentForm.instance().setState({
            approvers: [{ text: 'name', value: 123 }],
            isAddApprovalVisible: true,
        });

        wrapper.update();
        expect(wrapper.find('PillSelectorDropdown').prop('selectorOptions').length).toBe(1);
    });

    test('should reset approvers after submitting the form', () => {
        const commentText = 'a comment';
        const addApproval = 'on';
        const approverDateInput = '2014-04-12';
        const wrapper = render({
            createComment: jest.fn(),
            createTask: jest.fn(),
        });
        const instance = wrapper.instance();
        instance.getFormattedCommentText = jest.fn().mockReturnValue({ text: commentText, hasMention: false });

        wrapper.setState({
            approvers: [{ text: '123', value: 123 }, { text: '124', value: 124 }],
        });

        wrapper.find('Form').prop('onValidSubmit')({
            addApproval,
            approverDateInput,
        });

        expect(wrapper.state('approvers').length).toBe(0);
    });

    describe('onApprovalDateChangeHandler()', () => {
        test('should set the approval date to be one millisecond before midnight of the next day', () => {
            // Midnight on December 3rd GMT
            const date = new Date('2018-12-03T00:00:00');
            // 11:59:59:999 on December 3rd GMT
            const lastMillisecondOfDate = new Date('2018-12-03T23:59:59.999');
            const wrapper = render({});
            wrapper.instance().onApprovalDateChangeHandler(date);

            expect(wrapper.state('approvalDate')).toEqual(lastMillisecondOfDate);
        });

        test('should change a previously set approval date to null if there is no approval date', () => {
            // Midnight on December 3rd GMT
            const date = new Date('2018-12-03T00:00:00');
            // 11:59:59:999 on December 3rd GMT
            const lastMillisecondOfDate = new Date('2018-12-03T23:59:59.999');
            const wrapper = render({});

            wrapper.instance().onApprovalDateChangeHandler(date);
            expect(wrapper.state('approvalDate')).toEqual(lastMillisecondOfDate);

            wrapper.instance().onApprovalDateChangeHandler(null);
            expect(wrapper.state('approvalDate')).toEqual(null);
        });
    });

    describe('getFormattedCommentText()', () => {
        const rawContentNoEntities = {
            blocks: [
                {
                    text: 'Hey there',
                    type: 'unstyled',
                    entityRanges: [],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                },
            },
        };

        const rawContentOneEntity = {
            blocks: [
                {
                    text: 'Hey @Becky',
                    type: 'unstyled',
                    entityRanges: [{ offset: 4, length: 6, key: 'first' }],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 },
                },
            },
        };

        const rawContentTwoEntities = {
            blocks: [
                {
                    text: 'I hung out with @Becky and @Shania',
                    type: 'unstyled',
                    entityRanges: [{ offset: 16, length: 6, key: 'first' }, { offset: 27, length: 7, key: 'second' }],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 },
                },
                second: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 2 },
                },
            },
        };

        const rawContentTwoEntitiesOneLineBreak = {
            blocks: [
                {
                    text: 'I hung out with @Becky and',
                    type: 'unstyled',
                    entityRanges: [{ offset: 16, length: 6, key: 'first' }],
                },
                {
                    text: '@Shania yesterday',
                    type: 'unstyled',
                    entityRanges: [{ offset: 0, length: 7, key: 'second' }],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 },
                },
                second: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 2 },
                },
            },
        };

        // Test cases in order
        // no entities in the editor
        // one entity in the editor
        // two entities in the editor
        // two entities and a linebreak in the editor
        test.each`
            rawContent                           | expected
            ${rawContentNoEntities}              | ${{ text: 'Hey there', hasMention: false }}
            ${rawContentOneEntity}               | ${{ text: 'Hey @[1:Becky]', hasMention: true }}
            ${rawContentTwoEntities}             | ${{ text: 'I hung out with @[1:Becky] and @[2:Shania]', hasMention: true }}
            ${rawContentTwoEntitiesOneLineBreak} | ${{ text: 'I hung out with @[1:Becky] and\n@[2:Shania] yesterday', hasMention: true }}
        `('should return the correct result', ({ rawContent, expected }) => {
            const blocks = convertFromRaw(rawContent);

            const dummyEditorState = EditorState.createWithContent(blocks);

            const wrapper = render();
            const instance = wrapper.instance();
            wrapper.setState({ commentEditorState: dummyEditorState });

            const result = instance.getFormattedCommentText();
            expect(result).toEqual(expected);
        });
    });

    test('should have editor state reflect tagged_message prop when not empty', () => {
        const wrapper = render({ tagged_message: 'hey there' });

        expect(
            wrapper
                .find('DraftJSMentionSelector')
                .at(0)
                .prop('placeholder'),
        ).toBeUndefined();

        const content = wrapper
            .state()
            .commentEditorState.getCurrentContent()
            .getPlainText();
        expect(content).toEqual('hey there');
    });

    test('should have editor state reflect empty state when no tagged_message prop is passed', () => {
        const wrapper = render();

        expect(
            wrapper
                .find('DraftJSMentionSelector')
                .at(0)
                .prop('placeholder'),
        ).toEqual('be.contentSidebar.activityFeed.approvalCommentForm.commentWrite');

        const content = wrapper
            .state()
            .commentEditorState.getCurrentContent()
            .getPlainText();
        expect(content).toEqual('');
    });

    test('should not display trigger @mention selector when getMentionQuery prop is empty', () => {
        const wrapper = render({ getMentionWithQuery: null });

        expect(
            wrapper
                .find('DraftJSMentionSelector')
                .at(0)
                .prop('onMention'),
        ).toEqual(null);
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
                getApproverWithQuery: jest.fn(),
            });
            wrapper.setState({ approverSelectorError: 'test' });
            wrapper.instance().handleApproverSelectorInput('hi');
            expect(wrapper.state('approverSelectorError')).toEqual('');
        });
    });

    describe('scrollApproverSelector()', () => {
        test('should scroll the approver selector input', () => {
            const input = {
                scrollTop: 0,
                scrollHeight: 100,
            };
            document.querySelector = jest.fn().mockReturnValue(input);

            const wrapper = render();
            wrapper.instance().scrollApproverSelector();

            expect(input.scrollTop).toEqual(100);
        });
    });

    describe('handleApproverSelectorSelect()', () => {
        test('should update approvers when called', () => {
            const wrapper = render();
            wrapper.setState({ approvers: [{ value: 123 }] });
            wrapper.instance().handleApproverSelectorSelect([{ value: 234 }]);
            expect(wrapper.state('approvers')).toEqual([{ value: 123 }, { value: 234 }]);
        });

        test('should scroll the selector input after the state has been set', () => {
            const wrapper = render();
            const instance = wrapper.instance();
            instance.scrollApproverSelector = jest.fn();

            wrapper.instance().handleApproverSelectorSelect([{ value: 234 }]);
            expect(instance.scrollApproverSelector).toHaveBeenCalled();
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
