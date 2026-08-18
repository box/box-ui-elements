import * as React from 'react';
import classNames from 'classnames';
import { List } from 'immutable';
import noop from 'lodash/noop';

import parseCSV from '../../utils/parseCSV';
import Label from '../label';
import SelectorDropdown from '../selector-dropdown';

import PillSelector from './PillSelector';
import { ContactType } from '../../features/unified-share-modal/types';
import type {
    GetPillImageUrl,
    Option,
    OptionValue,
    SelectedOptions,
    SuggestedPill,
    SuggestedPills,
    SuggestedPillsFilter,
} from './flowTypes';
import type { TooltipProps } from '../tooltip';

import './PillSelectorDropdown.scss';

export interface PillSelectorDropdownProps {
    /** If true, user can add pills not included in selector options */
    allowCustomPills?: boolean;
    /** If true, pills with errors are parsed as pills also */
    allowInvalidPills?: boolean;
    /** `DatalistItem` components for dropdown options to select */
    children: React.ReactNode;
    /** CSS class for the component */
    className?: string;
    /** If true, the input control is disabled so no more input can be made */
    disabled?: boolean;
    /** Index at which to insert a divider */
    dividerIndex?: number;
    /** A CSS selector matching the element to use as a boundary when auto-scrolling dropdown elements into view. When not provided, boundary will be determined by scrollIntoView utility function */
    dropdownScrollBoundarySelector?: string;
    /** Error message */
    error?: React.ReactNode;
    /** Position of error message tooltip */
    errorTooltipPosition?: TooltipProps['position'];
    /** Called on pill render to get a specific class name to use for a particular option. Note: Only has effect when showRoundedPills is true. */
    getPillClassName?: (option: Option) => string;
    /** Function to retrieve the image URL associated with a pill */
    getPillImageUrl?: GetPillImageUrl;
    /** Passed in by `SelectorDropdown` for accessibility */
    inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    /** Option to enable dynamic positioning with popper */
    isPositionDynamic?: boolean;
    /** Input label */
    label?: React.ReactNode;
    /** Called when pill selector input is blurred */
    onBlur?: (
        event?: React.FocusEvent<HTMLTextAreaElement> | { target: { name: string; value?: Array<Option> } },
    ) => void;
    /** Should update selectorOptions based on the given input value */
    onInput: (
        value: string,
        event?:
            | React.ChangeEvent<HTMLInputElement>
            | React.ClipboardEvent<HTMLTextAreaElement>
            | { target: { value: string } },
    ) => void;
    /** Called when creating pills */
    onPillCreate?: (pills: Array<Option | ContactType>) => void;
    /** Should update selectedOptions given the option and index to remove */
    onRemove: (option: Option, index: number) => void;
    /** Should update selectedOptions given an array of pills and the event */
    onSelect: (pills: Array<Option>, event?: React.SyntheticEvent) => void;
    /** Function adds a collaborator from suggested collabs to form */
    onSuggestedPillAdd?: (suggestedPill: SuggestedPill) => void;
    /** Optional title of the overlay */
    overlayTitle?: string;
    /** function to parse user input into an array of items to be validated and then added to pill selector. If this function is not passed, a default CSV parser is used. */
    parseItems?: (inputValue: string) => Array<string | Option> | null | undefined;
    /** A placeholder to show in the input when there are no pills */
    placeholder?: string;
    /** Array or Immutable list with data for the selected options shown as pills */
    selectedOptions?: SelectedOptions;
    /** Array or Immutable list with data for the dropdown options to select */
    selectorOptions?: Array<Option> | List<Option>;
    /** Determines whether or not input text is cleared automatically when it does not result in new pills being added */
    shouldClearUnmatchedInput?: boolean;
    /** Determines whether or not the first item is highlighted automatically when the dropdown opens */
    shouldSetActiveItemOnOpen?: boolean;
    /** show avatars (uses showRoundedPills) */
    showAvatars?: boolean;
    /** Use rounded style for pills */
    showRoundedPills?: boolean;
    /** Array of suggested collaborators */
    suggestedPillsData?: SuggestedPills;
    /** String decribes the datapoint to filter by so that items in the form are not shown in suggestions. */
    suggestedPillsFilter?: SuggestedPillsFilter;
    /** String describes the suggested pills */
    suggestedPillsTitle?: string;
    /** Validate the given input value, and update `error` prop if necessary */
    validateForError?: (inputValue: string) => void;
    /** Called to check if pill item data is valid. The `item` is passed in. */
    validator?: (option: Option | OptionValue) => boolean;
}

interface PillSelectorDropdownState {
    inputValue: string;
    isInCompositionMode: boolean;
}

class PillSelectorDropdown extends React.Component<PillSelectorDropdownProps, PillSelectorDropdownState> {
    static defaultProps = {
        allowCustomPills: false,
        allowInvalidPills: false,
        disabled: false,
        error: '',
        inputProps: {},
        label: '',
        onBlur: noop,
        onPillCreate: noop,
        placeholder: '',
        selectedOptions: [] as SelectedOptions,
        selectorOptions: [] as Array<Option>,
        shouldClearUnmatchedInput: false,
        shouldSetActiveItemOnOpen: false,
        validator: () => true,
    };

    state: PillSelectorDropdownState = { inputValue: '', isInCompositionMode: false };

    parsePills = (inputValue: string) => {
        const { allowInvalidPills, parseItems, validator } = this.props;
        let pills = parseItems ? parseItems(inputValue) : parseCSV(inputValue);

        if (!pills) {
            return [];
        }

        if (!allowInvalidPills) {
            pills = pills.filter(pill => validator(pill));
        }

        const normalizedPills = pills.map(pill =>
            typeof pill === 'string'
                ? {
                      displayText: pill,
                      text: pill, // deprecated, left for backwards compatibility
                      value: pill,
                  }
                : pill,
        );
        return normalizedPills;
    };

    addPillsFromInput = (inputValue: string) => {
        const {
            allowCustomPills,
            onPillCreate,
            onSelect,
            selectedOptions,
            shouldClearUnmatchedInput,
            validateForError,
        } = this.props;

        // Do nothing if custom pills are not allowed
        if (!allowCustomPills) {
            return;
        }

        // Parse pills from input
        const pills = this.parsePills(inputValue);

        // "Select" the pills
        if (pills.length > 0) {
            onSelect(pills);
            onPillCreate(pills);

            this.resetInputValue();
        } else {
            const selectedCount = Array.isArray(selectedOptions) ? selectedOptions.length : selectedOptions.size;
            if (validateForError && (inputValue !== '' || selectedCount === 0)) {
                /**
                 * If no pills were added, but an inputValue exists or
                 * there are no pills selected, check for errors
                 */
                validateForError(inputValue);
            }
            if (shouldClearUnmatchedInput) {
                this.resetInputValue();
            }
        }
    };

    handleBlur = (
        event?: React.FocusEvent<HTMLTextAreaElement> | { target: { name: string; value?: Array<Option> } },
    ) => {
        const { onBlur } = this.props;
        const { inputValue } = this.state;
        this.addPillsFromInput(inputValue);
        onBlur(event);
    };

    handleInput = (event: React.ChangeEvent<HTMLInputElement> | { target: HTMLInputElement | { value: string } }) => {
        const { target } = event;
        const { value } = target;
        this.setState({ inputValue: value });
        this.props.onInput(value, event);
    };

    handleEnter = (event: React.SyntheticEvent) => {
        const { isInCompositionMode, inputValue } = this.state;
        if (!isInCompositionMode) {
            event.preventDefault();
            this.addPillsFromInput(inputValue);
        }
    };

    handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        event.preventDefault();

        const inputValue: string = event.clipboardData.getData('text');
        this.setState({ inputValue });
        this.props.onInput(inputValue, event);
        this.addPillsFromInput(inputValue);
    };

    handleSelect = (index: number, event: React.SyntheticEvent) => {
        const { onPillCreate, onSelect, selectorOptions } = this.props;
        const selectedOption =
            typeof (selectorOptions as List<Option>).get === 'function'
                ? (selectorOptions as List<Option>).get(index)
                : (selectorOptions as Array<Option>)[index];

        onSelect([selectedOption], event);
        onPillCreate([selectedOption]);

        this.handleInput({ target: { value: '' } });
    };

    handleCompositionStart = () => {
        this.setState({ isInCompositionMode: true });
    };

    handleCompositionEnd = () => {
        this.setState({ isInCompositionMode: false });
    };

    resetInputValue = () => {
        const { onInput } = this.props;

        this.setState({ inputValue: '' });
        onInput('');
    };

    render() {
        const {
            allowInvalidPills,
            children,
            className,
            disabled,
            dividerIndex,
            dropdownScrollBoundarySelector,
            error,
            errorTooltipPosition,
            getPillClassName,
            getPillImageUrl,
            inputProps,
            isPositionDynamic,
            label,
            onRemove,
            onSuggestedPillAdd,
            overlayTitle,
            placeholder,
            selectedOptions,
            showAvatars,
            showRoundedPills,
            suggestedPillsData,
            suggestedPillsFilter,
            suggestedPillsTitle,
            shouldSetActiveItemOnOpen,
            validator,
        } = this.props;

        const selectorDropdownElement = (
            <SelectorDropdown
                className={classNames('bdl-PillSelectorDropdown', 'pill-selector-wrapper', className)}
                dividerIndex={dividerIndex}
                isPositionDynamic={isPositionDynamic}
                onEnter={this.handleEnter}
                onSelect={this.handleSelect}
                overlayTitle={overlayTitle}
                scrollBoundarySelector={dropdownScrollBoundarySelector}
                shouldSetActiveItemOnOpen={shouldSetActiveItemOnOpen}
                selector={
                    <PillSelector
                        onChange={noop} // fix console error
                        onCompositionEnd={this.handleCompositionEnd}
                        onCompositionStart={this.handleCompositionStart}
                        {...inputProps}
                        allowInvalidPills={allowInvalidPills}
                        disabled={disabled}
                        error={error}
                        errorTooltipPosition={errorTooltipPosition}
                        getPillClassName={getPillClassName}
                        getPillImageUrl={getPillImageUrl}
                        onBlur={this.handleBlur}
                        onInput={this.handleInput}
                        onPaste={this.handlePaste}
                        onRemove={onRemove}
                        onSuggestedPillAdd={onSuggestedPillAdd}
                        placeholder={placeholder}
                        selectedOptions={selectedOptions}
                        showAvatars={showAvatars && showRoundedPills}
                        showRoundedPills={showRoundedPills}
                        suggestedPillsData={suggestedPillsData}
                        suggestedPillsFilter={suggestedPillsFilter}
                        suggestedPillsTitle={suggestedPillsTitle}
                        validator={validator}
                        value={this.state.inputValue}
                    />
                }
            >
                {children}
            </SelectorDropdown>
        );

        return label ? <Label text={label}>{selectorDropdownElement}</Label> : selectorDropdownElement;
    }
}

export default PillSelectorDropdown;
