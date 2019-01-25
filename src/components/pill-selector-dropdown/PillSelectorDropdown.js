import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import parseCSV from 'utils/parseCSV';
import { OptionsPropType } from 'common/box-proptypes';
import Label from '../label';
import SelectorDropdown from '../selector-dropdown';

import PillSelector from './PillSelector';

import './PillSelectorDropdown.scss';

class PillSelectorDropdown extends Component {
    static propTypes = {
        /** If true, user can add pills not included in selector options */
        allowCustomPills: PropTypes.bool,
        /** `DatalistItem` components for dropdown options to select */
        children: PropTypes.node,
        /** CSS class for the component */
        className: PropTypes.string,
        /** If true, the input control is disabled so no more input can be made */
        disabled: PropTypes.bool,
        /** Error message */
        error: PropTypes.node,
        /** Passed in by `SelectorDropdown` for accessibility */
        inputProps: PropTypes.object.isRequired,
        /** Input label */
        label: PropTypes.node,
        /** Should update selectorOptions based on the given input value */
        onInput: PropTypes.func.isRequired,
        /** Should update selectedOptions given the option and index to remove */
        onRemove: PropTypes.func.isRequired,
        /** Should update selectedOptions given an array of pills and the event */
        onSelect: PropTypes.func.isRequired,
        /** function to parse user input into an array of items to be validated and then added to pill selector. If this function is not passed, a default CSV parser is used. */
        parseItems: PropTypes.func,
        /** A placeholder to show in the input when there are no pills */
        placeholder: PropTypes.string.isRequired,
        /** Array or Immutable list with data for the selected options shown as pills */
        selectedOptions: OptionsPropType,
        /** Array or Immutable list with data for the dropdown options to select */
        selectorOptions: OptionsPropType,
        /** Validate the given input value, and update `error` prop if necessary */
        validateForError: PropTypes.func,
        /** Called to check if pill item data is valid. The `item` is passed in. */
        validator: PropTypes.func,
    };

    static defaultProps = {
        allowCustomPills: false,
        disabled: false,
        error: '',
        inputProps: {},
        label: '',
        placeholder: '',
        selectedOptions: [],
        selectorOptions: [],
    };

    state = { inputValue: '' };

    parsePills = () => {
        const { inputValue } = this.state;
        const { parseItems, validator } = this.props;

        let pills = parseItems ? parseItems(inputValue) : parseCSV(inputValue);

        if (!pills) {
            return [];
        }

        if (validator) {
            pills = pills.filter(pill => validator(pill));
        }

        // Keep the data format consistent with DatalistItem
        return pills.map(pill => ({
            text: pill,
            value: pill,
        }));
    };

    addPillsFromInput = () => {
        const { allowCustomPills, onInput, onSelect, selectedOptions, validateForError } = this.props;
        const { inputValue } = this.state;

        // Do nothing if custom pills are not allowed
        if (!allowCustomPills) {
            return;
        }

        // Parse pills from input
        const pills = this.parsePills();

        // "Select" the pills
        if (pills.length > 0) {
            onSelect(pills);

            // Reset inputValue
            this.setState({ inputValue: '' });
            onInput('');
        } else if (validateForError && (inputValue !== '' || selectedOptions.length === 0)) {
            /**
             * If no pills were added, but an inputValue exists or
             * there are no pills selected, check for errors
             */
            validateForError(inputValue);
        }
    };

    handleBlur = () => {
        this.addPillsFromInput();
    };

    handleInput = ({ target }) => {
        const { value } = target;
        this.setState({ inputValue: value });
        this.props.onInput(value);
    };

    handleEnter = event => {
        event.preventDefault();
        this.addPillsFromInput();
    };

    handlePaste = () => {
        /**
         * NOTE (ishay): setTimeout is necessary because
         * otherwise addPillsFromInput gets triggered as soon
         * as the user "paste's", but before the inputValue
         * is actually updated.
         */
        setTimeout(this.addPillsFromInput, 0);
    };

    handleSelect = (index, event) => {
        const { onSelect, selectorOptions } = this.props;
        const selectedOption =
            typeof selectorOptions.get === 'function' ? selectorOptions.get(index) : selectorOptions[index];

        onSelect([selectedOption], event);

        this.handleInput({ target: { value: '' } });
    };

    render() {
        const {
            children,
            className,
            disabled,
            error,
            inputProps,
            label,
            onRemove,
            placeholder,
            selectedOptions,
        } = this.props;

        return (
            <SelectorDropdown
                className={classNames('pill-selector-wrapper', className)}
                onEnter={this.handleEnter}
                onSelect={this.handleSelect}
                selector={
                    <Label text={label}>
                        <PillSelector
                            {...inputProps}
                            disabled={disabled}
                            error={error}
                            onBlur={this.handleBlur}
                            onInput={this.handleInput}
                            onPaste={this.handlePaste}
                            onRemove={onRemove}
                            placeholder={placeholder}
                            selectedOptions={selectedOptions}
                            value={this.state.inputValue}
                        />
                    </Label>
                }
            >
                {children}
            </SelectorDropdown>
        );
    }
}

export default PillSelectorDropdown;
