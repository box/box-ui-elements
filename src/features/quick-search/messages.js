import { defineMessages } from 'react-intl';

const messages = defineMessages({
    bookmark: {
        defaultMessage: 'Bookmark',
        description: 'Icon title for a Box item of type bookmark or web-link',
        id: 'boxui.quickSearch.bookmark',
    },
    collaboratedFolder: {
        defaultMessage: 'Collaborated Folder',
        description: 'Icon title for a Box item of type folder that has collaborators',
        id: 'boxui.quickSearch.collaboratedFolder',
    },
    externalFolder: {
        defaultMessage: 'External Folder',
        description: "Icon title for a Box item of type folder that has collaborators outside of the user's enterprise",
        id: 'boxui.quickSearch.externalFolder',
    },
    file: {
        defaultMessage: 'File',
        description: 'Icon title for a Box item of type file',
        id: 'boxui.quickSearch.file',
    },
    parentFolder: {
        defaultMessage: 'Parent Folder',
        description:
            'Title for a parent folder icon next to the name of the parent folder for a quick search result item',
        id: 'boxui.quickSearch.parentFolder',
    },
    personalFolder: {
        defaultMessage: 'Personal Folder',
        description: 'Icon title for a Box item of type folder that is private and has no collaborators',
        id: 'boxui.quickSearch.personalFolder',
    },
    updatedText: {
        defaultMessage: '{date, date, medium} by {user}',
        description: 'Text for a quick search result describing the date when the user last updated the item',
        id: 'boxui.quickSearch.updatedText',
    },
    updatedTextToday: {
        defaultMessage: 'Today by {user}',
        description:
            'Statement describing when and who last updated a quick search result item, capitalize if appropriate',
        id: 'boxui.quickSearch.updatedTextToday',
    },
    updatedTextYesterday: {
        defaultMessage: 'Yesterday by {user}',
        description:
            'Statement describing when and who last updated a quick search result item, capitalize if appropriate',
        id: 'boxui.quickSearch.updatedTextYesterday',
    },
});

export default messages;
