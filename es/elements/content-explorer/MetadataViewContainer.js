const _excluded = ["actionBarProps", "columns", "currentCollection", "metadataTemplate", "onMetadataFilter", "onSortChange", "tableProps"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { useIntl } from 'react-intl';
import { IconColumnVariant, MetadataView, PredefinedFilterName } from '@box/metadata-view';
import cloneDeep from 'lodash/cloneDeep';
import { FIELD_ITEM_NAME } from '../../constants';
import messages from '../common/messages';

// Public-friendly version of MetadataFormFieldValue from @box/metadata-filter
// (string[] for enum type, range/float objects stay the same)

const ITEM_FILTER_NAME = 'item_name';

/**
 * Helper function to trim metadataFieldNamePrefix from column names
 * For example: 'metadata.enterprise_1515946.mdViewTemplate1.industry' -> 'industry'
 */
function trimMetadataFieldPrefix(column) {
  // Check if the column starts with 'metadata.' and contains at least 2 dots
  if (column.startsWith('metadata.') && column.split('.').length >= 3) {
    // Split by dots and take everything after the first 3 parts
    // metadata.enterprise_1515946.mdViewTemplate1.industry -> industry
    const parts = column.split('.');
    return parts.slice(3).join('.');
  }
  return column;
}
function transformInitialFilterValuesToInternal(publicValues) {
  if (!publicValues) return undefined;
  return Object.entries(publicValues).reduce((acc, [key, {
    value
  }]) => {
    acc[key] = Array.isArray(value) ? {
      value: {
        enum: value
      }
    } : {
      value
    };
    return acc;
  }, {});
}
export function convertFilterValuesToExternal(fields) {
  return Object.entries(fields).reduce((acc, [key, field]) => {
    const {
      value,
      options,
      fieldType
    } = field;

    // Transform the value based on its type
    const transformedValue = 'enum' in value && Array.isArray(value.enum) ? value.enum // Convert enum type to string array
    : value; // Keep range/float objects as-is

    acc[key === ITEM_FILTER_NAME ? FIELD_ITEM_NAME : key] = {
      options,
      fieldType,
      value: transformedValue
    };
    return acc;
  }, {});
}

// Internal helper function for component use
function transformInternalFieldsToPublic(fields) {
  return convertFilterValuesToExternal(fields);
}
const MetadataViewContainer = _ref => {
  let {
      actionBarProps,
      columns,
      currentCollection,
      metadataTemplate,
      onMetadataFilter,
      onSortChange: onSortChangeInternal,
      tableProps
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    formatMessage
  } = useIntl();
  const {
    items = []
  } = currentCollection;
  const {
    initialFilterValues: initialFilterValuesProp,
    onFilterSubmit
  } = actionBarProps ?? {};
  const newColumns = React.useMemo(() => {
    let clonedColumns = cloneDeep(columns);
    const hasItemNameField = clonedColumns.some(col => col.id === FIELD_ITEM_NAME);
    if (!hasItemNameField) {
      clonedColumns = [{
        allowsSorting: true,
        id: FIELD_ITEM_NAME,
        isItemMetadata: true,
        isRowHeader: true,
        minWidth: 300,
        textValue: formatMessage(messages.name),
        type: 'string'
      }, ...clonedColumns];
    }
    return clonedColumns;
  }, [columns, formatMessage]);
  const filterGroups = React.useMemo(() => {
    const clonedTemplate = cloneDeep(metadataTemplate);
    let fields = clonedTemplate?.fields || [];

    // Filter fields to only include those that have corresponding columns
    const columnIds = newColumns.map(col => col.id);
    fields = fields.filter(field => {
      // For metadata fields, check if the column ID matches the field key
      // Column IDs for metadata fields are typically in format: metadata.template.fieldKey
      return columnIds.some(columnId => {
        const trimmedColumnId = trimMetadataFieldPrefix(columnId);
        return trimmedColumnId === field.key;
      });
    });

    // Check if item_name field already exists to avoid duplicates
    const hasItemNameField = fields.some(field => field.key === ITEM_FILTER_NAME);
    if (!hasItemNameField) {
      fields = [{
        key: ITEM_FILTER_NAME,
        displayName: formatMessage(messages.name),
        type: 'string',
        shouldRenderChip: true
      }, ...fields];
    }
    return [{
      toggleable: true,
      filters: fields?.map(field => {
        return {
          id: field.key,
          name: field.displayName,
          fieldType: field.type,
          options: field.options?.map(({
            key
          }) => key) || [],
          shouldRenderChip: true
        };
      }) || []
    }];
  }, [formatMessage, metadataTemplate, newColumns]);
  const initialFilterValues = React.useMemo(() => transformInitialFilterValuesToInternal(initialFilterValuesProp), [initialFilterValuesProp]);
  const handleFilterSubmit = React.useCallback(fields => {
    const transformed = transformInternalFieldsToPublic(fields);
    onMetadataFilter(transformed);
    if (onFilterSubmit) {
      onFilterSubmit(transformed);
    }
  }, [onFilterSubmit, onMetadataFilter]);

  // Create a wrapper function that calls both. The wrapper function should follow the signature of onSortChange from RAC
  const handleSortChange = React.useCallback(({
    column,
    direction
  }) => {
    // Call the internal onSortChange first
    // API accepts asc/desc "https://developer.box.com/reference/post-metadata-queries-execute-read/"
    if (onSortChangeInternal) {
      const trimmedColumn = trimMetadataFieldPrefix(String(column));
      onSortChangeInternal(trimmedColumn, direction === 'ascending' ? 'ASC' : 'DESC');
    }
    const onSortChangeExternal = tableProps?.onSortChange;
    // Then call the original customer-provided onSortChange if it exists
    // Accepts "ascending" / "descending" (https://react-spectrum.adobe.com/react-aria/Table.html)
    if (onSortChangeExternal) {
      onSortChangeExternal({
        column,
        direction
      });
    }
  }, [onSortChangeInternal, tableProps]);
  const transformedActionBarProps = React.useMemo(() => {
    return _objectSpread(_objectSpread({}, actionBarProps), {}, {
      initialFilterValues,
      onFilterSubmit: handleFilterSubmit,
      filterGroups,
      sortDropdownProps: {
        onSortChange: handleSortChange
      },
      predefinedFilterOptions: {
        [PredefinedFilterName.KeywordSearchFilterGroup]: {
          isDisabled: true
        },
        [PredefinedFilterName.LocationFilterGroup]: {
          isDisabled: true
        }
      }
    });
  }, [actionBarProps, initialFilterValues, handleFilterSubmit, handleSortChange, filterGroups]);

  // Create new tableProps with our wrapper function
  const newTableProps = _objectSpread(_objectSpread({}, tableProps), {}, {
    iconColumnVariant: IconColumnVariant.INLINE,
    onSortChange: handleSortChange
  });
  return /*#__PURE__*/React.createElement(MetadataView, _extends({
    actionBarProps: transformedActionBarProps,
    columns: newColumns,
    items: items,
    tableProps: newTableProps
  }, rest));
};
export default MetadataViewContainer;
//# sourceMappingURL=MetadataViewContainer.js.map