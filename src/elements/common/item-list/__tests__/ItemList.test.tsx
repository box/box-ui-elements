import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import ItemList from '../ItemList';

describe('elements/common/item-list/ItemList', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            items: [
                { type: 'folder', id: '001', name: 'Shared folder', modified_at: '2021-10-18T09:00:00-07:00' },
                { type: 'folder', id: '002', name: 'Documents', modified_at: '2021-10-18T09:00:00-07:00' },
                { type: 'file', id: '003', name: 'Presentation', modified_at: '2021-10-18T09:00:00-07:00' },
            ],
            view: 'files',
        };
        render(<ItemList {...defaultProps} {...props} />);
    };

    test('renders component correctly', () => {
        renderComponent();

        expect(screen.getByRole('grid', { name: 'List view' })).toBeInTheDocument();
        expect(screen.getAllByRole('columnheader').length).toBe(4);
        expect(screen.getByRole('columnheader', { name: 'NAME' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'UPDATED' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'SIZE' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'ACTIONS' })).toBeInTheDocument();
        expect(screen.getByRole('row', { name: /Shared folder$/ })).toBeInTheDocument();
        expect(screen.getByRole('row', { name: /Documents$/ })).toBeInTheDocument();
        expect(screen.getByRole('row', { name: /Presentation$/ })).toBeInTheDocument();
    });

    test('renders component with correct columns for small screen devices', () => {
        renderComponent({ isSmall: true });

        expect(screen.getAllByRole('columnheader').length).toBe(2);
        expect(screen.getByRole('columnheader', { name: 'DETAILS' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'ACTIONS' })).toBeInTheDocument();
    });

    test('renders component with correct columns for medium screen devices', () => {
        renderComponent({ isMedium: true });

        expect(screen.getAllByRole('columnheader').length).toBe(3);
        expect(screen.getByRole('columnheader', { name: 'NAME' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'UPDATED' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'ACTIONS' })).toBeInTheDocument();
    });

    test('renders component with correct columns for medium screen devices', () => {
        renderComponent({ isMedium: true });

        expect(screen.getAllByRole('columnheader').length).toBe(3);
        expect(screen.getByRole('columnheader', { name: 'NAME' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'UPDATED' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'ACTIONS' })).toBeInTheDocument();
    });

    test('renders component with item details when device screen is small', () => {
        const items = [
            { type: 'file', id: '004', name: 'Box file', modified_at: '2021-10-18T09:00:00-07:00', size: 2048 },
        ];

        renderComponent({ isSmall: true, items });

        expect(screen.getByText('Oct 18, 2021 • 2 KB')).toBeInTheDocument();
    });

    test('does not render component with item details when `view` is `recents`', () => {
        const items = [
            { type: 'file', id: '004', name: 'Box file', modified_at: '2021-10-18T09:00:00-07:00', size: 2048 },
        ];

        renderComponent({ isSmall: true, items, view: 'recents' });

        expect(screen.queryByText('Oct 18, 2021 • 2 KB')).not.toBeInTheDocument();
    });

    test.each(['folder', 'file', 'web_link'])(
        'calls `onItemClick` when a %s item is clicked with preview enabled',
        async type => {
            const items = [{ type, id: '004', name: 'Box item', modified_at: '2021-10-18T09:00:00-07:00' }];
            const onItemClick = jest.fn();

            renderComponent({ canPreview: true, items, onItemClick });

            expect(onItemClick).not.toHaveBeenCalled();

            await userEvent.click(screen.getByRole('row', { name: /Box item$/ }));

            expect(onItemClick).toHaveBeenCalledTimes(1);
        },
    );

    test('does not call `onItemClick` when a file item is clicked with preview disabled', async () => {
        const items = [{ type: 'file', id: '004', name: 'Box file', modified_at: '2021-10-18T09:00:00-07:00' }];
        const onItemClick = jest.fn();

        renderComponent({ canPreview: false, items, onItemClick });

        await userEvent.click(screen.getByRole('row', { name: /Box file$/ }));

        expect(onItemClick).not.toHaveBeenCalled();
    });

    test.each(['file', 'web_link'])(
        'does not call `onItemClick` when a %s item is clicked on a touch device with preview enabled',
        async type => {
            const items = [{ type, id: '004', name: 'Box item', modified_at: '2021-10-18T09:00:00-07:00' }];
            const onItemClick = jest.fn();

            renderComponent({ canPreview: true, isTouch: true, items, onItemClick });

            await userEvent.click(screen.getByRole('row', { name: /Box item$/ }));

            expect(onItemClick).not.toHaveBeenCalled();
        },
    );
});
