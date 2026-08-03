/**
 * @flow
 * @file Namespace-migration Metadata API surface (list/create/update + mode).
 *
 * Collaborator owned by Metadata.js — keeps mid/post-migration HTTP out of the
 * core scoped metadata flows. Methods are delegated from Metadata for a stable
 * public API (`api.getMetadataAPI().listNamespaces(...)`).
 */

import getProp from 'lodash/get';
import { getTypedFileId } from '../utils/file';
import {
    ERROR_CODE_CREATE_METADATA_TEMPLATE,
    ERROR_CODE_UPDATE_METADATA_TEMPLATE,
    HEADER_BOX_VERSION,
    HEADER_CONTENT_TYPE,
    METADATA_NAMESPACE_FINAL_FIELD,
    METADATA_NAMESPACE_MIGRATION_FIELD,
} from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { BoxItem } from '../common/types/core';
import type APICache from '../utils/Cache';
import { resolveMetadataNamespaceMode } from './metadataNamespaceUtils';
// TODO(MDX-2136): remove this import when namespace API is deployed
import {
    IS_NAMESPACE_API_MOCKED,
    mockListNamespaces,
    mockListTemplatesForNamespace,
    mockCreateMetadataTemplate,
    mockUpdateMetadataTemplate,
    mockGetTemplateSchemaForEditor,
} from './metadataNamespaceMocks';

/** Minimal host surface MetadataNamespaces needs from Metadata. */
export type MetadataNamespaceHost = {
    errorCode: string,
    getBaseApiUrl: () => string,
    getCache: () => APICache,
    getMetadataTemplateSchemaCacheKey: (templateKey: string, scope?: string) => string,
    getMetadataTemplateSchemaUrl: (templateKey: string, scope?: string) => string,
    getMetadataTemplateUrl: () => string,
    getMetadataTemplateUrlForScope: (scope: string) => string,
    isDestroyed: () => boolean,
    xhr: {
        get: (config: Object) => Promise<Object>,
        post: (config: Object) => Promise<Object>,
        put: (config: Object) => Promise<Object>,
    },
};

export default class MetadataNamespaces {
    host: MetadataNamespaceHost;

    constructor(host: MetadataNamespaceHost) {
        this.host = host;
    }

    getMetadataNamespacesUrl(namespaceFqn: string): string {
        return `${this.host.getBaseApiUrl()}/metadata_namespaces/${namespaceFqn}`;
    }

    getEnterpriseConfigurationsUrl(enterpriseNumericId: string): string {
        return `${this.host.getBaseApiUrl()}/enterprise_configurations/${enterpriseNumericId}`;
    }

    /**
     * Lists child namespaces under a given namespace FQN.
     */
    async listNamespaces(
        file: BoxItem,
        namespaceFqn: string,
        params: { limit: number, marker?: string },
    ): Promise<{ entries: Array<Object>, next_marker?: string }> {
        // TODO(MDX-2136): remove next line when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) return mockListNamespaces(file, namespaceFqn, params);

        const { id }: BoxItem = file;
        const url = this.getMetadataNamespacesUrl(namespaceFqn);
        try {
            const response = await this.host.xhr.get({
                url,
                id: getTypedFileId(id),
                params: { limit: params.limit, marker: params.marker },
            });
            return getProp(response, 'data', { entries: [] });
        } catch (e) {
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
        // TODO(MDX-2136): remove next line when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) return mockListTemplatesForNamespace(file, namespaceFqn, params);

        const { id }: BoxItem = file;
        const url = this.host.getMetadataTemplateUrlForScope(namespaceFqn);
        try {
            const response = await this.host.xhr.get({
                url,
                id: getTypedFileId(id),
                params: { limit: params.limit, marker: params.marker },
            });
            return getProp(response, 'data', { entries: [] });
        } catch (e) {
            return { entries: [] };
        }
    }

    /**
     * Fetches the metadata namespace migration mode for the given enterprise.
     * Returns `null` when the request fails so callers can fall back safely.
     */
    async getMetadataNamespaceMode(file: BoxItem, enterpriseNumericId: string): Promise<string | null> {
        const url = this.getEnterpriseConfigurationsUrl(enterpriseNumericId);
        const { id }: BoxItem = file;
        try {
            const response = await this.host.xhr.get({
                id: getTypedFileId(id),
                url,
                params: { categories: 'content_and_sharing' },
                headers: { [HEADER_BOX_VERSION]: '2025.0' },
            });
            const contentAndSharing = getProp(response, 'data.content_and_sharing', {});
            const isMigration = getProp(contentAndSharing, `${METADATA_NAMESPACE_MIGRATION_FIELD}.value`, false);
            const isFinal = getProp(contentAndSharing, `${METADATA_NAMESPACE_FINAL_FIELD}.value`, false);
            return resolveMetadataNamespaceMode(isMigration, isFinal);
        } catch (e) {
            return null;
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
        // TODO(MDX-2136): remove next two lines when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) {
            mockCreateMetadataTemplate(file, body, successCallback);
            return;
        }

        const { id }: BoxItem = file;
        this.host.errorCode = ERROR_CODE_CREATE_METADATA_TEMPLATE;
        const url = `${this.host.getMetadataTemplateUrl()}/schema`;
        try {
            const response = await this.host.xhr.post({ url, id: getTypedFileId(id), data: body });
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
        // TODO(MDX-2136): remove next two lines when namespace API is deployed
        if (IS_NAMESPACE_API_MOCKED) {
            mockUpdateMetadataTemplate(file, namespaceFqn, templateKey, patchItems, successCallback);
            return;
        }

        const { id }: BoxItem = file;
        this.host.errorCode = ERROR_CODE_UPDATE_METADATA_TEMPLATE;
        const url = this.host.getMetadataTemplateSchemaUrl(templateKey, namespaceFqn);
        try {
            const response = await this.host.xhr.put({
                url,
                id: getTypedFileId(id),
                headers: { [HEADER_CONTENT_TYPE]: 'application/json-patch+json' },
                data: patchItems,
            });
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
    async getTemplateSchemaForEditor(namespaceFqn: string, templateKey: string): Promise<Object> {
        // TODO(MDX-2136): remove the mock block when namespace API is deployed.
        if (IS_NAMESPACE_API_MOCKED) {
            const mockResult = mockGetTemplateSchemaForEditor(namespaceFqn, templateKey);
            if (mockResult) return mockResult;
        }

        const url = this.host.getMetadataTemplateSchemaUrl(templateKey, namespaceFqn);
        const response = await this.host.xhr.get({ url });
        const data = getProp(response, 'data', {});
        return {
            namespace: data.namespace || namespaceFqn,
            templateKey: data.templateKey,
            displayName: data.displayName,
            fields: (data.fields || []).map(f => ({
                ...f,
                isHidden: f.isHidden != null ? f.isHidden : f.hidden ?? false,
            })),
            isHidden: data.isHidden != null ? data.isHidden : data.hidden ?? false,
        };
    }
}
