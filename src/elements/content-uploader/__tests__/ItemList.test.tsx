import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import ItemList, { ItemListProps } from '../ItemList';
import { STATUS_ERROR, STATUS_COMPLETE, ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED } from '../../../constants';
import PlainUpload from '../../../api/uploads/PlainUpload';
import type { UploadItem } from '../../../common/types/upload';

jest.mock(
    '@box/react-virtualized/dist/es/AutoSizer',
    () =>
        ({ children }) =>
            children({ height: 600, width: 600 }),
);

const uploadApi = new PlainUpload({ token: 'token' });
const createUploadItem = (name: string, overrides: Partial<UploadItem> = {}): UploadItem => {
    const file = new File(['test content'], name);

    return {
        api: uploadApi,
        extension: '',
        file,
        name,
        progress: 100,
        size: file.size,
        status: STATUS_COMPLETE,
        ...overrides,
    };
};

describe('elements/content-uploader/ItemList', () => {
    const renderComponent = (props?: Partial<ItemListProps>) =>
        render(<ItemList items={[]} onClick={jest.fn()} {...props} />);

    test('should render with default props', () => {
        renderComponent();
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    test('should render component with correct number of items', () => {
        const items = [createUploadItem('item1'), createUploadItem('item2'), createUploadItem('item3')];
        renderComponent({ items });

        expect(screen.getAllByRole('row')).toHaveLength(3);
        const actionColumn = screen
            .getAllByRole('gridcell')
            .find(cell => cell.className.includes('bcu-item-list-action-column'));
        expect(actionColumn.style.flex).toEqual('0 0 32px');
    });

    test('should render action column with correct width for upgrade cta', () => {
        const items = [
            createUploadItem('item1', {
                error: { code: ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED },
                status: STATUS_ERROR,
            }),
        ];

        renderComponent({ items, onUpgradeCTAClick: jest.fn() });
        expect(screen.getAllByRole('row')).toHaveLength(1);
        const actionColumn = screen
            .getAllByRole('gridcell')
            .find(cell => cell.className.includes('bcu-item-list-action-column'));
        expect(actionColumn.style.flex).toEqual('0 0 100px');
    });

    test('should render component with resumable uploads enabled', () => {
        const items = [createUploadItem('item1')];
        renderComponent({ items, isResumableUploadsEnabled: true });
        expect(screen.getByRole('grid')).toBeInTheDocument();
        expect(screen.getAllByRole('gridcell')).toHaveLength(4);
    });
});
