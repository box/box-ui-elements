// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import isEqual from 'lodash/isEqual';

import type { FieldProps } from 'formik';

import DatalistItem from '../datalist-item';
import PillSelectorDropdown from './PillSelectorDropdown';
import type { Option, Pill } from './flowTypes';

import './PillSelectorDropdown.scss';

type Props = FieldProps & {
    /** CSS class for the component */
    className?: string,
    /** If true, the input control is disabled so no more input can be made */
    disabled?: boolean,
    /** If true, user can add pills not included in selector options */
    isCustomInputAllowed: boolean,
    /** Input label */
    label: React.Node,
    /** Array or Immutable list with data for the selected options shown as pills */
    options: Array<Option>,
    /** A placeholder to show in the input when there are no pills */
    placeholder: string,
    /** Called to check if pill item data is valid. The `item` is passed in. */
    validator: (text: string) => boolean,
};

type State = {
    selectorOptions: Array<Option>,
};

class PillSelectorDropdownField extends React.PureComponent<Props, State> {
    static defaultProps = {
        isCustomInputAllowed: false,
        options: [],
        validator: () => true,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            selectorOptions: props.options,
        };
    }

    deNormalize(options: Array<Option>): Array<Pill> {
        return options.map((option: Option) => ({
            text: option.displayText,
            value: option.value,
        }));
    }

    normalize(pills: Array<Pill>): Array<Option> {
        return pills.map((pill: Pill) => ({
            displayText: pill.text,
            value: pill.value,
        }));
    }

    createFakeSyntheticEvent(name: string, value: Array<Option>) {
        return {
            currentTarget: { name, value },
            target: { name, value },
        };
    }

    handleInput = (text: string) => {
        const { options } = this.props;
        const { field } = this.props;
        const { value = [] } = field;
        const filteredOptions = options.slice().filter((option: Option) => {
            const hasText = !!text && option.displayText.toLowerCase().includes(text.toLowerCase());
            const hasValue = !!value.find(v => isEqual(v, option));
            return hasText && !hasValue;
        });
        this.setState({ selectorOptions: filteredOptions });
    };

    handleSelect = (options: Array<Option>) => {
        const { field } = this.props;
        const { name, onChange, value = [] } = field;
        onChange(this.createFakeSyntheticEvent(name, [...value, ...options]));
    };

    handleRemove = (option: Option, index: number) => {
        const { field } = this.props;
        const { name, onChange, value } = field;
        const options = value.slice();
        options.splice(index, 1);
        onChange(this.createFakeSyntheticEvent(name, options));
    };

    render() {
        const { selectorOptions } = this.state;
        const { className, disabled, field, form, isCustomInputAllowed, label, placeholder, validator } = this.props;
        const { name, value = [] } = field;
        const { errors } = form;
        const error = getProp(errors, name);

        return (
            <PillSelectorDropdown
                allowCustomPills={isCustomInputAllowed}
                allowInvalidPills
                className={className}
                disabled={disabled}
                label={label}
                error={error}
                onInput={this.handleInput}
                onRemove={this.handleRemove}
                onSelect={this.handleSelect}
                placeholder={placeholder}
                selectedOptions={this.deNormalize(value)}
                selectorOptions={selectorOptions}
                validator={validator}
            >
                {selectorOptions.map(option => (
                    <DatalistItem key={option.value}>{option.displayText}</DatalistItem>
                ))}
            </PillSelectorDropdown>
        );
    }
}

export default PillSelectorDropdownField;
