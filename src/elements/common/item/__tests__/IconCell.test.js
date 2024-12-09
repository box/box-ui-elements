import * as React from 'react';

import { render, screen } from '../../../../test-utils/testing-library';
import { IconCellBase as IconCell } from '../IconCell';

const intl = {
    formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
};

describe('elements/common/item/IconCell', () => {
    const getWrapper = props => render(<IconCell intl={intl} {...props} />);

    describe('render()', () => {
        test('should render default file icon', () => {
            const rowData = { type: undefined };
            getWrapper({ rowData });

            expect(screen.getByTitle('File')).toBeInTheDocument();
        });

        test('should render archive icon', () => {
            const rowData = {
                type: 'folder',
                archive_type: 'archive',
                has_collaborations: false,
                is_externally_owned: false,
            };
            getWrapper({ rowData });

            expect(screen.getByTestId('archive-icon-cell')).toBeVisible();
        });

        test('should render archived folder icon', () => {
            const rowData = {
                type: 'folder',
                archive_type: 'folder_archive',
                has_collaborations: false,
                is_externally_owned: false,
            };
            getWrapper({ rowData });

            expect(screen.getByTestId('folder-archive-icon-cell')).toBeVisible();
        });

        [
            // personalFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: false,
                    is_externally_owned: false,
                },
                title: 'Personal Folder',
            },
            // collabFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: true,
                    is_externally_owned: false,
                },
                title: 'Collaborated Folder',
            },
            // externalCollabFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: true,
                    is_externally_owned: true,
                },
                title: 'Collaborated Folder',
            },
            // externalFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: false,
                    is_externally_owned: true,
                },
                title: 'External Folder',
            },
        ].forEach(({ rowData, title }) => {
            test('should render correct folder icon', () => {
                getWrapper({ rowData });

                expect(screen.getByTitle(title)).toBeInTheDocument();
            });
        });

        test('should render correct file icon', () => {
            const extension = 'boxnote';
            const rowData = { type: 'file', extension };
            getWrapper({ rowData });

            expect(screen.getByTitle('File')).toBeInTheDocument();
        });

        test('should render correct bookmark icon', () => {
            const rowData = { type: 'web_link' };
            getWrapper({ rowData });

            expect(screen.getByTitle('Bookmark')).toBeInTheDocument();
        });
    });
});
