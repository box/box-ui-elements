import type { FetchedAvatarUrls, UserContactType } from '@box/user-selector';
import type {
    FetchAvatarUrls,
    FetchUsers,
} from '@box/metadata-editor/lib/components/metadata-editor-fields/components/metadata-user-field/types.js';

import type API from '../../../api';
import type { GroupCollection, GroupMini, UserCollection, UserMini } from '../../../common/types/core';

/**
 * Maps an enterprise user or group to the `UserContactType` shape expected by the metadata
 * user field from `@box/metadata-editor`. `value` carries the real id (it becomes the
 * submitted field value), while the numeric `id` is only used by `@box/user-selector`
 * internally (e.g. avatar initials color), so non-numeric ids collapse to 0.
 */
export const mapToUserContact = (item: UserMini | GroupMini): UserContactType => ({
    email: item.type === 'user' ? item.email ?? item.login ?? '' : '',
    id: Number(item.id) || 0,
    name: item.name,
    type: item.type,
    value: item.id,
});

/**
 * Creates the `FetchUsers` prop for the metadata user field. Searches enterprise users and
 * groups in parallel (same pattern as `useContacts` in content-sharing) and merges both into
 * a single contact list. A failed leg resolves to an empty list so the picker degrades to
 * "no results" instead of breaking when e.g. the groups endpoint errors.
 */
export const createFetchUsers =
    (api: API, fileId: string): FetchUsers =>
    (inputValue: string): Promise<UserContactType[]> => {
        const usersPromise = new Promise<Array<UserMini>>(resolve => {
            api.getMarkerBasedUsersAPI(false).getUsersInEnterprise(
                fileId,
                (response: UserCollection) => resolve(response.entries ?? []),
                () => resolve([]),
                { filter_term: inputValue },
            );
        });

        const groupsPromise = new Promise<Array<GroupMini>>(resolve => {
            api.getMarkerBasedGroupsAPI(false).getGroupsInEnterprise(
                fileId,
                (response: GroupCollection) => resolve(response.entries ?? []),
                () => resolve([]),
                { filter_term: inputValue },
            );
        });

        return Promise.all([usersPromise, groupsPromise]).then(([users, groups]) =>
            [...users, ...groups].map(mapToUserContact),
        );
    };

/**
 * Creates the `FetchAvatarUrls` prop for the metadata user field. Resolves avatar URLs with
 * an access token attached (cached per user by the Users API) for the given contacts, keyed
 * by contact id. Groups and contacts whose avatar cannot be resolved are omitted from the
 * map — the selector falls back to initials for missing keys.
 */
export const createFetchAvatarUrls =
    (api: API, fileId: string): FetchAvatarUrls =>
    async (userContacts: UserContactType[]): Promise<FetchedAvatarUrls> => {
        const usersApi = api.getUsersAPI(false);
        const avatarUrlMap: FetchedAvatarUrls = {};

        await Promise.all(
            userContacts
                .filter(contact => contact.type !== 'group')
                .map(async contact => {
                    try {
                        const avatarUrl = await usersApi.getAvatarUrlWithAccessToken(contact.value, fileId);

                        if (avatarUrl) {
                            avatarUrlMap[contact.value] = avatarUrl;
                        }
                    } catch {
                        // A missing avatar is not an error state - the selector renders initials instead.
                    }
                }),
        );

        return avatarUrlMap;
    };
