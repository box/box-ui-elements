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
    selectedItemIds: new Set(),
};

const renderComponent = (props: Partial<SubHeaderLeftV2Props> = {}) =>
    render(<SubHeaderLeftV2 {...defaultProps} {...props} />);

describe('elements/common/sub-header/SubHeaderLeftV2', () => {
    describe('when no items are selected', () => {
        test('should render title if provided', () => {
            renderComponent({
                rootName: 'Custom Folder',
                title: 'Custom Title',
                selectedItemIds: new Set(),
            });

            expect(screen.getByText('Custom Title')).toBeInTheDocument();
        });

        test('should render root name if no title is provided', () => {
            renderComponent({
                rootName: 'Custom Folder',
                title: undefined,
                selectedItemIds: new Set(),
            });

            expect(screen.getByText('Custom Folder')).toBeInTheDocument();
        });
    });

    describe('when items are selected', () => {
        test('should render single selected item name', () => {
            renderComponent({
                selectedItemIds: new Set(['1']),
            });

            expect(screen.getByText('file1.txt')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should render multiple selected items count', () => {
            renderComponent({
                selectedItemIds: new Set(['1', '2']),
            });

            expect(screen.getByText('2 files selected')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should render all items selected count', () => {
            renderComponent({
                selectedItemIds: 'all',
            });

            expect(screen.getByText('3 files selected')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
        });

        test('should call onClearSelectedItemIds when close button is clicked', () => {
            const mockOnClearSelectedItemIds = jest.fn();

            renderComponent({
                selectedItemIds: new Set(['1']),
                onClearSelectedItemIds: mockOnClearSelectedItemIds,
            });

            const closeButton = screen.getByRole('button');
            closeButton.click();

            expect(mockOnClearSelectedItemIds).toHaveBeenCalledTimes(1);
        });

        test('should handle selected item not found in collection', () => {
            renderComponent({
                selectedItemIds: new Set(['999']), // Non-existent ID
            });

            // Should not crash and should not render any selected item text
            expect(screen.queryByText('file1.txt')).not.toBeInTheDocument();
            expect(screen.queryByText('file2.txt')).not.toBeInTheDocument();
            expect(screen.queryByText('file3.txt')).not.toBeInTheDocument();
        });

        test('should handle empty collection with selected items', () => {
            renderComponent({
                currentCollection: { items: [] },
                selectedItemIds: new Set(['1']),
            });

            // Should not crash and should not render any selected item text
            expect(screen.queryByText('file1.txt')).not.toBeInTheDocument();
        });
    });
});
