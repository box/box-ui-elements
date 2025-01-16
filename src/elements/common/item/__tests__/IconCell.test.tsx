import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import IconCell from '../IconCell';
import type { BoxItem } from '../IconCell';
import type { ItemType } from '../../../../common/types/core';
import { ITEM_TYPE_FILE, ITEM_TYPE_FOLDER, ITEM_TYPE_WEBLINK } from '../../../../common/constants';

interface TestProps {
    rowData: BoxItem;
    dimension?: number;
}

jest.mock('react-intl', () => ({
    useIntl: () => ({
        formatMessage: jest.fn(({ defaultMessage }) => defaultMessage),
    }),
}));

describe('elements/common/item/IconCell', () => {
    const defaultProps: TestProps = {
        rowData: { type: ITEM_TYPE_FILE },
        dimension: 32,
    };

    const renderComponent = (props: Partial<TestProps> = {}) => {
        const mergedProps = { ...defaultProps, ...props };
        return render(<IconCell {...mergedProps} />);
    };

    // Test data (alphabetically ordered)
    const archiveItem: BoxItem = {
        type: ITEM_TYPE_FOLDER,
        archive_type: 'archive',
    };

    const archiveFolderItem: BoxItem = {
        type: ITEM_TYPE_FOLDER,
        archive_type: 'folder_archive',
    };

    const externalFolderItem = {
        type: ITEM_TYPE_FOLDER,
        is_externally_owned: true,
    };

    const fileItem = {
        type: ITEM_TYPE_FILE,
        extension: 'boxnote',
    };

    const personalFolderItem = {
        type: ITEM_TYPE_FOLDER,
    };

    const sharedFolderItem = {
        type: ITEM_TYPE_FOLDER,
        has_collaborations: true,
    };

    const unknownTypeItem = {
        type: 'unknown' as ItemType,
    };

    const webLinkItem = {
        type: ITEM_TYPE_WEBLINK,
    };

    describe('render()', () => {
        test('should render default file icon for undefined type', () => {
            renderComponent({ rowData: { type: ITEM_TYPE_FILE } });
            expect(screen.getByRole('img', { name: 'File' })).toBeInTheDocument();
        });

        test('should render archive icon', () => {
            renderComponent({ rowData: archiveItem });
            expect(screen.getByRole('img', { name: 'Archive' })).toBeInTheDocument();
        });

        test('should render archived folder icon', () => {
            renderComponent({ rowData: archiveFolderItem });
            expect(screen.getByRole('img', { name: 'Archived Folder' })).toBeInTheDocument();
        });

        test.each([
            ['personal folder', personalFolderItem, 'Personal Folder'],
            ['collaborated folder', sharedFolderItem, 'Collaborated Folder'],
            ['external folder', externalFolderItem, 'External Folder'],
        ])('should render correct icon for %s', (_, rowData, expectedTitle) => {
            renderComponent({ rowData });
            expect(screen.getByRole('img', { name: expectedTitle })).toBeInTheDocument();
        });

        test('should render correct file icon', () => {
            renderComponent({ rowData: fileItem });
            expect(screen.getByRole('img', { name: 'File' })).toBeInTheDocument();
        });

        test('should render correct bookmark icon', () => {
            renderComponent({ rowData: webLinkItem });
            expect(screen.getByRole('img', { name: 'Bookmark' })).toBeInTheDocument();
        });

        test('should render default file icon for unknown type', () => {
            renderComponent({ rowData: unknownTypeItem });
            expect(screen.getByRole('img', { name: 'File' })).toBeInTheDocument();
        });
    });
});
