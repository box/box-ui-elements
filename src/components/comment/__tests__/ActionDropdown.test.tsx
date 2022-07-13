import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionDropdown, { ActionDropdownItem } from '../ActionDropdown';

describe('components/comment/ActionDropdown', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const items: ActionDropdownItem[] = [
        {
            text: 'First',
            onClick: fn1,
        },
        {
            text: 'Second',
            onClick: fn2,
            icon: <div>Icon</div>,
        },
    ];

    test('should render', async () => {
        render(<ActionDropdown items={items} />);

        expect(screen.getByTestId('ThreadedComment-actionDropdown')).toBeVisible();
    });

    test('should not render if items list is empty', async () => {
        render(<ActionDropdown items={[]} />);

        expect(screen.queryByTestId('ThreadedComment-actionDropdown')).not.toBeInTheDocument();
    });

    test('should open menu with items visible when button is clicked', async () => {
        render(<ActionDropdown items={items} />);

        fireEvent.click(screen.getByTestId('ThreadedComment-actionDropdown'));

        expect(await screen.findByText('First')).toBeVisible();
        expect(await screen.findByText('Second')).toBeVisible();
        expect(await screen.findByText('Icon')).toBeVisible();
    });

    test('should run onClick functions when cliked on menu items', async () => {
        render(<ActionDropdown items={items} />);

        const menuBtn = screen.getByTestId('ThreadedComment-actionDropdown');

        fireEvent.click(menuBtn);
        fireEvent.click(await screen.findByText('First'));

        fireEvent.click(menuBtn);
        fireEvent.click(await screen.findByText('Second'));

        expect(fn1).toHaveBeenCalled();
        expect(fn2).toHaveBeenCalled();
    });
});
