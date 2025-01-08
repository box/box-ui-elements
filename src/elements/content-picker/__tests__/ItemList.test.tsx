import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import ItemList, { ItemListProps } from '../ItemList';
import { TYPE_FOLDER, TYPE_FILE } from '../../../constants';

jest.mock(
    '@box/react-virtualized/dist/es/AutoSizer',
    () =>
        ({ children }) =>
            children({ height: 600, width: 600 }),
);

describe('elements/content-picker/ItemList', () => {
    const defaultProps: ItemListProps = {
        canSetShareAccess: false,
        currentCollection: { items: [] },
        extensionsWhitelist: [],
        focusedRow: -1,
        hasHitSelectionLimit: false,
        isSingleSelect: false,
        isSmall: false,
        onFocusChange: jest.fn(),
        onItemClick: jest.fn(),
        onItemSelect: jest.fn(),
        onShareAccessChange: jest.fn(),
        rootId: '0',
        selectableType: TYPE_FOLDER,
        tableRef: jest.fn(),
        view: 'folder',
    };

    const renderComponent = (props?: Partial<ItemListProps>) => render(<ItemList {...defaultProps} {...props} />);

    test('should render with default props', () => {
        renderComponent();
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    test('should render component with correct number of items', () => {
        const items = [
            {
                id: '1',
                name: 'item1',
                type: TYPE_FOLDER,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
            {
                id: '2',
                name: 'item2',
                type: TYPE_FOLDER,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
            {
                id: '3',
                name: 'item3',
                type: TYPE_FOLDER,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
        ];
        renderComponent({ currentCollection: { items } });

        const rows = screen.getAllByRole('row');
        const contentRows = rows.filter(row => !row.className.includes('ReactVirtualized__Table__headerRow'));
        expect(contentRows).toHaveLength(3);
    });

    test('should render share access column when not small', () => {
        const items = [
            {
                id: '1',
                name: 'item1',
                type: TYPE_FOLDER,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
        ];
        renderComponent({ currentCollection: { items }, isSmall: false, canSetShareAccess: true });

        const cells = screen.getAllByRole('gridcell');
        expect(cells).toHaveLength(4); // icon, name, share access, selection
    });

    test('should not render share access column when small', () => {
        const items = [
            {
                id: '1',
                name: 'item1',
                type: TYPE_FOLDER,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
        ];
        renderComponent({ currentCollection: { items }, isSmall: true, canSetShareAccess: true });

        const cells = screen.getAllByRole('gridcell');
        expect(cells).toHaveLength(3); // icon, name, selection
    });

    test('should call onItemSelect when clicking selectable row', () => {
        const onItemSelect = jest.fn();
        const items = [
            {
                id: '1',
                name: 'item1',
                type: TYPE_FOLDER,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
        ];
        renderComponent({ currentCollection: { items }, onItemSelect });

        const row = screen.getByRole('row', { name: /item1/i });
        row.click();

        expect(onItemSelect).toHaveBeenCalledWith(items[0]);
    });

    test('should call onFocusChange when clicking non-selectable row', () => {
        const onFocusChange = jest.fn();
        const items = [
            {
                id: '1',
                name: 'item1',
                type: TYPE_FILE,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
        ];
        renderComponent({ currentCollection: { items }, onFocusChange });

        const row = screen.getByRole('row', { name: /item1/i });
        row.click();

        expect(onFocusChange).toHaveBeenCalledWith(0);
    });

    test('should apply selected class to selected items', () => {
        const items = [
            {
                id: '1',
                name: 'item1',
                type: TYPE_FOLDER,
                selected: true,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
            {
                id: '2',
                name: 'item2',
                type: TYPE_FOLDER,
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
        ];
        renderComponent({ currentCollection: { items } });

        const rows = screen
            .getAllByRole('row')
            .filter(row => !row.className.includes('ReactVirtualized__Table__headerRow'));
        expect(rows[0]).toHaveClass('bcp-item-row-selected');
        expect(rows[1]).not.toHaveClass('bcp-item-row-selected');
    });

    test('should apply unselectable class to non-folder items when not selectable', () => {
        const items = [
            {
                id: '1',
                name: 'item1',
                type: TYPE_FOLDER,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
            {
                id: '2',
                name: 'item2',
                type: TYPE_FILE,
                permissions: {},
                selected: false,
                content_created_at: '2024-01-01T00:00:00.000Z',
                modified_at: '2024-01-01T00:00:00.000Z',
            },
        ];
        renderComponent({ currentCollection: { items }, selectableType: TYPE_FOLDER });

        const rows = screen
            .getAllByRole('row')
            .filter(row => !row.className.includes('ReactVirtualized__Table__headerRow'));
        expect(rows[0]).not.toHaveClass('bcp-item-row-unselectable');
        expect(rows[1]).toHaveClass('bcp-item-row-unselectable');
    });
});
