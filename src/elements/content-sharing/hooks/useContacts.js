// @flow

import * as React from 'react';
import API from '../../../api';
import { convertContactsResponse } from '../../../features/unified-share-modal/utils/convertData';
import type { ElementsErrorCallback } from '../../../common/types/api';
import type { UserCollection } from '../../../common/types/core';
import type { GetContactsFnType } from '../types';
import type { contactType } from '../../../features/unified-share-modal/flowTypes';

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
        if (getContacts) return;

        const updatedGetContactsFn: GetContactsFnType = () => (filterTerm: string) => {
            return new Promise((resolve: (result: Array<contactType>) => void) => {
                api.getUsersAPI(false).getUsersInEnterprise(
                    itemID,
                    (response: UserCollection) => {
                        if (handleSuccess) {
                            handleSuccess();
                        }
                        return resolve(convertContactsResponse(response, currentUserID));
                    },
                    handleError,
                    filterTerm,
                );
            });
        };
        setGetContacts(updatedGetContactsFn);
    }, [api, currentUserID, getContacts, handleError, handleSuccess, itemID]);

    return getContacts;
}

export default useContacts;
