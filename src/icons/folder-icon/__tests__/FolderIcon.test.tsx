import React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import FolderIcon from '../FolderIcon';

describe('icons/folder-icon/FolderIcon', () => {
    test('renders personal folder icon with correct aria-label', () => {
        render(<FolderIcon />);
        expect(screen.getByLabelText('Personal Folder')).toBeInTheDocument();
    });

    test('renders shared folder icon with correct aria-label when isCollab is true', () => {
        render(<FolderIcon isCollab />);
        expect(screen.getByLabelText('Collaborated Folder')).toBeInTheDocument();
    });

    test('renders external folder icon with correct aria-label when isExternal is true', () => {
        render(<FolderIcon isExternal />);
        expect(screen.getByLabelText('External Folder')).toBeInTheDocument();
    });

    test('renders with default dimension when dimension is not provided', () => {
        render(<FolderIcon />);

        const icon = screen.getByLabelText('Personal Folder');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('height', '32');
        expect(icon).toHaveAttribute('width', '32');
    });

    test('renders with custom dimension when dimension is provided', () => {
        render(<FolderIcon dimension={64} />);
        const icon = screen.getByLabelText('Personal Folder');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('height', '64');
        expect(icon).toHaveAttribute('width', '64');
    });

    test.each`
        isExternal | isCollab
        ${true}    | ${true}
        ${false}   | ${true}
        ${false}   | ${false}
    `('renders with custom title when title is provided', ({ isExternal, isCollab }) => {
        const customTitle = 'Custom Folder Title';
        render(<FolderIcon isExternal={isExternal} isCollab={isCollab} title={customTitle} />);
        expect(screen.getByLabelText(customTitle)).toBeInTheDocument();
    });
});
