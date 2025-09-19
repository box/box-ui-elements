import type { ItemType, StringMap } from '../../common/types/core';
import type { Theme } from '../common/theming/types';

export type ContentSharingV2Props = {
    /** apiHost - API hostname. Defaults to https://api.box.com */
    apiHost: string;
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
    /** theme - Theme for the element */
    theme?: Theme;
    /** uuid - Unique identifier, used for refreshing element visibility when called from the ES6 wrapper */
    uuid?: string;
};
