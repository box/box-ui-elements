// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    tooltipSelectValueError: {
        defaultMessage: 'Please Select a Value',
        description: 'Text displayed on the Tooltip for a value field',
        id: 'boxui.queryBar.tooltipSelectValueError',
    },
    tooltipSelectDateError: {
        defaultMessage: 'Please Select a Date',
        description: 'Text displayed on the Tooltip for a date field',
        id: 'boxui.queryBar.tooltipSelectDateError',
    },
    metadataViewTemplateListHeaderTitle: {
        defaultMessage: 'METADATA TEMPLATES',
        description: 'Header text shown in template dropdown',
        id: 'boxui.queryBar.metadataViewTemplateListHeaderTitle',
    },
    selectAttributePlaceholderText: {
        defaultMessage: 'Select attribute',
        description: 'Placeholder text on the attribute button, on click should open a dropdown',
        id: 'boxui.queryBar.selectAttributePlaceholderText',
    },
    selectValuePlaceholderText: {
        defaultMessage: 'Select value',
        description: 'Placeholder text on the value button, on click should open a dropdown',
        id: 'boxui.queryBar.selectValuePlaceholderText',
    },
    connectorWhereText: {
        defaultMessage: 'WHERE',
        description: 'Text on the label, the first condition will show WHERE',
        id: 'boxui.queryBar.connectorWhereText',
    },
    connectorAndText: {
        defaultMessage: 'AND',
        description: 'Text on the connector dropdown, on click should open a dropdown showing either AND or OR',
        id: 'boxui.queryBar.connectorAndText',
    },
    connectorOrText: {
        defaultMessage: 'OR',
        description: 'Text on the connector dropdown, on click should open a dropdown showing either AND or OR',
        id: 'boxui.queryBar.connectorOrText',
    },
    addFilterButtonText: {
        defaultMessage: '+ Add Filter',
        description: 'Text on the add filter button, on click generates another filter row',
        id: 'boxui.queryBar.addFilterButtonText',
    },
    applyFiltersButtonText: {
        defaultMessage: 'Apply',
        description: 'Text on the apply filter button, on click applies the filters',
        id: 'boxui.queryBar.applyFiltersButtonText',
    },
    templatesLoadingButtonText: {
        defaultMessage: 'Template Name',
        description: 'Text on the templates button when templates are still being loaded',
        id: 'boxui.queryBar.templatesLoadingButtonText',
    },
    templatesButtonText: {
        defaultMessage: 'Select Metadata',
        description:
            'Text on the templates button, on click opens a menu which allows users to select a metadata templates',
        id: 'boxui.queryBar.templatesButtonText',
    },
    filtersButtonText: {
        defaultMessage: 'Modify Filters',
        description: 'Text on the filters button, on click opens a menu which allows users to filter through the files',
        id: 'boxui.queryBar.filtersButtonText',
    },
    multipleFiltersButtonText: {
        defaultMessage: '{number} Filters',
        description:
            'Text on the filters button, will display a number in front of the filters text indicating how many filters are applied',
        id: 'boxui.queryBar.multipleFiltersButtonText',
    },
    noFiltersAppliedText: {
        defaultMessage: 'No Filters Applied',
        description: 'Text on the filters dropdown that is displayed when no filters have been inserted',
        id: 'boxui.queryBar.noFiltersAppliedText',
    },
    selectAttributeDropdownText: {
        defaultMessage: 'Select attribute',
        description:
            'Text on the select attribute button, on click opens a menu which allows users to select an attribute',
        id: 'boxui.queryBar.selectAttributeDropdownText',
    },
    operatorDropdownText: {
        defaultMessage: 'is',
        description: 'Text on the operator button, on click opens a menu which allows users to select an attribute',
        id: 'boxui.queryBar.operatorDropdownText',
    },
    selectValueDropdownText: {
        defaultMessage: 'Select value',
        description: 'Text on the select value button, on click opens a menu which allows users to select a value',
        id: 'boxui.queryBar.selectValueDropdownText',
    },
    columnsButtonText: {
        defaultMessage: 'Columns',
        description:
            'Text on the columns button, on click opens a menu which allows users to choose which columns to render',
        id: 'boxui.queryBar.columnsButtonText',
    },
    columnsHiddenButtonText: {
        defaultMessage: '{number} Columns Hidden',
        description: 'Text on the columns button, if columns have been hidden then it will display this text',
        id: 'boxui.queryBar.columnsHiddenButtonText',
    },
});

export default messages;
