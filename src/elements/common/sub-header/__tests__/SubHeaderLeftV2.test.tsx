import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import SubHeaderLeftV2 from '../SubHeaderLeftV2';
import type { Collection } from '../../../../common/types/core';
import type { SubHeaderLeftV2Props } from '../SubHeaderLeftV2';

const mockCollection: Collection = {
    items: [
        { id: '1', name: 'file1.txt' },
        { id: '2', name: 'file2.txt' },
        { id: '3', name: 'file3.txt' },
    ],
};

const defaultProps: SubHeaderLeftV2Props = {
    currentCollection: mockCollection,
    selectedKeys: new Set(),
};

const renderComponent = (props: Partial<SubHeaderLeftV2Props> = {}) =>
    render(<SubHeaderLeftV2 {...defaultProps} {...props} />);

describe('elements/common/sub-header/SubHeaderLeftV2', () => {
    describe('when no items are selected', () => {
        test('should render metadata view title', () => {
            renderComponent({
                title: 'Custom Metadata View',
                selectedKeys: new Set(),
            });

            expect(screen.getByText('Custom Metadata View')).toBeInTheDocument();
        });
    });

    describe('when items are selected', () => {
        test('should render single selected item name', () => {
            renderComponent({
                selectedKeys: new Set(['1']),
            });

            expect(screen.getByText('file1.txt')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should render multiple selected items count', () => {
            renderComponent({
                selectedKeys: new Set(['1', '2']),
            });

            expect(screen.getByText('2 files selected')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should render all items selected count', () => {
            renderComponent({
                selectedKeys: 'all',
            });

            expect(screen.getByText('3 files selected')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should call onClearSelectedKeys when close button is clicked', () => {
            const mockOnClearSelectedKeys = jest.fn();

            renderComponent({
                selectedKeys: new Set(['1']),
                onClearSelectedKeys: mockOnClearSelectedKeys,
            });

            const closeButton = screen.getByRole('button');
            closeButton.click();

            expect(mockOnClearSelectedKeys).toHaveBeenCalledTimes(1);
        });

        test('should handle selected item not found in collection', () => {
            renderComponent({
                selectedKeys: new Set(['999']), // Non-existent ID
            });

            // Should not crash and should not render any selected item text
            expect(screen.queryByText('file1.txt')).not.toBeInTheDocument();
            expect(screen.queryByText('file2.txt')).not.toBeInTheDocument();
            expect(screen.queryByText('file3.txt')).not.toBeInTheDocument();
        });

        test('should handle empty collection with selected items', () => {
            renderComponent({
                currentCollection: { items: [] },
                selectedKeys: new Set(['1']),
            });

            // Should not crash and should not render any selected item text
            expect(screen.queryByText('file1.txt')).not.toBeInTheDocument();
        });
    });

    describe('component structure', () => {
        test('should render with correct CSS classes when items are selected', () => {
            renderComponent({
                selectedKeys: new Set(['1']),
            });

            const container = screen.getByText('file1.txt').closest('div');
            expect(container).toHaveClass('SubHeaderLeftV2-selectedContainer');
        });

        test('should render close button with correct CSS class', () => {
            renderComponent({
                selectedKeys: new Set(['1']),
            });

            const closeButton = screen.getByRole('button');
            expect(closeButton).toHaveClass('SubHeaderLeftV2-clearSelectedKeysButton');
        });
    });

    describe('edge cases', () => {
        test('should handle zero selected items', () => {
            renderComponent({
                selectedKeys: new Set(),
            });

            // Should render title instead of selected items
            expect(screen.queryByRole('button')).not.toBeInTheDocument(); // No close button
        });
    });
});
