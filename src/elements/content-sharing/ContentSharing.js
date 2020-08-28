/**
 * @flow
 * @file ContentSharing Element
 * @description This is the top-level component for ContentSharing. It instantiates the API, which it then
 * passes to the SharingModal component either immediately (when no custom button is provided) or on
 * button click (when a custom button is provided).
 * @author Box
 */
import 'regenerator-runtime/runtime';
import * as React from 'react';
import API from '../../api';
import SharingModal from './SharingModal';
import { CLIENT_NAME_CONTENT_SHARING } from '../../constants';
import type { ItemType, StringMap } from '../../common/types/core';
import type { USMConfig } from '../../features/unified-share-modal/flowTypes';

import '../common/base.scss';
import '../common/fonts.scss';
import '../common/modal.scss';

type ContentSharingProps = {
    /** apiHost - API hostname. Defaults to https://api.box.com */
    apiHost: string,
    config?: USMConfig,
    /**
     * customButton - Clickable element for opening the SharingModal component.
     * This property should always be used in conjunction with displayInModal.
     */
    customButton?: React.Element<any>,
    /**
     * displayInModal - Whether the SharingModal component should be displayed in a modal.
     * If false, the SharingModal component will appear as a form within the surrounding page.
     * This property can be used with or without a customButton. If used without a customButton,
     * the modal will appear on page load. See ContentSharing.stories.js for examples.
     */
    displayInModal: boolean,
    /** itemID - Box file or folder ID */
    itemID: string,
    /** itemType - "file" or "folder" */
    itemType: ItemType,
    /** language - Language used for the element */
    language: string,
    /** messages - Localized strings used by the element */
    messages?: StringMap,
    /** token - Valid access token */
    token: string,
};

const createAPI = (apiHost, itemID, itemType, token) =>
    new API({
        apiHost,
        clientName: CLIENT_NAME_CONTENT_SHARING,
        id: `${itemType}_${itemID}`,
        token,
    });

function ContentSharing({
    apiHost,
    config,
    customButton,
    displayInModal,
    itemID,
    itemType,
    language,
    messages,
    token,
}: ContentSharingProps) {
    const [api, setAPI] = React.useState<API>(createAPI(apiHost, itemID, itemType, token));
    const [launchButton, setLaunchButton] = React.useState<React.Element<any> | null>(null);
    const [sharingModalInstance, setSharingModalInstance] = React.useState<React.Element<typeof SharingModal> | null>(
        customButton ? null : (
            <SharingModal
                api={api}
                config={config}
                displayInModal={false}
                itemID={itemID}
                itemType={itemType}
                language={language}
                messages={messages}
            />
        ),
    );

    // Reset the API if necessary
    React.useEffect(() => {
        setAPI(createAPI(apiHost, itemID, itemType, token));
    }, [apiHost, itemID, itemType, token]);

    // Reset state if the API has changed
    React.useEffect(() => {
        setSharingModalInstance(null);
        setLaunchButton(null);
    }, [api]);

    React.useEffect(() => {
        const createSharingModalInstance = () => {
            return (
                <SharingModal
                    api={api}
                    config={config}
                    displayInModal={displayInModal}
                    itemID={itemID}
                    itemType={itemType}
                    language={language}
                    messages={messages}
                />
            );
        };

        // Add an onClick function that instantiates SharingModal to the custom button
        if (customButton && !launchButton) {
            setLaunchButton(
                React.cloneElement(customButton, {
                    onClick: () => {
                        return setSharingModalInstance(createSharingModalInstance());
                    },
                }),
            );
        }

        // If there is no custom button, instantiate SharingModal
        if (!customButton && !sharingModalInstance) {
            setSharingModalInstance(createSharingModalInstance());
        }
    }, [
        api,
        config,
        sharingModalInstance,
        customButton,
        displayInModal,
        itemID,
        itemType,
        language,
        launchButton,
        messages,
    ]);

    return (
        <>
            {launchButton}
            {sharingModalInstance}
        </>
    );
}

export default ContentSharing;
