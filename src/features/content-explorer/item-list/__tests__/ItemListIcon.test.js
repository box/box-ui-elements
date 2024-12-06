import * as React from 'react';

import ItemListIcon from '../ItemListIcon';
import { render, screen } from '../../../../test-utils/testing-library';

describe('features/content-explorer/item-list/ItemListIcon', () => {
    const renderComponent = props => render(<ItemListIcon {...props} />);

    describe('render()', () => {
        test('should render default file icon', () => {
            renderComponent({});

            expect(screen.getByTitle('File')).toBeInTheDocument();
        });

        test('should render archive icon', () => {
            const rowData = {
                type: 'folder',
                archiveType: 'archive',
                hasCollaborations: false,
                isExternallyOwned: false,
            };
            renderComponent(rowData);

            expect(screen.getByTestId('archive-icon-cell')).toBeVisible();
        });

        test('should render archived folder icon', () => {
            const rowData = {
                type: 'folder',
                archiveType: 'folder_archive',
                hasCollaborations: false,
                isExternallyOwned: false,
            };
            renderComponent(rowData);

            expect(screen.getByTestId('folder-archive-icon-cell')).toBeVisible();
        });

        [
            // personalFolder
            {
                rowData: {
                    type: 'folder',
                    hasCollaborations: false,
                    isExternallyOwned: false,
                },
                title: 'Personal Folder',
            },
            // collabFolder
            {
                rowData: {
                    type: 'folder',
                    hasCollaborations: true,
                    isExternallyOwned: false,
                },
                title: 'Collaborated Folder',
            },
            // externalCollabFolder
            {
                rowData: {
                    type: 'folder',
                    hasCollaborations: true,
                    isExternallyOwned: true,
                },
                title: 'Collaborated Folder',
            },
            // externalFolder
            {
                rowData: {
                    type: 'folder',
                    hasCollaborations: false,
                    isExternallyOwned: true,
                },
                title: 'External Folder',
            },
        ].forEach(({ rowData, title }) => {
            test('should render correct folder icon', () => {
                renderComponent(rowData);

                expect(screen.getByTitle(title)).toBeInTheDocument();
            });
        });

        test('should render correct file icon', () => {
            const extension = 'boxnote';
            const rowData = { type: 'file', extension };
            renderComponent(rowData);

            expect(screen.getByTitle('File')).toBeInTheDocument();
        });

        test('should render correct bookmark icon', () => {
            const rowData = { type: 'web_link' };
            renderComponent(rowData);

            expect(screen.getByTitle('Bookmark')).toBeInTheDocument();
        });
    });
});
