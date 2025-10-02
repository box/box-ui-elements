import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { PageHeader } from '@box/blueprint-web';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderLeftV2 from './SubHeaderLeftV2';
import SubHeaderRight from './SubHeaderRight';
import { VIEW_MODE_LIST, VIEW_METADATA } from '../../../constants';
import { useFeatureEnabled } from '../feature-checking';
import './SubHeader.scss';
const SubHeader = ({
  bulkItemActions,
  canCreateNewFolder,
  canUpload,
  currentCollection,
  gridColumnCount = 0,
  gridMaxColumns = 0,
  gridMinColumns = 0,
  maxGridColumnCountForWidth = 0,
  onGridViewSliderChange = noop,
  isSmall,
  onClearSelectedItemIds,
  onCreate,
  onItemClick,
  onSortChange,
  onMetadataSidePanelToggle,
  onUpload,
  onViewModeChange,
  portalElement,
  rootId,
  rootName,
  selectedItemIds,
  title,
  view,
  viewMode = VIEW_MODE_LIST
}) => {
  const isMetadataViewV2Feature = useFeatureEnabled('contentExplorer.metadataViewV2');
  if (view === VIEW_METADATA && !isMetadataViewV2Feature) {
    return null;
  }
  return /*#__PURE__*/React.createElement(PageHeader.Root, {
    className: classNames({
      'be-sub-header': !isMetadataViewV2Feature
    }),
    "data-testid": "be-sub-header",
    variant: "inline"
  }, /*#__PURE__*/React.createElement(PageHeader.StartElements, null, view !== VIEW_METADATA && !isMetadataViewV2Feature && /*#__PURE__*/React.createElement(SubHeaderLeft, {
    currentCollection: currentCollection,
    isSmall: isSmall,
    onItemClick: onItemClick,
    portalElement: portalElement,
    rootId: rootId,
    rootName: rootName,
    view: view
  }), isMetadataViewV2Feature && /*#__PURE__*/React.createElement(SubHeaderLeftV2, {
    currentCollection: currentCollection,
    onClearSelectedItemIds: onClearSelectedItemIds,
    rootName: rootName,
    selectedItemIds: selectedItemIds,
    title: title
  })), /*#__PURE__*/React.createElement(PageHeader.EndElements, null, /*#__PURE__*/React.createElement(SubHeaderRight, {
    bulkItemActions: bulkItemActions,
    canCreateNewFolder: canCreateNewFolder,
    canUpload: canUpload,
    currentCollection: currentCollection,
    gridColumnCount: gridColumnCount,
    gridMaxColumns: gridMaxColumns,
    gridMinColumns: gridMinColumns,
    maxGridColumnCountForWidth: maxGridColumnCountForWidth,
    onCreate: onCreate,
    onGridViewSliderChange: onGridViewSliderChange,
    onSortChange: onSortChange,
    onMetadataSidePanelToggle: onMetadataSidePanelToggle,
    onUpload: onUpload,
    onViewModeChange: onViewModeChange,
    portalElement: portalElement,
    selectedItemIds: selectedItemIds,
    view: view,
    viewMode: viewMode
  })));
};
export default SubHeader;
//# sourceMappingURL=SubHeader.js.map