import { defineMessages } from 'react-intl';

const messages = defineMessages({
    annotationActivityDeleteMenuItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityDeleteMenuItem',
        defaultMessage: 'Delete',
        description: 'Text to show on menu item to delete the annotation',
    },
    annotationActivityDeletePrompt: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this comment?',
        description: 'Confirmation prompt text to delete the annotation',
    },
    annotationActivityEditMenuItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityEditMenuItem',
        defaultMessage: 'Modify',
        description: 'Text to show on menu item to edit an annotation',
    },
    annotationActivityPostedFullDateTime: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityPostedFullDateTime',
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'Annotation posted full date time for title',
    },
    annotationActivityPageItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivityPageItem',
        defaultMessage: 'Page {number}',
        description: 'Annotation activity item link',
    },
});

export default messages;
