import { defineMessages } from 'react-intl';

const messages = defineMessages({
    annotationActivityDeleteMenuItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityDeleteMenuItem',
        defaultMessage: 'Delete',
        description: 'Text to show on menu item to delete the annotation comment',
    },
    annotationActivityDeletePrompt: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityDeletePrompt',
        defaultMessage: 'Are you sure you want to permanently delete this comment?',
        description: 'Confirmation prompt text to delete the annotation comment',
    },
    annotationActivityEditMenuItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityEditMenuItem',
        defaultMessage: 'Modify',
        description: 'Text to show on menu item to edit the annotation comment',
    },
    annotationActivityPostedFullDateTime: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityPostedFullDateTime',
        defaultMessage: '{time, date, full} at {time, time, short}',
        description: 'Full data and time for annotation title',
    },
    annotationActivityPageItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivityPageItem',
        defaultMessage: 'Page {number}',
        description: 'Annotation activity item link shown on annotation activity',
    },

    annotationActivityTimeStampItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivityTimeStampItem',
        defaultMessage: 'TimeStamp {number}',
        description: 'Annotation activity item link shown on annotation activity for time stamp',
    },
    annotationActivityResolveMenuItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityResolveMenuItem',
        defaultMessage: 'Resolve',
        description: 'Text to show on menu item to resolve the annotation comment',
    },
    annotationActivityVersionLink: {
        id: 'be.contentSidebar.activityFeed.annotationActivityVersionLink',
        defaultMessage: 'Version {number}',
        description: 'Annotation activity item link shown on annotation activity for previous file version',
    },
    annotationActivityVersionUnavailable: {
        id: 'be.contentSidebar.activityFeed.annotationActivityVersionUnavailable',
        defaultMessage: 'Version Unavailable',
        description:
            'Annotation activity item link shown on annotation activity for previous file version that is unavailable',
    },
    annotationActivityUnresolveMenuItem: {
        id: 'be.contentSidebar.activityFeed.annotationActivity.annotationActivityUnresolveMenuItem',
        defaultMessage: 'Unresolve',
        description: 'Text to show on menu item to unresolve the annotation comment',
    },
});

export default messages;
