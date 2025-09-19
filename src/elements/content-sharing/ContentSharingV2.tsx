import * as React from 'react';

import { UnifiedShareModal } from '@box/unified-share-modal';

import API from '../../api';
import { CLIENT_NAME_CONTENT_SHARING, CLIENT_VERSION, DEFAULT_HOSTNAME_API } from '../../constants';
import Internationalize from '../common/Internationalize';
import Providers from '../common/Providers';
import ThemingStyles from '../common/theming/ThemingStyles';

import type { ContentSharingV2Props } from './types';

const createAPI = (apiHost, itemID, itemType, token) =>
    new API({
        apiHost,
        clientName: CLIENT_NAME_CONTENT_SHARING,
        id: `${itemType}_${itemID}`,
        token,
        version: CLIENT_VERSION,
    });

function ContentSharingV2({
    apiHost = DEFAULT_HOSTNAME_API,
    itemID,
    itemType,
    language,
    messages,
    hasProviders,
    theme,
    token,
}: ContentSharingV2Props) {
    const [api, setAPI] = React.useState<API | null>(createAPI(apiHost, itemID, itemType, token));

    // Reset the API if necessary
    React.useEffect(() => {
        if (apiHost && itemID && itemType && token) {
            setAPI(createAPI(apiHost, itemID, itemType, token));
        }
    }, [apiHost, itemID, itemType, token]);

    // Retrieve item from API later
    const mockItem = api && {
        id: itemID,
        name: 'Box Development Guide.pdf',
        type: itemType,
    };

    return (
        <Internationalize language={language} messages={messages}>
            <Providers hasProviders={hasProviders}>
                <ThemingStyles selector={`#${itemID}`} theme={theme} />
                <UnifiedShareModal item={mockItem} />
            </Providers>
        </Internationalize>
    );
}

export { ContentSharingV2 };
