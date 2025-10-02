import * as React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@box/blueprint-web';
import { Pencil } from '@box/blueprint-web-assets/icons/Fill';
import { BulkItemActionMenu } from './BulkItemActionMenu';
import Sort from './Sort';
import Add from './Add';
import GridViewSlider from '../../../components/grid-view/GridViewSlider';
import ViewModeChangeButton from './ViewModeChangeButton';
import { VIEW_FOLDER, VIEW_MODE_GRID, VIEW_METADATA } from '../../../constants';
import { useFeatureEnabled } from '../feature-checking';
import messages from './messages';
import './SubHeaderRight.scss';
const SubHeaderRight = ({
  bulkItemActions,
  canCreateNewFolder,
  canUpload,
  currentCollection,
  gridColumnCount,
  gridMaxColumns,
  gridMinColumns,
  maxGridColumnCountForWidth,
  onCreate,
  onGridViewSliderChange,
  onSortChange,
  onMetadataSidePanelToggle,
  onUpload,
  onViewModeChange,
  portalElement,
  selectedItemIds,
  view,
  viewMode
}) => {
  const {
    formatMessage
  } = useIntl();
  const isMetadataViewV2Feature = useFeatureEnabled('contentExplorer.metadataViewV2');
  const {
    items = []
  } = currentCollection;
  const hasGridView = !!gridColumnCount;
  const hasItems = items.length > 0;
  const isFolder = view === VIEW_FOLDER;
  const showSort = isFolder && hasItems;
  const showAdd = (!!canUpload || !!canCreateNewFolder) && isFolder;
  const isMetadataView = view === VIEW_METADATA;
  const hasSelectedItems = !!(selectedItemIds && (selectedItemIds === 'all' || selectedItemIds.size > 0));
  return /*#__PURE__*/React.createElement("div", {
    className: "be-sub-header-right"
  }, !isMetadataView && /*#__PURE__*/React.createElement(React.Fragment, null, hasItems && viewMode === VIEW_MODE_GRID && /*#__PURE__*/React.createElement(GridViewSlider, {
    columnCount: gridColumnCount,
    gridMaxColumns: gridMaxColumns,
    gridMinColumns: gridMinColumns,
    maxColumnCount: maxGridColumnCountForWidth,
    onChange: onGridViewSliderChange
  }), hasItems && hasGridView && /*#__PURE__*/React.createElement(ViewModeChangeButton, {
    viewMode: viewMode,
    onViewModeChange: onViewModeChange
  }), showSort && /*#__PURE__*/React.createElement(Sort, {
    onSortChange: onSortChange,
    portalElement: portalElement
  }), showAdd && /*#__PURE__*/React.createElement(Add, {
    isDisabled: !isFolder,
    onCreate: onCreate,
    onUpload: onUpload,
    portalElement: portalElement,
    showCreate: canCreateNewFolder,
    showUpload: canUpload
  })), isMetadataView && isMetadataViewV2Feature && hasSelectedItems && /*#__PURE__*/React.createElement(React.Fragment, null, bulkItemActions && bulkItemActions.length > 0 && /*#__PURE__*/React.createElement(BulkItemActionMenu, {
    actions: bulkItemActions,
    selectedItemIds: selectedItemIds
  }), /*#__PURE__*/React.createElement(Button, {
    icon: Pencil,
    size: "large",
    variant: "primary",
    onClick: onMetadataSidePanelToggle
  }, formatMessage(messages.metadata))));
};
export default SubHeaderRight;
//# sourceMappingURL=SubHeaderRight.js.map