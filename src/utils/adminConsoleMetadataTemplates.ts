import type {
    MetadataTemplateApiResponse,
    MetadataTemplateCreateBody,
    MetadataTemplatePatchItem,
} from '@box/metadata-template-editor';

import { generateMetadataTemplateKey } from './generateMetadataTemplateKey';

/** Same paths as Admin console `constants/urls` (relative to the host app, e.g. Admin Console). */
const METADATA_TEMPLATES_LIST_API_URL = '/app-api/admin-console/metadata-templates';
const METADATA_API_TEMPLATE_CREATE_URL = '/app-api/admin-console/metadata-templates/create';
const METADATA_API_TAXONOMY_LIST = '/app-api/admin-console/metadata-taxonomies';

function getCsrfToken(): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }
    const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : undefined;
}

async function adminConsoleFetch<T>(method: 'GET' | 'POST' | 'PUT', url: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const csrf = getCsrfToken();
    if (csrf) {
        headers['x-csrf-token'] = csrf;
    }

    const res = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err: Error & { status?: number } = new Error(`Admin console metadata templates API error: ${res.status}`);
        err.status = res.status;
        throw err;
    }

    const text = await res.text();
    if (!text) {
        return undefined as T;
    }
    return JSON.parse(text) as T;
}

export async function fetchAdminMetadataTemplateDetails(
    namespace: string,
    templateKey: string,
): Promise<MetadataTemplateApiResponse> {
    const url = `${METADATA_TEMPLATES_LIST_API_URL}/${encodeURIComponent(namespace)}/${encodeURIComponent(templateKey)}`;
    const response = await adminConsoleFetch<{ data: MetadataTemplateApiResponse[] }>('GET', url);
    return response.data[0];
}

export async function updateAdminMetadataTemplate(
    namespace: string,
    templateKey: string,
    requestBody: MetadataTemplatePatchItem[],
): Promise<void> {
    const url = `${METADATA_TEMPLATES_LIST_API_URL}/${encodeURIComponent(namespace)}/${encodeURIComponent(templateKey)}`;
    await adminConsoleFetch('PUT', url, requestBody);
}

export async function createAdminMetadataTemplate(
    body: MetadataTemplateCreateBody,
    existingTemplateKeys: string[],
): Promise<void> {
    const templateKey = generateMetadataTemplateKey(body.displayName, existingTemplateKeys, 'template');
    await adminConsoleFetch('POST', METADATA_API_TEMPLATE_CREATE_URL, {
        scope: body.namespace,
        displayName: body.displayName,
        templateKey,
        hidden: body.hidden,
        fields: body.fields,
    });
}

type TaxonomyApiResponse = {
    id: string;
    displayName: string;
    namespace: string;
    key: string;
    levels?: Array<{ displayName: string; level: number }>;
};

/** Same mapping as `MetadataTemplateList.fetchTaxonomies` in Admin console. */
export async function fetchAdminMetadataTaxonomiesFormatted(namespace: string) {
    const response = await adminConsoleFetch<{ entries: TaxonomyApiResponse[] }>(
        'GET',
        `${METADATA_API_TAXONOMY_LIST}/${encodeURIComponent(namespace)}`,
    );
    return response.entries.map((taxonomy: TaxonomyApiResponse) => ({
        id: taxonomy.id,
        label: taxonomy.displayName,
        namespace: taxonomy.namespace,
        taxonomyKey: taxonomy.key,
        selected: false,
        levels: taxonomy.levels
            ? taxonomy.levels.map(level => ({
                  name: level.displayName,
                  level: level.level,
              }))
            : [],
    }));
}
