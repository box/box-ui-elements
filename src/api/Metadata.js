/**
 * @flow
 * @file Helper for the box metadata related API
 * @author Box
 */

import getProp from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import File from './File';
import { getBadItemError, getBadPermissionsError, isUserCorrectableError } from '../util/error';
import { getTypedFileId } from '../util/file';
import {
    ERROR_CODE_FETCH_CLASSIFICATION,
    HEADER_CONTENT_TYPE,
    METADATA_SCOPE_ENTERPRISE,
    METADATA_SCOPE_GLOBAL,
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
     * @param {string} id - a box file id
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
     * API URL for metadata templates
     *
     * @param {string} scope - metadata scope or id
     * @return {string} base url for files
     */
    getMetadataTemplateUrl(scope: string, isInstanceId?: boolean): string {
        const baseUrl = `${this.getBaseApiUrl()}/metadata_templates`;
        if (isInstanceId) {
            return `${baseUrl}?metadata_instance_id=${scope}`;
        }
        return `${baseUrl}/${scope}`;
    }

    /**
     * Returns the custom properties template
     *
     * @return {Object} temaplte for custom properties
     */
    getCustomPropertiesTemplate(): MetadataEditorTemplate {
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
    createEditor(instance: MetadataInstance, template: MetadataEditorTemplate, canEdit: boolean): MetadataEditor {
        const data = {};
        Object.keys(instance).forEach(key => {
            if (!key.startsWith('$')) {
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
     * @return {Object} array of metadata templates
     */
    async getTemplates(id: string, scope: string, isInstanceId?: boolean): Promise<Array<MetadataEditorTemplate>> {
        this.errorCode = ERROR_CODE_FETCH_METADATA_TEMPLATES;
        let templates = {};
        try {
            templates = await this.xhr.get({
                url: this.getMetadataTemplateUrl(scope, isInstanceId),
                id: getTypedFileId(id),
                params: {
                    limit: 1000, // internal hard limit is 500
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
     * Gets metadata instances for a box file
     *
     * @param {string} id - file id
     * @return {Object} array of metadata instances
     */
    async getInstances(id: string): Promise<Array<MetadataInstance>> {
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
        customPropertiesTemplate: MetadataEditorTemplate,
        enterpriseTemplates: Array<MetadataEditorTemplate>,
        hasMetadataFeature: boolean,
        isExternallyOwned?: boolean,
    ): Array<MetadataEditorTemplate> {
        let userAddableTemplates: Array<MetadataEditorTemplate> = [];
        if (hasMetadataFeature) {
            userAddableTemplates = isExternallyOwned
                ? [customPropertiesTemplate]
                : [customPropertiesTemplate].concat(enterpriseTemplates);
        }
        return userAddableTemplates.filter(template => template.templateKey !== METADATA_TEMPLATE_CLASSIFICATION);
    }

    /**
     * Extracts classification for different representation in the UI.
     *
     * @param {string} id - box file id
     * @param {Array} instances - metadata instances
     * @return {Array} metadata instances without classification
     */
    extractClassification(id: string, instances: Array<MetadataInstance>): Array<MetadataInstance> {
        const index = instances.findIndex(instance => instance.$template === METADATA_TEMPLATE_CLASSIFICATION);
        if (index !== -1) {
            const classification = instances.splice(index, 1);
            const cache: APICache = this.getCache();
            const key = this.getClassificationCacheKey(id);
            cache.set(key, classification[0]);
        }
        return instances;
    }

    /**
     * Finds template for a given metadata instance.
     *
     * @param {string} id - box file id
     * @param {Object} instance - metadata instance
     * @param {Array} templates - metadata templates
     * @return {Object|undefined} template for metadata instance
     */
    async getTemplateForInstance(
        id: string,
        instance: MetadataInstance,
        templates: Array<MetadataEditorTemplate>,
    ): Promise<?MetadataEditorTemplate> {
        const instanceId = instance.$id;
        const templateKey = instance.$template;
        const scope = instance.$scope;
        let template = templates.find(t => t.templateKey === templateKey && t.scope === scope);
        if (scope === METADATA_SCOPE_ENTERPRISE && !template) {
            // If the template does not exist, it can be a template from another
            // enterprise because the user is viewing a collaborated file.
            const crossEnterpriseTemplate = await this.getTemplates(id, instanceId, true);
            // The API always returns an array of at most one item
            template = crossEnterpriseTemplate[0]; // eslint-disable-line
        }
        return template;
    }

    /**
     * Creates and returns metadata editors.
     *
     * @param {string} id - box file id
     * @param {Array} instances - metadata instances
     * @param {Object} customPropertiesTemplate - custom properties template
     * @param {Array} enterpriseTemplates - enterprise templates
     * @param {Array} globalTemplates - global templates
     * @param {boolean} canEdit - metadata editability
     * @return {Array} metadata editors
     */
    async getEditors(
        id: string,
        instances: Array<MetadataInstance>,
        customPropertiesTemplate: MetadataEditorTemplate,
        enterpriseTemplates: Array<MetadataEditorTemplate>,
        globalTemplates: Array<MetadataEditorTemplate>,
        canEdit: boolean,
    ): Promise<Array<MetadataEditor>> {
        // All usable templates for metadata instances
        const templates: Array<MetadataEditorTemplate> = [customPropertiesTemplate].concat(
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
                const template: ?MetadataEditorTemplate = await this.getTemplateForInstance(id, instance, templates);
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
     * @param {string} fileId - box file id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {boolean} hasMetadataFeature - metadata feature check
     * @param {Object} options - fetch options
     * @return {Promise}
     */
    async getMetadata(
        file: BoxItem,
        successCallback: ({ editors: Array<MetadataEditor>, templates: Array<MetadataEditorTemplate> }) => void,
        errorCallback: ElementsErrorCallback,
        hasMetadataFeature: boolean,
        options: FetchOptions = {},
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
            const customPropertiesTemplate: MetadataEditorTemplate = this.getCustomPropertiesTemplate();
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

            if (this.isDestroyed()) {
                return;
            }

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
            this.successHandler(metadata);
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
        operations: JsonPatchData,
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
     * Gets classification for a file.
     *
     * @param {string} fileId - The file id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {boolean|void} [options.forceFetch] - Optionally Bypasses the cache
     * @param {boolean|void} [options.refreshCache] - Optionally Updates the cache
     * @return {Promise}
     */
    async getClassification(
        fileId: string,
        successCallback: Function,
        errorCallback: Function,
        options: FetchOptions = {},
    ): Promise<void> {
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.errorCode = ERROR_CODE_FETCH_CLASSIFICATION;

        if (!fileId) {
            this.errorHandler(getBadItemError());
            return;
        }

        const cache: APICache = this.getCache();
        const key = this.getClassificationCacheKey(fileId);

        // Clear the cache if needed
        if (options.forceFetch) {
            cache.unset(key);
        }

        // Return the Cache value if it exists
        if (cache.has(key)) {
            this.successHandler(cache.get(key));
            if (!options.refreshCache) {
                return;
            }
        }

        try {
            const classification = await this.xhr.get({
                url: this.getMetadataUrl(fileId, METADATA_SCOPE_ENTERPRISE, METADATA_TEMPLATE_CLASSIFICATION),
                id: getTypedFileId(fileId),
            });

            if (!this.isDestroyed()) {
                cache.set(key, classification.data);
                this.successHandler(cache.get(key));
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
        template: MetadataEditorTemplate,
        operations: JsonPatchData,
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
                cachedMetadata.editors.splice(
                    cachedMetadata.editors.findIndex(({ instance }) => instance.id === editor.instance.id),
                    1,
                    editor,
                );
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
        template: MetadataEditorTemplate,
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
        template: MetadataEditorTemplate,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_DELETE_METADATA;
        if (!file || !template) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        const { scope, templateKey }: MetadataEditorTemplate = template;
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
