import { defineMessages } from 'react-intl';

export default defineMessages({
    unknownUser: {
        defaultMessage: 'Unknown User',
        description: 'The user is unknown in the database.',
        id: 'boxui.features.VirtualizedTableRenderers.unknownUser',
    },
    anonymousUser: {
        defaultMessage: 'Anonymous User',
        description: 'The user is an anonymous user',
        id: 'boxui.features.VirtualizedTableRenderers.anonymousUser',
    },
    externalFile: {
        defaultMessage: 'External File',
        description: 'Text to show when a file is external',
        id: 'boxui.features.VirtualizedTableRenderers.externalFile',
    },
    externalFolder: {
        defaultMessage: 'External Folder',
        description: 'Text to show when a folder is external',
        id: 'boxui.features.VirtualizedTableRenderers.externalFolder',
    },
    allFiles: {
        defaultMessage: 'All Files',
        description: 'Text to show when root folder is external',
        id: 'boxui.features.VirtualizedTableRenderers.allFiles',
    },
    lastModifiedBy: {
        defaultMessage: '{lastModified} by {user}',
        description:
            'Text to show on "modified by" table cell. Note that "lastModified" will contain additional localized text. Example: 2 days ago by John Smith',
        id: 'boxui.features.VirtualizedTableRenderers.lastModifiedBy',
    },
});
