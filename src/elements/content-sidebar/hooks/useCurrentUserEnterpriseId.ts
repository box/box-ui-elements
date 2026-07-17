import { useEffect, useState } from 'react';
import API from '../../../api';
import { FIELD_ENTERPRISE, METADATA_SCOPE_ENTERPRISE } from '../../../constants';
import type { BoxItem, User } from '../../../common/types/core';

interface UseCurrentUserEnterpriseIdReturn {
    /** Full enterprise FQN (e.g. `"enterprise_123456"`), or `undefined` while loading / unavailable. */
    enterpriseId: string | undefined;
    /** Numeric enterprise ID (without the `"enterprise_"` prefix), or `undefined` while loading / unavailable. */
    enterpriseNumericId: string | undefined;
}

/**
 * Resolves the authenticated user's enterprise ID via `GET /users/me?fields=enterprise`.
 *
 * Independent of metadata templates/instances so callers can hit
 * `enterprise_configurations` (and build an `enterprise_<id>` FQN) even when the
 * file has no templates applied yet.
 *
 * When `isEnabled` is `false` the fetch is skipped.
 */
export default function useCurrentUserEnterpriseId(
    api: API,
    file: BoxItem | null,
    isEnabled: boolean = true,
): UseCurrentUserEnterpriseIdReturn {
    const [enterpriseNumericId, setEnterpriseNumericId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!isEnabled || !file?.id) {
            setEnterpriseNumericId(undefined);
            return undefined;
        }

        let cancelled = false;

        api.getUsersAPI(false).getUser(
            file.id,
            (user: User) => {
                if (!cancelled) {
                    setEnterpriseNumericId(user?.enterprise?.id);
                }
            },
            () => {
                if (!cancelled) {
                    setEnterpriseNumericId(undefined);
                }
            },
            {
                params: {
                    fields: FIELD_ENTERPRISE,
                },
            },
        );

        return () => {
            cancelled = true;
        };
    }, [api, file?.id, isEnabled]);

    const enterpriseId = enterpriseNumericId ? `${METADATA_SCOPE_ENTERPRISE}_${enterpriseNumericId}` : undefined;

    return { enterpriseId, enterpriseNumericId };
}
