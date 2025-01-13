/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import '@testing-library/jest-dom';
import ItemGrid from '../ItemGrid';
import type { ItemGridProps } from '../flowTypes';
import type { Collection } from '../../../common/types/core';

describe('elements/content-explorer/ItemGrid', () => {
    const defaultProps: ItemGridProps & {
        currentCollection: Collection;
        gridColumnCount: number;
        rootElement: HTMLElement;
    } = {
        currentCollection: {
            items: [
                { id: '1', name: 'item1', type: 'file' },
                { id: '2', name: 'item2', type: 'folder' },
            ],
        },
        gridColumnCount: 3,
        onItemSelect: jest.fn(),
        rootElement: document.createElement('div'),
        rootId: '0',
    };

    test('renders grid with items', () => {
        render(<ItemGrid {...defaultProps} />);
        expect(screen.getByText('item1')).toBeInTheDocument();
        expect(screen.getByText('item2')).toBeInTheDocument();
    });

    test('calculates correct grid dimensions', () => {
        render(<ItemGrid {...defaultProps} />);
        const gridElement = screen.getByRole('grid');
        expect(gridElement).toBeInTheDocument();
    });

    test('handles item selection', () => {
        render(<ItemGrid {...defaultProps} />);
        const item1 = screen.getByText('item1');
        fireEvent.click(item1);
        expect(defaultProps.onItemSelect).toHaveBeenCalledWith(
            expect.objectContaining({ id: '1', name: 'item1' }),
            expect.any(Function),
        );
    });

    test('handles keyboard navigation', () => {
        render(<ItemGrid {...defaultProps} />);
        const gridElement = screen.getByRole('grid');

        // Test right arrow navigation
        fireEvent.keyDown(gridElement, { key: 'ArrowRight' });
        expect(defaultProps.onItemSelect).toHaveBeenCalled();

        // Test left arrow navigation
        fireEvent.keyDown(gridElement, { key: 'ArrowLeft' });
        expect(defaultProps.onItemSelect).toHaveBeenCalled();

        // Test up/down arrow navigation
        fireEvent.keyDown(gridElement, { key: 'ArrowDown' });
        expect(defaultProps.onItemSelect).toHaveBeenCalled();
        fireEvent.keyDown(gridElement, { key: 'ArrowUp' });
        expect(defaultProps.onItemSelect).toHaveBeenCalled();
    });

    test('handles empty collection', () => {
        const emptyProps = {
            ...defaultProps,
            currentCollection: { items: [] },
        };
        render(<ItemGrid {...emptyProps} />);
        expect(screen.queryByRole('gridcell')).not.toBeInTheDocument();
    });

    test('handles selected item state', () => {
        const selectedProps = {
            ...defaultProps,
            selected: defaultProps.currentCollection.items[0],
        };
        render(<ItemGrid {...selectedProps} />);
        expect(screen.getByText('item1')).toBeInTheDocument();
    });
});
