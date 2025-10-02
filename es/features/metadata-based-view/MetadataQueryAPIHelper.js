function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Metadata Queries API Helper
 * @author Box
 */
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getProp from 'lodash/get';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import API from '../../api';
import { ITEM_TYPE_FILE, JSON_PATCH_OP_ADD, JSON_PATCH_OP_REMOVE, JSON_PATCH_OP_REPLACE, JSON_PATCH_OP_TEST, METADATA_FIELD_TYPE_ENUM, METADATA_FIELD_TYPE_MULTISELECT } from '../../common/constants';
import { FIELD_NAME, FIELD_METADATA } from '../../constants';
const SELECT_TYPES = [METADATA_FIELD_TYPE_ENUM, METADATA_FIELD_TYPE_MULTISELECT];
export default class MetadataQueryAPIHelper {
  constructor(api) {
    _defineProperty(this, "createJSONPatchOperations", (field, oldValue, newValue) => {
      let operation = JSON_PATCH_OP_REPLACE;
      if (isNil(oldValue) && newValue) {
        operation = JSON_PATCH_OP_ADD;
      }
      if (oldValue && isNil(newValue)) {
        operation = JSON_PATCH_OP_REMOVE;
      }
      const testOp = {
        op: JSON_PATCH_OP_TEST,
        path: `/${field}`,
        value: oldValue
      };
      const patchOp = {
        op: operation,
        path: `/${field}`,
        value: newValue
      };
      if (operation === JSON_PATCH_OP_REMOVE) {
        delete patchOp.value;
      }
      return operation === JSON_PATCH_OP_ADD ? [patchOp] : [testOp, patchOp];
    });
    _defineProperty(this, "getMetadataQueryFields", () => {
      /*
          Example metadata query:
          const query = {
              from: 'enterprise_12345.myAwesomeTemplateKey',
              fields: [
                  'name', // base representation field for an item (name, size, etag etc.)
                  'metadata.enterprise_12345.myAwesomeTemplateKey.field_1', // metadata instance field
                  'metadata.enterprise_12345.myAwesomeTemplateKey.field_2', // metadata instance field
                  'metadata.enterprise_12345.myAwesomeTemplateKey.field_3' // metadata instance field
              ],
              ancestor_folder_id: 0,
          };
           This function will return ['field_1', 'field_2', 'field_3']
      */
      const {
        fields = [],
        from
      } = this.metadataQuery;
      return fields.filter(field => field.includes(from)).map(field => field.split('.').pop());
    });
    _defineProperty(this, "flattenMetadata", metadata => {
      const templateFields = getProp(this.metadataTemplate, 'fields', []);
      const instance = getProp(metadata, `${this.templateScope}.${this.templateKey}`);
      if (!instance) {
        return {};
      }
      const queryFields = this.getMetadataQueryFields();
      const fields = queryFields.map(queryField => {
        const templateField = find(templateFields, ['key', queryField]);
        const type = getProp(templateField, 'type'); // get data type
        const displayName = getProp(templateField, 'displayName', queryField); // get displayName, defaults to key

        const field = {
          key: `${FIELD_METADATA}.${this.templateScope}.${this.templateKey}.${queryField}`,
          value: instance[queryField],
          type,
          displayName
        };
        if (includes(SELECT_TYPES, type)) {
          // get "options" for enums or multiselects
          field.options = getProp(templateField, 'options');
        }
        return field;
      });
      return {
        enterprise: {
          fields,
          id: instance.$id
        }
      };
    });
    _defineProperty(this, "flattenResponseEntry", metadataEntry => {
      const {
        metadata
      } = metadataEntry;
      return _objectSpread(_objectSpread({}, metadataEntry), {}, {
        metadata: this.flattenMetadata(metadata)
      });
    });
    _defineProperty(this, "filterMetdataQueryResponse", response => {
      const {
        entries = [],
        next_marker
      } = response;
      return {
        entries: entries.filter(entry => getProp(entry, 'type') === ITEM_TYPE_FILE),
        // return only file items
        next_marker
      };
    });
    _defineProperty(this, "getFlattenedDataWithTypes", templateSchemaResponse => {
      this.metadataTemplate = getProp(templateSchemaResponse, 'data');
      const {
        entries,
        next_marker
      } = this.metadataQueryResponseData;
      return {
        items: entries.map(this.flattenResponseEntry),
        nextMarker: next_marker
      };
    });
    _defineProperty(this, "getTemplateSchemaInfo", data => {
      const {
        entries
      } = data;
      this.metadataQueryResponseData = this.filterMetdataQueryResponse(data);
      if (!entries || entries.length === 0) {
        // Don't make metadata API call to get template info
        return Promise.resolve();
      }
      const metadata = getProp(entries, '[0].metadata');
      this.templateScope = Object.keys(metadata)[0];
      const instance = metadata[this.templateScope];
      this.templateKey = Object.keys(instance)[0];
      return this.api.getMetadataAPI(true).getSchemaByTemplateKey(this.templateKey);
    });
    _defineProperty(this, "queryMetadata", () => {
      return new Promise((resolve, reject) => {
        this.api.getMetadataQueryAPI().queryMetadata(this.metadataQuery, resolve, reject, {
          forceFetch: true
        });
      });
    });
    _defineProperty(this, "fetchMetadataQueryResults", (metadataQuery, successsCallback, errorCallback) => {
      this.metadataQuery = this.verifyQueryFields(metadataQuery);
      return this.queryMetadata().then(this.getTemplateSchemaInfo).then(this.getFlattenedDataWithTypes).then(successsCallback).catch(errorCallback);
    });
    _defineProperty(this, "updateMetadata", (file, field, oldValue, newValue, successsCallback, errorCallback) => {
      const operations = this.createJSONPatchOperations(field, oldValue, newValue);
      return this.api.getMetadataAPI(true).updateMetadata(file, this.metadataTemplate, operations, successsCallback, errorCallback);
    });
    /**
     * Verify that the metadata query has required fields and update it if necessary
     * For a file item, default fields included in the response are "type", "id", "etag"
     *
     * @param {MetadataQueryType} metadataQuery metadata query object
     * @return {MetadataQueryType} updated metadata query object with required fields
     */
    _defineProperty(this, "verifyQueryFields", metadataQuery => {
      const clonedQuery = cloneDeep(metadataQuery);
      const clonedFields = isArray(clonedQuery.fields) ? clonedQuery.fields : [];

      // Make sure the query fields array has "name" field which is necessary to display info.
      if (!clonedFields.includes(FIELD_NAME)) {
        clonedFields.push(FIELD_NAME);
      }
      clonedQuery.fields = clonedFields;
      return clonedQuery;
    });
    this.api = api;
  }
}
//# sourceMappingURL=MetadataQueryAPIHelper.js.map