function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import Checkbox from '../checkbox/Checkbox';
import DraggableList from './DraggableList';
import DraggableListItem from './DraggableListItem';
import reorder from './draggable-list-utils/reorder';
import notes from './DraggableList.stories.md';
class DraggableListExamples extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      items: [],
      listId: ''
    });
    _defineProperty(this, "getItems", count => {
      return Array.from({
        length: count
      }, (v, k) => k).map(k => ({
        id: uniqueId('item_'),
        label: `item ${k}`
      }));
    });
    _defineProperty(this, "onDragEnd", (sourceIndex, destinationIndex) => {
      if (!destinationIndex) {
        return;
      }
      const items = reorder(this.state.items, sourceIndex, destinationIndex);
      this.setState({
        items
      });
    });
  }
  componentDidMount() {
    this.setState({
      items: this.getItems(10),
      listId: uniqueId()
    });
  }
  render() {
    const {
      isDraggableViaHandle
    } = this.props;
    const {
      items,
      listId
    } = this.state;
    return /*#__PURE__*/React.createElement(DraggableList, {
      className: "draggable-list-example-container",
      listId: listId,
      onDragEnd: this.onDragEnd
    }, items.map((item, index) => /*#__PURE__*/React.createElement(DraggableListItem, {
      key: `draggable-${index}`,
      id: item.id,
      index: index,
      isDraggableViaHandle: isDraggableViaHandle
    }, /*#__PURE__*/React.createElement(Checkbox, {
      label: item.label,
      name: item.label
    }))));
  }
}
export const Example = () => /*#__PURE__*/React.createElement(DraggableListExamples, null);
export const ExampleIsDraggableViaHandle = () => /*#__PURE__*/React.createElement(DraggableListExamples, {
  isDraggableViaHandle: true
});
export default {
  title: 'Components/DraggableList',
  component: DraggableList,
  parameters: {
    notes
  }
};
//# sourceMappingURL=DraggableList.stories.js.map