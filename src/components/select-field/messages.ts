import { defineMessages } from 'react-intl';

const messages = defineMessages({
    clearAll: {
        defaultMessage: 'Clear All',
        description: 'text shown on the Clear All option in the options list',
        id: 'boxui.selectField.clearAll',
    },
    searchPlaceholder: {
        defaultMessage: 'Search',
        description: 'Placeholder text shown in the search input',
        id: 'boxui.selectField.searchPlaceholder',
    },
    noResults: {
        defaultMessage: 'No Results',
        description:
            'Text shown in the select field dropdown when there are no options that match the search field input',
        id: 'boxui.selectField.noResults',
    },
});

export default messages;
