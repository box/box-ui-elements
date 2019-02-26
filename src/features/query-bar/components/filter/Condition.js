// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import IconClose from '../../../../icons/general/IconClose';
import Tooltip from '../../../../components/tooltip';
import IconAlertDefault from '../../../../icons/general/IconAlertDefault';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import ValueField from './ValueField';

import messages from '../../messages';
import {
    AND,
    COLUMN,
    COLUMN_OPERATORS,
    DATE,
    OPERATOR,
    OPERATOR_DISPLAY_TEXT,
    OPERATOR_KEY,
    OR,
    VALUE,
    VALUE_DISPLAY_TEXT,
    VALUE_KEY,
} from '../../constants';
import type { ColumnType, ConnectorType, OptionType } from '../../flowTypes';

import '../../styles/Condition.scss';

type Props = {
    areErrorsEnabled: boolean,
    columns?: Array<ColumnType>,
    condition: Object,
    deleteCondition: (index: number) => void,
    index: number,
    onColumnChange: (condition: Object, columnId: string, valueType: any) => void,
    onConnectorChange: (option: OptionType) => void,
    onFieldChange: (
        condition: Object,
        fieldDisplayText: string | Date,
        fieldDisplayTextType: string,
        fieldKey: string | Date,
        fieldKeyType: string,
        valueType: any,
    ) => void,
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
    onFieldChange,
    index,
    selectedConnector,
    onConnectorChange,
}: Props) => {
    const onDeleteButtonClick = () => {
        deleteCondition(index);
    };

    const updateColumnField = (option: OptionType) => {
        const { type, value: columnId } = option;

        onColumnChange(condition, columnId, type);
    };

    const updateSelectedField = (option: OptionType, fieldType?: string) => {
        const { displayText, type, value } = option;

        let displayTextType = '';
        let keyType = '';

        switch (fieldType) {
            case OPERATOR:
                displayTextType = OPERATOR_DISPLAY_TEXT;
                keyType = OPERATOR_KEY;
                break;
            case VALUE:
                displayTextType = VALUE_DISPLAY_TEXT;
                keyType = VALUE_KEY;
                break;
            default:
                throw new Error('invalid input');
        }

        onFieldChange(condition, displayText, displayTextType, value, keyType, type);
    };

    const getFormattedOptions = (options: Array<Object>): any[] => {
        return options.map(option => {
            const { displayName, type } = option;
            return {
                displayText: displayName,
                type, // TODO: valueType
                value: displayName,
            };
        });
    };

    const getColumnOperators = () => {
        const { valueType } = condition;
        if (valueType === '') {
            return [];
        }
        return COLUMN_OPERATORS[valueType];
    };

    const getColumnOptions = () => {
        const { columnId } = condition;
        const column = columns && columns.find(c => c.id === columnId);
        if (column && column.options) {
            return column.options.map(option => {
                const { key } = option;
                return {
                    displayName: key,
                    type: 'enum',
                    value: key,
                };
            });
        }
        return [];
    };

    const updateValueField = (fieldValue: Object) => {
        const { valueType } = condition;
        let displayText = '';
        const displayTextType = VALUE_DISPLAY_TEXT;

        let value = '';
        const keyType = VALUE_KEY;

        if (!fieldValue || !fieldValue.target) {
            displayText = fieldValue;
            value = fieldValue;
        } else {
            const { target } = fieldValue;
            displayText = target.value;
            value = target.value;
        }

        onFieldChange(condition, displayText, displayTextType, value, keyType, valueType);
    };

    const getErrorMessage = () => {
        const { valueKey, valueType } = condition;

        const isValueSet = valueKey !== null && valueKey !== '';
        const message = (
            <FormattedMessage
                {...(valueType === DATE ? messages.tooltipSelectDateError : messages.tooltipSelectValueError)}
            />
        );
        const error = areErrorsEnabled && !isValueSet ? message : null;

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
        const connectorOptions = getFormattedOptions(
            [AND, OR].map(connector => ({
                displayName: connector,
                value: connector,
            })),
        );

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
                        onChange={updateColumnField}
                        options={columnOptions}
                        selectedValue={columnId}
                    />
                </div>
            </div>
        );
    };

    const renderOperatorField = () => {
        const { operatorDisplayText } = condition;
        const columnOperators = getColumnOperators();
        const operatorOptions = getFormattedOptions(columnOperators);

        return (
            <div className="condition-operator-dropdown-container">
                <div className="filter-dropdown-single-select-field-container">
                    <SingleSelectField
                        fieldType={OPERATOR}
                        isDisabled={false}
                        onChange={updateSelectedField}
                        options={operatorOptions}
                        selectedValue={operatorDisplayText || operatorOptions[0].displayText}
                    />
                </div>
            </div>
        );
    };

    const renderValueField = () => {
        const { valueKey, valueType, valueDisplayText } = condition;

        const columnOptions = getColumnOptions();
        const valueOptions = getFormattedOptions(columnOptions);
        const error = getErrorMessage();

        const classnames = classNames('condition-value-dropdown-container', {
            'show-error': error,
        });

        return (
            <div className={classnames}>
                <ValueField
                    selectedValue={valueDisplayText}
                    updateValueField={updateValueField}
                    updateSelectedField={updateSelectedField}
                    valueKey={valueKey}
                    valueOptions={valueOptions}
                    valueType={valueType}
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
