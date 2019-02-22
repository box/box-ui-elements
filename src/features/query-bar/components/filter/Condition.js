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
    COLUMN_DISPLAY_TEXT,
    COLUMN_KEY,
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
    onConnectorChange: (option: OptionType) => void,
    selectedConnector: ConnectorType,
    update: (
        index: number,
        condition: Object,
        fieldDisplayText: string | Date,
        fieldDisplayTextType: string,
        fieldId: string,
        fieldKey: string | Date,
        fieldKeyType: string,
        valueType: any,
    ) => void,
};

const deleteButtonIconHeight = 18;
const deleteButtonIconWidth = 18;

const Condition = ({
    areErrorsEnabled,
    columns,
    condition,
    deleteCondition,
    index,
    selectedConnector,
    update,
    onConnectorChange,
}: Props) => {
    const onDeleteButtonClick = () => {
        deleteCondition(index);
    };

    const updateSelectedField = (option: OptionType, fieldType?: string) => {
        const { displayText, id, type, value } = option;

        let displayTextType = '';
        let keyType = '';

        switch (fieldType) {
            case COLUMN:
                displayTextType = COLUMN_DISPLAY_TEXT;
                keyType = COLUMN_KEY;
                break;
            case OPERATOR:
                displayTextType = OPERATOR_DISPLAY_TEXT;
                keyType = OPERATOR_KEY;
                break;
            case VALUE:
                displayTextType = VALUE_DISPLAY_TEXT;
                keyType = VALUE_KEY;
                break;
            default:
                break;
        }

        update(index, condition, displayText, displayTextType, id, value, keyType, type);
    };

    const getFormattedOptions = (options: Array<Object>): any[] => {
        return options.map(option => {
            const { displayName, id, type } = option;
            return {
                displayText: displayName,
                fieldId: id,
                type,
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
        const { fieldId } = condition;
        const column = columns && columns.find(c => c.id === fieldId);
        if (column && column.options) {
            return column.options.map(option => {
                const { key } = option;
                return {
                    displayName: key,
                    id: fieldId,
                    type: 'enum',
                    value: key,
                };
            });
        }
        return [];
    };

    const updateValueField = (fieldValue: Object) => {
        const { fieldId, valueType } = condition;
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

        update(index, condition, displayText, displayTextType, fieldId, value, keyType, valueType);
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
        const { columnDisplayText } = condition;
        const columnOptions = getFormattedOptions(columns || []);
        return (
            <div className="condition-attribute-dropdown-container">
                <div className="filter-dropdown-single-select-field-container">
                    <SingleSelectField
                        fieldType={COLUMN}
                        isDisabled={false}
                        onChange={updateSelectedField}
                        options={columnOptions}
                        selectedValue={columnDisplayText}
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
