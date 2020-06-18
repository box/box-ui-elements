/**
 * @flow
 * @file Unified Share Modal Element
 * @author Box
 */
import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import API from '../../api';
import Internationalize from '../common/Internationalize';
import ErrorMask from '../../components/error-mask/ErrorMask';
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
    FIELD_DESCRIPTION,
} from '../../constants';
import type { ItemType } from '../../common/types/core';
import type { item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type { USMElementItemAPIResponse, USMElementSharedLinkType } from './types';

type USMElementProps = {
    apiHost: string,
    itemID: string,
    itemType: ItemType,
    language: string,
    showFormOnly?: boolean,
    token: string,
};

const elementMessages = defineMessages({
    loadingError: {
        defaultMessage: 'Could not load shared link for this item.',
        description: 'Message that appears when the USM cannot be loaded.',
        id: 'be.usm.loadingError',
    },
});

function UnifiedShareModalElement(props: USMElementProps) {
    const { apiHost, itemID, itemType, language, token }: USMElementProps = props;
    const [item, setItem] = useState<?itemFlowType>(null);
    const [sharedLink, setSharedLink] = useState<?USMElementSharedLinkType>(null);
    const [currentUserID, setCurrentUserID] = useState<?string>(null);
    const [errorExists, setErrorExists] = useState<boolean>(false);

    const api = new API({
        apiHost,
        clientName: CLIENT_NAME_USM_ELEMENT,
        id: `${itemType}_usm`,
        token,
    });

    const resetState = useCallback(() => {
        setItem(null);
        setSharedLink(null);
        setCurrentUserID(null);
    }, [setItem, setSharedLink, setCurrentUserID]);

    const getError = useCallback(() => {
        setErrorExists(true);
    }, [setErrorExists]);

    const getUserSuccess = useCallback(
        userData => {
            const { id, userEnterpriseData } = normalizeUserResponse(userData);
            setSharedLink({ ...sharedLink, ...userEnterpriseData });
            setCurrentUserID(id);
            setErrorExists(false);
        },
        [sharedLink],
    );
    const getItemSuccess = (itemData: USMElementItemAPIResponse) => {
        const { item: itemFromAPI, sharedLink: sharedLinkFromAPI } = normalizeItemResponse(itemData);
        setItem(itemFromAPI);
        setSharedLink(sharedLinkFromAPI);
        setErrorExists(false);
    };

    useEffect(() => {
        resetState();
    }, [resetState, token, itemID, itemType]);

    useEffect(() => {
        const getUserData = async () => {
            await api.getUsersAPI(false).getUser(itemID, getUserSuccess, getError, {
                fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME],
            });
        };
        if (item && sharedLink && !currentUserID) {
            getUserData();
        }
    });

    useEffect(() => {
        const getItem = async () => {
            if (itemType === TYPE_FILE) {
                await api.getFileAPI().getFile(itemID, getItemSuccess, getError, {
                    fields: [
                        FIELD_DESCRIPTION,
                        FIELD_EXTENSION,
                        FIELD_ID,
                        FIELD_NAME,
                        FIELD_PERMISSIONS,
                        FIELD_SHARED_LINK,
                        FIELD_SHARED_LINK_FEATURES,
                        FIELD_TYPE,
                    ],
                });
            }

            if (itemType === TYPE_FOLDER) {
                await api.getFolderAPI().getFolderFields(itemID, getItemSuccess, getError, {
                    fields: [
                        FIELD_DESCRIPTION,
                        FIELD_EXTENSION,
                        FIELD_ID,
                        FIELD_NAME,
                        FIELD_PERMISSIONS,
                        FIELD_SHARED_LINK,
                        FIELD_SHARED_LINK_FEATURES,
                        FIELD_TYPE,
                    ],
                });
            }
        };

        if (!item && !sharedLink) {
            getItem();
        }
    }, [api, getError, item, itemID, itemType, sharedLink, currentUserID]);

    const renderElement = () => {
        if (errorExists) {
            return <ErrorMask errorHeader={<FormattedMessage {...elementMessages.loadingError} />} />;
        }

        if (item && sharedLink) {
            return (
                <Internationalize language={language} messages={messages}>
                    <UnifiedShareModal
                        canInvite={sharedLink.canInvite}
                        collaboratorsList={{ collaborators: [] }}
                        currentUserID={currentUserID}
                        getCollaboratorContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        getSharedLinkContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        initialDataReceived
                        item={item}
                        sharedLink={sharedLink}
                        showFormOnly
                    />
                </Internationalize>
            );
        }

        return null;
    };

    return renderElement();
}

export default UnifiedShareModalElement;
