import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import ItemGrid from '../ItemGrid';
import { isThumbnailAvailable } from '../../utils';

jest.mock('../../utils');

describe('elements/common/item-grid/ItemGrid', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            items: [
                { type: 'folder', id: '001', name: 'Shared folder', modified_at: '2021-10-18T09:00:00-07:00' },
                { type: 'folder', id: '002', name: 'Documents', modified_at: '2021-10-18T09:00:00-07:00' },
                { type: 'file', id: '003', name: 'Presentation', modified_at: '2021-10-18T09:00:00-07:00' },
            ],
            view: 'files',
        };
        render(<ItemGrid {...defaultProps} {...props} />);
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders component correctly', () => {
        renderComponent();

        expect(screen.getByRole('grid', { name: 'Grid view' })).toBeInTheDocument();
        expect(screen.getByRole('row', { name: 'Shared folder' })).toBeInTheDocument();
        expect(screen.getByRole('row', { name: 'Documents' })).toBeInTheDocument();
        expect(screen.getByRole('row', { name: 'Presentation' })).toBeInTheDocument();
    });

    test('renders component correctly with item thumbnails', () => {
        const items = [
            {
                type: 'file',
                id: '003',
                name: 'Presentation',
                thumbnailUrl: 'https://box.com/003/pic.jpg',
                modified_at: '2021-10-18T09:00:00-07:00',
            },
            {
                type: 'file',
                id: '004',
                name: 'Sample PDF',
                thumbnailUrl: 'https://box.com/004/pic.jpg',
                modified_at: '2021-10-18T09:00:00-07:00',
            },
        ];

        (isThumbnailAvailable as jest.Mock).mockReturnValueOnce(true);
        (isThumbnailAvailable as jest.Mock).mockReturnValueOnce(false);

        renderComponent({ items });

        expect(screen.getByRole('img', { name: 'Presentation' })).toBeInTheDocument();
        expect(screen.queryByRole('img', { name: 'Sample PDF' })).not.toBeInTheDocument();
    });

    test.each(['folder', 'file', 'web_link'])(
        'calls `onItemClick` when a %s item is clicked with preview enabled',
        async type => {
            const items = [{ type, id: '004', name: 'Box item', modified_at: '2021-10-18T09:00:00-07:00' }];
            const onItemClick = jest.fn();

            renderComponent({ canPreview: true, items, onItemClick });

            expect(onItemClick).not.toHaveBeenCalled();

            await userEvent.click(screen.getByRole('row', { name: 'Box item' }));

            expect(onItemClick).toHaveBeenCalledTimes(1);
        },
    );

    test('does not call `onItemClick` when a file item is clicked with preview disabled', async () => {
        const items = [{ type: 'file', id: '004', name: 'Box file', modified_at: '2021-10-18T09:00:00-07:00' }];
        const onItemClick = jest.fn();

        renderComponent({ canPreview: false, items, onItemClick });

        await userEvent.click(screen.getByRole('row', { name: 'Box file' }));

        expect(onItemClick).not.toHaveBeenCalled();
    });

    test.each(['file', 'web_link'])(
        'does not call `onItemClick` when a %s item is clicked on a touch device with preview enabled',
        async type => {
            const items = [{ type, id: '004', name: 'Box item', modified_at: '2021-10-18T09:00:00-07:00' }];
            const onItemClick = jest.fn();

            renderComponent({ canPreview: true, isTouch: true, items, onItemClick });

            await userEvent.click(screen.getByRole('row', { name: 'Box item' }));

            expect(onItemClick).not.toHaveBeenCalled();
        },
    );
});
