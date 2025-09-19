import * as React from 'react';

import { UnifiedShareModal } from '@box/unified-share-modal';

import Internationalize from '../common/Internationalize';
import Providers from '../common/Providers';

import type { ContentSharingV2Props } from './types';

function ContentSharingV2({
    children,
    itemID,
    itemType,
    language,
    messages,
    hasProviders = true,
}: ContentSharingV2Props) {
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

export { ContentSharingV2 };
