import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import dateCellRenderer from '../dateCellRenderer';

import headerCellRenderer, { HeaderCellRendererProps } from '../headerCellRenderer';
import moreOptionsCellRenderer, { MoreOptionsCellRendererProps } from '../moreOptionsCellRenderer';
import sizeCellRenderer, { SizeCellRendererProps } from '../sizeCellRenderer';

const mockItem = {
    id: '1',
    name: 'Test Item',
    modified_at: '2023-10-10T10:00:00Z',
    modified_by: { id: '123', name: 'John Doe', type: 'user' as const },
    interacted_at: '',
    size: 12345,
    permissions: {
        can_delete: true,
        can_download: true,
        can_preview: true,
        can_rename: true,
        can_share: true,
    },
    type: 'file',
};

describe('elements/content-explorer/CellRenderer', () => {
    describe('dateCellRenderer', () => {
        const renderComponent = () => {
            const Component = dateCellRenderer();
            return render(<Component dataKey="" rowData={mockItem} />);
        };

        test('renders date cell', () => {
            renderComponent();

            expect(screen.getByText(/Tue Oct 10 2023\s+by John Doe/)).toBeInTheDocument();
        });
    });

    describe('headerCellRenderer', () => {
        const renderComponent = (props?: HeaderCellRendererProps) => {
            return render(
                headerCellRenderer({ dataKey: 'date', label: 'name', sortBy: 'date', sortDirection: 'ASC', ...props }),
            );
        };
        test('renders header cell', () => {
            renderComponent();

            expect(screen.getByText('name')).toBeInTheDocument();
        });
    });

    describe('moreOptionsCellRenderer', () => {
        const renderComponent = (props?: MoreOptionsCellRendererProps) => {
            const Component = moreOptionsCellRenderer({
                canDelete: true,
                canDownload: true,
                canPreview: true,
                canRename: true,
                canShare: true,
                isSmall: false,
                onItemSelect: jest.fn(),
                onItemDelete: jest.fn(),
                onItemDownload: jest.fn(),
                onItemRename: jest.fn(),
                onItemShare: jest.fn(),
                onItemPreview: jest.fn(),
                ...props,
            });
            return render(<Component rowData={mockItem} />);
        };

        test('renders moreOptions cell', () => {
            renderComponent();

            expect(screen.getByRole('button', { name: 'More options' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
        });

        test('opens MoreOptions dropdown when clicked', async () => {
            renderComponent();
            await userEvent.click(screen.getByRole('button', { name: 'More options' }));

            expect(screen.getByRole('menuitem', { name: 'Preview' })).toBeInTheDocument();
            expect(screen.queryByRole('menuitem', { name: 'Open' })).not.toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: 'Download' })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();
        });
    });

    describe('sizeCellRenderer', () => {
        const renderComponent = (props?: SizeCellRendererProps) => {
            return render(sizeCellRenderer()({ cellData: 123, ...props }));
        };

        test('renders size cell', () => {
            renderComponent();

            expect(screen.getByText('123 Bytes')).toBeInTheDocument();
        });
    });
});
