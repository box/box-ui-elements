import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import ItemOptions from '../ItemOptions';

jest.mock('@box/blueprint-web', () => ({
    ...jest.requireActual('@box/blueprint-web'),
    Cell: () => <div data-testid="be-ItemOptions-cell"></div>,
}));

describe('elements/common/item/ItemOptions', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            canDelete: true,
            canDownload: true,
            canPreview: true,
            canRename: true,
            canShare: true,
            item: {
                type: 'file',
                id: '005',
                name: 'Box file',
                extension: 'pdf',
                permissions: {
                    can_delete: true,
                    can_download: true,
                    can_preview: true,
                    can_rename: true,
                    can_share: true,
                },
            },
            viewMode: 'grid',
        };
        return render(<ItemOptions {...defaultProps} {...props} />);
    };

    test('renders component correctly', async () => {
        renderComponent();

        await userEvent.click(screen.getByRole('button', { name: 'More options' }));

        expect(screen.getByRole('menuitem', { name: 'Preview' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Download' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();
    });

    test('renders an empty component if there are no permissions on the item', () => {
        const { container } = renderComponent({
            item: {
                type: 'file',
                id: '005',
                name: 'Box file',
                permissions: undefined,
            },
        });

        expect(container).toBeEmptyDOMElement();
    });

    test('renders a cell component if there are no permissions on the item in list view', () => {
        renderComponent({
            item: {
                type: 'file',
                id: '005',
                name: 'Box file',
                permissions: undefined,
            },
            viewMode: 'list',
        });

        expect(screen.getByTestId('be-ItemOptions-cell')).toBeInTheDocument();
    });

    test('renders an empty component if there are no options enabled for the item', () => {
        const { container } = renderComponent({
            canDelete: false,
            canDownload: false,
            canPreview: false,
            canRename: false,
            canShare: false,
        });

        expect(container).toBeEmptyDOMElement();
    });

    test('renders component with custom actions', async () => {
        const onAction = jest.fn();

        renderComponent({
            itemActions: [
                { label: 'Archive', type: 'folder' }, // Should be filtered since there are no folder items
                { label: 'Email', type: 'file' },
                { filter: ({ extension }) => extension === 'pdf', label: 'Export' },
                { label: 'Favorite', onAction, type: 'file' },
            ],
        });

        await userEvent.click(screen.getByRole('button', { name: 'More options' }));

        expect(screen.queryByRole('menuitem', { name: 'Archive' })).not.toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Favorite' })).toBeInTheDocument();

        expect(onAction).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole('menuitem', { name: 'Favorite' }));

        expect(onAction).toHaveBeenCalled();
    });

    test('renders an empty component if there are no applicable custom actions for the item', () => {
        const { container } = renderComponent({
            canDelete: false,
            canDownload: false,
            canPreview: false,
            canRename: false,
            canShare: false,
            itemActions: [
                { label: 'Archive', type: 'folder' },
                { filter: ({ extension }) => extension === 'csv', label: 'Import' },
            ],
        });

        expect(container).toBeEmptyDOMElement();
    });

    test('renders a cell component if there are no applicable custom actions for the item in list view', () => {
        renderComponent({
            canDelete: false,
            canDownload: false,
            canPreview: false,
            canRename: false,
            canShare: false,
            itemActions: [
                { label: 'Archive', type: 'folder' },
                { filter: ({ extension }) => extension === 'csv', label: 'Import' },
            ],
            viewMode: 'list',
        });

        expect(screen.getByTestId('be-ItemOptions-cell')).toBeInTheDocument();
    });
});
