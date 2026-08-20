/**
 * @flow
 * @file Namespace-migration Metadata API surface (list/create/update).
 *
 * Collaborator owned by Metadata.js — keeps mid/post-migration HTTP out of the
 * core scoped metadata flows. Methods are delegated from Metadata for a stable
 * public API (`api.getMetadataAPI().listNamespaces(...)`).
 *
 * Migration mode is host-owned (`metadataNamespaceMode` on the API instance).
 * This class does not fetch enterprise-configuration flags.
 */

import getProp from 'lodash/get';
import { getTypedFileId } from '../utils/file';
import {
    ERROR_CODE_CREATE_METADATA_TEMPLATE,
    ERROR_CODE_UPDATE_METADATA_TEMPLATE,
    HEADER_CONTENT_TYPE,
    METADATA_SCOPE_MODE_FINAL,
    METADATA_SCOPE_MODE_MIGRATION,
} from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { BoxItem } from '../common/types/core';
import type APICache from '../utils/Cache';
import type Xhr from '../utils/Xhr';
import MetadataAuthTokenRequiredError from './MetadataAuthTokenRequiredError';
// TODO: remove this import when namespace API is deployed
import {
    IS_NAMESPACE_API_MOCKED,
    mockListNamespaces,
    mockListTemplatesForNamespace,
    mockCreateMetadataTemplate,
    mockUpdateMetadataTemplate,
    mockGetTemplateSchemaForEditor,
} from './metadataNamespaceMocks';

export { MetadataAuthTokenRequiredError };

function isMetadataAuthTokenRequiredError(error: mixed): boolean {
    return error instanceof MetadataAuthTokenRequiredError;
}

/** Minimal host surface MetadataNamespaces needs from Metadata. */
export type MetadataNamespaceHost = {
    // Writable: MetadataNamespaces assigns error codes onto the host.
    errorCode: string,
    +metadataNamespaceMode: string,
    // Methods/+xhr are covariant so class instances (read-only methods) are assignable.
    +getBaseApiUrl: () => string,
    +getCache: () => APICache,
    +getMetadataTemplateSchemaCacheKey: (templateKey: string, scope?: string) => string,
    +getMetadataTemplateSchemaUrl: (templateKey: string, scope?: string) => string,
    +getMetadataTemplateUrl: () => string,
    +getMetadataTemplateUrlForScope: (scope: string) => string,
    +getMetadataAuthToken?: () => Promise<?string>,
    +isDestroyed: () => boolean,
    +xhr: Xhr,
};

export default class MetadataNamespaces {
    host: MetadataNamespaceHost;

    constructor(host: MetadataNamespaceHost) {
        this.host = host;
    }

    getMetadataNamespacesUrl(namespaceFqn: string): string {
        return `${this.host.getBaseApiUrl()}/metadata_namespaces/${namespaceFqn}`;
    }

    /**
     * Auth for namespace / template-schema calls.
     *
     * Template CRUD uses the public metadata template APIs. A user access token
     * (developer token or OAuth, typically with `root_readwrite`) is enough.
     *
     * In MIGRATION/FINAL (or when `forceMetadataToken` is set):
     * - If `getMetadataAuthToken` is provided, that string is used.
     * - If it is omitted and `token` is already a string, TokenService sends it as-is.
     * - If `token` is a per-file function, a getter is required — those tokens cannot
     *   call template schema APIs.
     *
     * SCOPED mode does not swap tokens.
     */
    async resolveNamespacedRequestAuth(
        file: ?BoxItem,
        options?: { forceMetadataToken?: boolean },
    ): Promise<{ accessToken?: string, id?: string }> {
        const mode = this.host.metadataNamespaceMode;
        const isNamespacedMode = mode === METADATA_SCOPE_MODE_MIGRATION || mode === METADATA_SCOPE_MODE_FINAL;
        const shouldUseMetadataToken = !!options?.forceMetadataToken || isNamespacedMode;

        if (shouldUseMetadataToken) {
            const getter = this.host.getMetadataAuthToken;
            if (typeof getter === 'function') {
                const token = await getter();
                if (token) {
                    return { accessToken: token };
                }
            }
            // String `token` (developer / OAuth) is sent as-is by TokenService.
            // Per-file token functions cannot call template schema APIs.
            if (typeof this.host.xhr.token === 'function') {
                throw new MetadataAuthTokenRequiredError();
            }
        }

        if (file && file.id) {
            return { id: getTypedFileId(file.id) };
        }
        return {};
    }

    /**
     * Runs `fn` with Xhr temporarily using a metadata-service string token.
     * TokenService treats a string token as already-resolved, so the usual
     * `id: file_…` argument is still passed and no shared Xhr API changes.
     */
    async withMetadataServiceToken<T>(
        file: ?BoxItem,
        fn: (id: ?string) => Promise<T>,
        options?: { forceMetadataToken?: boolean },
    ): Promise<T> {
        const { accessToken } = await this.resolveNamespacedRequestAuth(file, options);
        const { xhr } = this.host;
        const previousToken = xhr.token;
        if (accessToken) {
            xhr.token = accessToken;
        }
        try {
            // TokenService requires a typed id even for a string token.
            let id;
            if (file && file.id) {
                id = getTypedFileId(file.id);
            } else if (accessToken) {
                id = 'file_0';
            }
            return await fn(id);
        } finally {
            xhr.token = previousToken;
        }
    }

    /**
     * Lists child namespaces under a given namespace FQN.
     */
    async listNamespaces(
        file: BoxItem,
        namespaceFqn: string,
        params: { limit: number, marker?: string },
    ): Promise<{ entries: Array<Object>, next_marker?: string }> {
        // TODO: remove next line when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) return mockListNamespaces(file, namespaceFqn, params);

        const url = this.getMetadataNamespacesUrl(namespaceFqn);
        try {
            const response = await this.withMetadataServiceToken(file, id =>
                this.host.xhr.get({
                    url,
                    id,
                    params: { limit: params.limit, marker: params.marker },
                }),
            );
            return getProp(response, 'data', { entries: [] });
        } catch (e) {
            if (isMetadataAuthTokenRequiredError(e)) {
                throw e;
            }
            return { entries: [] };
        }
    }

    /**
     * Lists templates under a namespace FQN with cursor pagination.
     */
    async listTemplatesForNamespace(
        file: BoxItem,
        namespaceFqn: string,
        params: { limit: number, marker?: string },
    ): Promise<{ entries: Array<Object>, next_marker?: string }> {
        // TODO: remove next line when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) return mockListTemplatesForNamespace(file, namespaceFqn, params);

        const url = this.host.getMetadataTemplateUrlForScope(namespaceFqn);
        try {
            const response = await this.withMetadataServiceToken(file, id =>
                this.host.xhr.get({
                    url,
                    id,
                    params: { limit: params.limit, marker: params.marker },
                }),
            );
            return getProp(response, 'data', { entries: [] });
        } catch (e) {
            if (isMetadataAuthTokenRequiredError(e)) {
                throw e;
            }
            return { entries: [] };
        }
    }

    /**
     * Creates a new namespaced metadata template.
     */
    async createMetadataTemplate(
        file: BoxItem,
        body: Object,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        // TODO: remove next two lines when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) {
            mockCreateMetadataTemplate(file, body, successCallback);
            return;
        }

        this.host.errorCode = ERROR_CODE_CREATE_METADATA_TEMPLATE;
        const url = `${this.host.getMetadataTemplateUrl()}/schema`;
        try {
            const response = await this.withMetadataServiceToken(file, id =>
                this.host.xhr.post({ url, id, data: body }),
            );
            if (!this.host.isDestroyed()) {
                successCallback(getProp(response, 'data'));
            }
        } catch (e) {
            errorCallback(e, this.host.errorCode);
        }
    }

    /**
     * Updates a namespaced metadata template via patch operations.
     */
    async updateMetadataTemplate(
        file: BoxItem,
        namespaceFqn: string,
        templateKey: string,
        patchItems: Array<Object>,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        // TODO: remove next two lines when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) {
            mockUpdateMetadataTemplate(file, namespaceFqn, templateKey, patchItems, successCallback);
            return;
        }

        this.host.errorCode = ERROR_CODE_UPDATE_METADATA_TEMPLATE;
        const url = this.host.getMetadataTemplateSchemaUrl(templateKey, namespaceFqn);
        try {
            const response = await this.withMetadataServiceToken(file, id =>
                this.host.xhr.put({
                    url,
                    id,
                    headers: { [HEADER_CONTENT_TYPE]: 'application/json-patch+json' },
                    data: patchItems,
                }),
            );
            if (!this.host.isDestroyed()) {
                this.host.getCache().unset(this.host.getMetadataTemplateSchemaCacheKey(templateKey, namespaceFqn));
                successCallback(getProp(response, 'data'));
            }
        } catch (e) {
            errorCallback(e, this.host.errorCode);
        }
    }

    /**
     * Fetches a template schema in the shape expected by MetadataTemplateEditor.
     */
    async getTemplateSchemaForEditor(namespaceFqn: string, templateKey: string, file: ?BoxItem): Promise<Object> {
        // TODO: remove the mock block when namespace API is deployed.
        if (IS_NAMESPACE_API_MOCKED) {
            const mockResult = mockGetTemplateSchemaForEditor(namespaceFqn, templateKey);
            if (mockResult) return mockResult;
        }

        const url = this.host.getMetadataTemplateSchemaUrl(templateKey, namespaceFqn);
        const response = await this.withMetadataServiceToken(file, id => this.host.xhr.get({ url, id }), {
            forceMetadataToken: true,
        });
        const data = getProp(response, 'data', {});
        return {
            namespace: data.namespace || namespaceFqn,
            templateKey: data.templateKey,
            displayName: data.displayName,
            fields: (data.fields || []).map(f => ({
                ...f,
                hidden: f.hidden != null ? f.hidden : f.isHidden ?? false,
            })),
            hidden: data.hidden != null ? data.hidden : data.isHidden ?? false,
        };
    }
}
