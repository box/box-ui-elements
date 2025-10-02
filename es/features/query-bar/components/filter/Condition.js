import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import isFinite from 'lodash/isFinite';
import isInteger from 'lodash/isInteger';
import classNames from 'classnames';
import IconClose from '../../../../icons/general/IconClose';
import Tooltip from '../../../../components/tooltip';
import IconAlertDefault from '../../../../icons/general/IconAlertDefault';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import ValueField from './ValueField';
import messages from '../../messages';
import { AND, COLUMN, COLUMN_OPERATORS, DATE, ENUM, FLOAT, MULTI_SELECT, NUMBER, OPERATOR, OR, STRING } from '../../constants';
import '../../styles/Condition.scss';
const deleteButtonIconHeight = 18;
const deleteButtonIconWidth = 18;
const Condition = ({
  hasUserSubmitted,
  columns,
  condition,
  deleteCondition,
  onColumnChange,
  onOperatorChange,
  onValueChange,
  index,
  selectedConnector,
  onConnectorChange
}) => {
  const onDeleteButtonClick = () => {
    deleteCondition(index);
  };
  const handleColumnChange = option => {
    const {
      value: columnId
    } = option;
    onColumnChange(condition, columnId);
  };
  const handleOperatorChange = option => {
    const {
      id
    } = condition;
    const {
      value
    } = option;
    onOperatorChange(id, value);
  };
  const handleValueChange = values => {
    const {
      id
    } = condition;
    onValueChange(id, values);
  };
  const getColumnOperators = () => {
    const {
      columnId
    } = condition;
    const column = columns && columns.find(c => c.id === columnId);
    const type = column && column.type;
    if (!type) {
      return [];
    }
    return COLUMN_OPERATORS[type];
  };
  const getColumnOptions = () => {
    const {
      columnId
    } = condition;
    const column = columns && columns.find(c => c.id === columnId);
    if (column && column.options) {
      return column.options.map(option => {
        const {
          key
        } = option;
        return {
          displayText: key,
          value: key
        };
      });
    }
    return [];
  };
  const validateValue = (values, type) => {
    switch (type) {
      case NUMBER:
        return isInteger(Number(values[0]));
      case FLOAT:
        return isFinite(Number(values[0]));
      default:
        break;
    }
    return true;
  };
  const getErrorMessage = () => {
    const {
      values,
      columnId
    } = condition;
    const column = columns && columns.find(c => c.id === columnId);
    const type = column && column.type;
    const isValueEmpty = values.length === 0;
    let isValueValid = false;
    if (!isValueEmpty && type) {
      isValueValid = validateValue(values, type);
    }

    /**
     * isValueValid handles the error case when the user tries to enter an invalid input in either a
     * number type field or a float type field
     *
     * (!hasUserSubmitted && !isValueSet) handles the error case when a user presses on the Apply button
     * but the input field is empty
     */
    if (isValueValid || !hasUserSubmitted && isValueEmpty) {
      return null;
    }
    let messageText;
    switch (type) {
      case STRING:
        messageText = messages.tooltipEnterValueError;
        break;
      case NUMBER:
        messageText = !isValueValid ? messages.tooltipInvalidNumberError : messages.tooltipEnterValueError;
        break;
      case FLOAT:
        messageText = !isValueValid ? messages.tooltipInvalidFloatError : messages.tooltipEnterValueError;
        break;
      case DATE:
        messageText = messages.tooltipSelectDateError;
        break;
      case ENUM:
        messageText = messages.tooltipSelectValueError;
        break;
      case MULTI_SELECT:
        messageText = messages.tooltipSelectValueError;
        break;
      default:
        break;
    }
    return messageText && /*#__PURE__*/React.createElement(FormattedMessage, messageText);
  };
  const renderDeleteButton = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "condition-delete-button"
    }, /*#__PURE__*/React.createElement("button", {
      className: "delete-button",
      onClick: onDeleteButtonClick,
      type: "button"
    }, /*#__PURE__*/React.createElement(IconClose, {
      width: deleteButtonIconWidth,
      height: deleteButtonIconHeight,
      color: "#999EA4"
    })));
  };
  const renderConnectorField = () => {
    const connectorOptions = [AND, OR].map(connector => ({
      displayText: connector,
      value: connector
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "condition-connector"
    }, index === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "condition-connector-text"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.connectorWhereText)) : /*#__PURE__*/React.createElement(SingleSelectField, {
      isDisabled: false,
      onChange: onConnectorChange,
      options: connectorOptions,
      selectedValue: selectedConnector
    }));
  };
  const renderColumnField = () => {
    const {
      columnId
    } = condition;
    const columnOptions = columns && columns.map(column => {
      const {
        displayName,
        id,
        type
      } = column;
      return {
        displayText: displayName,
        type,
        value: id
      };
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "condition-column-dropdown-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "filter-dropdown-single-select-field-container"
    }, /*#__PURE__*/React.createElement(SingleSelectField, {
      fieldType: COLUMN,
      isDisabled: false,
      onChange: handleColumnChange,
      options: columnOptions || [],
      selectedValue: columnId
    })));
  };
  const renderOperatorField = () => {
    const {
      operator
    } = condition;
    const columnOperators = getColumnOperators();
    const operatorOptions = columnOperators.map(_operator => {
      const {
        displayText,
        key
      } = _operator;
      return {
        displayText,
        value: key
      };
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "condition-operator-dropdown-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "filter-dropdown-single-select-field-container"
    }, /*#__PURE__*/React.createElement(SingleSelectField, {
      fieldType: OPERATOR,
      isDisabled: false,
      onChange: handleOperatorChange,
      options: operatorOptions,
      selectedValue: operator
    })));
  };
  const renderValueField = () => {
    const column = columns && columns.find(c => c.id === condition.columnId);
    if (!column) {
      throw new Error('Expected Column');
    }
    const valueOptions = getColumnOptions();
    const error = getErrorMessage();
    const classnames = classNames('condition-value-dropdown-container', {
      'show-error': error
    });
    return /*#__PURE__*/React.createElement("div", {
      className: classnames
    }, /*#__PURE__*/React.createElement(ValueField, {
      onChange: handleValueChange,
      selectedValues: condition.values,
      valueOptions: valueOptions,
      valueType: column.type
    }));
  };
  const renderErrorIcon = () => {
    const error = getErrorMessage();
    return error && /*#__PURE__*/React.createElement("div", {
      className: "condition-error-icon-status"
    }, /*#__PURE__*/React.createElement(Tooltip, {
      text: error || '',
      position: "middle-right",
      theme: "error"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IconAlertDefault, null))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "condition-container"
  }, renderDeleteButton(), renderConnectorField(), renderColumnField(), renderOperatorField(), renderValueField(), renderErrorIcon());
};
export default Condition;
//# sourceMappingURL=Condition.js.map