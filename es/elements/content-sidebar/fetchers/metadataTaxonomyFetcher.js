const _excluded = ["display_name", "displayName"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export const metadataTaxonomyFetcher = async (api, fileId, scope, templateKey, fieldKey, level, options) => {
  const metadataOptions = await api.getMetadataAPI(false).getMetadataOptions(fileId, scope, templateKey, fieldKey, level, options);
  const {
    marker = null
  } = options;
  return _objectSpread(_objectSpread({
    options: metadataOptions.entries.map(metadataOption => ({
      value: metadataOption.id,
      displayValue: metadataOption.display_name || metadataOption.displayName,
      level: metadataOption.level,
      parentId: metadataOption.parentId,
      nodePath: metadataOption.nodePath,
      deprecated: metadataOption.deprecated,
      ancestors: metadataOption.ancestors?.map(_ref => {
        let {
            display_name,
            displayName
          } = _ref,
          rest = _objectWithoutProperties(_ref, _excluded);
        return _objectSpread(_objectSpread({}, rest), {}, {
          displayName: display_name || displayName
        });
      }),
      selectable: metadataOption.selectable
    })),
    marker
  }, metadataOptions.total_result_count !== undefined && {
    totalResultCount: metadataOptions.total_result_count
  }), metadataOptions.limit !== undefined && {
    limit: metadataOptions.limit
  });
};
export const metadataTaxonomyNodeAncestorsFetcher = async (api, fileID, scope, taxonomyKey, nodeID) => {
  const [metadataTaxonomy, metadataTaxonomyNode] = await Promise.all([api.getMetadataAPI(false).getMetadataTaxonomy(fileID, scope, taxonomyKey), api.getMetadataAPI(false).getMetadataTaxonomyNode(fileID, scope, taxonomyKey, nodeID, true)]);
  if (!metadataTaxonomy?.levels) {
    return [];
  }

  // Create a hashmap of levels to easily hydrate with data from metadataTaxonomyNode
  const levelsMap = new Map();
  for (const item of metadataTaxonomy.levels) {
    const levelData = {
      level: item.level,
      levelName: item.displayName || item.display_name,
      description: item.description
    };

    // If the level matches the metadataTaxonomyNode level, hydrate the level with the node data
    if (metadataTaxonomyNode.level === item.level) {
      levelsMap.set(item.level, _objectSpread(_objectSpread({}, levelData), {}, {
        id: metadataTaxonomyNode.id,
        levelValue: metadataTaxonomyNode.displayName || metadataTaxonomyNode.display_name
      }));
      // If the level is not the metadataTaxonomyNode level, just add the level data
    } else {
      levelsMap.set(item.level, levelData);
    }
  }
  // Hydrate the levels with the ancestors data from the metadataTaxonomyNode
  if (metadataTaxonomyNode.ancestors?.length) {
    for (const ancestor of metadataTaxonomyNode.ancestors) {
      const levelData = levelsMap.get(ancestor.level);
      if (levelData) {
        levelsMap.set(ancestor.level, _objectSpread(_objectSpread({}, levelData), {}, {
          levelValue: ancestor.displayName || ancestor.display_name,
          id: ancestor.id
        }));
      }
    }
  }

  // Filter out levels that were not hydrated by metadataTaxonomyNode
  const hydratedLevels = Array.from(levelsMap.values()).filter(level => !!level.id);

  // Return the hydrated levels as an array
  return hydratedLevels;
};
//# sourceMappingURL=metadataTaxonomyFetcher.js.map