/**
 * @flow
 * @file ContentSharing Element
 * @description This is the top-level component for ContentSharing. It instantiates the API, which it then
 * passes to the SharingModal component either immediately (when no custom button is provided) or on
 * button click (when a custom button is provided).
 * @author Box
 */
import * as React from 'react';
import API from '../../api';
import SharingModal from './SharingModal';
import { CLIENT_NAME_CONTENT_SHARING } from '../../constants';
import type { ItemType } from '../../common/types/core';

type ContentSharingProps = {
    apiHost: string,
    customButton?: React.Element<any>,
    displayInModal: boolean,
    itemID: string,
    itemType: ItemType,
    language: string,
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
    customButton,
    displayInModal,
    itemID,
    itemType,
    language,
    token,
}: ContentSharingProps) {
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const [api, setAPI] = React.useState<API>(createAPI(apiHost, itemID, itemType, token));
    const [launchButton, setLaunchButton] = React.useState<React.Element<any> | null>(null);
    const [sharingModalInstance, setSharingModalInstance] = React.useState<React.Element<typeof SharingModal> | null>(
        customButton ? null : (
            <SharingModal api={api} displayInModal={false} itemID={itemID} itemType={itemType} language={language} />
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
        setIsOpen(true);
    }, [api]);

    React.useEffect(() => {
        const createSharingModalInstance = () => {
            setIsOpen(true);
            return (
                <SharingModal
                    api={api}
                    displayInModal={displayInModal}
                    itemID={itemID}
                    itemType={itemType}
                    language={language}
                    onRequestClose={() => setIsOpen(false)}
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
        if (!customButton && !sharingModalInstance && isOpen) {
            setSharingModalInstance(createSharingModalInstance());
        }

        // If the modal is closed, remove the SharingModal instance
        if (!isOpen) {
            setSharingModalInstance(null);
        }
    }, [api, sharingModalInstance, customButton, displayInModal, isOpen, itemID, itemType, language, launchButton]);

    return (
        <>
            {sharingModalInstance}
            {launchButton}
        </>
    );
}

export default ContentSharing;
