import * as React from 'react';
import { mount } from 'enzyme';

import Button from '../../../../../components/button/Button';
import Media from '../../../../../components/media';
import { CommentFormUnwrapped as CommentForm } from '../CommentForm';

jest.mock('../../Avatar', () => () => 'Avatar');

const intlFake = {
    formatMessage: message => message.id,
};

describe('elements/content-sidebar/ActivityFeed/comment-form/CommentForm', () => {
    const render = props =>
        mount(
            <CommentForm
                getMentionWithQuery={() => {}}
                intl={intlFake}
                user={{ id: 123, name: 'foo bar' }}
                {...props}
            />,
        );

    test('should correctly render initial state', () => {
        const wrapper = render();

        expect(wrapper.find('[contentEditable]').length).toEqual(1);
        expect(wrapper.find('.bcs-CommentFormControls').length).toEqual(0);
        expect(wrapper.find('.bcs-CommentFormControls').find('button').length).toEqual(0);
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
        const wrapper = render({ isOpen: true, onCancel: onCancelSpy });
        const cancelButton = wrapper.find(Button).first();

        cancelButton.simulate('click');
        expect(onCancelSpy).toHaveBeenCalledTimes(1);
    });

    test('should render open comment input when isOpen is true', () => {
        const wrapper = render({ isOpen: true });

        expect(wrapper.find(Media).hasClass('bcs-is-open')).toBe(true);
        expect(wrapper.find('.bcs-CommentFormControls').length).toEqual(1);
        expect(wrapper.find('.bcs-CommentFormControls').find('button').length).toEqual(2);
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

        const form = wrapper.find('form');
        const formEl = form.getDOMNode();
        formEl.checkValidity = () => !!expectedCallCount;
        form.simulate('submit', { target: formEl });

        expect(createCommentSpy).toHaveBeenCalledTimes(expectedCallCount);
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
        ).toEqual('be.contentSidebar.activityFeed.commentForm.commentWrite');

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

    test('should not show mention tip is showTip is false', () => {
        const wrapper = render({ showTip: false });

        expect(wrapper.find('.bcs-CommentForm-tip').length).toEqual(0);
    });
});
