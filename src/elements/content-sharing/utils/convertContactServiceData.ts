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
export const convertGroupContactsResponse = contactsApiData => {
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
                email: 'Group', // Need this for the avatar to work for isUserContactType
                name,
                type,
                value: 'Group',
            };
        })
        .sort(sortByName);
};
