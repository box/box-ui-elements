import { convertGroupContactsResponse, convertUserContactsResponse } from '../utils';
import useContacts from './useContacts';

export const useContactService = (api, itemId, currentUserId) => {
    const getContacts = useContacts(api, itemId, {
        currentUserId,
        isContentSharingV2Enabled: true,
        transformUsers: data => convertUserContactsResponse(data, currentUserId),
        transformGroups: data => convertGroupContactsResponse(data),
    });

    return { contactService: { getContacts } };
};
