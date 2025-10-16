import * as React from 'react';

import { convertGroupContactsResponse, convertUserContactsResponse } from '../utils';
import useContacts from './useContacts';

export const useContactService = (api, itemID, currentUserId) => {
    const getContacts = useContacts(api, itemID, {
        transformUsers: data => convertUserContactsResponse(data, currentUserId),
        transformGroups: data => convertGroupContactsResponse(data),
    });

    const contactService = React.useMemo(() => {
        if (!currentUserId) {
            return null;
        }

        return { getContacts };
    }, [currentUserId, getContacts]);

    return { contactService };
};
