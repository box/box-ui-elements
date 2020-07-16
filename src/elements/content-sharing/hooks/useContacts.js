// @flow

import * as React from 'react';
import API from '../../../api';
import { convertContactsResponse } from '../../../features/unified-share-modal/utils/convertData';
import type { ElementsErrorCallback } from '../../../common/types/api';
import type { UserCollection } from '../../../common/types/core';
import type { GetContactsFnType } from '../types';

/**
 * Generate the getContacts function, which is used for inviting collaborators in the USM.
 *
 * @param {API} api
 * @param {string | null} currentUserID
 * @param {string} itemID
 * @param {Function} handleSuccess
 * @param {ElementsErrorCallback} handleError
 * @returns {GetContactsFnType | null}
 */
function useContacts(
    api: API,
    currentUserID: string | null,
    itemID: string,
    handleSuccess: ?Function,
    handleError: ElementsErrorCallback,
): GetContactsFnType | null {
    const [getContacts, setGetContacts] = React.useState<null | GetContactsFnType>(null);

    React.useEffect(() => {
        const handleGetContactsSuccess = (response: UserCollection) => {
            if (handleSuccess) {
                handleSuccess();
            }
            return convertContactsResponse(response, currentUserID);
        };

        if (!getContacts) {
            const updatedGetContactsFn: GetContactsFnType = () => (filterTerm: string) =>
                api.getUsersAPI(false).getUsersInEnterprise(itemID, handleGetContactsSuccess, handleError, filterTerm);
            setGetContacts(updatedGetContactsFn);
        }
    }, [api, currentUserID, getContacts, handleError, handleSuccess, itemID]);

    return getContacts;
}

export default useContacts;
