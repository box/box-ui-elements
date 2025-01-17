import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import FolderIcon from '../FolderIcon';

describe('icons/folder-icon/FolderIcon', () => {
    const renderComponent = (props = {}) => render(<FolderIcon {...props} />);

    test('should render default personal folder icon with correct accessibility', () => {
        renderComponent();
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('height', '32');
        expect(icon).toHaveAttribute('width', '32');
    });

    test('should render external folder icon with correct accessibility', () => {
        renderComponent({ isExternal: true });
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('height', '32');
        expect(icon).toHaveAttribute('width', '32');
    });

    test('should render collab folder icon with correct accessibility', () => {
        renderComponent({ isCollab: true });
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('height', '32');
        expect(icon).toHaveAttribute('width', '32');
    });

    test('should prioritize external over collab icon with correct accessibility', () => {
        renderComponent({
            isCollab: true,
            isExternal: true,
        });
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('height', '32');
        expect(icon).toHaveAttribute('width', '32');
    });

    test('should render with custom dimension', () => {
        renderComponent({ dimension: 64 });
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('height', '64');
        expect(icon).toHaveAttribute('width', '64');
    });

    test('should render with title and aria-label', () => {
        const title = 'Custom Title';
        renderComponent({ title });
        const icon = screen.getByRole('img', { name: title });
        expect(icon).toHaveAttribute('aria-label', title);
    });

    test('should render with aria-label when provided', () => {
        const ariaLabel = 'Custom Label';
        renderComponent({ 'aria-label': ariaLabel });
        const icon = screen.getByRole('img', { name: ariaLabel });
        expect(icon).toHaveAttribute('aria-label', ariaLabel);
    });

    test('should prioritize aria-label over title', () => {
        const title = 'Title';
        const ariaLabel = 'Label';
        renderComponent({ title, 'aria-label': ariaLabel });
        const icon = screen.getByRole('img', { name: ariaLabel });
        expect(icon).toHaveAttribute('aria-label', ariaLabel);
    });
});
