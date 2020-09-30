// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import type { UserMini, UserCollection } from '../../../common/types/core';
import type { ContentSharingHooksOptions, GetContactsByEmailFnType } from '../types';

/**
 * Generate the getContactsByEmail() function, which is used for looking up contacts added to the collaborators field in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ContentSharingHooksOptions} options
 * @returns {GetContactsByEmailFnType | null}
 */
function useContactsByEmail(
    api: API,
    itemID: string,
    options: ContentSharingHooksOptions,
): GetContactsByEmailFnType | null {
    const [getContactsByEmail, setGetContactsByEmail] = React.useState<null | GetContactsByEmailFnType>(null);
    const { handleSuccess = noop, handleError = noop, transformUsers } = options;

    React.useEffect(() => {
        if (getContactsByEmail) return;

        const resolveAPICall = (
            resolve: (result: Array<Object>) => void,
            response: UserCollection,
            transformFn: ?Function,
        ) => {
            handleSuccess(response);
            // A successful API call will always return an entries array, but we still need these checks for Flow purposes
            const entriesExist = response && response.entries && response.entries.length;
            if (transformFn && entriesExist) {
                return resolve(transformFn(response));
            }
            const emptyEntries: Object = {};
            return resolve(response && response.entries ? response.entries : emptyEntries);
        };

        const updatedGetContactsByEmailFn: GetContactsByEmailFnType = () => (filterTerm: {
            [emails: string]: string,
        }) => {
            if (!filterTerm || !filterTerm.emails || !Array.isArray(filterTerm.emails) || !filterTerm.emails.length) {
                return {};
            }
            const parsedFilterTerm = filterTerm.emails[0];

            return new Promise((resolve: (result: Array<UserMini>) => void) => {
                api.getMarkerBasedUsersAPI(false).getUsersInEnterprise(
                    itemID,
                    (response: UserCollection) => resolveAPICall(resolve, response, transformUsers),
                    handleError,
                    { filter_term: parsedFilterTerm },
                );
            });
        };
        setGetContactsByEmail(updatedGetContactsByEmailFn);
    }, [api, getContactsByEmail, handleError, handleSuccess, itemID, transformUsers]);

    return getContactsByEmail;
}

export default useContactsByEmail;
