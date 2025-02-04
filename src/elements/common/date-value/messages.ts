import { defineMessages } from 'react-intl';

const messages = defineMessages({
    today: {
        id: 'be.dateValue.today',
        description: "Text displayed to the user instead of showing today's date value",
        defaultMessage: 'Today',
    },
    yesterday: {
        id: 'be.dateValue.yesterday',
        description: "Text displayed to the user instead of showing yesterday's date value",
        defaultMessage: 'Yesterday',
    },
});

export default messages;
