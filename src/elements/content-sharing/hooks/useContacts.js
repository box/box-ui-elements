// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import type { GroupCollection, UserCollection } from '../../../common/types/core';
import type { ContentSharingHooksOptions, GetContactsFnType } from '../types';
import type { contactType } from '../../../features/unified-share-modal/flowTypes';

/**
 * Generate the getContacts() function, which is used for retrieving potential collaborators in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ContentSharingHooksOptions} options
 * @returns {GetContactsFnType | null}
 */
function useContacts(api: API, itemID: string, options: ContentSharingHooksOptions): GetContactsFnType | null {
    const [getContacts, setGetContacts] = React.useState<null | GetContactsFnType>(null);
    const { handleSuccess = noop, handleError = noop, transformResponse } = options;

    React.useEffect(() => {
        if (getContacts) return;

        const updatedGetContactsFn: GetContactsFnType = () => (filterTerm: string) => {
            const getUsers = new Promise((resolve: (result: UserCollection | Array<contactType>) => void) => {
                api.getUsersAPI(false).getUsersInEnterprise(
                    itemID,
                    (response: UserCollection) => {
                        handleSuccess(response);
                        if (transformResponse && response.entries.length) {
                            return resolve(transformResponse(response));
                        }
                        return resolve(response.entries); // a successful API call will always return an entries array
                    },
                    handleError,
                    filterTerm,
                );
            });
            const getGroups = new Promise((resolve: (result: GroupCollection | Array<contactType>) => void) => {
                api.getGroupsAPI(false).getGroupsInEnterprise(
                    itemID,
                    (response: GroupCollection) => {
                        handleSuccess(response);
                        return resolve(response.entries);
                    },
                    handleError,
                    filterTerm,
                );
            });
            return Promise.all([getUsers, getGroups]).then(contactArrays => [...contactArrays[0], ...contactArrays[1]]);
        };
        setGetContacts(updatedGetContactsFn);
    }, [api, getContacts, handleError, handleSuccess, itemID, transformResponse]);

    return getContacts;
}

export default useContacts;
