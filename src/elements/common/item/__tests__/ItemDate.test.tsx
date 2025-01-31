import React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import ItemDate from '../ItemDate';
import type { BoxItem } from '../../../../common/types/core';

describe('elements/common/item/ItemDate', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            item: {
                modified_at: '2021-10-18T09:00:00-07:00',
                modified_by: { name: 'detective parrot' },
            } as BoxItem,
            view: 'files',
        };
        render(<ItemDate {...defaultProps} {...props} />);
    };

    test('renders component correctly', () => {
        renderComponent();

        expect(screen.getByText('Oct 18, 2021 by detective parrot')).toBeInTheDocument();
    });

    test('renders component correctly when `view` is `recents`', () => {
        const item = { interacted_at: '2021-10-18T09:00:00-07:00' };

        renderComponent({ item, view: 'recents' });

        expect(screen.getByText('Viewed Oct 18, 2021')).toBeInTheDocument();
    });

    test('renders component with modified date when modified user is missing', () => {
        const item = { modified_at: '2021-10-18T09:00:00-07:00' };

        renderComponent({ item });

        expect(screen.getByText('Oct 18, 2021')).toBeInTheDocument();
    });
});
