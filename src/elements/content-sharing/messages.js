import { defineMessages } from 'react-intl';

const contentSharingMessages = defineMessages({
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
});

const CONTENT_SHARING_ERRORS = {
    400: 'badRequestError',
    401: 'noAccessError',
    403: 'noAccessError',
    404: 'notFoundError',
    500: 'loadingError',
};

export { contentSharingMessages, CONTENT_SHARING_ERRORS };
