import * as React from 'react';
import { useIntl } from 'react-intl';

import { fetchAvatars } from '../apis';
import { convertGroupContactsResponse, convertUserContactByEmailResponse, convertUserContactsResponse } from '../utils';
import useContactsByEmail from './useContactsByEmail';
import useContacts from './useContacts';

import messages from '../messages';

export const useContactService = (api, itemId, currentUserId) => {
    const { formatMessage } = useIntl();

    const getContacts = useContacts(api, itemId, {
        currentUserId,
        isContentSharingV2Enabled: true,
        transformUsers: data => convertUserContactsResponse(data, currentUserId),
        transformGroups: data => convertGroupContactsResponse(data, formatMessage(messages.groupContactLabel)),
    });

    const getContactByEmail = useContactsByEmail(api, itemId, {
        isContentSharingV2Enabled: true,
        transformUsers: data => convertUserContactByEmailResponse(data),
    });

    const getContactsAvatarUrls = React.useCallback(
        async contacts => {
            if (!contacts || contacts.length === 0) return Promise.resolve({});

            const collaborators = contacts.map(contact => ({
                accessible_by: {
                    id: contact.id,
                    is_active: true,
                    login: contact.email,
                    name: contact.name,
                    type: contact.type,
                },
            }));

            return fetchAvatars({
                api,
                itemId,
                collaborators,
            });
        },
        [api, itemId],
    );

    return { contactService: { getContactByEmail, getContacts, getContactsAvatarUrls } };
};
