import { defineMessages } from 'react-intl';

const messages = defineMessages({
    activeNowText: {
        defaultMessage: 'Active now',
        description: 'Description for someone who is currently viewing or editing a document',
        id: 'boxui.presence.activeNow',
    },
    timeSinceLastAccessedText: {
        defaultMessage: 'Viewed {timeAgo}',
        description:
            'Description for when someone last viewed a document, {timeAgo} is a relative time like 2 months ago',
        id: 'boxui.presence.timeSinceLastAccessed',
    },
    timeSinceLastPreviewedText: {
        defaultMessage: 'Previewed {timeAgo}',
        description:
            'Description for when someone last previewed a document, {timeAgo} is a relative time like 2 months ago',
        id: 'boxui.presence.timeSinceLastPreviewed',
    },
    timeSinceLastCommentedText: {
        defaultMessage: 'Commented {timeAgo}',
        description:
            'Description for when someone last commented on a document, {timeAgo} is a relative time like 2 months ago',
        id: 'boxui.presence.timeSinceLastCommented',
    },
    timeSinceLastModifiedText: {
        defaultMessage: 'Edited {timeAgo}',
        description:
            'Description for when someone last edited a document, {timeAgo} is a relative time like 2 months ago',
        id: 'boxui.presence.timeSinceLastModified',
    },
    accessedInTheLastMinuteText: {
        defaultMessage: 'Viewed less than a minute ago',
        description: 'Description for when someone last viewed a document less than a minute ago',
        id: 'boxui.presence.accessedInTheLastMinute',
    },
    previewedIntheLastMinuteText: {
        defaultMessage: 'Previewed less than a minute ago',
        description: 'Description for when someone last previewed a document less than a minute ago',
        id: 'boxui.presence.previewedIntheLastMinute',
    },
    commentedIntheLastMinuteText: {
        defaultMessage: 'Commented less than a minute ago',
        description: 'Description for when someone last commented on a document less than a minute ago',
        id: 'boxui.presence.commentedIntheLastMinute',
    },
    modifiedIntheLastMinuteText: {
        defaultMessage: 'Edited less than a minute ago',
        description: 'Description for when someone last edited a document less than a minute ago',
        id: 'boxui.presence.modifiedIntheLastMinute',
    },
    getLinkButtonText: {
        defaultMessage: 'Get Link',
        description: 'Text on button to get shared link for the item',
        id: 'boxui.presence.getLinkButton',
    },
    inviteButtonText: {
        defaultMessage: 'Invite People',
        description: 'Text on button to invite collaborators to this item',
        id: 'boxui.presence.inviteButton',
    },
    recentActivity: {
        defaultMessage: 'Recent Activity',
        description: 'Header on presence dropdown list that represents recent activity on the item',
        id: 'boxui.presence.recentActivity',
    },
    previewPresenceFlyoutCopy: {
        // GROWTH-421 Presence Autofly
        defaultMessage: 'Quickly see who has commented on, edited, or viewed this file.',
        description: 'Tooltip text visible on page load, to prompt the user to press a button to view activity',
        id: 'boxui.presence.previewPresenceFlyoutCopy',
    },
    previewPresenceFlyoutActivityCTA: {
        // GROWTH-421 Presence Autofly
        defaultMessage: 'View Recent Activity',
        description: 'Text on button embedded within tooltip that is visible on page load',
        id: 'boxui.presence.previewPresenceFlyoutActivityCTA',
    },
    previewPresenceFlyoutAccessStatsLink: {
        // GROWTH-421 Presence Autofly
        defaultMessage: 'See all activity',
        description: 'Text for link at footer of the Recent Activity panel',
        id: 'boxui.presence.previewPresenceFlyoutAccessStatsLink',
    },
    toggleButtonLabel: {
        defaultMessage: 'Recent Activity',
        description: 'Description of the button to toggle the presence overlay with recent activity',
        id: 'boxui.presence.toggleButtonLabel',
    },
});

export default messages;
