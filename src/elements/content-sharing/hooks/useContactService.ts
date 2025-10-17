import { useIntl } from 'react-intl';

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
        transformGroups: data =>
            convertGroupContactsResponse(data, formatMessage(messages.contactServiceGroupDisplayText)),
    });

    const getContactByEmail = useContactsByEmail(api, itemId, {
        isContentSharingV2Enabled: true,
        transformUsers: data => convertUserContactByEmailResponse(data),
    });

    return { contactService: { getContactByEmail, getContacts } };
};
