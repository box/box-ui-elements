// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import PillSelectorDropdown from './PillSelectorDropdown';
import defaultDropdownRenderer from './defaultDropdownRenderer';
import defaultDropdownFilter from './defaultDropdownFilter';
import type { Option, OptionValue } from './flowTypes';

type Props = FieldProps & {
    /** CSS class for the component. */
    className?: string,
    /** Given selected values and input text, returns a list of filtered options. Defaults to defaultDropdownFilter. */
    dropdownFilter: (options: Array<Option>, selectedValues: Array<Option>, inputText: string) => Array<Option>,
    /** Given options, renders the dropdown list. Defaults to defaultDropdownRenderer. */
    dropdownRenderer: (options: Array<Option>) => React.Node,
    /** Function to parse user input into an array of items. Defaults to CSV parser. */
    inputParser?: (inputValue: string) => Array<Option>,
    /** If true, the user can add pills not included in the dropdown options. Defaults to true. */
    isCustomInputAllowed: boolean,
    /** If true, the input control is disabled so no more input can be made. Defaults to false. */
    isDisabled: boolean,
    /** Pill selector label. */
    label: React.Node,
    /** Array of options shown in the dropdown. */
    options: Array<Option>,
    /** Called to check if pill text is valid. The text is passed in. */
    placeholder: string,
    /** A placeholder to show in the input when there are no pills. */
    validator?: (option: Option | OptionValue) => boolean,
};

type State = {
    inputText: string,
};

class PillSelectorDropdownField extends React.PureComponent<Props, State> {
    static defaultProps = {
        dropdownFilter: defaultDropdownFilter,
        dropdownRenderer: defaultDropdownRenderer,
        isCustomInputAllowed: true,
        isDisabled: false,
        options: [],
    };

    state = { inputText: '' };

    isValidOption({ displayText }: Option) {
        return !!displayText.trim();
    }

    createFakeEventTarget(name: string, value?: Array<Option>) {
        // Returns a dummy EventTarget like object that formik understands how to read
        return { target: { name, value } };
    }

    handleBlur = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const { field } = this.props;
        const { name, onBlur } = field;
        // Sets touched in formik for the pill selector field.
        // Event may or may not be available at this time.
        onBlur(event || this.createFakeEventTarget(name));
    };

    handleInput = (text: string, event: SyntheticInputEvent<HTMLInputElement>) => {
        this.setState({ inputText: text });
        if (text === '') {
            this.handleBlur(event);
        }
    };

    handleSelect = (options: Array<Option>) => {
        const { field } = this.props;
        const { name, onChange, value = [] } = field;
        const filteredOptions = options.filter(option => this.isValidOption(option));
        onChange(this.createFakeEventTarget(name, [...value, ...filteredOptions]));
    };

    handleRemove = (option: Option, index: number) => {
        const { field } = this.props;
        const { name, onChange, value } = field;
        const options = value.slice();
        options.splice(index, 1);
        onChange(this.createFakeEventTarget(name, options));
    };

    render() {
        const { inputText } = this.state;
        const {
            className,
            dropdownFilter,
            dropdownRenderer,
            field,
            form,
            inputParser,
            isCustomInputAllowed,
            isDisabled,
            label,
            options,
            placeholder,
            validator,
        } = this.props;
        const { name, value = [] } = field;
        const { errors, touched } = form;
        const isTouched = getProp(touched, name);
        const error = isTouched ? getProp(errors, name) : null;
        const filteredOptions: Array<Option> = dropdownFilter(options, value, inputText);
        const inputProps = { name }; // so that events generated have event.target.name

        return (
            <PillSelectorDropdown
                allowCustomPills={isCustomInputAllowed}
                allowInvalidPills
                className={className}
                disabled={isDisabled}
                inputProps={inputProps}
                label={label}
                error={error}
                onBlur={this.handleBlur}
                onInput={this.handleInput}
                onRemove={this.handleRemove}
                onSelect={this.handleSelect}
                parseItems={inputParser}
                placeholder={placeholder}
                selectedOptions={value}
                selectorOptions={filteredOptions}
                validator={validator}
            >
                {dropdownRenderer(filteredOptions)}
            </PillSelectorDropdown>
        );
    }
}

export default PillSelectorDropdownField;
