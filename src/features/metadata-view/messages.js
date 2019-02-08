// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
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
});

export default messages;
