import * as React from 'react';
import API from '../../api';
import type { ItemType, StringMap } from '../../common/types/core';
export interface ContentSharingV2Props {
    /** api - API instance */
    api: API;
    /** children - Children for the element to open the Unified Share Modal */
    children?: React.ReactElement;
    /** itemID - Box file or folder ID */
    itemID: string;
    /** itemType - "file" or "folder" */
    itemType: ItemType;
    /** hasProviders - Whether the element has providers for USM already */
    hasProviders?: boolean;
    /** language - Language used for the element */
    language?: string;
    /** messages - Localized strings used by the element */
    messages?: StringMap;
}
declare function ContentSharingV2({ api, children, itemID, itemType, hasProviders, language, messages, }: ContentSharingV2Props): React.JSX.Element;
export default ContentSharingV2;
