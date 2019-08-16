import { defineMessages } from 'react-intl';

const messages = defineMessages({
    add: {
        defaultMessage: 'Add',
        description: 'Button to add classification on an item',
        id: 'boxui.classification.add',
    },
    addClassification: {
        defaultMessage: 'CLASSIFY',
        description: 'Button to add classification on an item',
        id: 'boxui.classification.addClassification',
    },
    classification: {
        defaultMessage: 'Classification',
        description: 'Header for classification section in sidebar',
        id: 'boxui.classification.classification',
    },
    edit: {
        defaultMessage: 'Edit',
        description: 'Button to edit classification on an item',
        id: 'boxui.classification.edit',
    },
    missing: {
        defaultMessage: 'Not classified',
        description: 'Default message for classification in the sidebar when there is none',
        id: 'boxui.classification.missing',
    },
});

export default messages;
