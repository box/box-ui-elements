import React from 'react';
import userEvent from '@testing-library/user-event';

import ItemName, { ItemNameProps } from '../ItemName';
import { fireEvent, render, screen } from '../../../../test-utils/testing-library';
import { TYPE_FOLDER, TYPE_WEBLINK } from '../../../../constants';

const mockItem = {
    id: '1',
    name: 'Test Item',
    type: 'file',
};

describe('elements/common/item/ItemName', () => {
    const renderComponent = (props: Partial<ItemNameProps> = {}) => {
        render(<ItemName item={mockItem} onClick={jest.fn()} canPreview={true} isTouch={false} {...props} />);
    };

    test('renders a TextButton for folders', () => {
        renderComponent({
            item: { ...mockItem, type: TYPE_FOLDER },
            canPreview: false,
            isTouch: false,
        });
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('renders a TextButton for weblinks when not on touch and canPreview is true', () => {
        renderComponent({
            item: { ...mockItem, type: TYPE_WEBLINK },
            canPreview: true,
            isTouch: false,
        });
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('renders a span for files when isTouch is true', () => {
        renderComponent({
            canPreview: false,
            isTouch: true,
        });
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('calls onClick when TextButton is clicked', async () => {
        const mockOnClick = jest.fn();
        renderComponent({
            onClick: mockOnClick,
            canPreview: true,
            isTouch: false,
        });
        await userEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledWith(mockItem);
    });

    test('calls onFocus when TextButton is focused', () => {
        const mockOnFocus = jest.fn();
        renderComponent({
            onFocus: mockOnFocus,
            canPreview: true,
            isTouch: false,
        });
        fireEvent.focus(screen.getByRole('button'));
        expect(mockOnFocus).toHaveBeenCalledWith(mockItem);
    });
});
