function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import isNil from 'lodash/isNil';
import { getFileExtensions } from './utils';

// Custom type for range filters

// Union type for filter values

export const mergeQueryParams = (targetParams, sourceParams) => {
  return _objectSpread(_objectSpread({}, targetParams), sourceParams);
};
export const mergeQueries = (targetQueries, sourceQueries) => {
  return [...targetQueries, ...sourceQueries];
};
const generateArgKey = (key, index) => {
  const purifyKey = key.replace(/[^\w]/g, '_');
  return `arg_${purifyKey}_${index}`;
};
const escapeValue = value => value.replace(/([_%])/g, '\\$1');
export const getStringFilter = (filterValue, fieldKey, argIndexStart) => {
  let currentArgIndex = argIndexStart;
  const argKey = generateArgKey(fieldKey, currentArgIndex += 1);
  return {
    queryParams: {
      [argKey]: `%${escapeValue(filterValue)}%`
    },
    queries: [`(${fieldKey} ILIKE :${argKey})`],
    keysGenerated: currentArgIndex - argIndexStart
  };
};
const isInvalid = value => {
  return isNil(value) || value === '';
};
export const getRangeFilter = (filterValue, fieldKey, argIndexStart) => {
  let currentArgIndex = argIndexStart;
  if (filterValue && typeof filterValue === 'object' && 'range' in filterValue && filterValue.range) {
    const {
      gt,
      lt
    } = filterValue.range;
    const queryParams = {};
    const queries = [];
    if (!isInvalid(gt) && !isInvalid(lt)) {
      // Both gt and lt: between values
      const argKeyGt = generateArgKey(fieldKey, currentArgIndex += 1);
      const argKeyLt = generateArgKey(fieldKey, currentArgIndex += 1);
      queryParams[argKeyGt] = gt;
      queryParams[argKeyLt] = lt;
      queries.push(`(${fieldKey} >= :${argKeyGt} AND ${fieldKey} <= :${argKeyLt})`);
    } else if (!isInvalid(gt)) {
      // Only gt: greater than
      const argKey = generateArgKey(fieldKey, currentArgIndex += 1);
      queryParams[argKey] = gt;
      queries.push(`(${fieldKey} >= :${argKey})`);
    } else if (!isInvalid(lt)) {
      // Only lt: less than
      const argKey = generateArgKey(fieldKey, currentArgIndex += 1);
      queryParams[argKey] = lt;
      queries.push(`(${fieldKey} <= :${argKey})`);
    }
    return {
      queryParams,
      queries,
      keysGenerated: currentArgIndex - argIndexStart
    };
  }
  return {
    queryParams: {},
    queries: [],
    keysGenerated: 0
  };
};
export const getSelectFilter = (filterValue, fieldKey, argIndexStart) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return {
      queryParams: {},
      queries: [],
      keysGenerated: 0
    };
  }
  let currentArgIndex = argIndexStart;
  const multiSelectQueryParams = Object.fromEntries(filterValue.map(value => {
    currentArgIndex += 1;
    return [generateArgKey(fieldKey, currentArgIndex), String(value)];
  }));
  return {
    queryParams: multiSelectQueryParams,
    queries: [`(${fieldKey} HASANY (${Object.keys(multiSelectQueryParams).map(argKey => `:${argKey}`).join(', ')}))`],
    keysGenerated: currentArgIndex - argIndexStart
  };
};
export const getMimeTypeFilter = (filterValue, fieldKey, argIndexStart) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return {
      queryParams: {},
      queries: [],
      keysGenerated: 0
    };
  }
  let currentArgIndex = argIndexStart;
  const queryParams = {};
  const queries = [];

  // Handle specific extensions and folder type
  const extensions = [];
  let hasFolder = false;
  for (const extension of filterValue) {
    if (extension === 'folderType' && !hasFolder) {
      currentArgIndex += 1;
      const folderArgKey = generateArgKey('mime_folderType', currentArgIndex);
      queryParams[folderArgKey] = 'folder';
      queries.push(`(item.type = :${folderArgKey})`);
      hasFolder = true;
    } else {
      extensions.push(getFileExtensions(extension));
    }
  }

  // flat the array of arrays
  const flattenExtensions = extensions.flat();
  // Handle extensions in batch if any exist
  if (flattenExtensions.length > 0) {
    const extensionQueryParams = Object.fromEntries(flattenExtensions.map(extension => {
      currentArgIndex += 1;
      return [generateArgKey(fieldKey, currentArgIndex), extension];
    }));
    _extends(queryParams, extensionQueryParams);
    queries.push(`(item.extension IN (${Object.keys(extensionQueryParams).map(argKey => `:${argKey}`).join(', ')}))`);
  }

  // Combine queries with OR if multiple exist
  const finalQueries = queries.length > 1 ? [`(${queries.join(' OR ')})`] : queries;
  return {
    queryParams,
    queries: finalQueries,
    keysGenerated: currentArgIndex - argIndexStart
  };
};
//# sourceMappingURL=MetadataQueryBuilder.js.map