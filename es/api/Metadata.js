const _excluded = ["displayName", "display_name"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the Box metadata related API
 * @author Box
 */

import cloneDeep from 'lodash/cloneDeep';
import lodashFilter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import getProp from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import lodashMap from 'lodash/map';
import partition from 'lodash/partition';
import uniq from 'lodash/uniq';
import uniqueId from 'lodash/uniqueId';
import { getBadItemError, getBadPermissionsError, isUserCorrectableError } from '../utils/error';
import { getTypedFileId, getTypedFolderId } from '../utils/file';
import { handleOnAbort, formatMetadataFieldValue } from './utils';
import File from './File';
import { HEADER_CONTENT_TYPE, METADATA_SCOPE_ENTERPRISE, METADATA_SCOPE_GLOBAL, METADATA_TEMPLATE_FETCH_LIMIT, METADATA_TEMPLATE_PROPERTIES, METADATA_TEMPLATE_CLASSIFICATION, METADATA_TEMPLATE_SKILLS, METADATA_SUGGESTIONS_CONFIDENCE_EXPERIMENTAL, FIELD_METADATA_SKILLS, CACHE_PREFIX_METADATA, ERROR_CODE_UPDATE_SKILLS, ERROR_CODE_UPDATE_METADATA, ERROR_CODE_CREATE_METADATA, ERROR_CODE_DELETE_METADATA, ERROR_CODE_FETCH_METADATA, ERROR_CODE_FETCH_METADATA_TEMPLATES, ERROR_CODE_FETCH_SKILLS, ERROR_CODE_FETCH_METADATA_OPTIONS, ERROR_CODE_FETCH_METADATA_SUGGESTIONS, ERROR_CODE_EMPTY_METADATA_SUGGESTIONS, TYPE_FILE, ERROR_CODE_FETCH_METADATA_TAXONOMY_NODE, ERROR_CODE_FETCH_METADATA_TAXONOMY } from '../constants';
class Metadata extends File {
  /**
   * Creates a key for the metadata cache
   *
   * @param {string} id - Folder id
   * @return {string} key
   */
  getMetadataCacheKey(id) {
    return `${CACHE_PREFIX_METADATA}${id}`;
  }

  /**
   * Creates a key for the skills cache
   *
   * @param {string} id - Folder id
   * @return {string} key
   */
  getSkillsCacheKey(id) {
    return `${this.getMetadataCacheKey(id)}_skills`;
  }

  /**
   * Creates a key for the classification cache
   *
   * @param {string} id - Folder id
   * @return {string} key
   */
  getClassificationCacheKey(id) {
    return `${this.getMetadataCacheKey(id)}_classification`;
  }

  /**
   * Creates a key for the metadata template schema cache
   *
   * @param {string} templateKey - template key
   * @return {string} key
   */
  getMetadataTemplateSchemaCacheKey(templateKey) {
    return `${CACHE_PREFIX_METADATA}template_schema_${templateKey}`;
  }

  /**
   * API URL for metadata
   *
   * @param {string} id - a Box file id
   * @param {string} field - metadata field
   * @return {string} base url for files
   */
  getMetadataUrl(id, scope, template) {
    const baseUrl = `${this.getUrl(id)}/metadata`;
    if (scope && template) {
      return `${baseUrl}/${scope}/${template}`;
    }
    return baseUrl;
  }

  /**
   * API URL for metadata
   *
   * @param {string} id - a Box folder id
   * @param {string} field - metadata field
   * @return {string} base url for files
   */
  getMetadataUrlForFolder(id, scope, template) {
    const baseUrl = `${this.getBaseApiUrl()}/folders/${id}/metadata`;
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
  getMetadataTemplateUrl() {
    return `${this.getBaseApiUrl()}/metadata_templates`;
  }

  /**
   * API URL for metadata template for an instance
   *
   * @param {string} id - metadata instance id
   * @return {string} base url for files
   */
  getMetadataTemplateUrlForInstance(id) {
    return `${this.getMetadataTemplateUrl()}?metadata_instance_id=${id}`;
  }

  /**
   * API URL for getting metadata template schema by template key
   *
   * @param {string} templateKey - metadata template key
   * @return {string} API url for getting template schema by template key
   */
  getMetadataTemplateSchemaUrl(templateKey) {
    return `${this.getMetadataTemplateUrl()}/enterprise/${templateKey}/schema`;
  }

  /**
   * API URL for metadata templates
   *
   * @param {string} scope - metadata scope or id
   * @return {string} base url for files
   */
  getMetadataTemplateUrlForScope(scope) {
    return `${this.getMetadataTemplateUrl()}/${scope}`;
  }

  /**
   * Returns the custom properties template
   *
   * @return {Object} template for custom properties
   */
  getCustomPropertiesTemplate() {
    return {
      id: uniqueId('metadata_template_'),
      scope: METADATA_SCOPE_GLOBAL,
      templateKey: METADATA_TEMPLATE_PROPERTIES,
      hidden: false,
      fields: []
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
  createEditor(instance, template, canEdit) {
    const data = {};
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
        data
      }
    };
  }

  /**
   * API URL for taxonomies levels for templates
   *
   * @param {string} taxonomyPath - taxonomy path
   * @return {string} base url for files
   */
  getTaxonomyLevelsForTemplatesUrl(taxonomyPath) {
    return `${this.getBaseApiUrl()}/${taxonomyPath}`;
  }

  /**
   * Returns taxonomy path for API calls and level mapping
   *
   * @param {string} namespace
   * @param {string} taxonomyKey
   * @returns {string}
   */
  getTaxonomyPath(namespace, taxonomyKey) {
    if (!namespace || !taxonomyKey) {
      return null;
    }
    return `metadata_taxonomies/${namespace}/${taxonomyKey}`;
  }

  /**
   *
   * @param {Array<MetadataTemplate>} metadataTemplates
   * @param {string} id
   * @returns {Array<MetadataTemplate>}
   */
  async getTaxonomyLevelsForTemplates(metadataTemplates, id) {
    const templates = cloneDeep(metadataTemplates);
    const taxonomyFields = flatMap(templates, template => lodashFilter(template.fields, field => field.type === 'taxonomy' && !field.levels && (field.taxonomyKey || field.taxonomy_key)));
    if (isEmpty(taxonomyFields)) {
      return templates;
    }
    const taxonomyPaths = uniq(taxonomyFields.map(field => this.getTaxonomyPath(field.namespace, field.taxonomyKey || field.taxonomy_key)).filter(Boolean));
    const fetchPromises = taxonomyPaths.map(async taxonomyPath => {
      try {
        const result = await this.xhr.get({
          url: this.getTaxonomyLevelsForTemplatesUrl(taxonomyPath),
          id: getTypedFileId(id)
        });
        return {
          path: taxonomyPath,
          levels: result.data.levels || []
        };
      } catch (error) {
        throw new Error(`Failed to fetch taxonomy for path: ${taxonomyPath}`);
      }
    });
    const fetchResults = await Promise.all(fetchPromises);
    const taxonomyInfo = keyBy(fetchResults, 'path');
    return lodashMap(templates, template => {
      if (!template.fields) return template;
      const [fieldsToUpdate, restFields] = partition(template.fields, field => field.type === 'taxonomy' && !field.levels);
      if (isEmpty(fieldsToUpdate)) return template;
      const updatedFields = lodashMap(fieldsToUpdate, field => {
        const taxonomyPath = this.getTaxonomyPath(field.namespace, field.taxonomyKey || field.taxonomy_key);
        const levels = taxonomyInfo[taxonomyPath]?.levels || [];
        const taxonomyKey = field.taxonomyKey || field.taxonomy_key;
        delete field.taxonomy_key;
        return _objectSpread(_objectSpread({}, field), {}, {
          levels: lodashMap(levels, _ref => {
            let {
                displayName,
                display_name
              } = _ref,
              rest = _objectWithoutProperties(_ref, _excluded);
            return _objectSpread(_objectSpread({}, rest), {}, {
              displayName: displayName || display_name
            });
          }),
          taxonomyKey
        });
      });
      return _objectSpread(_objectSpread({}, template), {}, {
        fields: restFields.concat(updatedFields)
      });
    });
  }

  /**
   * Gets metadata templates for enterprise
   *
   * @param {string} id - file id
   * @param {string} scope - metadata scope
   * @param {string|void} [instanceId] - metadata instance id
   * @return {Object} array of metadata templates
   */
  async getTemplates(id, scope, instanceId) {
    this.errorCode = ERROR_CODE_FETCH_METADATA_TEMPLATES;
    let templates = {};
    const url = instanceId ? this.getMetadataTemplateUrlForInstance(instanceId) : this.getMetadataTemplateUrlForScope(scope);
    try {
      templates = await this.xhr.get({
        url,
        id: getTypedFileId(id),
        params: {
          limit: METADATA_TEMPLATE_FETCH_LIMIT // internal hard limit is 500
        }
      });
    } catch (e) {
      const {
        status
      } = e;
      if (isUserCorrectableError(status)) {
        throw e;
      }
    }
    templates = getProp(templates, 'data.entries', []);
    const templatesWithTaxonomies = await this.getTaxonomyLevelsForTemplates(templates, id);
    return templatesWithTaxonomies;
  }

  /**
   * Gets metadata template schema by template key
   *
   * @param {string} templateKey - template key
   * @return {Promise} Promise object of metadata template
   */
  async getSchemaByTemplateKey(templateKey) {
    const cache = this.getCache();
    const key = this.getMetadataTemplateSchemaCacheKey(templateKey);

    // Return cached value if it exists
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Fetch from API if not cached
    const url = this.getMetadataTemplateSchemaUrl(templateKey);
    const response = await this.xhr.get({
      url
    });

    // Cache the response
    cache.set(key, response);
    return response;
  }

  /**
   * Gets metadata instances for a Box file
   *
   * @param {string} id - file id
   * @param {boolean} isMetadataRedesign - feature flag
   * @return {Object} array of metadata instances
   */
  async getInstances(id, isMetadataRedesign = false) {
    this.errorCode = ERROR_CODE_FETCH_METADATA;
    const baseUrl = this.getMetadataUrl(id);
    const url = isMetadataRedesign ? `${baseUrl}?view=hydrated` : baseUrl;
    let instances = {};
    try {
      instances = await this.xhr.get({
        url,
        id: getTypedFileId(id)
      });
    } catch (e) {
      const {
        status
      } = e;
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
  getUserAddableTemplates(customPropertiesTemplate, enterpriseTemplates, hasMetadataFeature, isExternallyOwned) {
    let userAddableTemplates = [];
    if (hasMetadataFeature) {
      userAddableTemplates = isExternallyOwned ? [customPropertiesTemplate] : [customPropertiesTemplate].concat(enterpriseTemplates);
    }
    // Only templates that are not hidden and not classification
    return userAddableTemplates.filter(template => !template.hidden && template.templateKey !== METADATA_TEMPLATE_CLASSIFICATION);
  }

  /**
   * Extracts classification for different representation in the UI.
   *
   * @param {string} id - Box file id
   * @param {Array} instances - metadata instances
   * @return {Array} metadata instances without classification
   */
  extractClassification(id, instances) {
    const classification = instances.find(instance => instance.$template === METADATA_TEMPLATE_CLASSIFICATION);
    if (classification) {
      instances.splice(instances.indexOf(classification), 1);
      const cache = this.getCache();
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
  async getTemplateForInstance(id, instance, templates) {
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
  async getEditors(id, instances, customPropertiesTemplate, enterpriseTemplates, globalTemplates, canEdit) {
    // All usable templates for metadata instances
    const templates = [customPropertiesTemplate].concat(enterpriseTemplates, globalTemplates);

    // Create editors from each instance
    const editors = [];
    await Promise.all(instances.map(async instance => {
      const template = await this.getTemplateForInstance(id, instance, templates);
      if (template) {
        editors.push(this.createEditor(instance, template, canEdit));
      }
    }));
    return editors;
  }

  /**
   * Utility to concat instance and template into one entity.
   *
   * @param {Object} instance - metadata instance
   * @param {Object} template - metadata template
   * @param {boolean} canEdit - can user edit item
   * @return {Object} metadata template instance
   */
  createTemplateInstance(instance, template, canEdit) {
    const fields = [];

    // templateKey is unique identifier for the template,
    // but its value is set to 'properties' if instance was created using Custom Metadata option instead of template
    const isInstanceFromTemplate = template.templateKey !== METADATA_TEMPLATE_PROPERTIES;
    if (isInstanceFromTemplate) {
      // Get Metadata Fields for Instances created from predefined template
      const templateFields = template.fields || [];
      templateFields.forEach(field => {
        const value = formatMetadataFieldValue(field, instance[field.key]);
        fields.push(_objectSpread(_objectSpread({}, field), {}, {
          value
        }));
      });
    } else {
      // Get Metadata Fields for Custom Instances
      Object.keys(instance).forEach(key => {
        if (!key.startsWith('$')) {
          fields.push({
            key,
            type: 'string',
            value: instance[key]
          });
        }
      });
    }
    return {
      canEdit: instance.$canEdit && canEdit,
      displayName: template.displayName,
      hidden: template.hidden,
      id: template.id,
      fields,
      scope: template.scope,
      templateKey: template.templateKey,
      type: instance.$type
    };
  }

  /**
   * Creates and returns metadata entities.
   *
   * @param {string} id - Box file id
   * @param {Array} instances - metadata instances
   * @param {Object} customPropertiesTemplate - custom properties template
   * @param {Array} enterpriseTemplates - enterprise templates
   * @param {Array} globalTemplates - global templates
   * @param {boolean} canEdit
   * @return {Array} metadata editors
   */
  async getTemplateInstances(id, instances, customPropertiesTemplate, enterpriseTemplates, globalTemplates, canEdit) {
    // Get all usable templates for metadata instances
    const templates = [customPropertiesTemplate].concat(enterpriseTemplates, globalTemplates);

    // Create Metadata Template Instance from each instance
    const templateInstances = [];
    await Promise.all(instances.map(async instance => {
      const template = await this.getTemplateForInstance(id, instance, templates);
      if (template) {
        templateInstances.push(this.createTemplateInstance(instance, template, canEdit));
      }
    }));
    return templateInstances;
  }

  /**
   * API for getting metadata editors
   *
   * @param {Object} file
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @param {boolean} hasMetadataFeature - metadata feature check
   * @param {Object} options - fetch options
   * @param {boolean} isMetadataRedesign - is Metadata Sidebar redesigned
   * @return {Promise}
   */
  async getMetadata(file, successCallback, errorCallback, hasMetadataFeature, options = {}, isMetadataRedesign = false) {
    const {
      id,
      permissions,
      is_externally_owned
    } = file;
    this.errorCode = ERROR_CODE_FETCH_METADATA;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;

    // Check for valid file object.
    // Need to eventually check for upload permission.
    if (!id || !permissions) {
      this.errorHandler(getBadItemError());
      return;
    }
    const cache = this.getCache();
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
      const customPropertiesTemplate = this.getCustomPropertiesTemplate();
      const [instances, globalTemplates, enterpriseTemplates] = await Promise.all([this.getInstances(id, isMetadataRedesign), this.getTemplates(id, METADATA_SCOPE_GLOBAL), hasMetadataFeature ? this.getTemplates(id, METADATA_SCOPE_ENTERPRISE) : Promise.resolve([])]);

      // Filter out classification
      const filteredInstances = this.extractClassification(id, instances);
      const templateInstances = isMetadataRedesign ? await this.getTemplateInstances(id, filteredInstances, customPropertiesTemplate, enterpriseTemplates, globalTemplates, !!permissions.can_upload) : [];
      const editors = !isMetadataRedesign ? await this.getEditors(id, filteredInstances, customPropertiesTemplate, enterpriseTemplates, globalTemplates, !!permissions.can_upload) : [];
      const metadata = {
        editors,
        templateInstances,
        templates: this.getUserAddableTemplates(customPropertiesTemplate, enterpriseTemplates, hasMetadataFeature, is_externally_owned)
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
  async getSkills(file, successCallback, errorCallback, forceFetch = false) {
    this.errorCode = ERROR_CODE_FETCH_SKILLS;
    const {
      id
    } = file;
    if (!id) {
      errorCallback(getBadItemError(), this.errorCode);
      return;
    }
    const cache = this.getCache();
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
  async updateSkills(file, operations, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_UPDATE_SKILLS;
    const {
      id,
      permissions
    } = file;
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
          [HEADER_CONTENT_TYPE]: 'application/json-patch+json'
        },
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
   * API for patching metadata on item (file/folder)
   *
   * @param {BoxItem} item - File/Folder object for which we are changing the description
   * @param {Object} template - Metadata template
   * @param {Array} operations - Array of JSON patch operations
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @param {boolean} suppressCallbacks - Boolean to decide whether suppress callbacks or not
   * @return {Promise}
   */
  async updateMetadata(item, template, operations, successCallback, errorCallback, suppressCallbacks) {
    this.errorCode = ERROR_CODE_UPDATE_METADATA;
    if (!suppressCallbacks) {
      // Only set callbacks when we intend to invoke them for this call
      // so that callers performing bulk operations can suppress per-item callbacks
      this.successCallback = successCallback;
      this.errorCallback = errorCallback;
    }
    const {
      id,
      permissions,
      type
    } = item;
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
        url: type === 'file' ? this.getMetadataUrl(id, template.scope, template.templateKey) : this.getMetadataUrlForFolder(id, template.scope, template.templateKey),
        headers: {
          [HEADER_CONTENT_TYPE]: 'application/json-patch+json'
        },
        id: type === 'file' ? getTypedFileId(id) : getTypedFolderId(id),
        data: operations
      });
      if (!this.isDestroyed()) {
        const cache = this.getCache();
        const key = this.getMetadataCacheKey(id);
        const cachedMetadata = cache.get(key);
        const editor = this.createEditor(metadata.data, template, canEdit);
        if (cachedMetadata && cachedMetadata.editors) {
          cachedMetadata.editors.splice(cachedMetadata.editors.findIndex(({
            instance
          }) => instance.id === editor.instance.id), 1, editor);
        }
        if (!suppressCallbacks) {
          this.successHandler(editor);
        }
      }
    } catch (e) {
      if (suppressCallbacks) {
        // Let the caller decide how to handle errors (e.g., aggregate for bulk operations)
        throw e;
      }
      this.errorHandler(e);
    }
  }

  /**
   * API for bulk patching metadata on items (file/folder)
   *
   * @param {BoxItem[]} items - File/Folder object for which we are changing the description
   * @param {Object} template - Metadata template
   * @param {Array} operations - Array of JSON patch operations for each item
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {Promise}
   */
  async bulkUpdateMetadata(items, template, operations, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_UPDATE_METADATA;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    try {
      const updatePromises = items.map(async (item, index) => {
        try {
          // Suppress per-item callbacks; aggregate outcome at the bulk level only
          await this.updateMetadata(item, template, operations[index], successCallback, errorCallback, true);
        } catch (e) {
          // Re-throw to be caught by Promise.all and handled once below
          throw new Error(`Failed to update metadata: ${e.message || e}`);
        }
      });
      await Promise.all(updatePromises);
      if (!this.isDestroyed()) {
        this.successHandler();
      }
    } catch (e) {
      if (!this.isDestroyed()) {
        this.errorHandler(e);
      }
    }
  }

  /**
   * API for patching metadata on file
   *
   * @param {BoxItem} file - File object for which we are changing the description
   * @param {Object} templateInstance - Metadata template instance
   * @param {Array} operations - Array of JSON patch operations
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {Promise}
   */
  async updateMetadataRedesign(file, templateInstance, operations, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_UPDATE_METADATA;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    const {
      id,
      permissions
    } = file;
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
      await this.xhr.put({
        url: this.getMetadataUrl(id, templateInstance.scope, templateInstance.templateKey),
        headers: {
          [HEADER_CONTENT_TYPE]: 'application/json-patch+json'
        },
        id: getTypedFileId(id),
        data: operations
      });
      if (!this.isDestroyed()) {
        const cache = this.getCache();
        const key = this.getMetadataCacheKey(id);
        const cachedMetadata = cache.get(key);
        if (cachedMetadata && cachedMetadata.templateInstances) {
          cachedMetadata.templateInstances.splice(cachedMetadata.templateInstances.findIndex(instance => instance.scope === templateInstance.scope && instance.templateKey === templateInstance.templateKey), 1, templateInstance);
        }
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
  async createMetadata(file, template, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_CREATE_METADATA;
    if (!file || !template) {
      errorCallback(getBadItemError(), this.errorCode);
      return;
    }
    const {
      id,
      permissions,
      is_externally_owned
    } = file;
    if (!id || !permissions) {
      errorCallback(getBadItemError(), this.errorCode);
      return;
    }
    const canEdit = !!permissions.can_upload;
    const isProperties = template.templateKey === METADATA_TEMPLATE_PROPERTIES && template.scope === METADATA_SCOPE_GLOBAL;
    if (!canEdit || is_externally_owned && !isProperties) {
      errorCallback(getBadPermissionsError(), this.errorCode);
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
        const cache = this.getCache();
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
   * API for creating metadata on file
   *
   * @param {BoxItem} file - File object for which we are changing the description
   * @param {Object} template - Metadata Redesign template
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {Promise}
   */
  async createMetadataRedesign(file, template, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_CREATE_METADATA;
    if (!file || !template) {
      errorCallback(getBadItemError(), this.errorCode);
      return;
    }
    const {
      id,
      permissions,
      is_externally_owned
    } = file;
    if (!id || !permissions) {
      errorCallback(getBadItemError(), this.errorCode);
      return;
    }
    const canEdit = !!permissions.can_upload;
    const isProperties = template.templateKey === METADATA_TEMPLATE_PROPERTIES && template.scope === METADATA_SCOPE_GLOBAL;
    if (!canEdit || is_externally_owned && !isProperties) {
      errorCallback(getBadPermissionsError(), this.errorCode);
      return;
    }
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    try {
      const fieldsValues = template.fields.reduce((acc, obj) => {
        let {
          value
        } = obj;

        // API does not accept string for float type
        if (obj.type === 'float' && value) {
          value = parseFloat(obj.value);
        }

        // API does not accept empty string for enum type
        if (obj.type === 'enum' && value && value.length === 0) {
          value = undefined;
        }

        // API expects values as an array of strings
        if (obj.type === 'taxonomy' && value && Array.isArray(value)) {
          value = value.map(option => option.value);
        }
        acc[obj.key] = value;
        return acc;
      }, {});
      const metadata = await this.xhr.post({
        url: this.getMetadataUrl(id, template.scope, template.templateKey),
        id: getTypedFileId(id),
        data: fieldsValues
      });
      if (!this.isDestroyed()) {
        const cache = this.getCache();
        const key = this.getMetadataCacheKey(id);
        const cachedMetadata = cache.get(key);
        const templateInstance = _objectSpread(_objectSpread({}, template), {}, {
          type: metadata.data.$type
        });
        cachedMetadata.templateInstances.push(templateInstance);
        this.successHandler(templateInstance);
      }
    } catch (e) {
      this.errorHandler(e);
    }
  }

  /**
   * API for deleting metadata on file
   *
   * @param {BoxItem} file - File object for which we are changing the description
   * @param {string} template - Metadata template key
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @param isMetadataRedesign
   * @return {Promise}
   */
  async deleteMetadata(file, template, successCallback, errorCallback, isMetadataRedesign = false) {
    this.errorCode = ERROR_CODE_DELETE_METADATA;
    if (!file || !template) {
      errorCallback(getBadItemError(), this.errorCode);
      return;
    }
    const {
      scope,
      templateKey
    } = template;
    const {
      id,
      permissions
    } = file;
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
        id: getTypedFileId(id)
      });
      if (!this.isDestroyed()) {
        const cache = this.getCache();
        const key = this.getMetadataCacheKey(id);
        const metadata = cache.get(key);
        if (isMetadataRedesign) {
          metadata.templateInstances.splice(metadata.templateInstances.findIndex(instance => instance.scope === scope && instance.templateKey === templateKey), 1);
        } else {
          metadata.editors.splice(metadata.editors.findIndex(editor => editor.template.scope === scope && editor.template.templateKey === templateKey), 1);
        }
        this.successHandler();
      }
    } catch (e) {
      this.errorHandler(e);
    }
  }

  /**
   * API URL for metadata suggestions
   *
   * @return {string} url for metadata suggestions
   */
  getMetadataSuggestionsUrl() {
    return `${this.getBaseApiUrl()}/metadata_instances/suggestions`;
  }

  /**
   * Gets suggestions for possible metadata key-value pairs for the given item
   *
   * @param {string} id - Id of the item to pull metadata from
   * @param {string} type - Type of item. Only "file” is supported.
   * @param {string} scope - The metadata template scope
   * @param {string} templateKey - The metadata template key to apply
   * @param {string} confidence - The confidence level the suggestion must surpass. Only “experimental” is supported.
   * @return {Array<MetadataSuggestion>} array of metadata templates
   */
  async getMetadataSuggestions(id, type, scope, templateKey, confidence = METADATA_SUGGESTIONS_CONFIDENCE_EXPERIMENTAL) {
    this.errorCode = ERROR_CODE_FETCH_METADATA_SUGGESTIONS;
    if (!id || type !== TYPE_FILE) {
      throw getBadItemError();
    }
    if (!scope) {
      throw new Error('Missing scope');
    }
    if (!templateKey) {
      throw new Error('Missing templateKey');
    }
    if (confidence !== METADATA_SUGGESTIONS_CONFIDENCE_EXPERIMENTAL) {
      throw new Error(`Invalid confidence level: "${confidence}"`);
    }
    let suggestionsResponse = {};
    try {
      suggestionsResponse = await this.xhr.get({
        url: this.getMetadataSuggestionsUrl(),
        id: getTypedFileId(id),
        params: {
          item: `${type}_${id}`,
          scope,
          template_key: templateKey,
          confidence
        }
      });
    } catch (e) {
      const {
        status
      } = e;
      if (isUserCorrectableError(status)) {
        throw e;
      }
    }
    if (!isEmpty(suggestionsResponse) && getProp(suggestionsResponse, 'data.suggestions').length === 0) {
      this.errorCode = ERROR_CODE_EMPTY_METADATA_SUGGESTIONS;
      throw new Error('No suggestions found.');
    }
    return getProp(suggestionsResponse, 'data.suggestions', []);
  }

  /**
   * Build URL for metadata options associated to a taxonomy field.
   *
   * @param scope
   * @param templateKey
   * @param fieldKey
   * @returns {`${string}/metadata_templates/${string}/${string}/fields/${string}/options`}
   */
  getMetadataOptionsUrl(scope, templateKey, fieldKey) {
    return `${this.getBaseApiUrl()}/metadata_templates/${scope}/${templateKey}/fields/${fieldKey}/options`;
  }

  /**
   * Gets options associated with a taxonomy field.
   *
   * @param id
   * @param scope
   * @param templateKey
   * @param fieldKey
   * @param level
   * @param options
   * @returns {Promise<MetadataOptions>}
   */
  async getMetadataOptions(id, scope, templateKey, fieldKey, level, options) {
    this.errorCode = ERROR_CODE_FETCH_METADATA_OPTIONS;
    if (!id) {
      throw getBadItemError();
    }
    if (!scope) {
      throw new Error('Missing scope');
    }
    if (!templateKey) {
      throw new Error('Missing templateKey');
    }
    if (!fieldKey) {
      throw new Error('Missing fieldKey');
    }

    // 0 is a valid level value
    if (!level && level !== 0) {
      throw new Error('Missing level');
    }
    const {
      marker,
      searchInput: query_text,
      onlySelectableOptions,
      ancestorId: ancestor_id,
      level: optionsLevel,
      signal
    } = options;
    const params = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, marker ? {
      marker
    } : {}), query_text ? {
      query_text
    } : {}), optionsLevel ? {
      level: optionsLevel
    } : {}), ancestor_id ? {
      ancestor_id
    } : {}), onlySelectableOptions !== undefined ? {
      only_selectable_options: !!onlySelectableOptions
    } : {}), {}, {
      limit: 100
    });
    const url = this.getMetadataOptionsUrl(scope, templateKey, fieldKey);
    if (signal) {
      signal.onabort = () => handleOnAbort(this.xhr);
    }
    const metadataOptions = await this.xhr.get({
      url,
      id: getTypedFileId(id),
      params
    });
    return getProp(metadataOptions, 'data', {});
  }

  /**
   * Build URL for metadata taxonomy.
   *
   * @param {string} scope
   * @param {string} taxonomyKey
   * @returns {`${string}/metadata_taxonomies/${string}/${string}`}
   */
  getMetadataTaxonomyUrl(scope, taxonomyKey) {
    return `${this.getBaseApiUrl()}/metadata_taxonomies/${scope}/${taxonomyKey}`;
  }

  /**
   * Gets taxonomy associated with a taxonomy key.
   *
   * @param {number} id
   * @param {string} scope
   * @param {string} taxonomyKey
   * @param {string} nodeID
   * @returns {Promise<MetadataTaxonomy>}
   */
  async getMetadataTaxonomy(id, scope, taxonomyKey) {
    this.errorCode = ERROR_CODE_FETCH_METADATA_TAXONOMY;
    if (!id) {
      throw getBadItemError();
    }
    if (!scope) {
      throw new Error('Missing scope');
    }
    if (!taxonomyKey) {
      throw new Error('Missing taxonomyKey');
    }
    const url = this.getMetadataTaxonomyUrl(scope, taxonomyKey);
    const metadataTaxonomy = await this.xhr.get({
      url,
      id: getTypedFileId(id)
    });
    return getProp(metadataTaxonomy, 'data', {});
  }

  /**
   * Build URL for metadata taxonomies associated to a taxonomy node ID.
   *
   * @param {string} scope
   * @param {string} taxonomyKey
   * @param {string} nodeID
   * @param {boolean} includeAncestors
   * @returns {`${string}/metadata_taxonomies/${string}/${string}/nodes/${string}`}
   */
  getMetadataTaxonomyNodeUrl(scope, taxonomyKey, nodeID, includeAncestors = false) {
    const includeAncestorsParam = includeAncestors ? '?include-ancestors=true' : '';
    return `${this.getBaseApiUrl()}/metadata_taxonomies/${scope}/${taxonomyKey}/nodes/${nodeID}${includeAncestorsParam}`;
  }

  /**
   * Gets info associated with a taxonomy node.
   *
   * @param {number} id
   * @param {string} scope
   * @param {string} taxonomyKey
   * @param {string} nodeID
   * @param {boolean} includeAncestors
   * @returns {Promise<MetadataTaxonomyNode>}
   */
  async getMetadataTaxonomyNode(id, scope, taxonomyKey, nodeID, includeAncestors) {
    this.errorCode = ERROR_CODE_FETCH_METADATA_TAXONOMY_NODE;
    if (!id) {
      throw getBadItemError();
    }
    if (!nodeID) {
      throw new Error('Missing nodeID');
    }
    if (!scope) {
      throw new Error('Missing scope');
    }
    if (!taxonomyKey) {
      throw new Error('Missing taxonomyKey');
    }
    const url = this.getMetadataTaxonomyNodeUrl(scope, taxonomyKey, nodeID, includeAncestors);
    const metadataTaxonomyNode = await this.xhr.get({
      url,
      id: getTypedFileId(id)
    });
    return getProp(metadataTaxonomyNode, 'data', {});
  }
}
export default Metadata;
//# sourceMappingURL=Metadata.js.map