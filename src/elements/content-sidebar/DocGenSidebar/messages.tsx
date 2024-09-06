import { defineMessages } from 'react-intl';

const messages = defineMessages({
    textTags: {
        id: 'be.docGenSidebar.textTags',
        description: 'Text tags section header',
        defaultMessage: 'Text tags',
    },
    imageTags: {
        id: 'be.docGenSidebar.imageTags',
        description: 'Image tags section header',
        defaultMessage: 'Image tags',
    },
    docGenTags: {
        id: 'be.docGenSidebar.docGenTags',
        description: 'DocGen sidebar header',
        defaultMessage: 'Doc Gen Tags',
    },
    noTags: {
        id: 'be.docGenSidebar.emptyTags',
        defaultMessage: 'This document has no tags',
        description: 'No tags available',
    },
    errorCouldNotLoad: {
        id: 'be.docGenSidebar.errorTags',
        defaultMessage: "We couldn't load the tags",
        description: 'Error message when tags could not be loaded',
    },
    errorRefreshList: {
        id: 'be.docGenSidebar.refreshPrompt',
        defaultMessage: 'Please refresh the list.',
        description: 'Prompt to refresh the list after an error',
    },
    errorRefreshButton: {
        id: 'be.docGenSidebar.refreshButton',
        defaultMessage: 'Refresh',
        description: 'Label for the refresh button',
    },
    loadingAriaLabel: {
        id: 'be.docGenSidebar.loadingAriaLabel',
        defaultMessage: 'Loading',
        description: 'Label for the loader',
    },
});

export default messages;
