import React from 'react';
import { mount } from 'enzyme';
import ContentSidebar from '../ContentSidebar';
import messages from '../../messages';

jest.mock('../Sidebar', () => 'sidebar');

const {
    fileDescriptionInlineErrorTitleMessage,
    defaultInlineErrorContentMessage,
    versionHistoryErrorHeaderMessage,
    defaultErrorMaskSubHeaderMessage
} = messages;

describe('components/ContentSidebar/ContentSidebar', () => {
    let rootElement;
    const getWrapper = (props) => mount(<ContentSidebar {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('setFileDescriptionErrorCallback()', () => {
        test('should set an inlineError if there is an error in updating the file description', () => {
            const props = {};
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            instance.setFileDescriptionErrorCallback();
            const inlineErrorState = wrapper.state().fileError.inlineError;
            expect(typeof fileDescriptionInlineErrorTitleMessage).toBe('object');
            expect(typeof defaultInlineErrorContentMessage).toBe('object');
            expect(inlineErrorState.title).toEqual(fileDescriptionInlineErrorTitleMessage);
            expect(inlineErrorState.content).toEqual(defaultInlineErrorContentMessage);
        });
    });

    describe('fetchVersionsErrorCallback()', () => {
        test('should set a maskError if there is an error in fetching version history', () => {
            const props = {};
            const wrapper = getWrapper(props);
            const instance = wrapper.instance();
            instance.fetchVersionsErrorCallback();
            const inlineErrorState = wrapper.state().versionError.maskError;
            expect(typeof versionHistoryErrorHeaderMessage).toBe('object');
            expect(typeof defaultErrorMaskSubHeaderMessage).toBe('object');
            expect(inlineErrorState.errorHeader).toEqual(versionHistoryErrorHeaderMessage);
            expect(inlineErrorState.errorSubHeader).toEqual(defaultErrorMaskSubHeaderMessage);
        });
    });
});
