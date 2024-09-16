import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import UploadsManager from '../UploadsManager';

describe('elements/content-uploader/UploadsManager', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            isDragging: false,
            isExpanded: true,
            isVisible: true,
            isResumableUploadsEnabled: true,
            items: [],
            onItemActionClick: jest.fn(),
            onRemoveActionClick: jest.fn(),
            onUpgradeCTAClick: jest.fn(),
            onUploadsManagerActionClick: jest.fn(),
            toggleUploadsManager: jest.fn(),
            view: 'upload-empty',
        };
        return render(<UploadsManager {...defaultProps} {...props} />);
    };

    test('calls `toggleUploadsManager` when the uploads manager is clicked', async () => {
        const toggleUploadsManager = jest.fn();

        renderComponent({ toggleUploadsManager });

        expect(toggleUploadsManager).not.toHaveBeenCalled();

        await userEvent.click(screen.getByText('Drop files on this page to upload them into this folder.'));

        expect(toggleUploadsManager).toHaveBeenCalledTimes(1);
    });

    test.each(['Enter', ' '])('calls `toggleUploadsManager` when the Enter or Space key is pressed', async key => {
        const toggleUploadsManager = jest.fn();

        renderComponent({ toggleUploadsManager });

        expect(toggleUploadsManager).not.toHaveBeenCalled();

        await userEvent.type(screen.getByText('Drop files on this page to upload them into this folder.'), `{${key}}`);

        expect(toggleUploadsManager).toHaveBeenCalledTimes(2); // One call is made when clicking on the uploads manager to use userEvent.type
    });

    test('does not call `toggleUploadsManager` when a key that is not Enter or Space is pressed', async () => {
        const toggleUploadsManager = jest.fn();

        renderComponent({ toggleUploadsManager });

        expect(toggleUploadsManager).not.toHaveBeenCalled();

        await userEvent.type(screen.getByText('Drop files on this page to upload them into this folder.'), '{Tab}');

        expect(toggleUploadsManager).toHaveBeenCalledTimes(1); // One call is made when clicking on the uploads manager to use userEvent.type
    });

    test('calculates correct progress of current uploads when there are multiple items', () => {
        const items = [
            { isFolder: true, name: 'folder', progress: 100, size: 1, status: 'complete' },
            { extension: 'txt', name: 'file1', progress: 70, size: 4000, status: 'inprogress' },
            { extension: 'txt', name: 'file2', progress: 100, size: 2000, status: 'staged' },
        ];

        renderComponent({ items, view: 'upload-inprogress' });

        expect(window.getComputedStyle(screen.getByRole('progressbar')).width).toBe('80%');
    });

    test('renders component correctly when there are errors with uploading', () => {
        const items = [
            { extension: 'txt', name: 'file1', progress: 0, size: 4000, status: 'error' },
            { extension: 'txt', name: 'file2', progress: 0, size: 2000, status: 'error' },
        ];

        renderComponent({ items, view: 'error' });

        expect(screen.getByRole('button', { name: 'Resume All' })).toBeInTheDocument();
        expect(screen.getByText('Some Uploads Failed')).toBeInTheDocument();
    });
});
