import { useEffect, useState } from 'react';
import API from '../../../api';
import type { BoxItem } from '../../../common/types/core';

/** Mirrors the METADATA_SCOPE_MODE_* constants from constants.js as a strict union. */
export type MetadataScopeMode = 'SCOPED' | 'MIGRATION' | 'FINAL';

interface UseMetadataNamespaceModeReturn {
    /**
     * The migration mode returned by the enterprise configurations API,
     * or `null` while loading / if the request fails.
     */
    mode: MetadataScopeMode | null;
    /** True while the enterprise configurations request is in-flight. */
    isLoading: boolean;
}

/**
 * Fetches the metadata namespace migration mode for the given enterprise from
 * `GET /2.0/enterprise_configurations/{enterpriseNumericId}`.
 *
 * The fetch is deferred until `enterpriseNumericId` is known (typically from
 * the current user's enterprise). Cancels any in-flight request when the
 * component unmounts or the enterprise ID changes.
 *
 * When `isEnabled` is `false` the hook skips the API call entirely and returns
 * `{ mode: null, isLoading: false }`, keeping the UI in legacy SCOPED mode.
 * Pass the `enterprise_metadata_namespaces_opt_in` split treatment result here.
 *
 * Returns `{ mode: null, isLoading: false }` when `enterpriseNumericId` is
 * undefined — callers should treat this as "not yet known" and keep the UI
 * in its default (non-browser) state.
 *
 * @example
 * const { mode, isLoading } = useMetadataNamespaceMode(api, enterpriseNumericId, isEnabled);
 * const isTemplateManagementEnabled =
 *     !!mode && mode !== METADATA_SCOPE_MODE_SCOPED;
 */
export default function useMetadataNamespaceMode(
    file: BoxItem,
    api: API,
    enterpriseNumericId: string | undefined,
    isEnabled: boolean = false,
): UseMetadataNamespaceModeReturn {
    const [mode, setMode] = useState<MetadataScopeMode | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isEnabled || !file || !enterpriseNumericId) {
            setMode(null);
            setIsLoading(false);
            return undefined;
        }

        let isCancelled = false;
        setIsLoading(true);

        const metadataAPI = api.getMetadataAPI(false);
        metadataAPI.getMetadataNamespaceMode(file, enterpriseNumericId).then(resolvedMode => {
            if (!isCancelled) {
                setMode(resolvedMode as MetadataScopeMode | null);
                setIsLoading(false);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [api, file, enterpriseNumericId, isEnabled]);

    return { mode, isLoading };
}
