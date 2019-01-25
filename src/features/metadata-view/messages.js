// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    metadataViewTemplateListHeaderTitle: {
        defaultMessage: 'METADATA TEMPLATES',
        description: 'Header text shown in template dropdown',
        id: 'boxui.metadataView.metadataViewTemplateListHeaderTitle',
    },
    metadataViewTitle: {
        defaultMessage: 'METADATA VIEW • { filesNumber } FILES',
        description:
            'Header text shown in metadata view that indicates how many files are present in this current view',
        id: 'boxui.metadataView.metadataViewTitle',
    },
    needRefiningHeaderText: {
        defaultMessage: 'Too many results',
        description: 'Header text shown in metadata view for when the user has too many results within some range',
        id: 'boxui.metadataView.needRefiningHeaderText',
    },
    needRefiningSubtitleText: {
        defaultMessage: 'Please use filters to refine your results.',
        description: 'Subtitle text shown in metadata view for when the user has too many results within some range',
        id: 'boxui.metadataView.needRefiningSubtitleText',
    },
    tooManyResultsHeaderText: {
        defaultMessage: 'Over {upperFileLimit} files match this template',
        description: 'Header text shown in metadata view for when the user has too many results past an upper limit',
        id: 'boxui.metadataView.tooManyResultsHeaderText',
    },
    tooManyResultsSubtitleText: {
        defaultMessage: 'Result sets of this size are not currently supported in Box.',
        description: 'Subtitle text shown in metadata view for when the user has too many results past an upper limit',
        id: 'boxui.metadataView.tooManyResultsSubtitleText',
    },
    noResultsForQueryHeaderText: {
        defaultMessage: 'No results',
        description: 'Header text shown in metadata view for when there are no results for the current query',
        id: 'boxui.metadataView.noResultsForQueryHeaderText',
    },
    noResultsForQuerySubtitleText: {
        defaultMessage:
            'You do not have access to any files that match your query. Please use filters to modify your query.',
        description: 'Subtitle text shown in metadata view for when there are no results for the current query',
        id: 'boxui.metadataView.noResultsForQuerySubtitleText',
    },
    noResultsForTemplateHeaderText: {
        defaultMessage: 'No results',
        description: 'Header text shown in metadata view for when there are no results for the current template',
        id: 'boxui.metadataView.noResultsForTemplateHeaderText',
    },
    noResultsForTemplateSubtitleText: {
        defaultMessage: 'You do not have access to any files that match this template.',
        description: 'Subtitle text shown in metadata view for when there are no results for the current template',
        id: 'boxui.metadataView.noResultsForTemplateSubtitleText',
    },
    selectAttributePlaceholderText: {
        defaultMessage: 'Select attribute',
        description: 'Placeholder text on the attribute button, on click should open a dropdown',
        id: 'boxui.metadataView.selectAttributePlaceholderText',
    },
    selectValuePlaceholderText: {
        defaultMessage: 'Select value',
        description: 'Placeholder text on the value button, on click should open a dropdown',
        id: 'boxui.metadataView.selectValuePlaceholderText',
    },
    prefixButtonText: {
        defaultMessage: 'WHERE',
        description: 'Text on the prefix button, on click should open a dropdown showing either AND or OR',
        id: 'boxui.metadataView.prefixButtonText',
    },
    addFilterButtonText: {
        defaultMessage: '+ Add Filter',
        description: 'Text on the add filter button, on click generates another filter row',
        id: 'boxui.metadataView.addFilterButtonText',
    },
    applyFiltersButtonText: {
        defaultMessage: 'Apply',
        description: 'Text on the apply filter button, on click applies the filters',
        id: 'boxui.metadataView.applyFiltersButtonText',
    },
    templatesLoadingButtonText: {
        defaultMessage: 'Template Name',
        description: 'Text on the templates button when templates are still being loaded',
        id: 'boxui.metadataView.templatesLoadingButtonText',
    },
    templatesButtonText: {
        defaultMessage: 'Select Metadata',
        description:
            'Text on the templates button, on click opens a menu which allows users to select a metadata templates',
        id: 'boxui.metadataView.templatesButtonText',
    },
    filtersButtonText: {
        defaultMessage: 'Modify Filters',
        description: 'Text on the filters button, on click opens a menu which allows users to filter through the files',
        id: 'boxui.metadataView.filtersButtonText',
    },
    multipleFiltersButtonText: {
        defaultMessage: '{number} Filters',
        description:
            'Text on the filters button, will display a number in front of the filters text indicating how many filters are applied',
        id: 'boxui.metadataView.multipleFiltersButtonText',
    },
    noFiltersAppliedText: {
        defaultMessage: 'No Filters Applied',
        description: 'Text on the filters dropdown that is displayed when no filters have been inserted',
        id: 'boxui.metadataView.noFiltersAppliedText',
    },
    selectAttributeDropdownText: {
        defaultMessage: 'Select attribute',
        description:
            'Text on the select attribute button, on click opens a menu which allows users to select an attribute',
        id: 'boxui.metadataView.selectAttributeDropdownText',
    },
    operatorDropdownText: {
        defaultMessage: 'is',
        description: 'Text on the operator button, on click opens a menu which allows users to select an attribute',
        id: 'boxui.metadataView.operatorDropdownText',
    },
    selectValueDropdownText: {
        defaultMessage: 'Select value',
        description: 'Text on the select value button, on click opens a menu which allows users to select a value',
        id: 'boxui.metadataView.selectValueDropdownText',
    },
    columnsButtonText: {
        defaultMessage: 'Columns',
        description:
            'Text on the columns button, on click opens a menu which allows users to choose which columns to render',
        id: 'boxui.metadataView.columnsButtonText',
    },
    columnsHiddenButtonText: {
        defaultMessage: '{number} Columns Hidden',
        description: 'Text on the columns button, if columns have been hidden then it will display this text',
        id: 'boxui.metadataView.columnsHiddenButtonText',
    },
    nameHeaderColumnText: {
        defaultMessage: 'Name',
        description: 'Text on the name header column for the metadata views component',
        id: 'boxui.metadataView.nameHeaderColumnText',
    },
    updatedByColumnText: {
        defaultMessage: 'Updated',
        description: 'Text on the updated header column for the metadata views component',
        id: 'boxui.metadataView.updatedByColumnText',
    },
});

export default messages;
