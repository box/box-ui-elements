import React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import ItemTypeIcon from '../ItemTypeIcon';

describe('elements/common/item/ItemTypeIcon', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            item: {
                type: 'file',
                extension: 'pdf',
            },
        };
        return render(<ItemTypeIcon {...defaultProps} {...props} />);
    };

    test('renders component correctly for a file item', async () => {
        renderComponent();

        expect(screen.getByRole('img', { name: 'PDF file' })).toBeInTheDocument();
    });

    test('renders component correctly for a folder item', async () => {
        renderComponent({ item: { type: 'folder' } });

        expect(screen.getByRole('img', { name: 'Personal folder' })).toBeInTheDocument();
    });

    test('renders component correctly for a bookmark item', async () => {
        renderComponent({ item: { type: 'web_link' } });

        expect(screen.getByRole('img', { name: 'Bookmark' })).toBeInTheDocument();
    });

    test.each`
        item                                  | label
        ${{ archive_type: 'archive' }}        | ${'Archive'}
        ${{ archive_type: 'folder_archive' }} | ${'Archive folder'}
        ${{ is_externally_owned: true }}      | ${'External folder'}
        ${{ has_collaborations: true }}       | ${'Collaborated folder'}
    `('renders component when the folder is $label', ({ item, label }) => {
        renderComponent({ item: { type: 'folder', ...item } });

        expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
    });
});
