// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { ACCESS_COLLAB, ACCESS_NONE, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import type { RequestOptions } from '../../../common/types/api';
import type { BoxItemPermission, ItemType } from '../../../common/types/core';
import type { ContentSharingHooksOptions, SharedLinkUpdateLevelFnType, SharedLinkUpdateSettingsFnType } from '../types';

/**
 * Generate CRUD functions for shared links.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ItemType} itemType
 * @param {BoxItemPermission} permissions
 * @param {string} accessLevel
 * @param {ContentSharingHooksOptions} [options]
 */
function useSharedLink(
    api: API,
    itemID: string,
    itemType: ItemType,
    permissions: ?BoxItemPermission,
    accessLevel: string,
    options: ContentSharingHooksOptions = {},
) {
    const [onAddLink, setOnAddLink] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [onRemoveLink, setOnRemoveLink] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [
        changeSharedLinkAccessLevel,
        setChangeSharedLinkAccessLevel,
    ] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [
        changeSharedLinkPermissionLevel,
        setChangeSharedLinkPermissionLevel,
    ] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [onSubmitSettings, setOnSubmitSettings] = React.useState<null | SharedLinkUpdateSettingsFnType>(null);
    const [generatedFunctions, setGeneratedFunctions] = React.useState<boolean>(false);

    // Storing the access level in a ref allows us to update settings, which depend on the access level, after potentially updating the access level
    const currentAccessLevel = React.useRef(accessLevel);

    const {
        handleError = noop,
        handleRemoveSharedLinkSuccess = arg => arg,
        handleUpdateSharedLinkSuccess = arg => arg,
        transformAccess = arg => arg,
        transformPermissions = arg => arg,
        transformSettings = (data, access) => data, // eslint-disable-line no-unused-vars
    } = options;

    React.useEffect(() => {
        if (!permissions || generatedFunctions) return;

        const itemData = {
            id: itemID,
            permissions,
        };

        let itemAPIInstance;

        if (itemType === TYPE_FILE) {
            itemAPIInstance = api.getFileAPI();
        } else if (itemType === TYPE_FOLDER) {
            itemAPIInstance = api.getFolderAPI();
        }

        // Create functions that alter the access level of a shared link
        const connectToItemShare = (
            accessType: string,
            requestOptions?: RequestOptions = CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            successFn?: Function = handleUpdateSharedLinkSuccess,
        ) => {
            return itemAPIInstance.share(itemData, accessType, successFn, handleError, requestOptions);
        };

        const updatedOnAddLinkFn: SharedLinkUpdateLevelFnType = () => () => connectToItemShare(ACCESS_COLLAB);
        setOnAddLink(updatedOnAddLinkFn);

        const updatedOnRemoveLinkFn: SharedLinkUpdateLevelFnType = () => () =>
            connectToItemShare(ACCESS_NONE, undefined, handleRemoveSharedLinkSuccess);
        setOnRemoveLink(updatedOnRemoveLinkFn);

        const updatedChangeSharedLinkAccessLevelFn: SharedLinkUpdateLevelFnType = () => (newAccessLevel: string) =>
            connectToItemShare(transformAccess(newAccessLevel), undefined, data => {
                currentAccessLevel.current = newAccessLevel;
                handleUpdateSharedLinkSuccess(data);
            });
        setChangeSharedLinkAccessLevel(updatedChangeSharedLinkAccessLevelFn);

        const connectToUpdateSharedLink = (newSharedLinkData: Object) => {
            return itemAPIInstance.updateSharedLink(
                itemData,
                newSharedLinkData,
                handleUpdateSharedLinkSuccess,
                handleError,
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        };

        const updatedChangeSharedLinkPermissionLevelFn: SharedLinkUpdateLevelFnType = () => (
            newSharedLinkPermissionLevel: string,
        ) => connectToUpdateSharedLink({ permissions: transformPermissions(newSharedLinkPermissionLevel) });
        setChangeSharedLinkPermissionLevel(updatedChangeSharedLinkPermissionLevelFn);

        const updatedOnSubmitSettingsFn: SharedLinkUpdateSettingsFnType = () => newSettings =>
            connectToUpdateSharedLink(transformSettings(newSettings, currentAccessLevel.current));
        setOnSubmitSettings(updatedOnSubmitSettingsFn);

        setGeneratedFunctions(true);
    }, [
        permissions,
        generatedFunctions,
        itemID,
        itemType,
        handleUpdateSharedLinkSuccess,
        handleError,
        handleRemoveSharedLinkSuccess,
        transformAccess,
        accessLevel,
        transformPermissions,
        transformSettings,
        currentAccessLevel,
        api,
    ]);

    return {
        changeSharedLinkAccessLevel,
        changeSharedLinkPermissionLevel,
        onAddLink,
        onRemoveLink,
        onSubmitSettings,
    };
}

export default useSharedLink;
