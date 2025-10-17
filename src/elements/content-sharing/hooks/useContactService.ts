import { convertGroupContactsResponse, convertUserContactByEmailResponse, convertUserContactsResponse } from '../utils';
import useContactsByEmail from './useContactsByEmail';
import useContacts from './useContacts';

export const useContactService = (api, itemId, currentUserId) => {
    const getContacts = useContacts(api, itemId, {
        currentUserId,
        isContentSharingV2Enabled: true,
        transformUsers: data => convertUserContactsResponse(data, currentUserId),
        transformGroups: data => convertGroupContactsResponse(data),
    });

    const getContactByEmail = useContactsByEmail(api, itemId, {
        isContentSharingV2Enabled: true,
        transformUsers: data => convertUserContactByEmailResponse(data),
    });

    return { contactService: { getContactByEmail, getContacts } };
};
