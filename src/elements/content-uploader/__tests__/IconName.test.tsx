import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import IconName from '../IconName';
import { STATUS_ERROR, STATUS_IN_PROGRESS } from '../../../constants';

describe('elements/content-uploader/IconName', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            extension: 'pdf',
            name: 'test-item',
            isResumableUploadsEnabled: false,
            status: 'pending',
        };
        render(<IconName {...defaultProps} {...props} />);
    };

    test('renders component correctly', () => {
        renderComponent();

        expect(screen.getByRole('img', { name: 'PDF File' })).toBeInTheDocument();
        expect(screen.getByText('test-item')).toBeInTheDocument();
    });

    test('renders component correctly when item is a folder', () => {
        renderComponent({ isFolder: true });

        expect(screen.getByRole('img', { name: 'Folder' })).toBeInTheDocument();
        expect(screen.getByText('test-item')).toBeInTheDocument();
    });

    test('renders alert badge when there is an error', () => {
        renderComponent({ isResumableUploadsEnabled: true, status: STATUS_ERROR });

        expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
    });

    test('does not render alert badge when there is no error', () => {
        renderComponent({ isResumableUploadsEnabled: true, status: STATUS_IN_PROGRESS });

        expect(screen.queryByRole('img', { name: 'Error' })).not.toBeInTheDocument();
    });
});
