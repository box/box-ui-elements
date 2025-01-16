Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = require('react');
const testing_library_1 = require('../../../../test-utils/testing-library');
const IconCell_1 = require('../IconCell');
const constants_1 = require('../../../../common/constants');

describe('elements/common/item/IconCell', () => {
    const defaultIntl = {
        formatMessage: jest.fn(_a => {
            const { defaultMessage } = _a;
            return defaultMessage;
        }),
    };
    const defaultProps = {
        intl: defaultIntl,
        rowData: { type: constants_1.ITEM_TYPE_FILE },
    };
    const getWrapper = function (props) {
        if (props === void 0) {
            props = {};
        }
        return (0, testing_library_1.render)(<IconCell_1.IconCellBase {...defaultProps} {...props} />);
    };
    // Test data (alphabetically ordered)
    const archiveItem = {
        type: constants_1.ITEM_TYPE_FOLDER,
        archive_type: 'archive',
    };
    const archiveFolderItem = {
        type: constants_1.ITEM_TYPE_FOLDER,
        archive_type: 'folder_archive',
    };
    const externalFolderItem = {
        type: constants_1.ITEM_TYPE_FOLDER,
        is_externally_owned: true,
    };
    const fileItem = {
        type: constants_1.ITEM_TYPE_FILE,
        extension: 'boxnote',
    };
    const folderItem = {
        type: constants_1.ITEM_TYPE_FOLDER,
    };
    const personalFolderItem = {
        type: constants_1.ITEM_TYPE_FOLDER,
    };
    const sharedFolderItem = {
        type: constants_1.ITEM_TYPE_FOLDER,
        has_collaborations: true,
    };
    const unknownTypeItem = {
        type: 'unknown',
    };
    const webLinkItem = {
        type: constants_1.ITEM_TYPE_WEBLINK,
    };
    describe('render()', () => {
        test('should render default file icon for undefined type', () => {
            getWrapper({ rowData: { type: constants_1.ITEM_TYPE_FILE } });
            expect(testing_library_1.screen.getByTitle('File')).toBeInTheDocument();
        });
        test('should render archive icon', () => {
            getWrapper({ intl: defaultIntl, rowData: archiveItem });
            expect(testing_library_1.screen.getByTestId('archive-icon-cell')).toBeVisible();
        });
        test('should render archived folder icon', () => {
            getWrapper({ intl: defaultIntl, rowData: archiveFolderItem });
            expect(testing_library_1.screen.getByTestId('folder-archive-icon-cell')).toBeVisible();
        });
        test.each([
            ['personal folder', personalFolderItem, 'Personal Folder'],
            ['collaborated folder', sharedFolderItem, 'Collaborated Folder'],
            ['external folder', externalFolderItem, 'External Folder'],
        ])('should render correct icon for %s', (_, rowData, expectedTitle) => {
            getWrapper({ intl: defaultIntl, rowData });
            expect(testing_library_1.screen.getByTitle(expectedTitle)).toBeInTheDocument();
        });
        test('should render correct file icon', () => {
            getWrapper({ intl: defaultIntl, rowData: fileItem });
            expect(testing_library_1.screen.getByTitle('File')).toBeInTheDocument();
        });
        test('should render correct bookmark icon', () => {
            getWrapper({ intl: defaultIntl, rowData: webLinkItem });
            expect(testing_library_1.screen.getByTitle('Bookmark')).toBeInTheDocument();
        });
        test('should render default file icon for unknown type', () => {
            getWrapper({ intl: defaultIntl, rowData: unknownTypeItem });
            expect(testing_library_1.screen.getByTitle('File')).toBeInTheDocument();
        });
    });
});
