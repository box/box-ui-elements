function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import IconMetadataFilter from '../../../../icons/metadata-view/IconMetadataFilter';
import Condition from './Condition';
import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import MenuToggle from '../../../../components/dropdown-menu/MenuToggle';
import { Flyout, Overlay } from '../../../../components/flyout';
import { AND, OR, COLUMN_OPERATORS } from '../../constants';
import messages from '../../messages';
class FilterButton extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onClose", () => {
      this.setState({
        isMenuOpen: false
      });
    });
    _defineProperty(this, "onOpen", () => {
      this.setState({
        isMenuOpen: true
      });
    });
    _defineProperty(this, "toggleButton", () => {
      this.setState({
        isMenuOpen: !this.state.isMenuOpen
      });
    });
    _defineProperty(this, "createCondition", () => {
      const conditionID = uniqueId();
      const {
        columns
      } = this.props;
      if (columns && columns.length > 0) {
        const firstColumn = columns[0];
        const operator = COLUMN_OPERATORS[firstColumn.type][0].key;
        return {
          columnId: firstColumn.id,
          id: conditionID,
          operator,
          values: []
        };
      }
      throw new Error('Columns Required');
    });
    _defineProperty(this, "addFilter", () => {
      const newCondition = this.createCondition();
      this.setState({
        transientConditions: [...this.state.transientConditions, newCondition],
        hasUserSubmitted: false
      });
    });
    _defineProperty(this, "applyFilters", () => {
      const {
        onFilterChange
      } = this.props;
      const {
        transientConditions
      } = this.state;
      const areAllValid = this.areAllValid();
      if (areAllValid) {
        if (onFilterChange) {
          onFilterChange(transientConditions);
        }
        this.setState({
          isMenuOpen: false,
          transientConditions: [],
          hasUserSubmitted: false
        });
      } else {
        this.setState({
          hasUserSubmitted: true
        });
      }
    });
    _defineProperty(this, "updateConditionState", (conditionId, updateCondition) => {
      const {
        transientConditions
      } = this.state;
      let newConditionIndex = 0;
      const conditionToUpdate = transientConditions.find((currentCondition, index) => {
        newConditionIndex = index;
        return currentCondition.id === conditionId;
      });
      let newCondition = _objectSpread({}, conditionToUpdate);
      newCondition = updateCondition(newCondition);
      const newConditions = cloneDeep(transientConditions);
      newConditions[newConditionIndex] = newCondition;
      this.setState({
        transientConditions: newConditions
      });
    });
    _defineProperty(this, "handleColumnChange", (condition, columnId) => {
      const {
        columns
      } = this.props;
      const {
        transientConditions
      } = this.state;
      let newConditionIndex = 0;
      const conditionToUpdate = transientConditions.find((currentCondition, index) => {
        newConditionIndex = index;
        return currentCondition.id === condition.id;
      });
      const column = columns && columns.find(c => c.id === columnId);
      if (!column) {
        throw new Error('Invalid Column.id');
      }
      const type = column && column.type;
      const operator = COLUMN_OPERATORS[type][0].key;
      const newCondition = _objectSpread(_objectSpread({}, conditionToUpdate), {}, {
        columnId,
        operator,
        values: []
      });
      const newConditions = cloneDeep(transientConditions);
      newConditions[newConditionIndex] = newCondition;
      this.setState({
        transientConditions: newConditions
      });
    });
    _defineProperty(this, "handleOperatorChange", (conditionId, value) => {
      this.updateConditionState(conditionId, condition => {
        condition.operator = value;
        return condition;
      });
    });
    _defineProperty(this, "handleValueChange", (conditionId, values) => {
      this.updateConditionState(conditionId, condition => {
        condition.values = values;
        return condition;
      });
    });
    _defineProperty(this, "handleConnectorChange", option => {
      const convert = str => {
        switch (str) {
          case AND:
            return AND;
          case OR:
            return OR;
          default:
            throw new Error('Invalid connector');
        }
      };
      this.setState({
        selectedConnector: convert(option.value)
      });
    });
    _defineProperty(this, "deleteCondition", index => {
      const {
        transientConditions
      } = this.state;
      const conditionsAfterDeletion = transientConditions.filter((condition, conditionIndex) => {
        return conditionIndex !== index;
      });
      this.setState({
        transientConditions: conditionsAfterDeletion
      });
    });
    _defineProperty(this, "areAllValid", () => {
      const {
        transientConditions
      } = this.state;
      let areAllValid = true;
      transientConditions.forEach(condition => {
        if (condition.values.length === 0) {
          areAllValid = false;
        }
      });
      return areAllValid;
    });
    // Should close when all the conditions have a value set and the apply button is pressed.
    _defineProperty(this, "shouldClose", event => {
      // The current approach assumes that the Apply button contains at most one child element.
      const areAllValid = this.areAllValid();
      if (event && event.target && areAllValid) {
        if (event.target.classList.contains('apply-filters-button') || event.target.parentNode.classList.contains('apply-filters-button')) {
          return true;
        }
      }
      return false;
    });
    this.state = {
      hasUserSubmitted: false,
      isMenuOpen: false,
      selectedConnector: AND,
      transientConditions: cloneDeep(this.props.conditions)
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      columns,
      conditions
    } = this.props;
    const {
      isMenuOpen,
      transientConditions
    } = this.state;
    const {
      isMenuOpen: prevIsMenuOpen
    } = prevState;
    const wasFlyoutOpened = isMenuOpen && !prevIsMenuOpen;
    if (wasFlyoutOpened) {
      const hasUnsavedConditions = transientConditions.length > 0;
      const shouldSetInitialCondition = conditions.length === 0;
      if (!hasUnsavedConditions) {
        if (shouldSetInitialCondition) {
          const newConditions = columns && columns.length === 0 ? [] : [this.createCondition()];
          this.setState({
            transientConditions: newConditions
          });
        } else {
          this.setState({
            transientConditions: cloneDeep(this.props.conditions)
          });
        }
      }
    }
  }
  render() {
    const {
      columns,
      conditions
    } = this.props;
    const {
      transientConditions,
      hasUserSubmitted,
      isMenuOpen,
      selectedConnector
    } = this.state;
    const numberOfConditions = conditions.length;
    const areAllValid = this.areAllValid();
    const buttonClasses = classNames('query-bar-button', numberOfConditions !== 0 && areAllValid ? 'is-active' : '');
    const isFilterDisabled = !columns || columns.length === 0;
    return /*#__PURE__*/React.createElement(Flyout, {
      className: "query-bar-filter-dropdown-flyout",
      closeOnClick: true,
      closeOnClickOutside: true,
      closeOnClickPredicate: this.shouldClose,
      onClose: this.onClose,
      onOpen: this.onOpen,
      overlayIsVisible: isMenuOpen,
      portaledClasses: ['pika-single'] /* Element in DatePicker package  */,
      position: "bottom-right",
      shouldDefaultFocus: true
    }, /*#__PURE__*/React.createElement(Button, {
      className: buttonClasses,
      isDisabled: isFilterDisabled,
      onClick: this.toggleButton,
      type: "button"
    }, /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(IconMetadataFilter, {
      className: "button-icon"
    }), /*#__PURE__*/React.createElement("span", {
      className: "button-label"
    }, numberOfConditions === 0 ? /*#__PURE__*/React.createElement(FormattedMessage, messages.filtersButtonText) : /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.multipleFiltersButtonText, {
      values: {
        number: numberOfConditions
      }
    }))))), /*#__PURE__*/React.createElement(Overlay, null, isMenuOpen ? /*#__PURE__*/React.createElement("div", {
      className: "filter-button-dropdown"
    }, /*#__PURE__*/React.createElement("div", {
      className: "filter-button-dropdown-header"
    }, transientConditions.length === 0 ? /*#__PURE__*/React.createElement(FormattedMessage, messages.noFiltersAppliedText) : null, transientConditions.map((condition, index) => {
      return /*#__PURE__*/React.createElement(Condition, {
        key: `metadata-view-filter-item-${condition.id}`,
        hasUserSubmitted: hasUserSubmitted,
        columns: columns,
        condition: condition,
        deleteCondition: this.deleteCondition,
        index: index,
        onColumnChange: this.handleColumnChange,
        onConnectorChange: this.handleConnectorChange,
        onOperatorChange: this.handleOperatorChange,
        onValueChange: this.handleValueChange,
        selectedConnector: selectedConnector
      });
    })), /*#__PURE__*/React.createElement("div", {
      className: "filter-button-dropdown-footer"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "button",
      onClick: this.addFilter
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.addFilterButtonText)), /*#__PURE__*/React.createElement(PrimaryButton, {
      className: "apply-filters-button",
      onClick: this.applyFilters,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.applyFiltersButtonText)))) : /*#__PURE__*/React.createElement("div", null)));
  }
}
export default FilterButton;
//# sourceMappingURL=FilterButton.js.map