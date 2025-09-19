import type { ItemType, StringMap } from '../../common/types/core';

export type ContentSharingV2Props = {
    /** apiHost - API hostname. Defaults to https://api.box.com */
    apiHost: string;
    /** children - Children for the element to open the Unified Share Modal */
    children?: React.ReactElement;
    /** itemID - Box file or folder ID */
    itemID: string;
    /** itemType - "file" or "folder" */
    itemType: ItemType;
    /** language - Language used for the element */
    language: string;
    /** messages - Localized strings used by the element */
    messages?: StringMap;
    /** token - Valid access token */
    token: string;
    /** hasProviders - Providers for notifications and tooltips */
    hasProviders?: boolean;
    /** uuid - Unique identifier, used for refreshing element visibility when called from the ES6 wrapper */
    uuid?: string;
};
