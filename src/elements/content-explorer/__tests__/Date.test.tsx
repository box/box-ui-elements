import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import type { BoxItem } from '../../../common/types/core';
import Date, { DateProps } from '../Date';
import { FIELD_INTERACTED_AT, ITEM_TYPE_FILE } from '../../../constants';

const itemWithModifiedBy: BoxItem = {
    id: '123',
    modified_at: '2023-10-01T12:00:00Z',
    interacted_at: '2023-10-02T12:00:00Z',
    modified_by: { id: '456', name: 'John Doe', type: 'user' },
    type: ITEM_TYPE_FILE,
};

const itemWithoutModifiedBy: BoxItem = {
    id: '789',
    modified_at: '2023-10-01T12:00:00Z',
    interacted_at: '2023-10-02T12:00:00Z',
    type: ITEM_TYPE_FILE,
};

describe('elements/content-explorer/Date', () => {
    const renderComponent = (props: DateProps) => {
        return render(<Date {...props} />);
    };

    test('renders date with modified_by name when dataKey is not FIELD_INTERACTED_AT', () => {
        renderComponent({ dataKey: 'someKey', item: itemWithModifiedBy });
        expect(screen.getByText(/Sun Oct 1 2023\s+by John Doe/)).toBeInTheDocument();
    });

    test('renders date without modified_by name when dataKey is FIELD_INTERACTED_AT', () => {
        renderComponent({ dataKey: FIELD_INTERACTED_AT, item: itemWithoutModifiedBy });
        expect(screen.getByText('Mon Oct 2 2023')).toBeInTheDocument();
    });

    test('renders date without modified_by name when modified_by is not provided', () => {
        renderComponent({ dataKey: 'someKey', item: itemWithoutModifiedBy });
        expect(screen.getByText('Sun Oct 1 2023')).toBeInTheDocument();
    });
});
