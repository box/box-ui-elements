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

function parseHostEnterpriseId(hostEnterpriseId?: string | number): UseCurrentUserEnterpriseIdReturn | null {
    if (hostEnterpriseId == null || hostEnterpriseId === '') {
        return null;
    }
    const value = String(hostEnterpriseId);
    if (value.startsWith(`${METADATA_SCOPE_ENTERPRISE}_`)) {
        const enterpriseNumericId = value.slice(METADATA_SCOPE_ENTERPRISE.length + 1);
        return enterpriseNumericId ? { enterpriseId: value, enterpriseNumericId } : null;
    }
    return {
        enterpriseId: `${METADATA_SCOPE_ENTERPRISE}_${value}`,
        enterpriseNumericId: value,
    };
}

/**
 * Resolves the authenticated user's enterprise ID via `GET /users/me?fields=enterprise`.
 *
 * Independent of metadata templates/instances so callers can build an
 * `enterprise_<id>` FQN even when the file has no templates applied yet.
 *
 * When `isEnabled` is `false` the fetch is skipped.
 * When `hostEnterpriseId` is provided (numeric, numeric string, or
 * `enterprise_<id>` FQN), skips `/users/me` and uses that value.
 */
export default function useCurrentUserEnterpriseId(
    api: API,
    file: BoxItem | { id: string } | null,
    isEnabled: boolean = true,
    hostEnterpriseId?: string | number,
): UseCurrentUserEnterpriseIdReturn {
    const hostEnterprise = parseHostEnterpriseId(hostEnterpriseId);
    const [enterpriseNumericId, setEnterpriseNumericId] = useState<string | undefined>(undefined);
    const fileId = file?.id;

    useEffect(() => {
        if (hostEnterpriseId || !isEnabled || !fileId) {
            if (!hostEnterpriseId) {
                setEnterpriseNumericId(undefined);
            }
            return undefined;
        }

        let cancelled = false;

        api.getUsersAPI(false).getUser(
            fileId,
            (user: User) => {
                if (!cancelled) {
                    const id = user?.enterprise?.id;
                    setEnterpriseNumericId(id == null || id === '' ? undefined : String(id));
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
    }, [api, fileId, isEnabled, hostEnterpriseId]);

    if (hostEnterprise) {
        return hostEnterprise;
    }

    const enterpriseId = enterpriseNumericId ? `${METADATA_SCOPE_ENTERPRISE}_${enterpriseNumericId}` : undefined;

    return { enterpriseId, enterpriseNumericId };
}
