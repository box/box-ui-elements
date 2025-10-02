// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { FIELD_NAME, FIELD_PERMISSIONS } from '../../../constants';
import type { GroupCollection, GroupMini, UserCollection, UserMini } from '../../../common/types/core';
import type { ContentSharingHooksOptions, GetContactsFnType } from '../types';

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
    const { handleSuccess = noop, handleError = noop, transformGroups, transformUsers } = options;

    React.useEffect(() => {
        if (getContacts) return;

        const resolveAPICall = (
            resolve: (result: Array<Object>) => void,
            response: GroupCollection | UserCollection,
            transformFn: ?Function,
        ) => {
            handleSuccess(response);
            // A successful API call will always return an entries array, but we still need these checks for Flow purposes
            const entriesExist = response && response.entries && response.entries.length;
            if (transformFn && entriesExist) {
                return resolve(transformFn(response));
            }
            const emptyEntries: Array<any> = [];
            return resolve(response && response.entries ? response.entries : emptyEntries);
        };

        const updatedGetContactsFn: GetContactsFnType = () => (filterTerm: string) => {
            const getUsers = new Promise((resolve: (result: Array<UserMini>) => void) => {
                api.getMarkerBasedUsersAPI(false).getUsersInEnterprise(
                    itemID,
                    (response: UserCollection) => resolveAPICall(resolve, response, transformUsers),
                    handleError,
                    { filter_term: filterTerm },
                );
            });
            const getGroups = new Promise((resolve: (result: Array<GroupMini>) => void) => {
                api.getMarkerBasedGroupsAPI(false).getGroupsInEnterprise(
                    itemID,
                    (response: GroupCollection) => resolveAPICall(resolve, response, transformGroups),
                    handleError,
                    {
                        fields: [FIELD_NAME, FIELD_PERMISSIONS].toString(),
                        filter_term: filterTerm,
                    },
                );
            });
            return Promise.all([getUsers, getGroups]).then(contactArrays => [...contactArrays[0], ...contactArrays[1]]);
        };
        setGetContacts(updatedGetContactsFn);
    }, [api, getContacts, handleError, handleSuccess, itemID, transformGroups, transformUsers]);

    return getContacts;
}

export default useContacts;
