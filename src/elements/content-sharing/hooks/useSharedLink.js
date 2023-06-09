// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { ACCESS_NONE, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import type { BoxItemPermission, ItemType } from '../../../common/types/core';
import type {
    ConnectToItemShareFnType,
    ContentSharingHooksOptions,
    SharedLinkUpdateLevelFnType,
    SharedLinkUpdateSettingsFnType,
} from '../types';

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

    /**
     * Storing the access level in a ref allows us to update settings, which depend on the access level, in the following potential scenarios:
     * - After changing the shared link's access level
     * - After removing and recreating the shared link
     */
    const currentAccessLevel = React.useRef(accessLevel);

    const {
        handleRemoveSharedLinkError = noop,
        handleRemoveSharedLinkSuccess = arg => arg,
        handleUpdateSharedLinkError = noop,
        handleUpdateSharedLinkSuccess = arg => arg,
        setIsLoading = noop,
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
        const connectToItemShare: ConnectToItemShareFnType = ({
            access,
            requestOptions = CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            successFn = handleUpdateSharedLinkSuccess,
            errorFn = handleUpdateSharedLinkError,
        }) => {
            setIsLoading(true);
            return itemAPIInstance.share(itemData, access, successFn, errorFn, requestOptions);
        };

        /**
         * Set the shared link creation function.
         *
         * The backend will determine the default access level for the shared link, so we should not pass a value for "access."
         * The "open" and "company" access levels may be disabled due to certain policies, and attempting to set a disabled
         * access level will throw a 400. The only access level that we can reliably set is "collaborators," but defaulting
         * to that level diverges from existing shared link creation behavior in the WebApp.
         *
         * After a shared link is successfully created, we save the access level from the API response into our ref.
         */
        const updatedOnAddLinkFn: SharedLinkUpdateLevelFnType = () => () =>
            connectToItemShare({
                successFn: data => {
                    const {
                        shared_link: { access },
                    } = data;
                    currentAccessLevel.current = access;
                    handleUpdateSharedLinkSuccess(data);
                },
            });
        setOnAddLink(updatedOnAddLinkFn);

        // Shared link removal function
        const updatedOnRemoveLinkFn: SharedLinkUpdateLevelFnType = () => () =>
            connectToItemShare({
                access: ACCESS_NONE,
                successFn: handleRemoveSharedLinkSuccess,
                errorFn: handleRemoveSharedLinkError,
            });
        setOnRemoveLink(updatedOnRemoveLinkFn);

        // Shared link access level change function
        const updatedChangeSharedLinkAccessLevelFn: SharedLinkUpdateLevelFnType = () => (newAccessLevel: string) =>
            connectToItemShare({
                // $FlowFixMe
                access: transformAccess(newAccessLevel),
                successFn: data => {
                    currentAccessLevel.current = newAccessLevel;
                    handleUpdateSharedLinkSuccess(data);
                },
            });
        setChangeSharedLinkAccessLevel(updatedChangeSharedLinkAccessLevelFn);

        // Create functions that update shared link settings aside from the access level
        const connectToUpdateSharedLink = (newSharedLinkData: Object) => {
            setIsLoading(true);
            return itemAPIInstance.updateSharedLink(
                itemData,
                newSharedLinkData,
                handleUpdateSharedLinkSuccess,
                handleUpdateSharedLinkError,
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        };

        // Shared link permission level change function
        const updatedChangeSharedLinkPermissionLevelFn: SharedLinkUpdateLevelFnType = () => (
            newSharedLinkPermissionLevel: string,
        ) => connectToUpdateSharedLink({ permissions: transformPermissions(newSharedLinkPermissionLevel) });
        setChangeSharedLinkPermissionLevel(updatedChangeSharedLinkPermissionLevelFn);

        /**
         * Set the shared link settings update function. This is currently used in the Shared Link Settings Modal,
         * but it may also be used to update any settings not covered by the above functions.
         */
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
        handleRemoveSharedLinkSuccess,
        transformAccess,
        accessLevel,
        transformPermissions,
        transformSettings,
        currentAccessLevel,
        api,
        setIsLoading,
        handleRemoveSharedLinkError,
        handleUpdateSharedLinkError,
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
