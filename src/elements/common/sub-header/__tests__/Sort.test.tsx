import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import Sort, { SortProps } from '../Sort';
import { SORT_ASC, SORT_DESC } from '../../../../constants';

describe('elements/common/sub-header/Sort', () => {
    const renderComponent = (props: Partial<SortProps> = {}) => render(<Sort onSortChange={jest.fn()} {...props} />);

    test('should render a button and menu with 6 select menu items', async () => {
        renderComponent();

        const sortButton = screen.getByRole('button', { name: 'Sort' });
        expect(sortButton).toBeInTheDocument();

        await userEvent.click(sortButton);
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getAllByRole('menuitem')).toHaveLength(6);

        expect(screen.getByRole('menuitem', { name: 'Name: A → Z' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Name: Z → A' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Date: Oldest → Newest' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Date: Newest → Oldest' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Size: Smallest → Largest' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Size: Largest → Smallest' })).toBeInTheDocument();
    });

    test('should pass correct parameters when clicked', async () => {
        const onSortChange = jest.fn();
        renderComponent({ onSortChange });

        await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Name: A → Z' }));
        expect(onSortChange).toHaveBeenCalledWith('name', SORT_ASC);

        await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Name: Z → A' }));
        expect(onSortChange).toHaveBeenCalledWith('name', SORT_DESC);

        await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Date: Oldest → Newest' }));
        expect(onSortChange).toHaveBeenCalledWith('date', SORT_ASC);

        await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Date: Newest → Oldest' }));
        expect(onSortChange).toHaveBeenCalledWith('date', SORT_DESC);

        await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Size: Smallest → Largest' }));
        expect(onSortChange).toHaveBeenCalledWith('size', SORT_ASC);

        await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Size: Largest → Smallest' }));
        expect(onSortChange).toHaveBeenCalledWith('size', SORT_DESC);
    });
});
