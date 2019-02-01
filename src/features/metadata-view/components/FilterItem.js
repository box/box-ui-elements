// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import IconClose from '../../../icons/general/IconClose';
import SingleSelectField from '../../../components/select-field/SingleSelectField';
import FilterValueField from './FilterValueField';
import { isValidValue } from '../validator';

import messages from '../messages';
import {
    ATTRIBUTE,
    ATTRIBUTE_DISPLAY_TEXT,
    ATTRIBUTE_KEY,
    OPERATOR,
    OPERATOR_DISPLAY_TEXT,
    OPERATOR_KEY,
    OPERATORS_FOR_ATTRIBUTE,
    VALUE,
    VALUE_DISPLAY_TEXT,
    VALUE_KEY,
} from '../constants';

import '../styles/FilterItem.scss';

type State = {
    selectedAttribute: any,
    selectedAttributeDisplayText: string,
    selectedOperator: any,
    selectedValue: any,
    valueType: string,
};

type Props = {
    condition: Object,
    deleteCondition: (index: number) => void,
    index: number,
    intl: Object,
    template?: Object,
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

class FilterItem extends React.Component<Props, State> {
    state = {
        selectedAttribute: this.props.condition.attributeKey,
        selectedAttributeDisplayText: this.props.condition.attributeDisplayText || '',
        selectedOperator: this.props.condition.operatorKey,
        selectedValue: this.props.condition.valueKey,
        // eslint-disable-next-line react/no-unused-state
        valueType: '',
    };

    onDeleteButtonClick = () => {
        const { deleteCondition, index } = this.props;
        deleteCondition(index);
    };

    updateSelectedField = (option: Object, fieldType?: string) => {
        const { condition, update, index } = this.props;
        const value = option.value;
        const valueType = option.type;
        const fieldId = option.fieldId || condition.fieldId;

        const displayText = option.displayText;
        let displayTextType = '';
        let keyType = '';

        if (fieldType === ATTRIBUTE) {
            this.setState({
                selectedAttribute: value,
                selectedAttributeDisplayText: displayText,
                selectedOperator: '',
                selectedValue: null,
                // eslint-disable-next-line react/no-unused-state
                valueType,
            });
            displayTextType = ATTRIBUTE_DISPLAY_TEXT;
            keyType = ATTRIBUTE_KEY;
        } else if (fieldType === OPERATOR) {
            this.setState({ selectedOperator: value });
            displayTextType = OPERATOR_DISPLAY_TEXT;
            keyType = OPERATOR_KEY;
        } else if (fieldType === VALUE) {
            this.setState({ selectedValue: value });
            displayTextType = VALUE_DISPLAY_TEXT;
            keyType = VALUE_KEY;
        }

        update(index, condition, displayText, displayTextType, fieldId, value, keyType, valueType);
    };

    getFormattedOptions = (options: Array<Object>): any[] => {
        return options.map((option, index) => {
            return {
                displayText: option.displayName,
                fieldId: option.id,
                type: option.type,
                value: index,
            };
        });
    };

    getOperatorsForAttribute = () => {
        const { condition } = this.props;
        if (condition.valueType === '') {
            return [];
        }
        return OPERATORS_FOR_ATTRIBUTE[condition.valueType];
    };

    getValuesForAttribute = (attribute: string, template?: Object) => {
        const {
            condition: { fieldId },
        } = this.props;

        const field =
            template &&
            template.fields.find(f => {
                return f.id === fieldId;
            });

        if (field && field.options) {
            const fieldOptions = field.options.map((option, index) => {
                return {
                    displayName: option.key,
                    id: fieldId,
                    type: 'enum',
                    value: index,
                };
            });

            return fieldOptions;
        }
        return [];
    };

    updateValueField = (fieldValue: Object) => {
        const { condition, update, index } = this.props;
        let displayText = '';
        const displayTextType = VALUE_DISPLAY_TEXT;
        const fieldId = condition.fieldId;
        let value = '';
        const keyType = VALUE_KEY;
        const valueType = condition.valueType;
        if (!fieldValue || !fieldValue.target) {
            displayText = fieldValue;
            value = fieldValue;
            this.setState({
                selectedValue: fieldValue,
            });
        } else {
            const { target } = fieldValue;
            displayText = target.value;
            value = target.value;

            this.setState({
                selectedValue: target.value,
            });
        }

        update(index, condition, displayText, displayTextType, fieldId, value, keyType, valueType);
    };

    shouldDisplayErrorMessage = (valueType: string, selectedValue?: string | Date | number) => {
        return !isValidValue(valueType, selectedValue);
    };

    renderValueField = () => {
        const { condition, template, intl } = this.props;
        const { formatMessage } = intl;
        const { valueType, valueKey } = condition;
        const { selectedValue, selectedAttributeDisplayText } = this.state;

        const valuesForAttribute = this.getValuesForAttribute(selectedAttributeDisplayText, template);

        const valueOptions = this.getFormattedOptions(valuesForAttribute);

        const shouldDisplayErrorMessage = this.shouldDisplayErrorMessage(valueType, selectedValue);

        return (
            <div className="filter-item-value-dropdown-container">
                <FilterValueField
                    formatMessage={formatMessage}
                    selectedValue={selectedValue}
                    shouldDisplayErrorMessage={shouldDisplayErrorMessage}
                    updateValueField={this.updateValueField}
                    updateSelectedField={this.updateSelectedField}
                    valueKey={valueKey}
                    valueOptions={valueOptions}
                    valueType={valueType}
                />
            </div>
        );
    };

    render() {
        const { template, intl } = this.props;
        const { formatMessage } = intl;
        const { selectedAttribute, selectedOperator } = this.state;

        const templateAttributes = (template && template.fields) || [];
        const attributeOptions = this.getFormattedOptions(templateAttributes);

        const operatorsForAttribute = this.getOperatorsForAttribute();
        const operatorOptions = this.getFormattedOptions(operatorsForAttribute);

        return (
            <div className="filter-item-container">
                <div className="filter-item-delete-button">
                    <button type="button" className="delete-button" onClick={this.onDeleteButtonClick}>
                        <IconClose width={deleteButtonIconWidth} height={deleteButtonIconHeight} color="#999EA4" />
                    </button>
                </div>
                <div className="filter-item-prefix-container">
                    <p className="filter-item-prefix-text">
                        <FormattedMessage {...messages.prefixButtonText} />
                    </p>
                </div>
                <div className="filter-item-attribute-dropdown-container">
                    <div className="filter-dropdown-single-select-field-container">
                        <SingleSelectField
                            fieldType={ATTRIBUTE}
                            isDisabled={false}
                            onChange={this.updateSelectedField}
                            options={attributeOptions}
                            placeholder={formatMessage(messages.selectAttributePlaceholderText)}
                            selectedValue={selectedAttribute}
                        />
                    </div>
                </div>
                <div className="filter-item-operator-dropdown-container">
                    <div className="filter-dropdown-single-select-field-container">
                        <SingleSelectField
                            fieldType={OPERATOR}
                            isDisabled={false}
                            onChange={this.updateSelectedField}
                            options={operatorOptions}
                            selectedValue={selectedOperator}
                        />
                    </div>
                </div>
                {this.renderValueField()}
            </div>
        );
    }
}

export { FilterItem as BaseFilterItem };
export default injectIntl(FilterItem);
