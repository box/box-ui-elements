import * as React from 'react';

import { UnifiedShareModal } from '@box/unified-share-modal';

import Internationalize from '../common/Internationalize';
import Providers from '../common/Providers';

import type { ItemType, StringMap } from '../../common/types/core';

export interface ContentSharingV2Props {
    /** children - Children for the element to open the Unified Share Modal */
    children?: React.ReactElement;
    /** itemID - Box file or folder ID */
    itemID: string;
    /** itemType - "file" or "folder" */
    itemType: ItemType;
    /** hasProviders - Whether the element has providers for USM already */
    hasProviders: boolean;
    /** language - Language used for the element */
    language?: string;
    /** messages - Localized strings used by the element */
    messages?: StringMap;
}

function ContentSharingV2({ children, itemID, itemType, hasProviders, language, messages }: ContentSharingV2Props) {
    // Retrieve item from API later
    const mockItem = {
        id: itemID,
        name: 'Box Development Guide.pdf',
        type: itemType,
    };

    return (
        <Internationalize language={language} messages={messages}>
            <Providers hasProviders={hasProviders}>
                <UnifiedShareModal item={mockItem}>{children}</UnifiedShareModal>
            </Providers>
        </Internationalize>
    );
}

export default ContentSharingV2;
