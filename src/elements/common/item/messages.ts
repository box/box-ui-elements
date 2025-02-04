import { defineMessages } from 'react-intl';

const messages = defineMessages({
    archive: {
        id: 'be.item.archive',
        description: 'Label for a Box item icon of type folder and is an archive',
        defaultMessage: 'Archive',
    },
    archiveFolder: {
        id: 'be.item.archiveFolder',
        description: 'Label for a Box item icon of type folder and is located in an archive',
        defaultMessage: 'Archive folder',
    },
    bookmark: {
        id: 'be.item.bookmark',
        description: 'Label for a Box item icon of type bookmark or web-link',
        defaultMessage: 'Bookmark',
    },
    collaboratedFolder: {
        id: 'be.item.collaboratedFolder',
        description: 'Label for a Box item icon of type folder shared with collaborators',
        defaultMessage: 'Collaborated folder',
    },
    externalFolder: {
        id: 'be.item.externalFolder',
        description: 'Label for a Box item icon of type folder shared with outside organization collaborators',
        defaultMessage: 'External folder',
    },
    file: {
        id: 'be.item.file',
        description: 'Label for a Box item icon of type file',
        defaultMessage: 'File',
    },
    fileExtension: {
        id: 'be.item.fileExtension',
        description: 'Label for a Box item icon of type file with its file extension',
        defaultMessage: '{extension} file',
    },
    personalFolder: {
        id: 'be.item.personalFolder',
        description: 'Label for a Box item icon of type folder that is private to the user',
        defaultMessage: 'Personal folder',
    },
    modifiedDateBy: {
        id: 'be.item.modifiedDateBy',
        description: 'Text for the list or grid item to indicate the modified date and modified user',
        defaultMessage: '{date} by {name}',
    },
    viewedDate: {
        id: 'be.item.viewedDate',
        description: 'Text for the list or grid item to indicate the date the user last viewed the item',
        defaultMessage: 'Viewed {date}',
    },
    viewedToday: {
        id: 'be.item.viewedToday',
        description: 'Text for the list or grid item to indicate the user last viewed the item today',
        defaultMessage: 'Viewed today',
    },
    viewedYesterday: {
        id: 'be.item.viewedYesterday',
        description: 'Text for the list or grid item to indicate the user last viewed the item yesterday',
        defaultMessage: 'Viewed yesterday',
    },
});

export default messages;
