function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import isNil from 'lodash/isNil';
import xor from 'lodash/xor';
import { MULTI_VALUE_DEFAULT_OPTION, MULTI_VALUE_DEFAULT_VALUE } from '@box/metadata-editor';
import messages from '../common/messages';
import { NON_FOLDER_FILE_TYPES_MAP } from './constants';

// Specific type for metadata field value in the item
// Note: Item doesn't have field value in metadata object if that field is not set, so the value will be undefined in this case

// Get selected item text
export function useSelectedItemText(currentCollection, selectedItemIds) {
  const {
    formatMessage
  } = useIntl();
  return useMemo(() => {
    const selectedCount = selectedItemIds === 'all' ? currentCollection.items.length : selectedItemIds.size;
    if (selectedCount === 0) return '';

    // Case 1: Single selected item - show item name
    if (selectedCount === 1) {
      const selectedKey = selectedItemIds === 'all' ? currentCollection.items[0].id : selectedItemIds.values().next().value;
      const selectedItem = currentCollection.items.find(item => item.id === selectedKey);
      return selectedItem?.name ?? '';
    }

    // Case 2: Multiple selected items - show count
    return formatMessage(messages.numFilesSelected, {
      numSelected: selectedCount
    });
  }, [currentCollection.items, formatMessage, selectedItemIds]);
}

// Check if the field value is empty.
// Note: 0 doesn't represent empty here because of float type field
export function isEmptyValue(value) {
  if (isNil(value)) {
    return true;
  }

  // date, string, enum
  if (value === '') {
    return true;
  }

  // multiSelect
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  // float
  if (Number.isNaN(value)) {
    return true;
  }
  return false;
}

// Check if the field values are equal based on the field types
export function areFieldValuesEqual(value1, value2) {
  if (isEmptyValue(value1) && isEmptyValue(value2)) {
    return true;
  }

  // Handle multiSelect arrays comparison
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return xor(value1, value2).length === 0;
  }
  return value1 === value2;
}

// Return default form value by field type
function getDefaultValueByFieldType(fieldType) {
  if (fieldType === 'date' || fieldType === 'enum' || fieldType === 'float' || fieldType === 'string') {
    return '';
  }
  if (fieldType === 'multiSelect') {
    return [];
  }
  return undefined;
}

// Set the field value in Metadata Form based on the field type
function getFieldValue(fieldType, fieldValue) {
  if (isNil(fieldValue)) {
    return getDefaultValueByFieldType(fieldType);
  }
  return fieldValue;
}

// Check if the field value in Metadata Form is multi-values such as "Multiple values"
export function isMultiValuesField(fieldType, fieldValue) {
  if (fieldType === 'multiSelect') {
    return Array.isArray(fieldValue) && fieldValue.length === 1 && fieldValue[0] === MULTI_VALUE_DEFAULT_VALUE;
  }
  if (fieldType === 'enum') {
    return fieldValue === MULTI_VALUE_DEFAULT_VALUE;
  }
  return false;
}

// Get template instance based on metadata template and selected items
export function useTemplateInstance(metadataTemplate, selectedItems, isEditing) {
  const {
    formatMessage
  } = useIntl();
  const {
    displayName,
    fields,
    hidden,
    id,
    scope,
    templateKey,
    type
  } = metadataTemplate;
  const selectedItemsFields = fields.map(({
    displayName: fieldDisplayName,
    hidden: fieldHidden,
    id: fieldId,
    key,
    options,
    type: fieldType
  }) => {
    const defaultItemField = {
      displayName: fieldDisplayName,
      hidden: fieldHidden,
      id: fieldId,
      key,
      options,
      type: fieldType,
      value: getFieldValue(fieldType, undefined)
    };
    const firstSelectedItem = selectedItems[0];
    const firstSelectedItemFieldValue = firstSelectedItem.metadata[scope][templateKey][key];

    // Case 1: Single selected item
    if (selectedItems.length <= 1) {
      return _objectSpread(_objectSpread({}, defaultItemField), {}, {
        value: firstSelectedItemFieldValue
      });
    }

    // Case 2.1: Multiple selected items, but all have the same initial value
    const allItemsHaveSameInitialValue = selectedItems.every(selectedItem => areFieldValuesEqual(selectedItem.metadata[scope][templateKey][key], firstSelectedItemFieldValue));
    if (allItemsHaveSameInitialValue) {
      return _objectSpread(_objectSpread({}, defaultItemField), {}, {
        value: getFieldValue(fieldType, firstSelectedItemFieldValue)
      });
    }

    // Case 2.2: Multiple selected items, but some have different initial values
    // Case 2.2.1: Edit Mode
    if (isEditing) {
      let fieldValue = getFieldValue(fieldType, undefined);
      // Add MultiValue Option if the field is multiSelect or enum
      if (fieldType === 'multiSelect' || fieldType === 'enum') {
        fieldValue = fieldType === 'enum' ? MULTI_VALUE_DEFAULT_VALUE : [MULTI_VALUE_DEFAULT_VALUE];
        const multiValueOption = options?.find(option => option.key === MULTI_VALUE_DEFAULT_VALUE);
        if (!multiValueOption) {
          options?.push(MULTI_VALUE_DEFAULT_OPTION);
        }
      }
      return _objectSpread(_objectSpread({}, defaultItemField), {}, {
        value: fieldValue
      });
    }

    /**
     * Case: 2.2.2 View Mode
     *
     * We want to show "Multiple values" label for multiple dates across files selection.
     * We use fragment here to bypass check in shared feature.
     * This feature tries to parse string as date if the string is passed as value.
     */
    const multipleValuesText = formatMessage(messages.multipleValues);
    return _objectSpread(_objectSpread({}, defaultItemField), {}, {
      value: /*#__PURE__*/React.createElement(React.Fragment, null, multipleValuesText)
    });
  });
  return {
    canEdit: true,
    displayName,
    hidden,
    id,
    fields: selectedItemsFields,
    scope,
    templateKey,
    type
  };
}
export const getFileExtensions = selectedFileType => {
  if (NON_FOLDER_FILE_TYPES_MAP.has(selectedFileType)) {
    return NON_FOLDER_FILE_TYPES_MAP.get(selectedFileType).flat();
  }
  return [];
};
//# sourceMappingURL=utils.js.map