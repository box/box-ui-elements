import { defineMessages } from 'react-intl';

const messages = defineMessages({
    add: {
        defaultMessage: 'Add',
        description: 'Button to add classification on an item',
        id: 'boxui.classification.add',
    },
    appliedByDetails: {
        defaultMessage: '{appliedBy} on {appliedAt}',
        description: 'Details stating which user or service applied the classification and on what date.',
        id: 'boxui.classification.appliedByDetails',
    },
    appliedByTitle: {
        defaultMessage: 'Applied By',
        description: 'The title text for classification applied details',
        id: 'boxui.classification.appliedByTitle',
    },
    classification: {
        defaultMessage: 'Classification',
        description: 'Header for classification section in sidebar',
        id: 'boxui.classification.classification',
    },
    definition: {
        defaultMessage: 'Definition',
        description: 'Header displayed above the classification definition',
        id: 'boxui.classification.definition',
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
    modifiedByLabel: {
        defaultMessage: 'Classification Label',
        description: 'Label displayed above details about when a classification was last modified.',
        id: 'boxui.classification.modifiedByLabel',
    },
    importedBy: {
        defaultMessage: 'Imported from {modifiedBy} on {modifiedAt}',
        description: 'Sentence stating which user or service imported a classification and on what date.',
        id: 'boxui.classification.importedBy',
    },
    modifiedBy: {
        defaultMessage: 'Applied by {modifiedBy} on {modifiedAt}',
        description: 'Sentence stating which user or service modified a classification and on what date.',
        id: 'boxui.classification.modifiedBy',
    },
    // Classification Colors
    classificationYellow: {
        defaultMessage: 'Yellow',
        description: 'Classification label color name as yellow',
        id: 'boxui.classification.classificationYellow',
    },
    classificationOrange: {
        defaultMessage: 'Orange',
        description: 'Classification label color name as orange',
        id: 'boxui.classification.classificationOrange',
    },
    classificationRed: {
        defaultMessage: 'Red',
        description: 'Classification label color name as red',
        id: 'boxui.classification.classificationRed',
    },
    classificationPurple: {
        defaultMessage: 'Purple',
        description: 'Classification label color name as purple',
        id: 'boxui.classification.classificationPurple',
    },
    classificationLightBlue: {
        defaultMessage: 'Light Blue',
        description: 'Classification label color name as light blue',
        id: 'boxui.classification.classificationLightBlue',
    },
    classificationDarkBlue: {
        defaultMessage: 'Dark Blue',
        description: 'Classification label color name as dark blue',
        id: 'boxui.classification.classificationDarkBlue',
    },
    classificationGreen: {
        defaultMessage: 'Green',
        description: 'Classification label color name as green',
        id: 'boxui.classification.classificationGreen',
    },
    classificationGrey: {
        defaultMessage: 'Grey',
        description: 'Classification label color name as grey',
        id: 'boxui.classification.classificationGrey',
    },
});

export default messages;
