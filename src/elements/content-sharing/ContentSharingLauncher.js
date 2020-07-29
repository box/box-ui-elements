/**
 * @flow
 * @file Launcher for the ContentSharing Element
 * @description This component enables ContentSharing to be instantiated via button click or as a form within the containing page.
 * @author Box
 */
import * as React from 'react';
import API from '../../api';
import ContentSharing from './ContentSharing';
import { CLIENT_NAME_CONTENT_SHARING } from '../../constants';

type ContentSharingLauncherProps = {
    apiHost: string,
    customButton?: React.ReactElement,
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

function ContentSharingLauncher({
    apiHost,
    displayInModal,
    itemID,
    itemType,
    language,
    token,
    customButton,
}: ContentSharingLauncherProps) {
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const [api, setAPI] = React.useState<API>(createAPI(apiHost, itemID, itemType, token));
    const [launchButton, setLaunchButton] = React.useState<React.ReactElement | null>(null);
    const [contentSharingInstance, setContentSharingInstance] = React.useState<React.ReactElement | null>(
        customButton ? null : (
            <ContentSharing api={api} displayInModal={false} itemID={itemID} itemType={itemType} language={language} />
        ),
    );

    // Reset the API if necessary
    React.useEffect(() => {
        setAPI(createAPI(apiHost, itemID, itemType, token));
    }, [apiHost, itemID, itemType, token]);

    // Reset state if the API has changed
    React.useEffect(() => {
        setContentSharingInstance(null);
    }, [api]);

    React.useEffect(() => {
        const createContentSharingInstance = () => {
            return (
                <ContentSharing
                    api={api}
                    displayInModal={displayInModal}
                    itemID={itemID}
                    itemType={itemType}
                    language={language}
                    onRequestClose={() => setIsOpen(false)}
                />
            );
        };

        // Add an onClick function that instantiates ContentSharing to the custom button
        if (customButton && !launchButton) {
            setLaunchButton(
                React.cloneElement(customButton, {
                    onClick: () => {
                        return setContentSharingInstance(createContentSharingInstance());
                    },
                }),
            );
        }

        // If there is no custom button, instantiate ContentSharing
        if (!customButton && !contentSharingInstance) {
            setContentSharingInstance(createContentSharingInstance());
        }

        // If the modal is closed, remove the ContentSharing instance
        if (!isOpen) {
            setContentSharingInstance(null);
        }
    }, [api, contentSharingInstance, customButton, displayInModal, isOpen, itemID, itemType, language, launchButton]);

    return (
        <>
            {contentSharingInstance}
            {launchButton}
        </>
    );
}

export default ContentSharingLauncher;
