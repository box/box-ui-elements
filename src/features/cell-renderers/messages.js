import { defineMessages } from 'react-intl';

export default defineMessages({
    unknownUser: {
        defaultMessage: 'Unknown User',
        description: 'The user is unknown in the database.',
        id: 'boxui.features.CellRenderers.unknownUser',
    },
    anonymousUser: {
        defaultMessage: 'Anonymous User',
        description: 'The user is a anonymous user',
        id: 'boxui.features.CellRenderers.anonymousUser',
    },
    externalFile: {
        defaultMessage: 'External File',
        description: 'Text to show when a file is external',
        id: 'boxui.features.CellRenderers.externalFile',
    },
    externalFolder: {
        defaultMessage: 'External Folder',
        description: 'Text to show when a folder is external',
        id: 'boxui.features.CellRenderers.externalFolder',
    },
    allFiles: {
        defaultMessage: 'All Files',
        description: 'Text to show for root folder is external',
        id: 'boxui.features.CellRenderers.allFiles',
    },
    lastModifiedBy: {
        defaultMessage: '{lastModified} by {user}',
        description:
            'Text to show on "modified by" table cell. Note that "lastModified" will contain additional localized text. Example: 2 days ago by John Smith',
        id: 'boxui.features.CellRenderers.lastModifiedBy',
    },
});
