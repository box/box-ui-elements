import * as React from 'react';

import ItemListIcon from '../ItemListIcon';
import { render, screen } from '../../../../test-utils/testing-library';

describe('features/content-explorer/item-list/ItemListIcon', () => {
    const renderComponent = props => render(<ItemListIcon {...props} />);

    const expectIconWithDefaultSize = icon => {
        expect(icon).toBeVisible();
        expect(icon).toHaveAttribute('width', '32');
        expect(icon).toHaveAttribute('height', '32');
    };

    describe('render()', () => {
        test('should render default file icon', () => {
            renderComponent({});

            const fileIcon = screen.getByLabelText('File');
            expectIconWithDefaultSize(fileIcon);
        });

        test('should render archive icon', () => {
            const rowData = {
                type: 'folder',
                archiveType: 'archive',
                hasCollaborations: false,
                isExternallyOwned: false,
            };
            renderComponent(rowData);

            const archiveIcon = screen.getByLabelText('Archive');
            expectIconWithDefaultSize(archiveIcon);
        });

        test('should render archived folder icon', () => {
            const rowData = {
                type: 'folder',
                archiveType: 'folder_archive',
                hasCollaborations: false,
                isExternallyOwned: false,
            };
            renderComponent(rowData);

            const archivedFolderIcon = screen.getByLabelText('Archived Folder');
            expectIconWithDefaultSize(archivedFolderIcon);
        });

        test.each([
            // personalFolder
            {
                rowData: {
                    type: 'folder',
                    hasCollaborations: false,
                    isExternallyOwned: false,
                },
                label: 'Personal Folder',
            },
            // collabFolder
            {
                rowData: {
                    type: 'folder',
                    hasCollaborations: true,
                    isExternallyOwned: false,
                },
                label: 'Collaborated Folder',
            },
            // externalFolder
            {
                rowData: {
                    type: 'folder',
                    hasCollaborations: false,
                    isExternallyOwned: true,
                },
                label: 'External Folder',
            },
        ])('should render $label folder icon', ({ rowData, label }) => {
            renderComponent(rowData);

            const folderIcon = screen.getByLabelText(label);
            expectIconWithDefaultSize(folderIcon);
        });

        test('should render correct file icon', () => {
            const extension = 'boxnote';
            const rowData = { type: 'file', extension };
            renderComponent(rowData);

            const fileIcon = screen.getByLabelText('BOXNOTE File');
            expectIconWithDefaultSize(fileIcon);
        });

        test('should render correct bookmark icon', () => {
            const rowData = { type: 'web_link' };
            renderComponent(rowData);

            const bookmarkIcon = screen.getByLabelText('Bookmark');
            expectIconWithDefaultSize(bookmarkIcon);
        });
    });
});
