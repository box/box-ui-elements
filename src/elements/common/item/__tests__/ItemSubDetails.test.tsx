import React from 'react';

import { render, screen } from '../../../../test-utils/testing-library';
import ItemSubDetails, { ItemSubDetailsProps } from '../ItemSubDetails';
import { VIEW_RECENTS } from '../../../../constants';

const mockItem = {
    id: '1',
    name: 'Test Item',
    modified_at: '2023-10-10T10:00:00Z',
    modified_by: { id: '123', name: 'John Doe', type: 'user' as const },
    interacted_at: '',
    size: 12345,
};

describe('ItemSubDetails', () => {
    const renderComponent = (props: Partial<ItemSubDetailsProps> = {}) => {
        const defaultProps = {
            item: mockItem,
            view: 'default',
            ...props,
        };

        render(<ItemSubDetails {...defaultProps} />);
    };

    test('renders modified date and modified by name', () => {
        renderComponent();

        expect(screen.getByText(/Modified\s+Tue Oct 10 2023\s+by John Doe/)).toBeInTheDocument();
        expect(screen.getByText('12.06 KB')).toBeInTheDocument();
    });

    test('renders interacted date for recents view', () => {
        renderComponent({
            item: {
                ...mockItem,
                interacted_at: '2023-10-11T10:00:00Z',
            },
            view: VIEW_RECENTS,
        });

        expect(screen.getByText(/Last accessed on\s+Wed Oct 11 2023/)).toBeInTheDocument();
    });

    test('renders modified date without modified by name', () => {
        renderComponent({
            item: {
                ...mockItem,
                modified_by: null,
            },
        });
        expect(screen.getByText(/Modified\s+Tue Oct 10 2023/)).toBeInTheDocument();
    });

    test('renders size correctly', () => {
        renderComponent();
        expect(screen.getByText('12.06 KB')).toBeInTheDocument();
    });
});
