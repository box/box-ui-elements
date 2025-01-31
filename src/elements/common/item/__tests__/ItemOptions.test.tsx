import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import ItemOptions from '../ItemOptions';

describe('elements/common/item/ItemOptions', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            canDelete: true,
            canDownload: true,
            canPreview: true,
            canRename: true,
            canShare: true,
            isGridView: true,
            item: {
                type: 'file',
                id: '005',
                name: 'Box file',
                permissions: {
                    can_delete: true,
                    can_download: true,
                    can_preview: true,
                    can_rename: true,
                    can_share: true,
                },
            },
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
        renderComponent({
            itemActions: [
                { label: 'Archive', type: 'folder' }, // Should be filtered since there are no folder items
                { label: 'Email', type: 'file' },
                { label: 'Favorite', type: 'file' },
            ],
        });

        await userEvent.click(screen.getByRole('button', { name: 'More options' }));

        expect(screen.queryByRole('menuitem', { name: 'Archive' })).not.toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Favorite' })).toBeInTheDocument();
    });
});
