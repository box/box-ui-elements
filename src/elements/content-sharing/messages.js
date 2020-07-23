import { defineMessages } from 'react-intl';

const messages = defineMessages({
    badRequestError: {
        defaultMessage: 'The request for this item was malformed.',
        description: 'Message that appears when the request for the ContentSharing Element is malformed.',
        id: 'be.contentSharing.badRequestError',
    },
    loadingError: {
        defaultMessage: 'Could not load shared link for this item.',
        description: 'Message that appears when the ContentSharing Element cannot be loaded.',
        id: 'be.contentSharing.loadingError',
    },
    noAccessError: {
        defaultMessage: 'You do not have access to this item.',
        description: 'Message that appears when the user cannot access the item for the ContentSharing Element.',
        id: 'be.contentSharing.noAccessError',
    },
    notFoundError: {
        defaultMessage: 'Could not find shared link for this item.',
        description: 'Message that appears when the item for the ContentSharing Element cannot be found.',
        id: 'be.contentSharing.notFoundError',
    },
    sharedLinkUpdateError: {
        defaultMessage: 'Could not update the shared link for this item.',
        description: 'Message that appears when the shared link in the ContentSharing Element cannot be updated.',
        id: 'be.contentSharing.sharedLinkUpdateError',
    },
    sharedLinkSettingsUpdateSuccess: {
        defaultMessage: 'Your settings were saved successfully.',
        description:
            'Message that appears when the shared link settings in the ContentSharing Element were successfully updated.',
        id: 'be.contentSharing.sharedLinkSettingsUpdateSuccess',
    },
    collaboratorsLoadingError: {
        defaultMessage: 'Could not retrieve collaborators for this item.',
        description: 'Message that appears when collaborators cannot be retrieved in the ContentSharing Element.',
        id: 'be.contentSharing.collaboratorsLoadingError',
    },
    getContactsError: {
        defaultMessage: 'Could not retrieve contacts.',
        description: 'Message that appears when users cannot be retrieved in the ContentSharing Element.',
        id: 'be.contentSharing.getContactsError',
    },
});

export default messages;
