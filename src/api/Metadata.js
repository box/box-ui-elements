/**
 * @flow
 * @file Helper for the Box metadata related API
 * @author Box
 */

import getProp from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { getBadItemError, getBadPermissionsError, isUserCorrectableError } from '../utils/error';
import { getTypedFileId } from '../utils/file';
import File from './File';
import {
    HEADER_CONTENT_TYPE,
    METADATA_SCOPE_ENTERPRISE,
    METADATA_SCOPE_GLOBAL,
    METADATA_TEMPLATE_FETCH_LIMIT,
    METADATA_TEMPLATE_PROPERTIES,
    METADATA_TEMPLATE_CLASSIFICATION,
    METADATA_TEMPLATE_SKILLS,
    FIELD_METADATA_SKILLS,
    CACHE_PREFIX_METADATA,
    ERROR_CODE_UPDATE_SKILLS,
    ERROR_CODE_UPDATE_METADATA,
    ERROR_CODE_CREATE_METADATA,
    ERROR_CODE_DELETE_METADATA,
    ERROR_CODE_FETCH_METADATA,
    ERROR_CODE_FETCH_METADATA_TEMPLATES,
    ERROR_CODE_FETCH_SKILLS,
} from '../constants';

import type { RequestOptions, ElementsErrorCallback, JSONPatchOperations } from '../common/types/api';
import type {
    MetadataTemplateSchemaResponse,
    MetadataTemplate,
    MetadataInstanceV2,
    MetadataEditor,
    MetadataFields,
} from '../common/types/metadata';
import type { BoxItem } from '../common/types/core';
import type APICache from '../utils/Cache';

class Metadata extends File {
    /**
     * Creates a key for the metadata cache
     *
     * @param {string} id - Folder id
     * @return {string} key
     */
    getMetadataCacheKey(id: string): string {
        return `${CACHE_PREFIX_METADATA}${id}`;
    }

    /**
     * Creates a key for the skills cache
     *
     * @param {string} id - Folder id
     * @return {string} key
     */
    getSkillsCacheKey(id: string): string {
        return `${this.getMetadataCacheKey(id)}_skills`;
    }

    /**
     * Creates a key for the classification cache
     *
     * @param {string} id - Folder id
     * @return {string} key
     */
    getClassificationCacheKey(id: string): string {
        return `${this.getMetadataCacheKey(id)}_classification`;
    }

    /**
     * API URL for metadata
     *
     * @param {string} id - a Box file id
     * @param {string} field - metadata field
     * @return {string} base url for files
     */
    getMetadataUrl(id: string, scope?: string, template?: string): string {
        const baseUrl = `${this.getUrl(id)}/metadata`;
        if (scope && template) {
            return `${baseUrl}/${scope}/${template}`;
        }
        return baseUrl;
    }

    /**
     * API URL for metadata templates for a scope
     *
     * @param {string} scope - metadata scope
     * @return {string} base url for files
     */
    getMetadataTemplateUrl(): string {
        return `${this.getBaseApiUrl()}/metadata_templates`;
    }

    /**
     * API URL for metadata template for an instance
     *
     * @param {string} id - metadata instance id
     * @return {string} base url for files
     */
    getMetadataTemplateUrlForInstance(id: string): string {
        return `${this.getMetadataTemplateUrl()}?metadata_instance_id=${id}`;
    }

    /**
     * API URL for getting metadata template schema by template key
     *
     * @param {string} templateKey - metadata template key
     * @return {string} API url for getting template schema by template key
     */
    getMetadataTemplateSchemaUrl(templateKey: string): string {
        return `${this.getMetadataTemplateUrl()}/enterprise/${templateKey}/schema`;
    }

    /**
     * API URL for metadata templates
     *
     * @param {string} scope - metadata scope or id
     * @return {string} base url for files
     */
    getMetadataTemplateUrlForScope(scope: string): string {
        return `${this.getMetadataTemplateUrl()}/${scope}`;
    }

    /**
     * Returns the custom properties template
     *
     * @return {Object} temaplte for custom properties
     */
    getCustomPropertiesTemplate(): MetadataTemplate {
        return {
            id: uniqueId('metadata_template_'),
            scope: METADATA_SCOPE_GLOBAL,
            templateKey: METADATA_TEMPLATE_PROPERTIES,
            hidden: false,
        };
    }

    /**
     * Utility to create editors from metadata instances
     * and metadata templates.
     *
     * @param {Object} instance - metadata instance
     * @param {Object} template - metadata template
     * @param {boolean} canEdit - is instance editable
     * @return {Object} metadata editor
     */
    createEditor(instance: MetadataInstanceV2, template: MetadataTemplate, canEdit: boolean): MetadataEditor {
        const data: MetadataFields = {};
        Object.keys(instance).forEach(key => {
            if (!key.startsWith('$')) {
                // $FlowFixMe
                data[key] = instance[key];
            }
        });

        return {
            template,
            instance: {
                id: instance.$id,
                canEdit: instance.$canEdit && canEdit,
                data,
            },
        };
    }

    /**
     * Gets metadata templates for enterprise
     *
     * @param {string} id - file id
     * @param {string} scope - metadata scope
     * @param {string|void} [instanceId] - metadata instance id
     * @return {Object} array of metadata templates
     */
    async getTemplates(id: string, scope: string, instanceId?: string): Promise<Array<MetadataTemplate>> {
        this.errorCode = ERROR_CODE_FETCH_METADATA_TEMPLATES;
        let templates = {};
        const url = instanceId
            ? this.getMetadataTemplateUrlForInstance(instanceId)
            : this.getMetadataTemplateUrlForScope(scope);

        try {
            templates = await this.xhr.get({
                url,
                id: getTypedFileId(id),
                params: {
                    limit: METADATA_TEMPLATE_FETCH_LIMIT, // internal hard limit is 500
                },
            });
        } catch (e) {
            const { status } = e;
            if (isUserCorrectableError(status)) {
                throw e;
            }
        }

        return getProp(templates, 'data.entries', []);
    }

    /**
     * Gets metadata template schema by template key
     *
     * @param {string} templateKey - template key
     * @return {Promise} Promise object of metadata template
     */
    getSchemaByTemplateKey(templateKey: string): Promise<MetadataTemplateSchemaResponse> {
        const url = this.getMetadataTemplateSchemaUrl(templateKey);
        return this.xhr.get({ url });
    }

    /**
     * Gets metadata instances for a Box file
     *
     * @param {string} id - file id
     * @return {Object} array of metadata instances
     */
    async getInstances(id: string): Promise<Array<MetadataInstanceV2>> {
        this.errorCode = ERROR_CODE_FETCH_METADATA;
        let instances = {};
        try {
            instances = await this.xhr.get({
                url: this.getMetadataUrl(id),
                id: getTypedFileId(id),
            });
        } catch (e) {
            const { status } = e;
            if (isUserCorrectableError(status)) {
                throw e;
            }
        }
        return getProp(instances, 'data.entries', []);
    }

    /**
     * Returns a list of templates that can be added by the user.
     * For collabed files, only custom properties is allowed.
     *
     * @return {Object} template for custom properties
     */
    getUserAddableTemplates(
        customPropertiesTemplate: MetadataTemplate,
        enterpriseTemplates: Array<MetadataTemplate>,
        hasMetadataFeature: boolean,
        isExternallyOwned?: boolean,
    ): Array<MetadataTemplate> {
        let userAddableTemplates: Array<MetadataTemplate> = [];
        if (hasMetadataFeature) {
            userAddableTemplates = isExternallyOwned
                ? [customPropertiesTemplate]
                : [customPropertiesTemplate].concat(enterpriseTemplates);
        }
        // Only templates that are not hidden and not classification
        return userAddableTemplates.filter(
            template => !template.hidden && template.templateKey !== METADATA_TEMPLATE_CLASSIFICATION,
        );
    }

    /**
     * Extracts classification for different representation in the UI.
     *
     * @param {string} id - Box file id
     * @param {Array} instances - metadata instances
     * @return {Array} metadata instances without classification
     */
    extractClassification(id: string, instances: Array<MetadataInstanceV2>): Array<MetadataInstanceV2> {
        const classification = instances.find(instance => instance.$template === METADATA_TEMPLATE_CLASSIFICATION);
        if (classification) {
            instances.splice(instances.indexOf(classification), 1);
            const cache: APICache = this.getCache();
            const key = this.getClassificationCacheKey(id);
            cache.set(key, classification);
        }
        return instances;
    }

    /**
     * Finds template for a given metadata instance.
     *
     * @param {string} id - Box file id
     * @param {Object} instance - metadata instance
     * @param {Array} templates - metadata templates
     * @return {Object|undefined} template for metadata instance
     */
    async getTemplateForInstance(
        id: string,
        instance: MetadataInstanceV2,
        templates: Array<MetadataTemplate>,
    ): Promise<?MetadataTemplate> {
        const instanceId = instance.$id;
        const templateKey = instance.$template;
        const scope = instance.$scope;
        let template = templates.find(t => t.templateKey === templateKey && t.scope === scope);

        // Enterprise scopes are always enterprise_XXXXX
        if (!template && scope.startsWith(METADATA_SCOPE_ENTERPRISE)) {
            // If the template does not exist, it can be a template from another
            // enterprise because the user is viewing a collaborated file.
            const crossEnterpriseTemplate = await this.getTemplates(id, scope, instanceId);
            // The API always returns an array of at most one item
            template = crossEnterpriseTemplate[0]; // eslint-disable-line
        }

        return template;
    }

    /**
     * Creates and returns metadata editors.
     *
     * @param {string} id - Box file id
     * @param {Array} instances - metadata instances
     * @param {Object} customPropertiesTemplate - custom properties template
     * @param {Array} enterpriseTemplates - enterprise templates
     * @param {Array} globalTemplates - global templates
     * @param {boolean} canEdit - metadata editability
     * @return {Array} metadata editors
     */
    async getEditors(
        id: string,
        instances: Array<MetadataInstanceV2>,
        customPropertiesTemplate: MetadataTemplate,
        enterpriseTemplates: Array<MetadataTemplate>,
        globalTemplates: Array<MetadataTemplate>,
        canEdit: boolean,
    ): Promise<Array<MetadataEditor>> {
        // All usable templates for metadata instances
        const templates: Array<MetadataTemplate> = [customPropertiesTemplate].concat(
            enterpriseTemplates,
            globalTemplates,
        );

        // Filter out skills and classification
        // let filteredInstances = this.extractSkills(id, instances);
        const filteredInstances = this.extractClassification(id, instances);

        // Create editors from each instance
        const editors: Array<MetadataEditor> = [];
        await Promise.all(
            filteredInstances.map(async instance => {
                const template: ?MetadataTemplate = await this.getTemplateForInstance(id, instance, templates);
                if (template) {
                    editors.push(this.createEditor(instance, template, canEdit));
                }
            }),
        );
        return editors;
    }

    /**
     * API for getting metadata editors
     *
     * @param {string} fileId - Box file id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {boolean} hasMetadataFeature - metadata feature check
     * @param {Object} options - fetch options
     * @return {Promise}
     */
    async getMetadata(
        file: BoxItem,
        successCallback: ({ editors: Array<MetadataEditor>, templates: Array<MetadataTemplate> }) => void,
        errorCallback: ElementsErrorCallback,
        hasMetadataFeature: boolean,
        options: RequestOptions = {},
    ): Promise<void> {
        const { id, permissions, is_externally_owned }: BoxItem = file;
        this.errorCode = ERROR_CODE_FETCH_METADATA;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        // Check for valid file object.
        // Need to eventually check for upload permission.
        if (!id || !permissions) {
            this.errorHandler(getBadItemError());
            return;
        }

        const cache: APICache = this.getCache();
        const key = this.getMetadataCacheKey(id);

        // Clear the cache if needed
        if (options.forceFetch) {
            cache.unset(key);
        }

        // Return the cached value if it exists
        if (cache.has(key)) {
            this.successHandler(cache.get(key));
            if (!options.refreshCache) {
                return;
            }
        }

        try {
            const customPropertiesTemplate: MetadataTemplate = this.getCustomPropertiesTemplate();
            const [instances, globalTemplates, enterpriseTemplates] = await Promise.all([
                this.getInstances(id),
                this.getTemplates(id, METADATA_SCOPE_GLOBAL),
                hasMetadataFeature ? this.getTemplates(id, METADATA_SCOPE_ENTERPRISE) : Promise.resolve([]),
            ]);

            const editors = await this.getEditors(
                id,
                instances,
                customPropertiesTemplate,
                enterpriseTemplates,
                globalTemplates,
                !!permissions.can_upload,
            );

            const metadata = {
                editors,
                templates: this.getUserAddableTemplates(
                    customPropertiesTemplate,
                    enterpriseTemplates,
                    hasMetadataFeature,
                    is_externally_owned,
                ),
            };

            cache.set(key, metadata);

            if (!this.isDestroyed()) {
                this.successHandler(metadata);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    /**
     * Gets skills for file
     *
     * @param {string} id - file id
     * @return {Object} array of metadata instances
     */
    async getSkills(
        file: BoxItem,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        forceFetch: boolean = false,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_FETCH_SKILLS;
        const { id }: BoxItem = file;
        if (!id) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        const cache: APICache = this.getCache();
        const key = this.getSkillsCacheKey(id);
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        // Clear the cache if needed
        if (forceFetch) {
            cache.unset(key);
        }

        // Return the Cache value if it exists
        if (cache.has(key)) {
            this.successHandler(cache.get(key));
            return;
        }

        // The file object may already have skills in it
        let skills = {
            data: getProp(file, FIELD_METADATA_SKILLS),
        };

        try {
            if (!skills.data) {
                skills = await this.xhr.get({
                    url: this.getMetadataUrl(id, METADATA_SCOPE_GLOBAL, METADATA_TEMPLATE_SKILLS),
                    id: getTypedFileId(id),
                });
            }

            if (!this.isDestroyed()) {
                const cards = skills.data.cards || [];
                cache.set(key, cards);
                this.successHandler(cards);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    /**
     * API for patching skills on a file
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {string} field - Metadata field to patch
     * @param {Array} operations - Array of JSON patch operations
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    async updateSkills(
        file: BoxItem,
        operations: JSONPatchOperations,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_UPDATE_SKILLS;
        const { id, permissions } = file;
        if (!id || !permissions) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        if (!permissions.can_upload) {
            errorCallback(getBadPermissionsError(), this.errorCode);
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            const metadata = await this.xhr.put({
                url: this.getMetadataUrl(id, METADATA_SCOPE_GLOBAL, METADATA_TEMPLATE_SKILLS),
                headers: {
                    [HEADER_CONTENT_TYPE]: 'application/json-patch+json',
                },
                id: getTypedFileId(id),
                data: operations,
            });
            if (!this.isDestroyed()) {
                const cards = metadata.data.cards || [];
                this.merge(this.getCacheKey(id), FIELD_METADATA_SKILLS, metadata.data);
                this.getCache().set(this.getSkillsCacheKey(id), cards);
                this.successHandler(cards);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    /**
     * API for patching metadata on file
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {Object} template - Metadata template
     * @param {Array} operations - Array of JSON patch operations
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    async updateMetadata(
        file: BoxItem,
        template: MetadataTemplate,
        operations: JSONPatchOperations,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_UPDATE_METADATA;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        const { id, permissions } = file;
        if (!id || !permissions) {
            this.errorHandler(getBadItemError());
            return;
        }

        const canEdit = !!permissions.can_upload;

        if (!canEdit) {
            this.errorHandler(getBadPermissionsError());
            return;
        }

        try {
            const metadata = await this.xhr.put({
                url: this.getMetadataUrl(id, template.scope, template.templateKey),
                headers: {
                    [HEADER_CONTENT_TYPE]: 'application/json-patch+json',
                },
                id: getTypedFileId(id),
                data: operations,
            });
            if (!this.isDestroyed()) {
                const cache: APICache = this.getCache();
                const key = this.getMetadataCacheKey(id);
                const cachedMetadata = cache.get(key);
                const editor = this.createEditor(metadata.data, template, canEdit);
                if (cachedMetadata && cachedMetadata.editors) {
                    cachedMetadata.editors.splice(
                        cachedMetadata.editors.findIndex(({ instance }) => instance.id === editor.instance.id),
                        1,
                        editor,
                    );
                }
                this.successHandler(editor);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    /**
     * API for creating metadata on file
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {Object} template - Metadata template
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    async createMetadata(
        file: BoxItem,
        template: MetadataTemplate,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_CREATE_METADATA;
        if (!file || !template) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        const { id, permissions, is_externally_owned }: BoxItem = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        const canEdit = !!permissions.can_upload;
        const isProperties =
            template.templateKey === METADATA_TEMPLATE_PROPERTIES && template.scope === METADATA_SCOPE_GLOBAL;

        if (!canEdit || (is_externally_owned && !isProperties)) {
            errorCallback(getBadPermissionsError(), this.errorCode);
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            const metadata = await this.xhr.post({
                url: this.getMetadataUrl(id, template.scope, template.templateKey),
                id: getTypedFileId(id),
                data: {},
            });
            if (!this.isDestroyed()) {
                const cache: APICache = this.getCache();
                const key = this.getMetadataCacheKey(id);
                const cachedMetadata = cache.get(key);
                const editor = this.createEditor(metadata.data, template, canEdit);
                cachedMetadata.editors.push(editor);
                this.successHandler(editor);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    /**
     * API for deleting metadata on file
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {string} scope - Metadata instance scope
     * @param {string} template - Metadata template key
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    async deleteMetadata(
        file: BoxItem,
        template: MetadataTemplate,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_DELETE_METADATA;
        if (!file || !template) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        const { scope, templateKey }: MetadataTemplate = template;
        const { id, permissions }: BoxItem = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        if (!permissions.can_upload) {
            errorCallback(getBadPermissionsError(), this.errorCode);
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            await this.xhr.delete({
                url: this.getMetadataUrl(id, scope, templateKey),
                id: getTypedFileId(id),
            });
            if (!this.isDestroyed()) {
                const cache: APICache = this.getCache();
                const key = this.getMetadataCacheKey(id);
                const metadata = cache.get(key);
                metadata.editors.splice(
                    metadata.editors.findIndex(
                        editor => editor.template.scope === scope && editor.template.templateKey === templateKey,
                    ),
                    1,
                );
                this.successHandler();
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }
}

export default Metadata;
