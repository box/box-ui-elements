const _excluded = ["currentCollection", "features", "fieldsToShow", "gridColumnCount", "metadataTemplate", "metadataViewProps", "onMetadataFilter", "onMetadataUpdate", "onSortChange", "view", "viewMode"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import EmptyView from '../common/empty-view';
import ItemGrid from '../common/item-grid';
import ItemList from '../common/item-list';
import ProgressBar from '../common/progress-bar';
import MetadataBasedItemList from '../../features/metadata-based-view';
import MetadataViewContainer from './MetadataViewContainer';
import { isFeatureEnabled } from '../common/feature-checking';
import { VIEW_ERROR, VIEW_METADATA, VIEW_MODE_LIST, VIEW_MODE_GRID, VIEW_SELECTED } from '../../constants';
import './Content.scss';

/**
 * Determines if we should show the empty state
 *
 * @param {string} view the current view
 * @param {Object} currentCollection the current collection
 * @param {FieldsToShow} fieldsToShow list of metadata template fields to show
 * @return {boolean} empty or not
 */
function isEmpty(view, currentCollection, fieldsToShow) {
  const {
    items = []
  } = currentCollection;
  return view === VIEW_ERROR || !items.length || view === VIEW_METADATA && !fieldsToShow.length;
}
const Content = _ref => {
  let {
      currentCollection,
      features,
      fieldsToShow = [],
      gridColumnCount,
      metadataTemplate,
      metadataViewProps,
      onMetadataFilter,
      onMetadataUpdate,
      onSortChange,
      view,
      viewMode = VIEW_MODE_LIST
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    items,
    percentLoaded,
    sortBy,
    sortDirection
  } = currentCollection;
  const isViewEmpty = isEmpty(view, currentCollection, fieldsToShow);
  const isMetadataBasedView = view === VIEW_METADATA;
  const isListView = !isMetadataBasedView && viewMode === VIEW_MODE_LIST; // Folder view or Recents view
  const isGridView = !isMetadataBasedView && viewMode === VIEW_MODE_GRID; // Folder view or Recents view
  const isMetadataViewV2Feature = isFeatureEnabled(features, 'contentExplorer.metadataViewV2');
  return /*#__PURE__*/React.createElement("div", {
    className: "bce-content"
  }, view === VIEW_ERROR || view === VIEW_SELECTED ? null : /*#__PURE__*/React.createElement(ProgressBar, {
    percent: percentLoaded
  }), !isMetadataViewV2Feature && isViewEmpty && /*#__PURE__*/React.createElement(EmptyView, {
    view: view,
    isLoading: percentLoaded !== 100
  }), isMetadataViewV2Feature && view === VIEW_ERROR && /*#__PURE__*/React.createElement(EmptyView, {
    view: view,
    isLoading: false
  }), !isMetadataViewV2Feature && !isViewEmpty && isMetadataBasedView && /*#__PURE__*/React.createElement(MetadataBasedItemList, _extends({
    currentCollection: currentCollection,
    fieldsToShow: fieldsToShow,
    onMetadataUpdate: onMetadataUpdate
  }, rest)), isMetadataViewV2Feature && isMetadataBasedView && /*#__PURE__*/React.createElement(MetadataViewContainer, _extends({
    currentCollection: currentCollection,
    isLoading: percentLoaded !== 100,
    hasError: view === VIEW_ERROR,
    metadataTemplate: metadataTemplate,
    onMetadataFilter: onMetadataFilter,
    onSortChange: onSortChange
  }, metadataViewProps)), !isViewEmpty && isListView && /*#__PURE__*/React.createElement(ItemList, _extends({
    items: items,
    onSortChange: onSortChange,
    sortBy: sortBy,
    sortDirection: sortDirection,
    view: view
  }, rest)), !isViewEmpty && isGridView && /*#__PURE__*/React.createElement(ItemGrid, _extends({
    gridColumnCount: gridColumnCount,
    items: items,
    view: view
  }, rest)));
};
export default Content;
//# sourceMappingURL=Content.js.map