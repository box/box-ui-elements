// @flow
import * as React from 'react';
import classNames from 'classnames';
import { List } from 'immutable';
import noop from 'lodash/noop';

import Label from '../label';
import SelectorDropdown from '../selector-dropdown';
import parseCSV from '../../utils/parseCSV';

import PillSelector from './PillSelector';
import { type SelectedOptions } from './flowTypes';

import './PillSelectorDropdown.scss';

type Props = {
    /** If true, user can add pills not included in selector options */
    allowCustomPills?: boolean,
    /** `DatalistItem` components for dropdown options to select */
    children: React.Node,
    /** CSS class for the component */
    className?: string,
    /** If true, the input control is disabled so no more input can be made */
    disabled?: boolean,
    /** Error message */
    error?: React.Node,
    /** Passed in by `SelectorDropdown` for accessibility */
    inputProps: Object,
    /** Input label */
    label: React.Node,
    /** Should update selectorOptions based on the given input value */
    onInput: Function,
    /** Should update selectedOptions given the option and index to remove */
    onRemove: Function,
    /** Should update selectedOptions given an array of pills and the event */
    onSelect: Function,
    /** Function adds a collaborator from suggested collabs to form */
    onSuggestedPillAdd?: Function,
    /** function to parse user input into an array of items to be validated and then added to pill selector. If this function is not passed, a default CSV parser is used. */
    parseItems?: Function,
    /** A placeholder to show in the input when there are no pills */
    placeholder: string,
    /** Array or Immutable list with data for the selected options shown as pills */
    selectedOptions: SelectedOptions,
    /** Array or Immutable list with data for the dropdown options to select */
    selectorOptions: Array<Object> | List<Object>,
    /** Array of suggested collaborators */
    suggestedPillsData?: Array<Object>,
    /** String describes the suggested pills */
    suggestedPillsTitle?: string,
    /** Validate the given input value, and update `error` prop if necessary */
    validateForError?: Function,
    /** Called to check if pill item data is valid. The `item` is passed in. */
    validator?: Function,
};

type State = {
    inputValue: string,
};

class PillSelectorDropdown extends React.Component<Props, State> {
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

    handleInput = ({ target }: { target: HTMLInputElement | Object }) => {
        const { value } = target;
        this.setState({ inputValue: value });
        this.props.onInput(value);
    };

    handleEnter = (event: SyntheticEvent<>) => {
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

    handleSelect = (index: number, event: SyntheticEvent<>) => {
        const { onSelect, selectorOptions } = this.props;
        const selectedOption =
            // $FlowFixMe
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
            onSuggestedPillAdd,
            placeholder,
            selectedOptions,
            suggestedPillsData,
            suggestedPillsTitle,
        } = this.props;

        return (
            <SelectorDropdown
                className={classNames('pill-selector-wrapper', className)}
                onEnter={this.handleEnter}
                onSelect={this.handleSelect}
                selector={
                    <Label text={label}>
                        <PillSelector
                            onChange={noop} // fix console error
                            {...inputProps}
                            disabled={disabled}
                            error={error}
                            onBlur={this.handleBlur}
                            onInput={this.handleInput}
                            onPaste={this.handlePaste}
                            onRemove={onRemove}
                            onSuggestedPillAdd={onSuggestedPillAdd}
                            placeholder={placeholder}
                            selectedOptions={selectedOptions}
                            suggestedPillsData={suggestedPillsData}
                            suggestedPillsTitle={suggestedPillsTitle}
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
