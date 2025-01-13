/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import '@testing-library/jest-dom';
import ItemGridCell from '../ItemGridCell';
import type { ItemGridProps } from '../flowTypes';
import type { BoxItem } from '../../../common/types/core';

describe('elements/content-explorer/ItemGridCell', () => {
    const defaultProps: ItemGridProps & { item: BoxItem } = {
        item: {
            id: '1',
            name: 'test-item',
            type: 'file',
            thumbnailUrl: null,
        },
        canPreview: true,
        isSmall: false,
        isTouch: false,
        onItemClick: jest.fn(),
        onItemSelect: jest.fn(),
        rootId: '0',
        view: 'grid',
    };

    test('renders with item name', () => {
        render(<ItemGridCell {...defaultProps} />);
        expect(screen.getByText('test-item')).toBeVisible();
    });

    test('renders thumbnail component', () => {
        render(<ItemGridCell {...defaultProps} />);
        expect(screen.getByRole('figure')).toHaveClass('bce-ItemGridCell');
    });

    test('renders more options button', () => {
        render(<ItemGridCell {...defaultProps} />);
        expect(screen.getByRole('button')).toBeVisible();
    });

    test('handles item click', () => {
        render(<ItemGridCell {...defaultProps} />);
        const itemName = screen.getByText('test-item');
        fireEvent.click(itemName);
        expect(defaultProps.onItemClick).toHaveBeenCalledWith(defaultProps.item);
    });

    test('handles item selection', () => {
        render(<ItemGridCell {...defaultProps} />);
        const itemName = screen.getByText('test-item');
        fireEvent.click(itemName);
        expect(defaultProps.onItemSelect).toHaveBeenCalledWith(defaultProps.item, expect.any(Function));
    });

    test('handles touch interaction', () => {
        const touchProps = { ...defaultProps, isTouch: true };
        render(<ItemGridCell {...touchProps} />);
        const itemName = screen.getByText('test-item');
        fireEvent.click(itemName);
        expect(defaultProps.onItemSelect).toHaveBeenCalled();
    });

    test('handles keyboard navigation', () => {
        render(<ItemGridCell {...defaultProps} />);
        const itemName = screen.getByText('test-item');

        // Test Enter key
        fireEvent.keyDown(itemName, { key: 'Enter' });
        expect(defaultProps.onItemSelect).toHaveBeenCalled();

        // Test Space key
        fireEvent.keyDown(itemName, { key: ' ' });
        expect(defaultProps.onItemSelect).toHaveBeenCalled();
    });

    test('handles preview state', () => {
        const previewProps = { ...defaultProps, canPreview: false };
        render(<ItemGridCell {...previewProps} />);
        const itemName = screen.getByText('test-item');
        fireEvent.click(itemName);
        expect(defaultProps.onItemSelect).toHaveBeenCalled();
    });
});
