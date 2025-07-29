import { defineMessages } from 'react-intl';

const messages = defineMessages({
    breadcrumb: {
        defaultMessage: 'Breadcrumb',
        description: 'Aria label for the folder breadcrumb',
        id: 'boxui.contentExplorer.breadcrumb',
    },
    folderTreeBreadcrumbsText: {
        defaultMessage: '{folderName} ({totalItems})',
        description: 'Text shown for the current folder and its number of items next to the folder tree breadcrumbs',
        id: 'boxui.contentExplorer.folderTreeBreadcrumbsText',
    },
    filePath: {
        defaultMessage: 'File path',
        description: 'Tooltip message for the folder tree breadcrumb button',
        id: 'boxui.contentExplorer.filepath',
    },
    clickToGoBack: {
        defaultMessage: 'Click to go back',
        description: 'Aria label for button to navigate back to the previous folder',
        id: 'boxui.contentExplorer.clickToGoBack',
    },
    clickToViewPath: {
        defaultMessage: 'Click to view path',
        description: 'Aria label for folder tree button to navigate back to previous folders',
        id: 'boxui.contentExplorer.clickToViewPath',
    },
    selectItem: {
        defaultMessage: 'Select {name}',
        description: 'Label for radio input to select an item from the item list, {name} is the item name',
        id: 'boxui.contentExplorer.selectItem',
    },
    nameColumnHeader: {
        defaultMessage: 'Name',
        description: 'Text shown as the header for a column of item names in the list',
        id: 'boxui.contentExplorer.name',
    },
    cancel: {
        defaultMessage: 'Cancel',
        description: 'Text shown on button used to close the content explorer',
        id: 'boxui.contentExplorer.cancel',
    },
    choose: {
        defaultMessage: 'Choose',
        description: 'Text shown on button used to choose an item',
        id: 'boxui.contentExplorer.choose',
    },
    move: {
        defaultMessage: 'Move',
        description: 'Text shown on button used to move an item to a different folder',
        id: 'boxui.contentExplorer.move',
    },
    copy: {
        defaultMessage: 'Copy',
        description: 'Text shown on button used to copy an item to a different folder',
        id: 'boxui.contentExplorer.copy',
    },
    searchPlaceholder: {
        defaultMessage: 'Search',
        description: 'Placeholder text shown in the search input',
        id: 'boxui.contentExplorer.searchPlaceholder',
    },
    searchResults: {
        defaultMessage: 'Search Results',
        description: 'Text shown in the breadcrumbs when showing search results',
        id: 'boxui.contentExplorer.searchResults',
    },
    newFolder: {
        defaultMessage: 'New Folder',
        description: 'Text shown on button used to create a new folder',
        id: 'boxui.contentExplorer.newFolder',
    },
    newFolderForbidden: {
        defaultMessage: 'You do not have permission to create a folder here.',
        description:
            'Text shown when hovering over a disabled new folder button because the user lacks permissions to create a folder',
        id: 'boxui.contentexplorer.newFolder.forbidden',
    },
    numSelected: {
        defaultMessage: '{numSelected} Selected',
        description: 'Text shown to indicate the number of items selected',
        id: 'boxui.contentExplorer.numSelected',
    },
    numItemsSelected: {
        defaultMessage: `
            {numSelected, plural,
                =0 {0 items selected}
                one {1 item selected}
                other {# items selected}
            }
        `,
        description: 'Text shown to indicate the number of items selected with Include Subfolders feature',
        id: 'boxui.contentExplorer.numItemsSelected',
    },
    numFoldersSelected: {
        defaultMessage: `
            {numSelected, plural,
                =0 {0 folders selected}
                one {1 folder selected}
                other {# folders selected}
            }
        `,
        description: 'Text shown to indicate the number of folders selected',
        id: 'boxui.contentExplorer.numFoldersSelected',
    },
    emptySearch: {
        defaultMessage: "Sorry, we couldn't find what you're looking for.",
        description: 'Text shown in the list when there are no search results',
        id: 'boxui.contentExplorer.emptySearch',
    },
    emptyFolder: {
        defaultMessage: 'There are no subfolders in this folder.',
        description: 'Text shown in the list when the folder being viewed is empty',
        id: 'boxui.contentExplorer.emptyFolder',
    },
    newFolderModalTitle: {
        defaultMessage: 'Create a New Folder in "{parentFolderName}"',
        description:
            'Title shown in the modal used to create a new folder. "parentFolderName" should not be translated',
        id: 'boxui.newFolderModal.title',
    },
    newFolderModalFolderNameLabel: {
        defaultMessage: 'Folder Name',
        description: 'Label text shown on top of the folder name input when creating a new folder',
        id: 'boxui.newFolderModal.folderName.label',
    },
    newFolderModalFolderNamePlaceholder: {
        defaultMessage: 'My New Folder',
        description: 'Placeholder text shown in the folder name input when creating a new folder',
        id: 'boxui.newFolderModal.folderName.placeholder',
    },
    newFolderModalCancel: {
        defaultMessage: 'Cancel',
        description: 'Text shown on button to close the modal used to create a new folder',
        id: 'boxui.newFolderModal.cancel',
    },
    newFolderModalCreate: {
        defaultMessage: 'Create',
        description: 'Text shown on button to create a new folder',
        id: 'boxui.newFolderModal.create',
    },
    selectAll: {
        defaultMessage: 'Select All',
        description: 'Select All label for select all items check box',
        id: 'boxui.contentExplorer.selectAll',
    },
    results: {
        defaultMessage: '{itemsCount} results',
        description: 'Results label for number of items on list',
        id: 'boxui.contentExplorer.results',
    },
    result: {
        defaultMessage: '{itemsCount} result',
        description: "Results label for number of items on list when it's just 1",
        id: 'boxui.contentExplorer.result',
    },
    includeSubfolders: {
        defaultMessage: 'Include Subfolders',
        description: 'Label text shown next to the Include Subfolders toggle',
        id: 'boxui.contentExplorer.includeSubfolders',
    },
    infoNoticeIconAriaLabel: {
        defaultMessage: 'Info icon',
        description: 'Aria label for the info icon',
        id: 'boxui.contentExplorer.infoNoticeIconAriaLabel',
    },
});

export default messages;
