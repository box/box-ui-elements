import * as React from 'react';
import { useIntl } from 'react-intl';
import { UploadsManager as UploadsManagerBP } from '@box/uploads-manager';

import { mapToModernizedUploadItems } from './utils/mapToModernizedUploadItem';
import { UploadItem as LegacyUploadItem, FolderUploadItem } from '../../common/types/upload';

type UploadsManagerBPProps = React.ComponentProps<typeof UploadsManagerBP>;

export interface ModernizedUploadsManagerProps extends Omit<UploadsManagerBPProps, 'items'> {
    isUploadEtaEnabled?: boolean;
    items: Array<LegacyUploadItem | FolderUploadItem>;
    rootFolderId: string;
}

/**
 * Adapts upload queue items for the modernized panel. Rendered below `Internationalize` so error
 * copy can be resolved from the message catalog rather than echoing the API response.
 */
const ModernizedUploadsManager = ({
    isUploadEtaEnabled = false,
    items,
    rootFolderId,
    ...uploadsManagerProps
}: ModernizedUploadsManagerProps) => {
    const { formatMessage } = useIntl();

    return (
        <UploadsManagerBP
            {...uploadsManagerProps}
            items={mapToModernizedUploadItems(items, rootFolderId, isUploadEtaEnabled, formatMessage)}
        />
    );
};

export default ModernizedUploadsManager;
