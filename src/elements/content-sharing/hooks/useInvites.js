// @flow

import React, { useState } from 'react';
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
    const [sendInvites, setSendInvites] = useState<null | SendInvitesFnType>(null);
    const {
        collaborators,
        handleSuccess = noop,
        handleError = noop,
        isContentSharingV2Enabled,
        setIsLoading = noop,
        transformRequest,
        transformResponse = arg => arg,
    } = options;

    React.useEffect(() => {
        if (sendInvites || (isContentSharingV2Enabled && !collaborators)) return;

        const itemData = {
            id: itemID,
            type: itemType,
        };

        const sendCollabRequest = collab => {
            setIsLoading(true);
            return new Promise((resolve, reject) => {
                api.getCollaborationsAPI(false).addCollaboration(
                    itemData,
                    collab,
                    response => {
                        handleSuccess(response);
                        resolve(transformResponse(response));
                    },
                    error => {
                        handleError(error);
                        reject(error);
                    },
                );
            }).finally(() => setIsLoading(false));
        };

        const createPostCollaborationFn: SendInvitesFnType =
            () => async (collabRequest: InviteCollaboratorsRequest) => {
                if (!transformRequest) return Promise.resolve(null);

                const { users, groups } = transformRequest(collabRequest);
                return Promise.all([
                    ...users.map(user => sendCollabRequest(user)),
                    ...groups.map(group => sendCollabRequest(group)),
                ]);
            };

        if (!sendInvites) {
            setSendInvites(createPostCollaborationFn);
        }
    }, [
        api,
        collaborators,
        handleError,
        handleSuccess,
        isContentSharingV2Enabled,
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
