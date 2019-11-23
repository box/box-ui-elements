import { defineMessages } from 'react-intl';

export default defineMessages({
    lastModifiedBy: {
        id: 'boxui.features.ReactVirtualizedRenderers.lastModifiedBy',
        defaultMessage: '{lastModified} by {user}',
        description:
            'Text to show on "modified by" table cell. Note that "lastModified" will contain additional localized text. Example: 2 days ago by John Smith',
    },
});
