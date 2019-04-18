// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import IconClose from '../../../../icons/general/IconClose';
import Tooltip from '../../../../components/tooltip';
import IconAlertDefault from '../../../../icons/general/IconAlertDefault';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import ValueField from './ValueField';
import { isFloat, isInt } from '../../validator';

import messages from '../../messages';
import {
    AND,
    COLUMN,
    COLUMN_OPERATORS,
    DATE,
    ENUM,
    FLOAT,
    MULTI_SELECT,
    NUMBER,
    OPERATOR,
    OR,
    STRING,
} from '../../constants';
import type {
    ColumnType,
    ConditionType,
    ConditionValueType,
    ConnectorType,
    OperatorOptionType,
    OperatorType,
    OptionType,
} from '../../flowTypes';

import '../../styles/Condition.scss';

type Props = {
    areErrorsEnabled: boolean,
    columns?: Array<ColumnType>,
    condition: ConditionType,
    deleteCondition: (index: number) => void,
    index: number,
    onColumnChange: (condition: ConditionType, columnId: string) => void,
    onConnectorChange: (option: OptionType) => void,
    onOperatorChange: (conditionId: string, value: OperatorType) => void,
    onValueChange: (conditionId: string, values: Array<ConditionValueType>) => void,
    selectedConnector: ConnectorType,
};

const deleteButtonIconHeight = 18;
const deleteButtonIconWidth = 18;

const Condition = ({
    areErrorsEnabled,
    columns,
    condition,
    deleteCondition,
    onColumnChange,
    onOperatorChange,
    onValueChange,
    index,
    selectedConnector,
    onConnectorChange,
}: Props) => {
    const onDeleteButtonClick = () => {
        deleteCondition(index);
    };

    const handleColumnChange = (option: OptionType) => {
        const { value: columnId } = option;
        onColumnChange(condition, columnId);
    };

    const handleOperatorChange = (option: OperatorOptionType) => {
        const { id } = condition;
        const { value } = option;
        onOperatorChange(id, value);
    };

    const handleValueChange = (values: Array<ConditionValueType>) => {
        const { id } = condition;
        onValueChange(id, values);
    };

    const getColumnOperators = () => {
        const { columnId } = condition;
        const column = columns && columns.find(c => c.id === columnId);
        const type = column && column.type;

        if (!type) {
            return [];
        }
        return COLUMN_OPERATORS[type];
    };

    const getColumnOptions = () => {
        const { columnId } = condition;
        const column = columns && columns.find(c => c.id === columnId);
        if (column && column.options) {
            return column.options.map(option => {
                const { key } = option;
                return {
                    displayText: key,
                    value: key,
                };
            });
        }
        return [];
    };

    const validateValue = (values: Array<ConditionValueType>, type: string) => {
        switch (type) {
            case NUMBER:
                return isInt(String(values[0]));
            case FLOAT:
                return isFloat(String(values[0]));
            default:
                break;
        }
        return true;
    };

    const getErrorMessage = () => {
        const { values, columnId } = condition;
        const column = columns && columns.find(c => c.id === columnId);
        const type = column && column.type;

        const isValueSet = values.length !== 0;

        let isValueValid = true;
        if (isValueSet && type) {
            isValueValid = validateValue(values, type);
        }

        let message;
        let messageText;
        switch (type) {
            case STRING:
                message = <FormattedMessage {...messages.tooltipEnterValueError} />;
                break;
            case NUMBER:
                messageText = !isValueValid ? messages.tooltipInvalidNumberError : messages.tooltipEnterValueError;
                message = <FormattedMessage {...messageText} />;
                break;
            case FLOAT:
                messageText = !isValueValid ? messages.tooltipInvalidFloatError : messages.tooltipEnterValueError;
                message = <FormattedMessage {...messageText} />;
                break;
            case DATE:
                message = <FormattedMessage {...messages.tooltipSelectDateError} />;
                break;
            case ENUM:
                message = <FormattedMessage {...messages.tooltipSelectValueError} />;
                break;
            case MULTI_SELECT:
                message = <FormattedMessage {...messages.tooltipSelectValueError} />;
                break;
            default:
                break;
        }

        const error = !isValueValid || (areErrorsEnabled && !isValueSet) ? message : null;

        if (!error) {
            return null;
        }

        return error;
    };

    const renderDeleteButton = () => {
        return (
            <div className="condition-delete-button">
                <button className="delete-button" onClick={onDeleteButtonClick} type="button">
                    <IconClose width={deleteButtonIconWidth} height={deleteButtonIconHeight} color="#999EA4" />
                </button>
            </div>
        );
    };

    const renderConnectorField = () => {
        const connectorOptions = [AND, OR].map(connector => ({
            displayText: connector,
            value: connector,
        }));

        return (
            <div className="condition-connector">
                {index === 0 ? (
                    <p className="condition-connector-text">
                        <FormattedMessage {...messages.connectorWhereText} />
                    </p>
                ) : (
                    <SingleSelectField
                        isDisabled={false}
                        onChange={onConnectorChange}
                        options={connectorOptions}
                        selectedValue={selectedConnector}
                    />
                )}
            </div>
        );
    };

    const renderColumnField = () => {
        const { columnId } = condition;

        const columnOptions =
            columns &&
            columns.map(column => {
                const { displayName, id, type } = column;
                return {
                    displayText: displayName,
                    type,
                    value: id,
                };
            });

        return (
            <div className="condition-column-dropdown-container">
                <div className="filter-dropdown-single-select-field-container">
                    <SingleSelectField
                        fieldType={COLUMN}
                        isDisabled={false}
                        onChange={handleColumnChange}
                        options={columnOptions}
                        selectedValue={columnId}
                    />
                </div>
            </div>
        );
    };

    const renderOperatorField = () => {
        const { operator } = condition;
        const columnOperators = getColumnOperators();
        const operatorOptions = columnOperators.map(_operator => {
            const { displayText, key } = _operator;
            return {
                displayText,
                value: key,
            };
        });

        return (
            <div className="condition-operator-dropdown-container">
                <div className="filter-dropdown-single-select-field-container">
                    <SingleSelectField
                        fieldType={OPERATOR}
                        isDisabled={false}
                        onChange={handleOperatorChange}
                        options={operatorOptions}
                        selectedValue={operator}
                    />
                </div>
            </div>
        );
    };

    const renderValueField = () => {
        const column = columns && columns.find(c => c.id === condition.columnId);

        if (!column) {
            throw new Error('Expected Column');
        }

        const valueOptions = getColumnOptions();
        const error = getErrorMessage();

        const classnames = classNames('condition-value-dropdown-container', {
            'show-error': error,
        });

        return (
            <div className={classnames}>
                <ValueField
                    onChange={handleValueChange}
                    selectedValues={condition.values}
                    valueOptions={valueOptions}
                    valueType={column.type}
                />
            </div>
        );
    };

    const renderErrorIcon = () => {
        const error = getErrorMessage();
        return (
            error && (
                <div className="condition-error-icon-status">
                    <Tooltip text={error || ''} position="middle-right" theme="error">
                        <span>
                            <IconAlertDefault />
                        </span>
                    </Tooltip>
                </div>
            )
        );
    };

    return (
        <div className="condition-container">
            {renderDeleteButton()}
            {renderConnectorField()}
            {renderColumnField()}
            {renderOperatorField()}
            {renderValueField()}
            {renderErrorIcon()}
        </div>
    );
};

export default Condition;
