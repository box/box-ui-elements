// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../../api';
import {
    convertItemResponse,
    convertSharedLinkPermissions,
    convertSharedLinkSettings,
    USM_TO_API_ACCESS_LEVEL_MAP,
} from '../../../features/unified-share-modal/utils/convertData';
import { ACCESS_COLLAB, ACCESS_NONE, STATUS_ERROR, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import contentSharingMessages from '../messages';
import type { RequestOptions } from '../../../common/types/api';
import type { BoxItemPermission, Collaborations, ItemType, NotificationType } from '../../../common/types/core';
import type { item as itemFlowType } from '../../../features/unified-share-modal/flowTypes';
import type { ContentSharingItemAPIResponse, ContentSharingSharedLinkType, SharedLinkUpdateFnType } from '../types';

// Generate shared link CRUD functions for the item
function useSharedLink(
    api: API,
    itemID: string,
    itemType: ItemType,
    sharedLink: any,
    permissions: ?BoxItemPermission,
    setItem: ((item: itemFlowType | null) => itemFlowType) => void,
    setSharedLink: ((sharedLink: ContentSharingSharedLinkType | null) => ContentSharingSharedLinkType) => void,
    options,
) {
    const { handleError, handleSuccess } = options;
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

    React.useEffect(() => {
        if (!permissions || generatedFunctions) return;

        // Handle successful PUT requests to /files or /folders
        const handleUpdateItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
            setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
            setSharedLink((prevSharedLink: ContentSharingSharedLinkType | null) => ({
                ...prevSharedLink,
                ...updatedSharedLink,
            }));
            handleSuccess();
        };

        const handleRemoveSharedLinkSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
            setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
            setSharedLink(() => updatedSharedLink);
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
            createSharedLinkAPIConnection(USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel]);
        setChangeSharedLinkAccessLevel(updatedChangeSharedLinkAccessLevelFn);

        const updatedChangeSharedLinkPermissionLevelFn: SharedLinkUpdateFnType = () => (
            newSharedLinkPermissionLevel: string,
        ) => {
            return itemAPIInstance.updateSharedLink(
                itemData,
                {
                    permissions: convertSharedLinkPermissions(newSharedLinkPermissionLevel),
                },
                handleUpdateItemSuccess,
                handleError,
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        };
        setChangeSharedLinkPermissionLevel(updatedChangeSharedLinkPermissionLevelFn);

        const updatedOnSubmitSettingsFn = () => newSettings => {
            const { serverURL } = sharedLink;
            return itemAPIInstance.updateSharedLink(
                itemData,
                convertSharedLinkSettings(newSettings, serverURL),
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
