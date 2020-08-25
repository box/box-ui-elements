// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import type { ContentSharingHooksOptions, GetAvatarsFnType } from '../types';

/**
 * Generate the getAvatars() function, which is used for retrieving potential collaborators in the USM.
 *
 * @param {API} api
 * @param {collaboratorsList}
 * @returns {GetAvatarsFnType | null}
 */
function useAvatars(
    api: API,
    itemID,
    collaboratorsList,
    options: ContentSharingHooksOptions = {},
): GetAvatarsFnType | null {
    const [avatars, setAvatars] = React.useState<null | GetAvatarsFnType>(null);
    const { handleSuccess = noop, handleError = noop } = options;

    React.useEffect(() => {
        if (avatars || !collaboratorsList || !collaboratorsList.entries) return;
        const usersAPI = api.getUsersAPI(false);

        (async () => {
            const idToAvatarMap = {};
            await Promise.all(
                collaboratorsList.entries.map(async collab => {
                    if (!collab || !collab.accessible_by) return null;
                    const {
                        accessible_by: { id: userID },
                    } = collab;
                    const url = await usersAPI.getAvatarUrlWithAccessToken(userID, itemID);
                    idToAvatarMap[userID] = url;
                    return null;
                }),
            );
            setAvatars(idToAvatarMap);
        })();
    }, [api, avatars, collaboratorsList, handleError, handleSuccess, itemID]);

    return avatars;
}

export default useAvatars;
