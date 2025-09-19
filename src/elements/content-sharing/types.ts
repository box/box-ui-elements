import type { ItemType, StringMap } from '../../common/types/core';

export type ContentSharingV2Props = {
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
};
