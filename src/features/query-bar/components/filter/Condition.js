// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

import IconClose from '../../../../icons/general/IconClose';
import Tooltip from '../../../../components/tooltip';
import IconAlertDefault from '../../../../icons/general/IconAlertDefault';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import ValueField from './ValueField';

import messages from '../../messages';
import {
    ATTRIBUTE,
    COLUMN_DISPLAY_TEXT,
    COLUMN_KEY,
    OPERATOR,
    OPERATOR_DISPLAY_TEXT,
    OPERATOR_KEY,
    OPERATORS_FOR_ATTRIBUTE,
    VALUE,
    VALUE_DISPLAY_TEXT,
    VALUE_KEY,
    WHERE,
    AND,
    OR,
} from '../../constants';
import type { ColumnType } from '../../flowTypes';

import '../../styles/FilterItem.scss';

type Props = {
    areErrorsEnabled: boolean,
    columns?: Array<ColumnType>,
    condition: Object,
    deleteCondition: (index: number) => void,
    index: number,
    intl: Object,
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
    updateSelectedPrefix: (option: Object) => void,
};

const deleteButtonIconHeight = 18;
const deleteButtonIconWidth = 18;

const Condition = ({
    areErrorsEnabled,
    columns,
    condition,
    deleteCondition,
    index,
    intl: { formatMessage },
    update,
    updateSelectedPrefix,
}: Props) => {
    const onDeleteButtonClick = () => {
        deleteCondition(index);
    };

    const updateSelectedField = (option: Object, fieldType?: string) => {
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

        const message = valueType === 'date' ? messages.tooltipSelectDateError : messages.tooltipSelectValueError;

        const error = areErrorsEnabled && !isValueSet ? formatMessage(message) : null;

        return error;
    };

    const renderDeleteButton = () => {
        return (
            <div className="filter-item-delete-button">
                <button className="delete-button" onClick={onDeleteButtonClick} type="button">
                    <IconClose width={deleteButtonIconWidth} height={deleteButtonIconHeight} color="#999EA4" />
                </button>
            </div>
        );
    };

    const renderPrefixField = () => {
        const { prefix } = condition;
        let message = '';
        switch (prefix) {
            case WHERE:
                message = { ...messages.prefixLabelWhereText };
                break;
            case AND:
                message = { ...messages.prefixButtonAndText };
                break;
            case OR:
                message = { ...messages.prefixButtonOrText };
                break;
            default:
                break;
        }

        const prefixOptions = getFormattedOptions(
            [AND, OR].map(key => ({
                displayName: key,
                value: key,
            })),
        );

        return (
            <div className="filter-item-prefix-container">
                {prefix === WHERE ? (
                    <p className="filter-item-prefix-text">{formatMessage(message)}</p>
                ) : (
                    <SingleSelectField
                        isDisabled={false}
                        onChange={updateSelectedPrefix}
                        options={prefixOptions}
                        placeholder={formatMessage(message)}
                        selectedValue={prefix}
                    />
                )}
            </div>
        );
    };

    const renderAttributeField = () => {
        const { attributeDisplayText } = condition;
        const templateAttributes = (template && template.fields) || [];
        const attributeOptions = getFormattedOptions(templateAttributes);

        return (
            <div className="filter-item-attribute-dropdown-container">
                <div className="filter-dropdown-single-select-field-container">
                    <SingleSelectField
                        fieldType={ATTRIBUTE}
                        isDisabled={false}
                        onChange={updateSelectedField}
                        options={attributeOptions}
                        placeholder={formatMessage(messages.selectAttributePlaceholderText)}
                        selectedValue={attributeDisplayText}
                    />
                </div>
            </div>
        );
    };

    const renderOperatorField = () => {
        const { operatorDisplayText, attributeDisplayText } = condition;

        const operatorsForAttribute = getOperatorsForAttribute(attributeDisplayText);
        const operatorOptions = getFormattedOptions(operatorsForAttribute);

        const selectedValue = operatorDisplayText || operatorOptions[0].displayText;

        return (
            <div className="filter-item-operator-dropdown-container">
                <div className="filter-dropdown-single-select-field-container">
                    <SingleSelectField
                        fieldType={OPERATOR}
                        isDisabled={false}
                        onChange={updateSelectedField}
                        options={operatorOptions}
                        selectedValue={
                            selectedValue // Default operator dropdown to first entry in options
                        }
                    />
                </div>
            </div>
        );
    };

    const renderValueField = () => {
        const { valueKey, valueType } = condition;

        const valuesForAttribute = getValuesForAttribute();
        const valueOptions = getFormattedOptions(valuesForAttribute);
        const error = getErrorMessage();

        const classnames = classNames('filter-item-value-dropdown-container', {
            'show-error': error,
        });

        return (
            <div className={classnames}>
                <ValueField
                    formatMessage={formatMessage}
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
                <div className="filter-item-error-icon-status">
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
        <div className="filter-item-container">
            {renderDeleteButton()}
            {renderPrefixField()}
            {renderAttributeField()}
            {renderOperatorField()}
            {renderValueField()}
            {renderErrorIcon()}
        </div>
    );
};

export { Condition as BaseCondition };
export default injectIntl(Condition);
