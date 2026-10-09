import { useEffect, useState } from 'react';

import API from '../../../api';
import type { BoxItem } from '../../../common/types/core';
import { canCreateTemplatesInNamespace } from '../utils/metadataTemplatePermissions';

/**
 * Whether the enterprise root namespace allows template creation.
 *
 * The root is never a row in `GET /metadata_namespaces/{fqn}/children`, so its
 * `CREATE_NAMESPACE_TEMPLATES` grant comes from `GET /metadata_namespaces/{fqn}`.
 * Stays false until that response arrives, and on any failure.
 */
export default function useCanCreateTemplateAtRoot(
    api: API,
    file: BoxItem | null,
    enterpriseFqn: string | undefined,
): boolean {
    const [canCreateAtRoot, setCanCreateAtRoot] = useState(false);

    useEffect(() => {
        if (!file?.id || !enterpriseFqn) {
            setCanCreateAtRoot(false);
            return undefined;
        }

        let cancelled = false;

        api.getMetadataAPI(false)
            .getNamespace(file, enterpriseFqn)
            .then(namespace => {
                if (!cancelled) {
                    setCanCreateAtRoot(canCreateTemplatesInNamespace(namespace));
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setCanCreateAtRoot(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [api, enterpriseFqn, file]);

    return canCreateAtRoot;
}
