import { STATUS_INACTIVE } from '../../../constants';

const APP_USERS_DOMAIN_REGEXP = /boxdevedition.com/;
const sortByName = ({ name: nameA = '' }, { name: nameB = '' }) => nameA.localeCompare(nameB);

/**
 * Convert an enterprise users API response into an array of internal USM contacts.
 */
export const convertUserContactsResponse = (contactsApiData, currentUserId) => {
    const { entries = [] } = contactsApiData;

    // Return all active users except for the current user and app users
    return entries
        .filter(
            ({ id, login: email, status }) =>
                id !== currentUserId &&
                email &&
                !APP_USERS_DOMAIN_REGEXP.test(email) &&
                status &&
                status !== STATUS_INACTIVE,
        )
        .map(contact => {
            const { id, login: email, name, type } = contact;
            return {
                id,
                email,
                name,
                type,
                value: email,
            };
        })
        .sort(sortByName);
};

/**
 * Convert an enterprise groups API response into an array of internal USM contacts.
 */
export const convertGroupContactsResponse = (contactsApiData, formatMessage) => {
    const { entries = [] } = contactsApiData;

    // Only return groups with the correct permissions
    return entries
        .filter(({ permissions }) => {
            return permissions && permissions.can_invite_as_collaborator;
        })
        .map(contact => {
            const { id, name, type } = contact;
            return {
                id,
                email: formatMessage, // Need this for the avatar to work for isUserContactType
                name,
                type,
                value: id,
            };
        })
        .sort(sortByName);
};

/**
 * Convert an enterprise users API response into a single internal USM contact object (from the first entry).
 */
export const convertUserContactByEmailResponse = contactsApiData => {
    const { entries = [] } = contactsApiData;
    const entry = entries[0];
    if (!entry) {
        return {};
    }

    const { id, login: email = '', name, type } = entry;
    return {
        id,
        email,
        name,
        type,
        value: email,
    };
};
