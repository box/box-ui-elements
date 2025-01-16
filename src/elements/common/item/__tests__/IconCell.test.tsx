import * as React from 'react';
import type { IntlShape } from 'react-intl';
import { render, screen } from '../../../../test-utils/testing-library';

import { IconCellBase } from '../IconCell';
import type { BoxItem } from '../IconCell';
import type { ItemType } from '../../../../common/types/core';
import { ITEM_TYPE_FILE, ITEM_TYPE_FOLDER, ITEM_TYPE_WEBLINK } from '../../../../common/constants';

interface TestProps {
    intl: IntlShape;
    rowData: BoxItem;
    dimension?: number;
}

describe('elements/common/item/IconCell', () => {
    const defaultIntl = {
        formatMessage: jest.fn(({ defaultMessage }) => defaultMessage),
    } as unknown as IntlShape;

    const defaultProps: TestProps = {
        intl: defaultIntl,
        rowData: { type: ITEM_TYPE_FILE },
        dimension: 32,
    };

    const renderComponent = (props: Partial<TestProps> = {}) => {
        const mergedProps = { ...defaultProps, ...props };
        return render(<IconCellBase {...mergedProps} />);
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
            expect(screen.getByTitle('File')).toBeInTheDocument();
        });

        test('should render archive icon', () => {
            renderComponent({ intl: defaultIntl, rowData: archiveItem });
            expect(screen.getByTestId('archive-icon-cell')).toBeVisible();
        });

        test('should render archived folder icon', () => {
            renderComponent({ intl: defaultIntl, rowData: archiveFolderItem });
            expect(screen.getByTestId('folder-archive-icon-cell')).toBeVisible();
        });

        test.each([
            ['personal folder', personalFolderItem, 'Personal Folder'],
            ['collaborated folder', sharedFolderItem, 'Collaborated Folder'],
            ['external folder', externalFolderItem, 'External Folder'],
        ])('should render correct icon for %s', (_, rowData, expectedTitle) => {
            renderComponent({ intl: defaultIntl, rowData });
            expect(screen.getByTitle(expectedTitle)).toBeInTheDocument();
        });

        test('should render correct file icon', () => {
            renderComponent({ intl: defaultIntl, rowData: fileItem });
            expect(screen.getByTitle('File')).toBeInTheDocument();
        });

        test('should render correct bookmark icon', () => {
            renderComponent({ intl: defaultIntl, rowData: webLinkItem });
            expect(screen.getByTitle('Bookmark')).toBeInTheDocument();
        });

        test('should render default file icon for unknown type', () => {
            renderComponent({ intl: defaultIntl, rowData: unknownTypeItem });
            expect(screen.getByTitle('File')).toBeInTheDocument();
        });
    });
});
