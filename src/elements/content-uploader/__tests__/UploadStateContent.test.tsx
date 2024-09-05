import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import UploadStateContent from '../UploadStateContent';

describe('elements/content-uploader/UploadStateContent', () => {
    const renderComponent = (props = {}) => render(<UploadStateContent {...props} />);

    test('renders empty component when there are no props', () => {
        const { container } = renderComponent();

        expect(container.firstChild).toBeEmptyDOMElement();
    });

    test('renders text when there is a message', () => {
        renderComponent({ message: 'upload here' });

        expect(screen.getByText('upload here')).toBeInTheDocument();
    });

    test('renders file input when there is a file input label', () => {
        renderComponent({ fileInputLabel: 'file upload' });

        expect(screen.getByLabelText('file upload')).toBeInTheDocument();
    });

    test('renders folder input when there is a folder input label', () => {
        renderComponent({ fileInputLabel: 'file upload', folderInputLabel: 'folder upload' });

        expect(screen.getByLabelText('file upload')).toBeInTheDocument();
        expect(screen.getByLabelText('folder upload')).toBeInTheDocument();
    });

    test('does not render folder input when the label is a button', () => {
        renderComponent({ fileInputLabel: 'file upload', folderInputLabel: 'folder upload', useButton: true });

        expect(screen.getByLabelText('file upload')).toBeInTheDocument();
        expect(screen.queryByLabelText('folder upload')).not.toBeInTheDocument();
    });

    test('resets the input selection when there is a change event', async () => {
        const onChange = jest.fn();
        renderComponent({ fileInputLabel: 'file upload', onChange });

        const input: HTMLInputElement = screen.getByLabelText('file upload');
        await userEvent.upload(input, new File(['box'], 'box.txt'));

        expect(onChange).toBeCalled();
        expect(input.files.length).toBe(0);
    });
});
