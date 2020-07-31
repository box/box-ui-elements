// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import type { SendInvitesFnType, UseInvitesOptions } from '../types';
import type { InviteCollaboratorsRequest } from '../../../features/unified-share-modal/flowTypes';
import type { ItemType } from '../../../common/types/core';

/**
 * Generate the sendInvites() function, which is used for inviting collaborators in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ItemType} itemType
 * @param {UseInvitesOptions} options
 */
function useInvites(api: API, itemID: string, itemType: ItemType, options: UseInvitesOptions) {
    const [sendInvites, setSendInvites] = React.useState<null | SendInvitesFnType>(null);
    const {
        handleSuccess = noop,
        handleError = noop,
        setIsLoading = noop,
        transformRequest,
        transformResponse = arg => arg,
    } = options;

    React.useEffect(() => {
        if (sendInvites) return;

        const itemData = {
            id: itemID,
            type: itemType,
        };
        const sendCollabRequest = collab => {
            setIsLoading(true);
            return api.getCollaborationsAPI(false).addCollaboration(
                itemData,
                collab,
                response => {
                    handleSuccess(response);
                    return transformResponse(response);
                },
                handleError,
            );
        };

        const createPostCollaborationFn: SendInvitesFnType = () => async (
            collabRequest: InviteCollaboratorsRequest,
        ) => {
            if (!transformRequest) return Promise.resolve(null);

            const { users, groups } = transformRequest(collabRequest);
            return Promise.all([
                users.map(user => sendCollabRequest(user)),
                groups.map(group => sendCollabRequest(group)),
            ]);
        };

        if (!sendInvites) {
            setSendInvites(createPostCollaborationFn);
        }
    }, [
        api,
        handleError,
        handleSuccess,
        itemID,
        itemType,
        sendInvites,
        setIsLoading,
        transformRequest,
        transformResponse,
    ]);

    return sendInvites;
}

export default useInvites;
