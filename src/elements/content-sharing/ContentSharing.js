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
// $FlowFixMe
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import { isFeatureEnabled } from '../common/feature-checking';
import SharingModal from './SharingModal';
// $FlowFixMe
import ContentSharingV2 from './ContentSharingV2';
import { CLIENT_NAME_CONTENT_SHARING, CLIENT_VERSION, DEFAULT_HOSTNAME_API } from '../../constants';

import type { ItemType, StringMap } from '../../common/types/core';
import type { USMConfig } from '../../features/unified-share-modal/flowTypes';
import type { FeatureConfig } from '../common/feature-checking';

import '../common/base.scss';
import '../common/fonts.scss';
import '../common/modal.scss';

type ContentSharingProps = {
    /** apiHost - API hostname. Defaults to https://api.box.com */
    apiHost: string,
    /** children - Children for the element to open the Unified Share Modal */
    children?: React.Element<any>,
    /** config - Configuration object that shows/hides features in the USM */
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
    /** features - Features for the element */
    features?: FeatureConfig,
    /** hasProviders - Whether the element has providers for USM already */
    hasProviders?: boolean,
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
    /** uuid - Unique identifier, used for refreshing element visibility when called from the ES6 wrapper */
    uuid?: string,
};

const createAPI = (apiHost, itemID, itemType, token) =>
    new API({
        apiHost,
        clientName: CLIENT_NAME_CONTENT_SHARING,
        id: `${itemType}_${itemID}`,
        token,
        version: CLIENT_VERSION,
    });

function ContentSharing({
    apiHost = DEFAULT_HOSTNAME_API,
    children,
    config,
    customButton,
    displayInModal,
    features = {},
    hasProviders = true,
    itemID,
    itemType,
    language,
    messages,
    token,
    uuid,
}: ContentSharingProps) {
    const [api, setAPI] = React.useState<API | null>(createAPI(apiHost, itemID, itemType, token));
    const [launchButton, setLaunchButton] = React.useState<React.Element<any> | null>(null);
    const [isVisible, setIsVisible] = React.useState<boolean>(!customButton);

    // Reset the API if necessary
    React.useEffect(() => {
        if (apiHost && itemID && itemType && token) {
            setAPI(createAPI(apiHost, itemID, itemType, token));
        }
    }, [apiHost, itemID, itemType, token]);

    // Reset state if the API has changed
    React.useEffect(() => {
        setIsVisible(!customButton);
    }, [api, customButton, uuid]);

    React.useEffect(() => {
        if (customButton && !launchButton) {
            setLaunchButton(
                React.cloneElement(customButton, {
                    onClick: () => {
                        return setIsVisible(true);
                    },
                }),
            );
        }
    }, [config, customButton, displayInModal, itemID, itemType, language, launchButton, messages, isVisible]);

    if (isFeatureEnabled(features, 'contentSharingV2')) {
        return (
            api && (
                <ContentSharingV2
                    api={api}
                    itemID={itemID}
                    itemType={itemType}
                    hasProviders={hasProviders}
                    language={language}
                    messages={messages}
                >
                    {children}
                </ContentSharingV2>
            )
        );
    }

    return (
        <>
            {launchButton}
            {api && (
                <SharingModal
                    api={api}
                    config={config}
                    displayInModal={displayInModal}
                    isVisible={isVisible}
                    itemID={itemID}
                    itemType={itemType}
                    language={language}
                    messages={messages}
                    setIsVisible={setIsVisible}
                    uuid={uuid}
                />
            )}
        </>
    );
}

export { ContentSharing as ContentSharingComponent };
export default withBlueprintModernization(ContentSharing);
