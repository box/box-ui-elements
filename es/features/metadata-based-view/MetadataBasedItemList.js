function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';
import classNames from 'classnames';
import find from 'lodash/find';
import getProp from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import MultiGrid from '@box/react-virtualized/dist/es/MultiGrid/MultiGrid';
import MetadataField from '../metadata-instance-fields/MetadataField';
import ReadOnlyMetadataField from '../metadata-instance-fields/ReadOnlyMetadataField';
import FileIcon from '../../icons/file-icon';
import IconWithTooltip from './IconWithTooltip';
import PlainButton from '../../components/plain-button';
import { getFileExtension } from '../../utils/file';
import messages from '../../elements/common/messages';
import './MetadataBasedItemList.scss';
import { CANCEL_ICON_TYPE, EDIT_ICON_TYPE, FILE_ICON_COLUMN_INDEX, FILE_ICON_COLUMN_WIDTH, FILE_ICON_SIZE, FILE_NAME_COLUMN_INDEX, FILE_NAME_COLUMN_WIDTH, FIXED_COLUMNS_NUMBER, FIXED_ROW_NUMBER, HEADER_ROW_INDEX, MIN_METADATA_COLUMN_WIDTH, SAVE_ICON_TYPE } from './constants';
import { FIELD_TYPE_FLOAT, FIELD_TYPE_INTEGER, FIELD_TYPE_STRING } from '../metadata-instance-fields/constants';
import { FIELD_METADATA } from '../../constants';
class MetadataBasedItemList extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "getInitialState", () => {
      return {
        editedColumnIndex: -1,
        editedRowIndex: -1,
        hoveredRowIndex: -1,
        hoveredColumnIndex: -1,
        isUpdating: false,
        scrollLeftOffset: 0,
        scrollRightOffset: 0
      };
    });
    _defineProperty(this, "getItemWithPermissions", item => {
      /*
          - @TODO: Remove permissions object once its part of API response.
          - add "can_preview: true" so that users can click to launch the Preview modal. If users don't have access, they will see the error when Preview loads.
          - add "can_upload: true" so that users can update the metadata values.
      */
      const permissions = {
        can_preview: true,
        can_upload: true
      };
      return _objectSpread(_objectSpread({}, item), {}, {
        permissions
      });
    });
    _defineProperty(this, "handleCancelEdit", () => {
      this.setState({
        editedColumnIndex: -1,
        editedRowIndex: -1
      });
    });
    _defineProperty(this, "handleSave", (item, field, type, currentValue, editedValue) => {
      const {
        onMetadataUpdate
      } = this.props;
      onMetadataUpdate(this.getItemWithPermissions(item), field, currentValue, this.getValueForType(type, editedValue));
      this.setState({
        isUpdating: true
      });
    });
    _defineProperty(this, "handleMouseEnter", (columnIndex, rowIndex) => this.setState({
      hoveredColumnIndex: columnIndex,
      hoveredRowIndex: rowIndex
    }));
    _defineProperty(this, "handleMouseLeave", () => this.setState({
      hoveredRowIndex: -1,
      hoveredColumnIndex: -1
    }));
    _defineProperty(this, "handleContentScroll", ({
      clientWidth,
      scrollLeft,
      scrollWidth
    }) => {
      this.setState({
        scrollLeftOffset: scrollLeft,
        scrollRightOffset: scrollWidth - clientWidth - scrollLeft
      });
    });
    _defineProperty(this, "cellRenderer", ({
      columnIndex,
      rowIndex,
      key,
      style
    }) => {
      const {
        hoveredRowIndex
      } = this.state;
      const isHeaderRow = rowIndex === HEADER_ROW_INDEX;
      const isFileIconCell = !isHeaderRow && columnIndex === FILE_ICON_COLUMN_INDEX;
      const isFileNameCell = !isHeaderRow && columnIndex === FILE_NAME_COLUMN_INDEX;
      const isGridRowHovered = !isHeaderRow && rowIndex === hoveredRowIndex;
      const data = isHeaderRow ? this.getGridHeaderData(columnIndex) : this.getGridCellData(columnIndex, rowIndex);
      const classes = classNames('bdl-MetadataBasedItemList-cell', {
        'bdl-MetadataBasedItemList-cell--fileIcon': isFileIconCell,
        'bdl-MetadataBasedItemList-cell--filename': isFileNameCell,
        'bdl-MetadataBasedItemList-cell--hover': isGridRowHovered
      });
      return /*#__PURE__*/React.createElement("div", {
        className: classes,
        key: key,
        onMouseEnter: () => this.handleMouseEnter(columnIndex, rowIndex),
        onMouseLeave: this.handleMouseLeave,
        style: style
      }, data);
    });
    this.state = this.getInitialState();
  }
  componentDidUpdate(prevProps) {
    const prevItems = getProp(prevProps, 'currentCollection.items');
    const currentItems = getProp(this.props, 'currentCollection.items');
    if (!isEqual(currentItems, prevItems)) {
      // Either the view was refreshed or metadata was updated, reset edit part of the state to initial values
      this.setState({
        editedColumnIndex: -1,
        editedRowIndex: -1,
        isUpdating: false,
        valueBeingEdited: undefined
      });
    }
  }
  getQueryResponseFields() {
    const fields = getProp(this.props, 'currentCollection.items[0].metadata.enterprise.fields', []);
    return fields.map(({
      key,
      displayName
    }) => ({
      key,
      displayName
    }));
  }
  getColumnWidth(width) {
    const {
      fieldsToShow
    } = this.props;
    return ({
      index
    }) => {
      if (index === FILE_ICON_COLUMN_INDEX) {
        return FILE_ICON_COLUMN_WIDTH;
      }
      if (index === FILE_NAME_COLUMN_INDEX) {
        return FILE_NAME_COLUMN_WIDTH;
      }
      const availableWidth = width - FILE_NAME_COLUMN_WIDTH - FILE_ICON_COLUMN_WIDTH; // total width minus width of sticky columns
      // Maintain min column width, else occupy the rest of the space equally
      return Math.max(availableWidth / fieldsToShow.length, MIN_METADATA_COLUMN_WIDTH);
    };
  }
  handleItemClick(item) {
    const {
      onItemClick
    } = this.props;
    onItemClick(this.getItemWithPermissions(item));
  }
  handleEditIconClick(columnIndex, rowIndex, value) {
    this.setState({
      editedColumnIndex: columnIndex,
      editedRowIndex: rowIndex,
      valueBeingEdited: value
    });
  }
  getValueForType(type, value) {
    if (type === FIELD_TYPE_FLOAT && !isNil(value)) {
      return parseFloat(value);
    }
    if (type === FIELD_TYPE_INTEGER && !isNil(value)) {
      return parseInt(value, 10);
    }
    return value;
  }
  isMetadataField(key) {
    return key.startsWith(`${FIELD_METADATA}.`);
  }
  getFieldNameFromKey(key) {
    return key.split('.').pop();
  }
  getGridCellData(columnIndex, rowIndex) {
    const {
      currentCollection: {
        items = []
      },
      fieldsToShow
    } = this.props;
    const {
      editedColumnIndex,
      editedRowIndex,
      hoveredColumnIndex,
      hoveredRowIndex,
      isUpdating,
      valueBeingEdited
    } = this.state;
    const isCellBeingEdited = columnIndex === editedColumnIndex && rowIndex === editedRowIndex;
    const isCellHovered = columnIndex === hoveredColumnIndex && rowIndex === hoveredRowIndex;
    const fieldToShow = fieldsToShow[columnIndex - FIXED_COLUMNS_NUMBER];
    const isCellEditable = !isCellBeingEdited && isCellHovered && getProp(fieldToShow, 'canEdit', false);
    const item = items[rowIndex - 1];
    const {
      id,
      name
    } = item;
    const fields = getProp(item, 'metadata.enterprise.fields', []);
    let cellData;
    switch (columnIndex) {
      case FILE_ICON_COLUMN_INDEX:
        cellData = /*#__PURE__*/React.createElement(FileIcon, {
          dimension: FILE_ICON_SIZE,
          extension: getFileExtension(name)
        });
        break;
      case FILE_NAME_COLUMN_INDEX:
        cellData = /*#__PURE__*/React.createElement(PlainButton, {
          type: "button",
          onClick: () => this.handleItemClick(item)
        }, name);
        break;
      default:
        {
          const key = isString(fieldToShow) ? fieldToShow : fieldToShow.key;
          let field;
          let type = FIELD_TYPE_STRING;
          let value;
          let options = [];
          const isMetadataField = this.isMetadataField(key);
          if (isMetadataField) {
            // If field is metadata instance field
            field = find(fields, ['key', key]);
            if (!field) {
              return cellData;
            }
            ({
              type,
              value,
              options = []
            } = field);
          } else {
            // If field is item field, e.g. name, size, description etc.
            value = getProp(item, key);
          }
          const fieldName = this.getFieldNameFromKey(key);
          const shouldShowEditIcon = isCellEditable && isString(type);
          cellData = /*#__PURE__*/React.createElement(React.Fragment, null, !isCellBeingEdited && /*#__PURE__*/React.createElement(ReadOnlyMetadataField, {
            dataValue: value,
            displayName: "",
            type: type
          }), shouldShowEditIcon && /*#__PURE__*/React.createElement(IconWithTooltip, {
            type: EDIT_ICON_TYPE,
            tooltipText: /*#__PURE__*/React.createElement(FormattedMessage, messages.editLabel),
            onClick: () => this.handleEditIconClick(columnIndex, rowIndex, value)
          }), isCellBeingEdited && /*#__PURE__*/React.createElement("div", {
            className: "bdl-MetadataBasedItemList-cell--edit"
          }, /*#__PURE__*/React.createElement(MetadataField, {
            canEdit: true,
            dataKey: `${id}${key}`,
            dataValue: valueBeingEdited,
            displayName: "",
            type: type,
            onChange: (changeKey, changedValue) => {
              this.setState({
                valueBeingEdited: changedValue
              });
            },
            onRemove: () => {
              this.setState({
                valueBeingEdited: undefined
              });
            },
            options: options
          }), /*#__PURE__*/React.createElement(IconWithTooltip, {
            className: "bdl-MetadataBasedItemList-cell--cancelIcon",
            onClick: this.handleCancelEdit,
            tooltipText: /*#__PURE__*/React.createElement(FormattedMessage, messages.cancel),
            type: CANCEL_ICON_TYPE
          }), value !== valueBeingEdited && /*#__PURE__*/React.createElement(IconWithTooltip, {
            className: "bdl-MetadataBasedItemList-cell--saveIcon",
            onClick: () => this.handleSave(item, fieldName, type, value, valueBeingEdited),
            tooltipText: /*#__PURE__*/React.createElement(FormattedMessage, messages.save),
            type: SAVE_ICON_TYPE,
            isUpdating: isUpdating
          })));
        }
    }
    return cellData;
  }
  getGridHeaderData(columnIndex) {
    const {
      fieldsToShow
    } = this.props;
    if (columnIndex === 0) return undefined;
    if (columnIndex === FILE_NAME_COLUMN_INDEX) {
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.name); // "Name" column header
    }
    const responseFields = this.getQueryResponseFields();
    const field = fieldsToShow[columnIndex - FIXED_COLUMNS_NUMBER];
    const key = isString(field) ? field : field.key;

    // Derive displayName in following order:
    // 1. fieldsToShow prop ||
    // 2. metadata template instance ||
    // 3. field key
    const displayName = getProp(field, 'displayName') || getProp(find(responseFields, ['key', key]), 'displayName', key);
    return displayName;
  }
  getScrollPositionClasses(width) {
    const {
      scrollLeftOffset,
      scrollRightOffset
    } = this.state;
    const isViewScrolledLeft = this.calculateContentWidth() > width && scrollRightOffset > 0;
    const isViewScrolledRight = scrollLeftOffset > 0;
    const isViewScrolledInMiddle = isViewScrolledLeft && isViewScrolledRight;
    return {
      'is-scrolledLeft': isViewScrolledLeft && !isViewScrolledInMiddle,
      // content scrolled all the way to the left
      'is-scrolledRight': isViewScrolledRight && !isViewScrolledInMiddle,
      // content scrolled all the way to the right
      'is-scrolledMiddle': isViewScrolledInMiddle // content scrolled somewhere in between
    };
  }
  calculateContentWidth() {
    const {
      fieldsToShow
    } = this.props;
    // total width = sum of widths of sticky & non-sticky columns
    return FILE_ICON_COLUMN_WIDTH + FILE_NAME_COLUMN_WIDTH + fieldsToShow.length * MIN_METADATA_COLUMN_WIDTH;
  }
  render() {
    const {
      currentCollection,
      fieldsToShow
    } = this.props;
    const rowCount = currentCollection.items ? currentCollection.items.length : 0;
    return /*#__PURE__*/React.createElement(AutoSizer, null, ({
      width,
      height
    }) => {
      const scrollClasses = this.getScrollPositionClasses(width);
      const classesTopRightGrid = classNames('bdl-MetadataBasedItemList-topRightGrid', scrollClasses);
      const classesBottomRightGrid = classNames('bdl-MetadataBasedItemList-bottomRightGrid', scrollClasses);
      return /*#__PURE__*/React.createElement("div", {
        className: "bdl-MetadataBasedItemList",
        "data-testid": "metadata-based-item-list"
      }, /*#__PURE__*/React.createElement(MultiGrid, {
        cellRenderer: this.cellRenderer,
        classNameBottomRightGrid: classesBottomRightGrid,
        classNameTopRightGrid: classesTopRightGrid,
        columnCount: fieldsToShow.length + FIXED_COLUMNS_NUMBER,
        columnWidth: this.getColumnWidth(width),
        fixedColumnCount: FIXED_COLUMNS_NUMBER,
        fixedRowCount: FIXED_ROW_NUMBER,
        height: height,
        hideBottomLeftGridScrollbar: true,
        hideTopRightGridScrollbar: true,
        rowCount: rowCount + FIXED_ROW_NUMBER,
        rowHeight: 50,
        width: width,
        onScroll: this.handleContentScroll
      }));
    });
  }
}
export default MetadataBasedItemList;
//# sourceMappingURL=MetadataBasedItemList.js.map