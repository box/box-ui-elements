import { defineMessages } from 'react-intl';

const messages = defineMessages({
    textTags: {
        id: 'sidebar.docgen.textTags',
        description: 'Text tags section header',
        defaultMessage: 'Text tags',
    },
    imageTags: {
        id: 'sidebar.docgen.imageTags',
        description: 'Image tags section header',
        defaultMessage: 'Image tags',
    },
    docgenTags: {
        id: 'sidebar.docgen.docgenTags',
        description: 'DocGen sidebar header',
        defaultMessage: 'Doc Gen Tags',
    },
    noTags: {
        id: 'sidebar.docgen.noTags',
        defaultMessage: 'This document has no tags',
        description: 'No tags available',
    },
});

export default messages;
