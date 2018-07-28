/**
 * @flow
 * @file Helper for the box metadata related API
 * @author Box
 */

import getProp from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import File from './File';
import { getBadItemError, getBadPermissionsError } from '../util/error';
import { getTypedFileId } from '../util/file';
import {
    HEADER_CONTENT_TYPE,
    METADATA_SCOPE_ENTERPRISE,
    METADATA_SCOPE_GLOBAL,
    METADATA_TEMPLATE_PROPERTIES,
    METADATA_TEMPLATE_SKILLS,
    FIELD_METADATA_SKILLS,
    CACHE_PREFIX_METADATA
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
     * Utility to create editors from metadata instances
     * and metadata templates.
     *
     * @param {Object} instance - metadata instance
     * @param {Object} template - metadata tempalte
     * @param {boolean} canEdit - is instance editable
     * @return {Object} metadata editor
     */
    createEditor(instance: MetadataInstance, template: MetadataEditorTemplate, canEdit: boolean): MetadataEditor {
        const data = {};
        Object.keys(instance).forEach((key) => {
            if (!key.startsWith('$')) {
                data[key] = instance[key];
            }
        });
        return {
            template,
            instance: {
                id: instance.$id,
                canEdit: instance.$canEdit && canEdit,
                data
            }
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
        return getProp(
            await this.xhr.get({
                url: this.getMetadataTemplateUrl(scope),
                id: getTypedFileId(id)
            }),
            'data.entries',
            []
        ).filter((template) => !template.hidden);
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
                id: getTypedFileId(id)
            }),
            'data.entries',
            []
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
        errorCallback: Function,
        forceFetch: boolean = false
    ): Promise<void> {
        const { id }: BoxItem = file;
        if (!id) {
            errorCallback(getBadItemError());
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
            data: getProp(file, FIELD_METADATA_SKILLS)
        };

        try {
            if (!skills.data) {
                skills = await this.xhr.get({
                    url: this.getMetadataUrl(id, METADATA_SCOPE_GLOBAL, METADATA_TEMPLATE_SKILLS),
                    id: getTypedFileId(id)
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
        errorCallback: Function
    ): Promise<void> {
        const { id, permissions } = file;
        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return;
        }

        if (!permissions.can_upload) {
            errorCallback(getBadPermissionsError());
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            const metadata = await this.xhr.put({
                url: this.getMetadataUrl(id, METADATA_SCOPE_GLOBAL, METADATA_TEMPLATE_SKILLS),
                headers: { [HEADER_CONTENT_TYPE]: 'application/json-patch+json' },
                id: getTypedFileId(id),
                data: operations
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
        template: MetadataEditorTemplate,
        operations: JsonPatchData,
        successCallback: Function,
        errorCallback: Function
    ): Promise<void> {
        const { id, permissions } = file;
        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return;
        }

        const canEdit = !!permissions.can_upload;

        if (!canEdit) {
            errorCallback(getBadPermissionsError());
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            const metadata = await this.xhr.put({
                url: this.getMetadataUrl(id, template.scope, template.templateKey),
                headers: { [HEADER_CONTENT_TYPE]: 'application/json-patch+json' },
                id: getTypedFileId(id),
                data: operations
            });
            if (!this.isDestroyed()) {
                const cache: APICache = this.getCache();
                const key = this.getMetadataCacheKey(id);
                const cachedMetadata = cache.get(key);
                const editor = this.createEditor(metadata.data, template, canEdit);
                cachedMetadata.editors.splice(
                    cachedMetadata.editors.findIndex(({ instance }) => instance.id === editor.instance.id),
                    1,
                    editor
                );
                this.successHandler();
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
        errorCallback: Function
    ): Promise<void> {
        if (!file || !template) {
            errorCallback(getBadItemError());
            return;
        }

        const { id, permissions, is_externally_owned }: BoxItem = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return;
        }

        const canEdit = !!permissions.can_upload;
        const isProperties =
            template.templateKey === METADATA_TEMPLATE_PROPERTIES && template.scope === METADATA_SCOPE_GLOBAL;

        if (!canEdit || (is_externally_owned && !isProperties)) {
            errorCallback(getBadPermissionsError());
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            const metadata = await this.xhr.post({
                url: this.getMetadataUrl(id, template.scope, template.templateKey),
                id: getTypedFileId(id),
                data: {}
            });
            if (!this.isDestroyed()) {
                const cache: APICache = this.getCache();
                const key = this.getMetadataCacheKey(id);
                const cachedMetadata = cache.get(key);
                const editor = this.createEditor(metadata.data, template, canEdit);
                cachedMetadata.editors.push(editor);
                this.successHandler();
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
        errorCallback: Function
    ): Promise<void> {
        if (!file || !template) {
            errorCallback(getBadItemError());
            return;
        }

        const { scope, templateKey }: MetadataEditorTemplate = template;
        const { id, permissions, is_externally_owned }: BoxItem = file;
        const isProperties = templateKey === METADATA_TEMPLATE_PROPERTIES && scope === METADATA_SCOPE_GLOBAL;

        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return;
        }

        if (!permissions.can_upload || (is_externally_owned && !isProperties)) {
            errorCallback(getBadPermissionsError());
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            await this.xhr.delete({
                url: this.getMetadataUrl(id, scope, templateKey),
                id: getTypedFileId(id)
            });
            if (!this.isDestroyed()) {
                const cache: APICache = this.getCache();
                const key = this.getMetadataCacheKey(id);
                const metadata = cache.get(key);
                metadata.editors.splice(
                    metadata.editors.findIndex(
                        (editor) => editor.template.scope === scope && editor.template.templateKey === templateKey
                    ),
                    1
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
        errorCallback: Function,
        getMetadata?: Function,
        forceFetch: boolean = false
    ): Promise<void> {
        const { id, permissions, is_externally_owned }: BoxItem = file;
        if (!id || !permissions) {
            errorCallback(getBadItemError());
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
            const instances: Array<MetadataInstance> = await this.getInstances(id);
            const legacyInstances = getMetadata ? await getMetadata(id) : null;
            const customPropertiesTemplate: Array<MetadataEditorTemplate> = [
                {
                    id: uniqueId('metadata_template_'),
                    scope: METADATA_SCOPE_GLOBAL,
                    templateKey: METADATA_TEMPLATE_PROPERTIES,
                    hidden: false
                }
            ];
            const templates: Array<MetadataEditorTemplate> = customPropertiesTemplate
                .concat(await this.getTemplates(id, METADATA_SCOPE_ENTERPRISE))
                .concat(await this.getTemplates(id, METADATA_SCOPE_GLOBAL));

            if (this.isDestroyed()) {
                return;
            }

            instances.forEach((instance) => {
                const templateKey = instance.$template;
                const scope = instance.$scope;
                let template = templates.find((t) => t.templateKey === templateKey && t.scope === scope);

                if (!template && legacyInstances && legacyInstances.entries && legacyInstances.entries.length > 0) {
                    template = this.createTemplateFromLegacy(legacyInstances.entries, templateKey, scope);
                }

                if (template && !template.hidden) {
                    editors.push(this.createEditor(instance, template, !!permissions.can_upload));
                }
            });

            const metadata = { editors, templates: is_externally_owned ? customPropertiesTemplate : templates };
            cache.set(key, metadata);
            this.successHandler(metadata);
        } catch (e) {
            this.errorHandler(e);
        }
    }

    createTemplateFromLegacy(legacyInstances: Array<any>, templateKey: string, scope: string): ?MetadataEditorTemplate {
        const fields = [];
        const legacyInstance = legacyInstances.find((instance) => {
            const template = instance.type.substring(0, instance.type.indexOf('-'));
            return template === templateKey && instance.scope === scope;
        });

        if (!legacyInstance) {
            return null;
        }

        legacyInstance.fields.forEach(({ key, type, displayName, options, description }) => {
            fields.push({
                id: uniqueId('metadata_field_'),
                type,
                key,
                displayName,
                description,
                options: Array.isArray(options) ? options.map((option) => ({ key: option.value })) : undefined
            });
        });

        return {
            id: legacyInstance.type,
            scope,
            templateKey,
            displayName: legacyInstance.displayName,
            fields,
            hidden: legacyInstance.hidden
        };
    }
}

export default Metadata;
