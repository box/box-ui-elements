import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { UserCollection, UserMini } from '../../../common/types/core';
import { ContactByEmailObject, ContentSharingHooksOptions, GetContactsByEmailFnType } from '../types';

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
            resolve: (result: ContactByEmailObject | Array<UserMini>) => void,
            response: UserCollection,
            transformFn?: (response: UserCollection) => ContactByEmailObject | Array<UserMini>,
        ): void => {
            handleSuccess(response);
            // A successful API call will always return an entries array, but we still need these checks for type safety
            if (response?.entries?.length) {
                return resolve(transformFn ? transformFn(response) : response.entries);
            }
            return resolve({} as ContactByEmailObject);
        };

        const updatedGetContactsByEmailFn: GetContactsByEmailFnType =
            () =>
            (filterTerm: { emails: string[] }): Promise<ContactByEmailObject | Array<UserMini>> => {
                if (!filterTerm || !Array.isArray(filterTerm.emails) || !filterTerm.emails.length) {
                    return Promise.resolve({} as ContactByEmailObject);
                }
                const parsedFilterTerm = filterTerm.emails[0];

                interface UsersAPI {
                    getUsersInEnterprise: (
                        itemID: string,
                        successCallback: (response: UserCollection) => void,
                        errorCallback: () => void,
                        options: { filter_term: string },
                    ) => void;
                }
                return new Promise<ContactByEmailObject | Array<UserMini>>(resolve => {
                    const usersAPI = api.getMarkerBasedUsersAPI(false) as UsersAPI;
                    usersAPI.getUsersInEnterprise(
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
