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
    activityMessageSeeMore: {
        id: 'be.contentSidebar.activityFeed.common.seeMoreMessage',
        defaultMessage: 'See more',
        description: 'See more button for showing whole long message',
    },
    activityMessageSeeLess: {
        id: 'be.contentSidebar.activityFeed.common.seeLessMessage',
        defaultMessage: 'See less',
        description: 'See less button for hiding part of long message',
    },
    activityMessageEdited: {
        id: 'be.contentSidebar.activityFeed.common.editedMessage',
        defaultMessage: '\\ (edited)',
        description: 'Label indicating that message was edited, should be lowercase, should have escaped leading space',
    },
    activityMessageTimestampLabel: {
        id: 'be.contentSidebar.activityFeed.common.timestampLabel',
        defaultMessage: 'Seek to video timestamp',
        description: 'Accessibility label for timestamp button that allows jumping to a specific time in media',
    },
});

export default messages;
