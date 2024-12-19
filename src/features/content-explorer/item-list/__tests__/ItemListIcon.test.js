import * as React from 'react';

import ItemListIcon from '../ItemListIcon';
import { render, screen } from '../../../../test-utils/testing-library';

describe('features/content-explorer/item-list/ItemListIcon', () => {
    const renderComponent = props => render(<ItemListIcon {...props} />);

    describe('render()', () => {
        test('should render default file icon', () => {
            renderComponent({});

            expect(screen.getByLabelText('File')).toBeInTheDocument();
        });

        test('should render archive icon', () => {
            const rowData = {
                type: 'folder',
                archiveType: 'archive',
                hasCollaborations: false,
                isExternallyOwned: false,
            };
            renderComponent(rowData);

            expect(screen.getByLabelText('Archive')).toBeVisible();
        });

        test('should render archived folder icon', () => {
            const rowData = {
                type: 'folder',
                archiveType: 'folder_archive',
                hasCollaborations: false,
                isExternallyOwned: false,
            };
            renderComponent(rowData);

            expect(screen.getByLabelText('Archived Folder')).toBeVisible();
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

            expect(screen.getByLabelText(label)).toBeInTheDocument();
        });

        test('should render correct file icon', () => {
            const extension = 'boxnote';
            const rowData = { type: 'file', extension };
            renderComponent(rowData);

            expect(screen.getByLabelText('BOXNOTE File')).toBeInTheDocument();
        });

        test('should render correct bookmark icon', () => {
            const rowData = { type: 'web_link' };
            renderComponent(rowData);

            expect(screen.getByLabelText('Bookmark')).toBeInTheDocument();
        });
    });
});
