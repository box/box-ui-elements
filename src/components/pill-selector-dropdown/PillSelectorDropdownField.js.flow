// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import type { FieldProps } from 'formik';

import PillSelectorDropdown from './PillSelectorDropdown';
import defaultDropdownRenderer from './defaultDropdownRenderer';
import defaultDropdownFilter from './filters/defaultDropdownFilter';
import defaultInputParser from './defaultInputParser';
import type { Option, OptionValue } from './flowTypes';

type Props = FieldProps & {
    /** CSS class for the component. */
    className?: string,
    /** Given selected values and input text, returns a list of filtered options. Defaults to defaultDropdownFilter. */
    dropdownFilter: (options: Array<Option>, selectedValues: Array<Option>, inputText: string) => Array<Option>,
    /** Given options, renders the dropdown list. Defaults to defaultDropdownRenderer. */
    dropdownRenderer: (options: Array<Option>) => React.Node,
    /** A CSS selector matching the element to use as a boundary when auto-scrolling dropdown elements into view. When not provided, boundary will be determined by scrollIntoView utility function */
    dropdownScrollBoundarySelector?: string,
    /** Function to parse user input into an array of items. Defaults to CSV parser. */
    inputParser: (inputValue: string, options: Array<Option>, selectedOptions: Array<Option>) => Array<Option>,
    /** If true, the user can add pills not included in the dropdown options. Defaults to true. */
    isCustomInputAllowed: boolean,
    /** If true, the input control is disabled so no more input can be made. Defaults to false. */
    isDisabled: boolean,
    /** Pill selector label. */
    label: React.Node,
    /** Function to intercept the user entered input to fetch options in the selector dropdown */
    onInput: (text: string, event?: SyntheticInputEvent<HTMLInputElement>) => void,
    /** Array of options shown in the dropdown. */
    options: Array<Option>,
    /** Called to check if pill text is valid. The text is passed in. */
    placeholder: string,
    /** Determines whether or not copy pasted text is cleared when it does not result in new pills being added */
    shouldClearUnmatchedInput: boolean,
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
        inputParser: defaultInputParser,
        isCustomInputAllowed: true,
        isDisabled: false,
        onInput: noop,
        options: [],
        shouldClearUnmatchedInput: false,
    };

    state = { inputText: '' };

    isValidOption({ displayText }: Option) {
        return !!displayText.trim();
    }

    createFakeEventTarget(name: string, value?: Array<Option>) {
        // Returns a dummy EventTarget like object that formik understands how to read
        return { target: { name, value } };
    }

    handleBlur = (event?: SyntheticInputEvent<HTMLInputElement>) => {
        const { field } = this.props;
        const { name, onBlur } = field;
        // Sets touched in formik for the pill selector field.
        // Event may or may not be available at this time.
        onBlur(event || this.createFakeEventTarget(name));
    };

    handleInput = (text: string, event?: SyntheticInputEvent<HTMLInputElement>) => {
        const { onInput } = this.props;
        this.setState({ inputText: text });
        onInput(text, event);
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
        const { name, onChange, value = [] } = field;
        const options = value.slice();
        options.splice(index, 1);
        onChange(this.createFakeEventTarget(name, options));
    };

    handleParseItems = (inputValue: string): ?Array<Option> => {
        const { field, inputParser, options } = this.props;
        const { value: selectedOptions = [] } = field;
        return inputParser(inputValue, options, selectedOptions);
    };

    render() {
        const { inputText } = this.state;
        const {
            className,
            dropdownFilter,
            dropdownRenderer,
            dropdownScrollBoundarySelector,
            field,
            form,
            isCustomInputAllowed,
            isDisabled,
            label,
            options,
            placeholder,
            shouldClearUnmatchedInput,
            validator,
        } = this.props;
        const { name, value = [] }: { name: string, value: Array<Option> } = field;
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
                dropdownScrollBoundarySelector={dropdownScrollBoundarySelector}
                inputProps={inputProps}
                label={label}
                error={error}
                onBlur={this.handleBlur}
                onInput={this.handleInput}
                onRemove={this.handleRemove}
                onSelect={this.handleSelect}
                parseItems={this.handleParseItems}
                placeholder={placeholder}
                selectedOptions={value}
                selectorOptions={filteredOptions}
                shouldClearUnmatchedInput={shouldClearUnmatchedInput}
                shouldSetActiveItemOnOpen
                validator={validator}
            >
                {dropdownRenderer(filteredOptions)}
            </PillSelectorDropdown>
        );
    }
}

export default PillSelectorDropdownField;
