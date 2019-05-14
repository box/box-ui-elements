// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import isEqual from 'lodash/isEqual';

import type { FieldProps } from 'formik';

import DatalistItem from '../datalist-item';
import PillSelectorDropdown from './PillSelectorDropdown';
import type { Option, OptionValue, Pill } from './flowTypes';

import './PillSelectorDropdown.scss';

type Props = FieldProps & {
    /** CSS class for the component. */
    className?: string,
    /** If true, the user can add pills not included in the dropdown options. Defaults to true. */
    isCustomInputAllowed: boolean,
    /** If true, the input control is disabled so no more input can be made. Defaults to false. */
    isDisabled: boolean,
    /** Pill selector label. */
    label: React.Node,
    /** Array of options shown in the pill selector dropdown. */
    options: Array<Option>,
    /** A placeholder to show in the input when there are no pills. */
    placeholder: string,
    /** Called to check if pill text is valid. The text is passed in. */
    validator?: (value: OptionValue) => boolean,
};

type State = {
    selectorOptions: Array<Option>,
};

class PillSelectorDropdownField extends React.PureComponent<Props, State> {
    static defaultProps = {
        isCustomInputAllowed: true,
        isDisabled: false,
        options: [],
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            selectorOptions: props.options,
        };
    }

    toPills(options: Array<Option>): Array<Pill> {
        return options.map(({ displayText, value }: Option) => ({
            text: displayText,
            value,
        }));
    }

    toOptions(options: Array<Option & Pill>): Array<Option> {
        return options.map(({ displayText, value }) => ({
            displayText,
            value,
        }));
    }

    createFakeEventTarget(name: string, value: Array<Option>) {
        return { target: { name, value } };
    }

    handleInput = (text: string) => {
        const { options, field } = this.props;
        const { value = [] } = field;
        const filteredOptions = options.filter((option: Option) => {
            // Filter out anything that does not match the display text of the options
            const hasText = !!text && option.displayText.toLowerCase().includes(text.toLowerCase());
            // Also filter out anything that has alrady been chosen
            const hasValue = !!value.find(val => isEqual(val, option));
            return hasText && !hasValue;
        });
        this.setState({ selectorOptions: filteredOptions });
    };

    handleSelect = (optionsOrPills: Array<Option & Pill>) => {
        const { field } = this.props;
        const { name, onChange, value = [] } = field;
        const options = this.toOptions(optionsOrPills);
        onChange(this.createFakeEventTarget(name, [...value, ...options]));
    };

    handleRemove = (option: Option, index: number) => {
        const { field } = this.props;
        const { name, onChange, value } = field;
        const options = value.slice();
        options.splice(index, 1);
        onChange(this.createFakeEventTarget(name, options));
    };

    render() {
        const { selectorOptions } = this.state;
        const { className, isDisabled, field, form, isCustomInputAllowed, label, placeholder, validator } = this.props;
        const { name, value = [] } = field;
        const { errors } = form;
        const error = getProp(errors, name);

        return (
            <PillSelectorDropdown
                allowCustomPills={isCustomInputAllowed}
                allowInvalidPills
                className={className}
                disabled={isDisabled}
                label={label}
                error={error}
                onInput={this.handleInput}
                onRemove={this.handleRemove}
                onSelect={this.handleSelect}
                placeholder={placeholder}
                selectedOptions={this.toPills(value)}
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
