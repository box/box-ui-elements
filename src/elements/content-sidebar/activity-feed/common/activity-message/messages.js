// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    activityMessageShowOriginal: {
        id: 'be.contentSidebar.activityFeed.commmon.showOriginalMessage',
        defaultMessage: 'Show Original',
        description: 'Show original button for showing original comment',
    },
    activityMessageTranslate: {
        id: 'be.contentSidebar.activityFeed.common.translateMessage',
        defaultMessage: 'Translate',
        description: 'Translate button for translating comment',
    },
    activityMessageEdited: {
        id: 'be.contentSidebar.activityFeed.common.editedMessage',
        defaultMessage: 'edited',
        description: 'Label indicating that message was edited, should be lowercase',
    },
});

export default messages;
