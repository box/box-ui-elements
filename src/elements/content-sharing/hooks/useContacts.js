// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import type { UserCollection } from '../../../common/types/core';
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
    const { handleSuccess = noop, handleError = noop, transformResponse = arg => arg } = options;

    React.useEffect(() => {
        if (getContacts) return;

        const updatedGetContactsFn: GetContactsFnType = () => (filterTerm: string) => {
            return new Promise((resolve: (result: UserCollection | Array<contactType>) => void) => {
                api.getUsersAPI(false).getUsersInEnterprise(
                    itemID,
                    (response: UserCollection) => {
                        handleSuccess(response);
                        return resolve(transformResponse(response));
                    },
                    handleError,
                    filterTerm,
                );
            });
        };
        setGetContacts(updatedGetContactsFn);
    }, [api, getContacts, handleError, handleSuccess, itemID, transformResponse]);

    return getContacts;
}

export default useContacts;
