import { defineMessages } from 'react-intl';

const messages = defineMessages({
    addClassification: {
        defaultMessage: 'Add Classification',
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
    missingClassificationMessage: {
        defaultMessage: 'Unclassified, click the edit icon to add classification.',
        description: 'Default message for classification in the sidebar when there is none',
        id: 'boxui.classification.missingClassificationMessage',
    },
});

export default messages;
