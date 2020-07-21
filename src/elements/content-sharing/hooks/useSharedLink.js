// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { ACCESS_COLLAB, ACCESS_NONE, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import type { RequestOptions } from '../../../common/types/api';
import type { BoxItemPermission, ItemType } from '../../../common/types/core';
import type { item as itemFlowType } from '../../../features/unified-share-modal/flowTypes';
import type { ContentSharingItemAPIResponse, ContentSharingSharedLinkType, SharedLinkUpdateFnType } from '../types';

/**
 *
 * @param {*} api
 * @param {*} itemID
 * @param {*} itemType
 * @param {*} sharedLink
 * @param {*} permissions
 * @param {*} setItem
 * @param {any}
 * @param {*} setSharedLink
 * @param {any}
 * @param {*} [responseHandlers]
 * @param {*} [transformationHandlers]
 */
function useSharedLink(
    api: API,
    itemID: string,
    itemType: ItemType,
    sharedLink: any,
    permissions: ?BoxItemPermission,
    setItem: ((item: itemFlowType | null) => itemFlowType) => void,
    setSharedLink: ((sharedLink: ContentSharingSharedLinkType | null) => ContentSharingSharedLinkType) => void,
    responseHandlers = {},
    transformationHandlers = {},
) {
    const [onAddLink, setOnAddLink] = React.useState<null | SharedLinkUpdateFnType>(null);
    const [onRemoveLink, setOnRemoveLink] = React.useState<null | SharedLinkUpdateFnType>(null);
    const [changeSharedLinkAccessLevel, setChangeSharedLinkAccessLevel] = React.useState<null | SharedLinkUpdateFnType>(
        null,
    );
    const [
        changeSharedLinkPermissionLevel,
        setChangeSharedLinkPermissionLevel,
    ] = React.useState<null | SharedLinkUpdateFnType>(null);
    const [onSubmitSettings, setOnSubmitSettings] = React.useState<null | Function>(null);
    const [generatedFunctions, setGeneratedFunctions] = React.useState<boolean>(false);
    const { handleError = noop, handleSuccess = noop } = responseHandlers;
    const {
        transformAccess = arg => arg,
        transformItem = arg => arg,
        transformPermissions = arg => arg,
        transformSettings = arg => arg,
    } = transformationHandlers;

    React.useEffect(() => {
        if (!permissions || generatedFunctions) return;

        // Handle successful PUT requests to /files or /folders
        const handleUpdateItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = transformItem(itemData);
            setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
            setSharedLink((prevSharedLink: ContentSharingSharedLinkType | null) => ({
                ...prevSharedLink,
                ...updatedSharedLink,
            }));
            handleSuccess();
        };

        const handleRemoveSharedLinkSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = transformItem(itemData);
            setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
            setSharedLink(() => updatedSharedLink);
            handleSuccess();
        };

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

        const createSharedLinkAPIConnection = (
            accessType: string,
            requestOptions?: RequestOptions = CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            successFn?: (itemData: ContentSharingItemAPIResponse) => void = handleUpdateItemSuccess,
        ) => {
            return itemAPIInstance.share(itemData, accessType, successFn, handleError, requestOptions);
        };

        const updatedOnAddLinkFn: SharedLinkUpdateFnType = () => () => createSharedLinkAPIConnection(ACCESS_COLLAB);
        setOnAddLink(updatedOnAddLinkFn);

        const updatedOnRemoveLinkFn: SharedLinkUpdateFnType = () => () =>
            createSharedLinkAPIConnection(ACCESS_NONE, undefined, handleRemoveSharedLinkSuccess);
        setOnRemoveLink(updatedOnRemoveLinkFn);

        const updatedChangeSharedLinkAccessLevelFn: SharedLinkUpdateFnType = () => (newAccessLevel: string) =>
            createSharedLinkAPIConnection(transformAccess(newAccessLevel));
        setChangeSharedLinkAccessLevel(updatedChangeSharedLinkAccessLevelFn);

        const updatedChangeSharedLinkPermissionLevelFn: SharedLinkUpdateFnType = () => (
            newSharedLinkPermissionLevel: string,
        ) => {
            return itemAPIInstance.updateSharedLink(
                itemData,
                {
                    permissions: transformPermissions(newSharedLinkPermissionLevel),
                },
                handleUpdateItemSuccess,
                handleError,
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        };
        setChangeSharedLinkPermissionLevel(updatedChangeSharedLinkPermissionLevelFn);

        const updatedOnSubmitSettingsFn = () => newSettings => {
            return itemAPIInstance.updateSharedLink(
                itemData,
                transformSettings(newSettings),
                handleUpdateItemSuccess,
                handleError,
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        };
        setOnSubmitSettings(updatedOnSubmitSettingsFn);

        setGeneratedFunctions(true);
    }, [
        api,
        generatedFunctions,
        handleError,
        handleSuccess,
        itemID,
        itemType,
        permissions,
        setItem,
        setSharedLink,
        sharedLink,
        transformAccess,
        transformItem,
        transformPermissions,
        transformSettings,
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
