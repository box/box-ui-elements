import { defineMessages } from 'react-intl';

const messages = defineMessages({
    listView: {
        id: 'be.itemList.listView',
        description: 'Label for the list of files and folders displayed in a list view',
        defaultMessage: 'List view',
    },
    nameColumn: {
        id: 'be.itemList.nameColumn',
        description: 'Label for the column header in the list view for the name of the item',
        defaultMessage: 'Name',
    },
    dateColumn: {
        id: 'be.itemList.dateColumn',
        description: 'Label for the column header in the list view for the date the item was modified',
        defaultMessage: 'Modified',
    },
    sizeColumn: {
        id: 'be.itemList.sizeColumn',
        description: 'Label for the column header in the list view for the size of the item',
        defaultMessage: 'Size',
    },
    actionsColumn: {
        id: 'be.itemList.actionsColumn',
        description: 'Label for the column header in the list view for the available user actions on the item',
        defaultMessage: 'Actions',
    },
    detailsColumn: {
        id: 'be.itemList.detailsColumn',
        description: 'Label for the column header in the list view for the combined details of the item',
        defaultMessage: 'Details',
    },
    itemSubtitle: {
        id: 'be.itemList.itemSubtitle',
        description: 'Concatenated text of the modified date and item size of the file or folder',
        defaultMessage: '{date} • {size}',
    },
});

export default messages;
