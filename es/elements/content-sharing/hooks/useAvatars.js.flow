// @flow

import * as React from 'react';
import API from '../../../api';
import type { Collaboration, Collaborations } from '../../../common/types/core';
import type { AvatarURLMap } from '../types';

/**
 * Generate a map of avatar URLs, which are used to display collaborators in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {Collaborations | null} collaboratorsList
 * @returns {AvatarURLMap | null}
 */
function useAvatars(api: API, itemID: string, collaboratorsList: Collaborations | null): AvatarURLMap | null {
    const [avatarURLMap, setAvatarURLMap] = React.useState<AvatarURLMap | null>(null);

    React.useEffect(() => {
        if (avatarURLMap || !collaboratorsList || !collaboratorsList.entries) return;

        const usersAPI = api.getUsersAPI(false);

        (async () => {
            const retrievedAvatarURLMap: AvatarURLMap = {};
            const entries = collaboratorsList ? collaboratorsList.entries : []; // needed for Flow
            await Promise.all(
                entries.map(async (collab: Collaboration) => {
                    if (!collab || !collab.accessible_by) return;
                    const {
                        accessible_by: { id: userID },
                    } = collab;
                    const url = await usersAPI.getAvatarUrlWithAccessToken(userID.toString(), itemID);
                    retrievedAvatarURLMap[userID] = url;
                }),
            );
            setAvatarURLMap(retrievedAvatarURLMap);
        })();
    }, [api, avatarURLMap, collaboratorsList, itemID]);

    return avatarURLMap;
}

export default useAvatars;
