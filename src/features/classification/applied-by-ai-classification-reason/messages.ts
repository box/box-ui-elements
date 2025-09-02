import { defineMessages } from 'react-intl';

const messages = defineMessages({
    appliedByBoxAi: {
        defaultMessage: 'Box AI',
        description:
            'Title of the card that shows the reason why the AI classification was applied when no date is available.',
        id: 'boxui.classification.appliedByBoxAi',
    },
    appliedByBoxAiOnDate: {
        defaultMessage: 'Box AI on {modifiedAt}',
        description:
            'Title of the card that shows the reason why the AI classification was applied on a specific date.',
        id: 'boxui.classification.appliedByBoxAiOnDate',
    },
});

export default messages;
