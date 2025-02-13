import { defineMessages } from 'react-intl';

const messages = defineMessages({
    errorState: {
        id: 'be.emptyView.errorState',
        description: 'Text shown in the empty state when there is an error',
        defaultMessage: 'A network error has occurred while trying to load.',
    },
    folderState: {
        id: 'be.emptyView.folderState',
        description: 'Text shown in the empty state when there are no folder items',
        defaultMessage: 'There are no items in this folder.',
    },
    loadingState: {
        id: 'be.emptyView.loadingState',
        description: 'Text shown in the empty state when the folder items are loading',
        defaultMessage: 'Please wait while the items load...',
    },
    metadataState: {
        id: 'be.emptyView.metadataState',
        description: 'Text shown in the empty state when there are no items for the metadata query',
        defaultMessage: 'There are no items in this folder.',
    },
    recentsState: {
        id: 'be.emptyView.recentsState',
        description: 'Text shown in the empty state when there are no recent items',
        defaultMessage: 'There are no recent items yet.',
    },
    searchState: {
        id: 'be.emptyView.searchState',
        description: 'Text shown in the empty state when there no results for the search query',
        defaultMessage: "Sorry, we couldn't find what you're looking for.",
    },
    selectedState: {
        id: 'be.emptyView.selectedState',
        description: 'Text shown in the empty state when there are no selected items',
        defaultMessage: "You haven't selected any items yet.",
    },
});

export default messages;
