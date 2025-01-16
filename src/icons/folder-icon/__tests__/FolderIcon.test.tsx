import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import FolderIcon from '../FolderIcon';

describe('icons/folder-icon/FolderIcon', () => {
    const renderComponent = (props = {}) => render(<FolderIcon {...props} />);

    test('should render default 32 icon when no props are defined', () => {
        const { container } = renderComponent();
        expect(container.firstChild).toMatchSnapshot();
    });

    test('should render external icon when isExternal is true', () => {
        const { container } = renderComponent({ isExternal: true });
        expect(container.firstChild).toMatchSnapshot();
    });

    test('should render collab icon when isCollab is true', () => {
        const { container } = renderComponent({ isCollab: true });
        expect(container.firstChild).toMatchSnapshot();
    });

    test('should render external icon when isExternal and isCollab is true', () => {
        const { container } = renderComponent({
            isCollab: true,
            isExternal: true,
        });
        expect(container.firstChild).toMatchSnapshot();
    });

    test('should render 64 icon when dimension is defined', () => {
        const { container } = renderComponent({ dimension: 64 });
        expect(container.firstChild).toMatchSnapshot();
    });

    test('should render title when title is defined', () => {
        const { container } = renderComponent({ title: 'title' });
        expect(container.firstChild).toMatchSnapshot();
    });

    test('should render with correct accessibility attributes', () => {
        renderComponent({ title: 'Test Title' });
        const icon = screen.getByRole('img', { name: 'Test Title' });
        expect(icon).toHaveAttribute('aria-label', 'Test Title');
    });
});
