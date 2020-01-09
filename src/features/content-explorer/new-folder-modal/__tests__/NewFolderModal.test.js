import React from 'react';
import sinon from 'sinon';

import { NewFolderModalBase as NewFolderModal } from '../NewFolderModal';

describe('features/content-explorer/new-folder-modal/NewFolderModal', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props =>
        shallow(
            <NewFolderModal
                intl={{ formatMessage: () => '' }}
                isOpen
                onCreateFolderSubmit={() => {}}
                onRequestClose={() => {}}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.hasClass('new-folder-modal')).toBe(true);
            expect(wrapper.find('TextInput.folder-name-input').length).toBe(1);
            expect(wrapper.find('.new-folder-modal-cancel-button').length).toBe(1);
            expect(wrapper.find('.new-folder-modal-create-button').length).toBe(1);
            expect(!wrapper.find('.new-folder-modal-create-button').prop('isLoading')).toBe(true);
            expect(wrapper.find('.new-folder-modal-create-button').prop('isDisabled')).toBe(true);
        });

        test('should render component with class when specified', () => {
            const className = 'test';
            const wrapper = renderComponent({ className });

            expect(wrapper.hasClass('new-folder-modal')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render component with modal title', () => {
            const wrapper = renderComponent({
                parentFolderName: 'Test Folder',
            });

            expect(wrapper.find('Modal').prop('title')).toBeTruthy();
        });

        test('should render component with error when specified', () => {
            const createFolderError = 'This is an error';
            const wrapper = renderComponent({ createFolderError });

            expect(wrapper.find('.folder-name-input').prop('error')).toEqual(createFolderError);
        });

        test('should render component with loading create button when isCreatingFolder is true', () => {
            const wrapper = renderComponent({ isCreatingFolder: true });

            expect(wrapper.find('.new-folder-modal-create-button').prop('isLoading')).toBe(true);
        });

        test('should render component with disabled create button when error is specified', () => {
            const createFolderError = 'This is an error';
            const wrapper = renderComponent({ createFolderError });

            // Make sure the button isn't disabled because of the empty input
            wrapper.setState({ folderNameInput: 'test' });

            expect(wrapper.find('.new-folder-modal-create-button').prop('isDisabled')).toBe(true);
        });
    });

    describe('onRequestClose', () => {
        test('should call onRequestClose when cancel button is clicked', () => {
            const onRequestCloseSpy = sandbox.spy();
            const wrapper = renderComponent({
                onRequestClose: onRequestCloseSpy,
            });

            wrapper.find('.new-folder-modal-cancel-button').simulate('click');

            expect(onRequestCloseSpy.calledOnce).toBe(true);
        });
    });

    describe('onCreateFolderSubmit', () => {
        test('should call onCreateFolderSubmit when create button is clicked', () => {
            const input = 'test';
            const onCreateFolderSubmitSpy = sandbox.spy();
            const wrapper = renderComponent({
                onCreateFolderSubmit: onCreateFolderSubmitSpy,
            });

            wrapper.setState({ folderNameInput: input });
            wrapper.find('.new-folder-modal-create-button').simulate('click');

            expect(onCreateFolderSubmitSpy.calledOnce).toBe(true);
            expect(onCreateFolderSubmitSpy.calledWithExactly(input)).toBe(true);
        });
    });

    describe('onCreateFolderInput', () => {
        test('should call onCreateFolderInput when typing in folder name input', () => {
            const input = 'test';
            const onCreateFolderInputSpy = sandbox.spy();
            const wrapper = renderComponent({
                onCreateFolderInput: onCreateFolderInputSpy,
            });

            wrapper.find('.folder-name-input').simulate('input', { target: { value: input } });

            expect(onCreateFolderInputSpy.calledOnce).toBe(true);
            expect(onCreateFolderInputSpy.calledWithExactly(input)).toBe(true);
        });
    });
});
