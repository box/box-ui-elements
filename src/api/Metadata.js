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
    ERROR_CODE_FETCH_EDITORS,
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
    getMetadataTemplateUrl(scope: string): string {
        return `${this.getBaseApiUrl()}/metadata_templates/${scope}`;
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

        const visibleFields = (template.fields && template.fields.filter(field => field && !field.hidden)) || [];

        return {
            template: {
                ...template,
                fields: visibleFields,
            },
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
    async getTemplates(id: string, scope: string): Promise<Array<MetadataEditorTemplate>> {
        let templates = {};
        try {
            templates = await this.xhr.get({
                url: this.getMetadataTemplateUrl(scope),
                id: getTypedFileId(id),
            });
        } catch (e) {
            const { status } = e;
            if (isUserCorrectableError(status)) {
                throw e;
            }
        }

        return getProp(templates, 'data.entries', []).filter(
            template => !template.hidden && template.templateKey !== METADATA_TEMPLATE_CLASSIFICATION,
        );
    }

    /**
     * Gets metadata instances for file
     *
     * @param {string} id - file id
     * @return {Object} array of metadata instances
     */
    async getInstances(id: string): Promise<Array<MetadataInstance>> {
        return getProp(
            await this.xhr.get({
                url: this.getMetadataUrl(id),
                id: getTypedFileId(id),
            }),
            'data.entries',
            [],
        );
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
        const { id, permissions } = file;
        if (!id || !permissions) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        const canEdit = !!permissions.can_upload;

        if (!canEdit) {
            errorCallback(getBadPermissionsError(), this.errorCode);
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

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

    /**
     * API for getting metadata editors
     *
     * @param {string} id - box file id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    async getEditors(
        file: BoxItem,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        getMetadata?: Function,
        hasMetadataFeature: boolean,
        forceFetch: boolean = false,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_FETCH_EDITORS;
        const { id, permissions, is_externally_owned }: BoxItem = file;
        if (!id || !permissions) {
            errorCallback(getBadItemError(), this.errorCode);
            return;
        }

        const cache: APICache = this.getCache();
        const key = this.getMetadataCacheKey(id);
        const editors: Array<MetadataEditor> = [];
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        // Clear the cache if needed
        if (forceFetch) {
            cache.unset(key);
        }

        // Return the Cache value if it exists
        if (cache.has(key)) {
            successCallback(cache.get(key));
            return;
        }

        try {
            // Metadata instances
            const instances: Array<MetadataInstance> = await this.getInstances(id);

            // Metadata instances and templates from webapp
            // This will be removed soon
            const legacyInstances = getMetadata ? await getMetadata(id) : null;

            // Get custom properties template
            const customPropertiesTemplate: MetadataEditorTemplate = this.getCustomPropertiesTemplate();

            // Get templates for the enterprise  of the current user and
            // not templates from the enterprise of file owner if collabed
            const enterpriseTemplates: Array<MetadataEditorTemplate> = hasMetadataFeature
                ? await this.getTemplates(id, METADATA_SCOPE_ENTERPRISE)
                : [];

            // Get global templates defined by box
            const globalTemplates: Array<MetadataEditorTemplate> = await this.getTemplates(id, METADATA_SCOPE_GLOBAL);

            // Templates that can be added by the user.
            // This will only be current user's enterprise templates
            // and only global properties.
            let userAddableTemplates: Array<MetadataEditorTemplate> = [];
            if (hasMetadataFeature) {
                userAddableTemplates = is_externally_owned
                    ? [customPropertiesTemplate]
                    : [customPropertiesTemplate].concat(enterpriseTemplates);
            }

            // Templates that can have an associated instance.
            // This will be all templates.
            const templates: Array<MetadataEditorTemplate> = [customPropertiesTemplate].concat(
                enterpriseTemplates,
                globalTemplates,
            );

            if (this.isDestroyed()) {
                return;
            }

            instances.forEach(instance => {
                const templateKey = instance.$template;
                const scope = instance.$scope;
                let template = templates.find(t => t.templateKey === templateKey && t.scope === scope);

                if (!template && legacyInstances && legacyInstances.entries && legacyInstances.entries.length > 0) {
                    template = this.createTemplateFromLegacy(legacyInstances.entries, templateKey, scope);
                }

                if (template && !template.hidden) {
                    editors.push(this.createEditor(instance, template, !!permissions.can_upload));
                }
            });

            const metadata = {
                editors,
                templates: userAddableTemplates,
            };
            cache.set(key, metadata);
            this.successHandler(metadata);
        } catch (e) {
            this.errorHandler(e);
        }
    }

    createTemplateFromLegacy(legacyInstances: Array<any>, templateKey: string, scope: string): ?MetadataEditorTemplate {
        const fields = [];
        const legacyInstance = legacyInstances.find(instance => {
            const template = instance.type.substring(0, instance.type.indexOf('-'));
            return template === templateKey && instance.scope === scope;
        });

        if (!legacyInstance) {
            return null;
        }

        legacyInstance.fields.forEach(({ key, type, displayName, options, description, editor }) => {
            let v2Type = type;
            if (editor === 'calendar') {
                v2Type = 'date';
            } else if (editor === 'dropdown') {
                v2Type = 'enum';
            } else if (editor === 'multipleSelection') {
                v2Type = 'multiSelect';
            }

            fields.push({
                id: uniqueId('metadata_field_'),
                type: v2Type,
                key,
                displayName,
                description,
                options: Array.isArray(options) ? options.map(option => ({ key: option.value })) : undefined,
            });
        });

        return {
            id: legacyInstance.type,
            scope,
            templateKey,
            displayName: legacyInstance.displayName,
            fields,
            hidden: legacyInstance.hidden,
        };
    }
}

export default Metadata;
