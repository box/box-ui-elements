import React from 'react';
import noop from 'lodash/noop';
import { render, screen } from '../../../test-utils/testing-library';
import Footer from '../Footer';
import { ERROR_CODE_UPLOAD_FILE_LIMIT } from '../../../constants';

describe('elements/content-uploader/Footer', () => {
    const defaultProps = {
        fileLimit: 10,
        hasFiles: false,
        isDone: false,
        isLoading: false,
        onCancel: noop,
        onUpload: noop,
    };
    const renderComponent = (props = {}) => render(<Footer {...defaultProps} {...props} />);

    test('cancel button should not be disabled when hasFiles is $hasFiles and isDone is $isDone', () => {
        renderComponent({ hasFiles: true, isDone: false });
        const closeButton = screen.getByRole('button', { name: 'Cancel' });

        expect(closeButton).not.toHaveAttribute('aria-disabled');
    });

    test.each`
        hasFiles | isDone
        ${false} | ${true}
        ${false} | ${false}
        ${true}  | ${true}
    `('cancel button should be disabled when hasFiles is $hasFiles and isDone is $isDone', ({ hasFiles, isDone }) => {
        renderComponent({ hasFiles, isDone });
        const closeButton = screen.getByRole('button', { name: 'Cancel' });

        expect(closeButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('upload button should not be disabled there are files', () => {
        renderComponent({ hasFiles: true });
        const uploadButton = screen.getByRole('button', { name: 'Upload' });

        expect(uploadButton).not.toHaveAttribute('aria-disabled');
    });

    test('upload button should be disabled when there are not any files', () => {
        renderComponent({ hasFiles: false });
        const uploadButton = screen.getByRole('button', { name: 'Upload' });

        expect(uploadButton).toHaveAttribute('aria-disabled');
    });

    test('close button should be disabled when there are files', () => {
        renderComponent({ hasFiles: true, onClose: noop });
        const closeButton = screen.getByRole('button', { name: 'Close' });

        expect(closeButton).toHaveAttribute('aria-disabled');
    });

    test('close button should not be disabled when there are not any files', () => {
        renderComponent({ hasFiles: false, onClose: noop });
        const closeButton = screen.getByRole('button', { name: 'Close' });

        expect(closeButton).not.toHaveAttribute('aria-disabled');
    });

    test('should render upload error message when errorCode is ERROR_CODE_UPLOAD_FILE_LIMIT', () => {
        renderComponent({ errorCode: ERROR_CODE_UPLOAD_FILE_LIMIT });

        expect(screen.getByText('You can only upload up to 10 file(s) at a time.')).toBeInTheDocument();
    });
});
