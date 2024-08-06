import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import ItemList, { ItemListProps } from '../ItemList';
import { STATUS_ERROR, STATUS_COMPLETE, ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED } from '../../../constants';

jest.mock(
    '@box/react-virtualized/dist/es/AutoSizer',
    () =>
        ({ children }) =>
            children({ height: 600, width: 600 }),
);

describe('elements/content-uploader/ItemList', () => {
    const renderComponent = (props?: Partial<ItemListProps>) =>
        render(<ItemList items={[]} onClick={jest.fn()} {...props} />);

    test('should render with default props', () => {
        renderComponent();
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    test('should render component with correct number of items', () => {
        const items = [
            { id: '1', name: 'item1', status: STATUS_COMPLETE },
            { id: '2', name: 'item2', status: STATUS_COMPLETE },
            { id: '3', name: 'item3', status: STATUS_COMPLETE },
        ];
        renderComponent({ items });

        expect(screen.getAllByRole('row')).toHaveLength(3);
        const actionColumn = screen
            .getAllByRole('gridcell')
            .find(cell => cell.className.includes('bcu-item-list-action-column'));
        expect(actionColumn.style.flex).toEqual('0 0 32px');
    });

    test('should render action column with correct width for upgrade cta', () => {
        const items = [
            { id: '1', name: 'item1', status: STATUS_ERROR, code: ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED },
        ];

        renderComponent({ items, onUpgradeCTAClick: jest.fn() });
        expect(screen.getAllByRole('row')).toHaveLength(1);
        const actionColumn = screen
            .getAllByRole('gridcell')
            .find(cell => cell.className.includes('bcu-item-list-action-column'));
        expect(actionColumn.style.flex).toEqual('0 0 100px');
    });

    test('should render component with resumable uploads enabled', () => {
        const items = [{ id: '1', name: 'item1', status: STATUS_COMPLETE }];
        renderComponent({ items, isResumableUploadsEnabled: true });
        expect(screen.getByRole('grid')).toBeInTheDocument();
        expect(screen.getAllByRole('gridcell')).toHaveLength(4);
    });
});
