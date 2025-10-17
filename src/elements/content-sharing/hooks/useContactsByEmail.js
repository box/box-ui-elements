// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import type { UserCollection, UserMini } from '../../../common/types/core';
import type { ContactByEmailObject, ContentSharingHooksOptions, GetContactsByEmailFnType } from '../types';

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
    const { handleSuccess = noop, handleError = noop, isContentSharingV2Enabled, transformUsers } = options;

    React.useEffect(() => {
        if (getContactsByEmail) return;

        const resolveAPICall = (
            resolve: (result: ContactByEmailObject | Array<UserMini>) => void,
            response: UserCollection,
            transformFn: ?Function,
        ) => {
            handleSuccess(response);
            // A successful API call will always return an entries array, but we still need these checks for Flow purposes
            if (response && response.entries && response.entries.length) {
                return resolve(transformFn ? transformFn(response) : response.entries);
            }
            return resolve({});
        };

        const updatedGetContactsByEmailFn: GetContactsByEmailFnType =
            () => (filterTerm: { [emails: string]: string }) => {
                if (!filterTerm || !Array.isArray(filterTerm.emails) || !filterTerm.emails.length) {
                    return Promise.resolve({});
                }
                const parsedFilterTerm = filterTerm.emails[0];

                return new Promise((resolve: (result: ContactByEmailObject | Array<UserMini>) => void) => {
                    api.getMarkerBasedUsersAPI(false).getUsersInEnterprise(
                        itemID,
                        (response: UserCollection) => resolveAPICall(resolve, response, transformUsers),
                        handleError,
                        { filter_term: parsedFilterTerm },
                    );
                });
            };

        const getContactsByEmailV2 = () => email => {
            if (!email) {
                return Promise.resolve({});
            }

            return new Promise(resolve => {
                api.getMarkerBasedUsersAPI(false).getUsersInEnterprise(
                    itemID,
                    response => resolveAPICall(resolve, response, transformUsers),
                    handleError,
                    { filter_term: email },
                );
            });
        };

        isContentSharingV2Enabled
            ? setGetContactsByEmail(getContactsByEmailV2)
            : setGetContactsByEmail(updatedGetContactsByEmailFn);
    }, [api, getContactsByEmail, handleError, handleSuccess, isContentSharingV2Enabled, itemID, transformUsers]);

    return getContactsByEmail;
}

export default useContactsByEmail;
