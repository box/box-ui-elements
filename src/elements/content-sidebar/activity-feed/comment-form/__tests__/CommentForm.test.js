import * as React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { EditorState } from 'draft-js';

import Button from '../../../../../components/button/Button';
import Media from '../../../../../components/media';
import { CommentFormUnwrapped as CommentForm } from '../CommentForm';

jest.mock('../../Avatar', () => () => 'Avatar');

const intlFake = {
    formatMessage: message => message.id,
};

describe('elements/content-sidebar/ActivityFeed/comment-form/CommentForm', () => {
    const getComponent = (props = {}) => (
        <CommentForm getMentionWithQuery={() => {}} intl={intlFake} user={{ id: 123, name: 'foo bar' }} {...props} />
    );

    const getWrapper = props => mount(getComponent(props));

    const getWrapperRTL = props => render(getComponent(props));

    test('should correctly render initial state', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('[contentEditable]').length).toEqual(1);
        expect(wrapper.find('.bcs-CommentFormControls').length).toEqual(0);
        expect(wrapper.find('.bcs-CommentFormControls').find('button').length).toEqual(0);
    });

    test('should call onFocus handler when input is focused', () => {
        const onFocusSpy = jest.fn();

        const wrapper = getWrapper({ onFocus: onFocusSpy });

        const mentionSelector = wrapper.find('[contentEditable]');
        mentionSelector.simulate('focus');
        expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    test('should call oncancel handler when input is canceled', () => {
        const onCancelSpy = jest.fn();
        const wrapper = getWrapper({ isOpen: true, onCancel: onCancelSpy });
        const cancelButton = wrapper.find(Button).first();

        cancelButton.simulate('click');
        expect(onCancelSpy).toHaveBeenCalledTimes(1);
    });

    test('should render open comment input when isOpen is true', () => {
        const wrapper = getWrapper({ isOpen: true });

        expect(wrapper.find(Media).hasClass('bcs-is-open')).toBe(true);
        expect(wrapper.find('.bcs-CommentFormControls').length).toEqual(1);
        expect(wrapper.find('.bcs-CommentFormControls').find('button').length).toEqual(2);
    });

    test('should set required to false on comment input when not open', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('isRequired')).toEqual(false);
    });

    test('should set required to true on comment input when isOpen is true', () => {
        const wrapper = getWrapper({ isOpen: true });

        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('isRequired')).toEqual(true);
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

        const wrapper = getWrapper({ createComment: createCommentSpy });
        const instance = wrapper.instance();

        instance.getFormattedCommentText = jest.fn().mockReturnValue(commentText);

        const form = wrapper.find('form');
        const formEl = form.getDOMNode();
        formEl.checkValidity = () => !!expectedCallCount;
        form.simulate('submit', { target: formEl });

        expect(createCommentSpy).toHaveBeenCalledTimes(expectedCallCount);
    });

    test('should have editor state reflect tagged_message prop when not empty', () => {
        const wrapper = getWrapper({ tagged_message: 'hey there' });

        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('placeholder')).toBeUndefined();

        const content = wrapper.state().commentEditorState.getCurrentContent().getPlainText();
        expect(content).toEqual('hey there');
    });

    test('should have editor state reflect empty state when no tagged_message prop is passed', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('placeholder')).toEqual(
            'be.contentSidebar.activityFeed.commentForm.commentWrite',
        );

        const content = wrapper.state().commentEditorState.getCurrentContent().getPlainText();
        expect(content).toEqual('');
    });

    test('should not display trigger @mention selector when getMentionQuery prop is empty', () => {
        const wrapper = getWrapper({ getMentionWithQuery: null });

        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('onMention')).toEqual(null);
    });

    test('should not show mention tip is showTip is false', () => {
        const wrapper = getWrapper({ showTip: false });

        expect(wrapper.find('.bcs-CommentForm-tip').length).toEqual(0);
    });

    test('should show custom placeholder when provided', () => {
        const wrapper = getWrapper({ placeholder: 'Your comment goes here' });

        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('placeholder')).toEqual('Your comment goes here');
    });

    test('should not focus on textbox when shouldFocusOnOpen is false', () => {
        const mockFocusFunc = jest.fn();
        EditorState.moveFocusToEnd = mockFocusFunc;

        getWrapperRTL();
        expect(mockFocusFunc).not.toHaveBeenCalled();
    });

    test('should focus on textbox when shouldFocusOnOpen is true', () => {
        const mockFocusFunc = jest.fn();
        EditorState.moveFocusToEnd = mockFocusFunc;

        getWrapperRTL({ shouldFocusOnOpen: true });
        expect(mockFocusFunc).toHaveBeenCalled();
    });

    test('should enable timestamp when file is a video and timestampedComments is enabled', () => {
        const wrapper = getWrapper({
            file: { extension: 'mp4' },
            features: { 'activityFeed.timestampedComments': { enabled: true } },
        });
        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('timestampedCommentsEnabled')).toEqual(true);
    });

    test('should not enable timestamp when file is not a video but timestampedComments is enabled', () => {
        const wrapper = getWrapper({
            file: { extension: 'pdf' },
            features: { 'activityFeed.timestampedComments': { enabled: true } },
        });
        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('timestampedCommentsEnabled')).toEqual(false);
    });

    test('should not enable timestamp when file is a video but timestampedComments is disabled', () => {
        const wrapper = getWrapper({
            file: { extension: 'mp4' },
            features: { 'activityFeed.timestampedComments': { enabled: false } },
        });
        expect(wrapper.find('DraftJSMentionSelector').at(0).prop('timestampedCommentsEnabled')).toEqual(false);
    });
});
