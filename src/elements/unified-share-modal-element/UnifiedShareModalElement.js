/**
 * @flow
 * @file Unified Share Modal Element
 * @author Box
 */
import React, { useCallback, useEffect, useState } from 'react';
import API from '../../api';
import Internationalize from '../common/Internationalize';
import UnifiedShareModal from '../../features/unified-share-modal';
import messages from '../../features/unified-share-modal/messages';
import { normalizeItemResponse, normalizeUserResponse } from './utils';
import {
    CLIENT_NAME_USM_ELEMENT,
    FIELD_ENTERPRISE,
    FIELD_HOSTNAME,
    FIELD_ID,
    FIELD_NAME,
    FIELD_TYPE,
    FIELD_SHARED_LINK,
    FIELD_SHARED_LINK_FEATURES,
    TYPE_FILE,
    TYPE_FOLDER,
    FIELD_PERMISSIONS,
    FIELD_EXTENSION,
    FIELD_OWNED_BY,
    FIELD_DESCRIPTION,
} from '../../constants';

type USMProps = {
    apiHost: string,
    currentUserID: string,
    itemID: string,
    itemType: TYPE_FILE | TYPE_FOLDER,
    language: string,
    showFormOnly: boolean,
    token: string,
};

function UnifiedShareModalElement(props: USMProps) {
    const { apiHost, currentUserID, itemID, itemType, language, token }: USMProps = props;
    const [item, setItem] = useState<{ item: BoxItem }>(null);
    const [sharedLink, setSharedLink] = useState<{ sharedLink: BoxItem }>(null);
    const [userDataReceived, setUserDataReceived] = useState<boolean>(false);

    const api = new API({
        apiHost,
        clientName: CLIENT_NAME_USM_ELEMENT,
        id: `${itemType}_usm`,
        token,
    });

    const getUserSuccess = useCallback(
        userEnterpriseData => {
            const normalizedUserEnterpriseData = normalizeUserResponse(userEnterpriseData);
            setSharedLink({ ...sharedLink, ...normalizedUserEnterpriseData });
            setUserDataReceived(true);
        },
        [setUserDataReceived, sharedLink],
    );

    const getUserData = useCallback(
        async (ownerID: string) => {
            await api.getUsersAPI().getUser(ownerID, getUserSuccess, null, {
                fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME],
            });
        },
        [api, getUserSuccess],
    );

    const getItemSuccess = itemData => {
        const { item: itemFromAPI, sharedLink: sharedLinkFromAPI } = normalizeItemResponse(itemData);
        setItem(itemFromAPI);
        setSharedLink(sharedLinkFromAPI);
    };

    const getItem = useCallback(async () => {
        if (itemType === TYPE_FILE) {
            await api.getFileAPI().getFile(itemID, getItemSuccess, null, {
                fields: [
                    FIELD_DESCRIPTION,
                    FIELD_EXTENSION,
                    FIELD_ID,
                    FIELD_NAME,
                    FIELD_OWNED_BY,
                    FIELD_PERMISSIONS,
                    FIELD_SHARED_LINK,
                    FIELD_SHARED_LINK_FEATURES,
                    FIELD_TYPE,
                ],
            });
        }

        if (itemType === TYPE_FOLDER) {
            await api.getFolderAPI().getFolderFields(getItemSuccess, null, null, {
                fields: [
                    FIELD_DESCRIPTION,
                    FIELD_EXTENSION,
                    FIELD_ID,
                    FIELD_NAME,
                    FIELD_OWNED_BY,
                    FIELD_PERMISSIONS,
                    FIELD_SHARED_LINK,
                    FIELD_SHARED_LINK_FEATURES,
                    FIELD_TYPE,
                ],
            });
        }
    }, [api, itemID, itemType]);

    useEffect(() => {
        if (!item && !sharedLink) {
            getItem();
        }

        if (item && sharedLink && !userDataReceived) {
            const { ownerID } = item;
            getUserData(ownerID);
        }
    }, [item, sharedLink, getItem, getUserData, userDataReceived]);

    return item && sharedLink ? (
        <Internationalize language={language} messages={messages}>
            <UnifiedShareModal
                collaboratorsList={[]}
                currentUserID={currentUserID}
                item={item}
                sharedLink={sharedLink}
                showFormOnly
            />
        </Internationalize>
    ) : null;
}

export default UnifiedShareModalElement;
