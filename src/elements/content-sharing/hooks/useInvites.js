// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import type { ContentSharingHooksOptions } from '../types';
import type { InviteCollaboratorsRequest } from '../../../features/unified-share-modal/flowTypes';
import type { ItemType } from '../../common/types/core';

/**
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ItemType} itemType
 * @param {ContentSharingHooksOptions} options
 */
function useInvites(api: API, itemID: string, itemType: ItemType, options: ContentSharingHooksOptions) {
    const [sendInvites, setSendInvites] = React.useState<null | Function>(null);
    const {
        handleSuccess = noop,
        handleError = noop,
        transformRequest = arg => arg,
        transformResponse = arg => arg,
    } = options;

    React.useEffect(() => {
        if (sendInvites) return;

        const itemData = {
            id: itemID,
            type: itemType,
        };
        const sendCollabRequest = collab =>
            api.getCollaborationsAPI().addCollaboration(
                itemData,
                collab,
                response => {
                    handleSuccess(response);
                    return transformResponse(response);
                },
                handleError,
            );

        const createPostCollaborationFn = () => async (collabRequest: InviteCollaboratorsRequest) => {
            const { users, groups } = transformRequest(collabRequest);
            if (!users || !groups) return;
            await Promise.all([
                users.map(user => sendCollabRequest(user)),
                groups.map(group => sendCollabRequest(group)),
            ]);
        };

        if (!sendInvites) {
            setSendInvites(createPostCollaborationFn);
        }
    }, [api, handleError, handleSuccess, itemID, itemType, sendInvites, transformRequest, transformResponse]);

    return sendInvites;
}

export default useInvites;
