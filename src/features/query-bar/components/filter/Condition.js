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
    ATTRIBUTE,
    COLUMN_DISPLAY_TEXT,
    COLUMN_KEY,
    CONNECTOR_NAMES,
    DATE,
    OPERATOR,
    OPERATOR_DISPLAY_TEXT,
    OPERATOR_KEY,
    OPERATORS_FOR_ATTRIBUTE,
    OR,
    VALUE,
    VALUE_DISPLAY_TEXT,
    VALUE_KEY,
} from '../../constants';
import type { ColumnType, SelectOptionType } from '../../flowTypes';

import '../../styles/Condition.scss';

type Props = {
    areErrorsEnabled: boolean,
    columns?: Array<ColumnType>,
    condition: Object,
    deleteCondition: (index: number) => void,
    index: number,
    intl: Object,
    onConnectorChange: (option: SelectOptionType) => void,
    selectedConnector: string,
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

    const updateSelectedField = (option: SelectOptionType, fieldType?: string) => {
        const conditionIndex = index;
        const value = option.value;
        const valueType = option.type;
        const fieldId = option.fieldId || condition.fieldId;

        const displayText = option.displayText;
        let displayTextType = '';
        let keyType = '';

        if (fieldType === ATTRIBUTE) {
            displayTextType = COLUMN_DISPLAY_TEXT;
            keyType = COLUMN_KEY;
        } else if (fieldType === OPERATOR) {
            displayTextType = OPERATOR_DISPLAY_TEXT;
            keyType = OPERATOR_KEY;
        } else if (fieldType === VALUE) {
            displayTextType = VALUE_DISPLAY_TEXT;
            keyType = VALUE_KEY;
        }

        update(conditionIndex, condition, displayText, displayTextType, fieldId, value, keyType, valueType);
    };

    const getFormattedOptions = (options: Array<Object>): any[] => {
        return options.map(option => {
            return {
                displayText: option.displayName,
                fieldId: option.id,
                type: option.type,
                value: option.displayName,
            };
        });
    };

    const getOperatorsForAttribute = () => {
        const { valueType } = condition;
        if (valueType === '') {
            return [];
        }
        return OPERATORS_FOR_ATTRIBUTE[valueType];
    };

    const getValuesForAttribute = () => {
        const { fieldId } = condition;
        const field =
            columns &&
            columns.find(column => {
                return column.id === fieldId;
            });

        if (field && field.options) {
            const fieldOptions = field.options.map((option, optionIndex) => {
                return {
                    displayName: option.key,
                    id: fieldId,
                    type: 'enum',
                    value: optionIndex,
                };
            });

            return fieldOptions;
        }
        return [];
    };

    const updateValueField = (fieldValue: Object) => {
        let displayText = '';
        const displayTextType = VALUE_DISPLAY_TEXT;
        const fieldId = condition.fieldId;
        let value = '';
        const keyType = VALUE_KEY;
        const valueType = condition.valueType;
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
        let message = '';
        switch (selectedConnector) {
            case AND:
                message = <FormattedMessage {...messages.connectorAndText} />;
                break;
            case OR:
                message = <FormattedMessage {...messages.connectorOrText} />;
                break;
            default:
                break;
        }

        const connectorOptions = getFormattedOptions(
            [AND, OR].map(connector => ({
                displayName: CONNECTOR_NAMES[connector],
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
                        placeholder={message}
                        selectedValue={selectedConnector}
                    />
                )}
            </div>
        );
    };

    const renderAttributeField = () => {
        const { columnDisplayText } = condition;
        const columnAttributes = columns || [];
        const attributeOptions = getFormattedOptions(columnAttributes);
        const placeholder = <FormattedMessage {...messages.selectAttributePlaceholderText} />;

        return (
            <div className="condition-attribute-dropdown-container">
                <div className="filter-dropdown-single-select-field-container">
                    <SingleSelectField
                        fieldType={ATTRIBUTE}
                        isDisabled={false}
                        onChange={updateSelectedField}
                        options={attributeOptions}
                        placeholder={placeholder}
                        selectedValue={columnDisplayText}
                    />
                </div>
            </div>
        );
    };

    const renderOperatorField = () => {
        const { operatorDisplayText } = condition;
        const operatorsForAttribute = getOperatorsForAttribute();
        const operatorOptions = getFormattedOptions(operatorsForAttribute);

        const selectedValue = operatorDisplayText || operatorOptions[0].displayText;

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

        const valuesForAttribute = getValuesForAttribute();
        const valueOptions = getFormattedOptions(valuesForAttribute);
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
            {renderAttributeField()}
            {renderOperatorField()}
            {renderValueField()}
            {renderErrorIcon()}
        </div>
    );
};

export default Condition;
