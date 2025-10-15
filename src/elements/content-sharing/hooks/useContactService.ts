import * as React from 'react';

import { STATUS_INACTIVE } from '../../../constants';
import useContacts from './useContacts';
import useContactsByEmail from './useContactsByEmail';
import { convertUserContactsByEmailResponse } from '../../../features/unified-share-modal/utils/convertData';

const APP_USERS_DOMAIN_REGEXP = /boxdevedition.com/;
const sortByName = ({ name: nameA = '' }, { name: nameB = '' }) => nameA.localeCompare(nameB);

/**
 * Convert an enterprise users API response into an array of internal USM contacts.
 */
export const convertUserContactsResponse = (contactsAPIData, currentUserID) => {
    const { entries = [] } = contactsAPIData;

    // Return all active users except for the current user and app users
    return entries
        .filter(
            ({ id, login: email, status }) =>
                id !== currentUserID &&
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
export const convertGroupContactsResponse = contactsAPIData => {
    const { entries = [] } = contactsAPIData;

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

export const useContactService = (api, itemID, currentUserID) => {
    const getContacts = useContacts(api, itemID, {
        transformUsers: data => convertUserContactsResponse(data, currentUserID),
        transformGroups: data => convertGroupContactsResponse(data),
    });

    const getContactsByEmail = useContactsByEmail(api, itemID, {
        transformUsers: data => convertUserContactsByEmailResponse(data),
    });

    const contactService = React.useMemo(() => {
        if (!currentUserID) {
            return null;
        }

        return {
            getContacts,
            getContactsByEmail,
        };
    }, [currentUserID, getContacts, getContactsByEmail]);

    return { contactService };
};
