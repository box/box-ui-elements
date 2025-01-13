import * as React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import UploadInput, { UploadInputProps } from '../UploadInput';

describe('elements/content-uploader/UploadInput', () => {
    const renderComponent = (props: Partial<UploadInputProps>) => {
        const defaultProps: UploadInputProps = {
            onChange: jest.fn(),
        };
        return render(<UploadInput {...defaultProps} {...props} />);
    };

    test('should render correctly when inputLabel is available', () => {
        renderComponent({
            inputLabelClass: 'inputLabelClass',
            inputLabel: 'yo',
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByText('yo')).toHaveClass('inputLabelClass');
    });

    test('should render correctly when inputLabel is not available', () => {
        const { container } = renderComponent({});
        expect(container).toBeEmptyDOMElement();
    });

    test('should render correctly when isFolderUpload is true', () => {
        renderComponent({
            inputLabel: 'yo',
            isFolderUpload: true,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).toHaveAttribute('webkitdirectory', '');
    });

    test('should render correctly when isFolderUpload is false', () => {
        renderComponent({
            inputLabel: 'yo',
            isFolderUpload: false,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).not.toHaveAttribute('webkitdirectory');
    });

    test('should render correctly when isMultiple is true', () => {
        renderComponent({
            inputLabel: 'yo',
            isMultiple: true,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).toHaveAttribute('multiple');
    });

    test('should render correctly when isMultiple is false', () => {
        renderComponent({
            inputLabel: 'yo',
            isMultiple: false,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).not.toHaveAttribute('multiple');
    });

    describe('onSelection callback', () => {
        const createMockFileList = (files: File[]) => ({
            ...files,
            item: (i: number) => files[i],
            length: files.length,
        });

        test('should call onSelection with FileList when provided', () => {
            const onSelection = jest.fn(() => true);
            const onChange = jest.fn();
            const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockFileList = createMockFileList([mockFile]);

            renderComponent({
                inputLabel: 'upload',
                onSelection,
                onChange,
            });

            const input = screen.getByTestId('upload-input');
            fireEvent.change(input, { target: { files: mockFileList } });

            expect(onSelection).toHaveBeenCalledWith(mockFileList);
            expect(onChange).toHaveBeenCalled();
        });

        test('should prevent upload when onSelection returns false', () => {
            const onSelection = jest.fn(() => false);
            const onChange = jest.fn();
            const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockFileList = createMockFileList([mockFile]);

            renderComponent({
                inputLabel: 'upload',
                onSelection,
                onChange,
            });

            const input = screen.getByTestId('upload-input');
            fireEvent.change(input, { target: { files: mockFileList } });

            expect(onSelection).toHaveBeenCalledWith(mockFileList);
            expect(onChange).not.toHaveBeenCalled();
        });

        test('should proceed with upload when onSelection returns true', () => {
            const onSelection = jest.fn(() => true);
            const onChange = jest.fn();
            const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockFileList = createMockFileList([mockFile]);

            renderComponent({
                inputLabel: 'upload',
                onSelection,
                onChange,
            });

            const input = screen.getByTestId('upload-input');
            fireEvent.change(input, { target: { files: mockFileList } });

            expect(onSelection).toHaveBeenCalledWith(mockFileList);
            expect(onChange).toHaveBeenCalled();
        });

        test('should proceed with upload when onSelection is not provided', () => {
            const onChange = jest.fn();
            const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockFileList = createMockFileList([mockFile]);

            renderComponent({
                inputLabel: 'upload',
                onChange,
            });

            const input = screen.getByTestId('upload-input');
            fireEvent.change(input, { target: { files: mockFileList } });

            expect(onChange).toHaveBeenCalled();
        });
    });
});
