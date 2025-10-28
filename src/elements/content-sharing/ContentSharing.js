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
import Internationalize from '../common/Internationalize';
import Providers from '../common/Providers';
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

/**
 * Top-level React component that initializes the sharing API and renders the content-sharing UI,
 * either the feature-flagged ContentSharingV2 wrapped with localization and providers or the legacy SharingModal with an optional custom launch button.
 *
 * @param {string} [apiHost] - Hostname for the API; defaults to the library's default API hostname.
 * @param {React.ReactNode} [children] - Optional children passed into the ContentSharingV2 variant.
 * @param {Object} [config] - Configuration object passed to the legacy SharingModal.
 * @param {React.ReactElement} [customButton] - Optional custom launch button; when provided it is cloned and wired to open the sharing UI.
 * @param {boolean} [displayInModal] - When true, instructs the legacy sharing UI to render inside a modal.
 * @param {Object} [features] - Feature-flag map; used to enable the `contentSharingV2` variant.
 * @param {boolean} [hasProviders] - When true, wraps ContentSharingV2 with provider context; controls whether Providers is applied.
 * @param {string} itemID - Identifier of the item being shared.
 * @param {string} itemType - Type of the item being shared.
 * @param {string} [language] - Locale code used by the Internationalize wrapper.
 * @param {Object} [messages] - Localization messages passed to Internationalize.
 * @param {string} [token] - Authorization token used to construct the API client.
 * @param {string} [uuid] - Unique identifier used to reset component visibility when it changes.
 * @returns {JSX.Element|null} The rendered content-sharing UI (either ContentSharingV2 wrapped with Internationalize and Providers, or the legacy SharingModal and optional launch button), or null while the API is unavailable.
 */
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
                <Internationalize language={language} messages={messages}>
                    <Providers hasProviders={hasProviders}>
                        <ContentSharingV2 api={api} itemId={itemID} itemType={itemType}>
                            {children}
                        </ContentSharingV2>
                    </Providers>
                </Internationalize>
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