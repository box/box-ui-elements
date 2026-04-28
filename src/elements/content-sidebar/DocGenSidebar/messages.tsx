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
    checkboxTags: {
        id: 'be.docGenSidebar.checkboxTags',
        description: 'Checkbox tags section header',
        defaultMessage: 'Checkbox tags',
    },
    radiobuttonTags: {
        id: 'be.docGenSidebar.radiobuttonTags',
        description: 'Radiobutton tags section header',
        defaultMessage: 'Radiobutton tags',
    },
    dropdownTags: {
        id: 'be.docGenSidebar.dropdownTags',
        description: 'Dropdown tags section header',
        defaultMessage: 'Dropdown tags',
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
        defaultMessage: 'Looks like your recent changes to the Doc Gen template are yet to be processed.',
        description: 'Error message when tags could not be loaded',
    },
    errorRefreshButton: {
        id: 'be.docGenSidebar.refreshButton',
        defaultMessage: 'Process document',
        description: 'Label for the Process document button',
    },
});

export default messages;
