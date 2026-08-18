import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { List } from 'immutable';

import Tooltip, { TooltipPosition, TooltipTheme, type TooltipProps } from '../tooltip';
import { KEYS } from '../../constants';

import RoundPill from './RoundPill';
import Pill from './Pill';
import SuggestedPillsRow from './SuggestedPillsRow';
import type {
    GetPillImageUrl,
    Option,
    OptionValue,
    RoundOption,
    SelectedOptions,
    SuggestedPill,
    SuggestedPills,
    SuggestedPillsFilter,
} from './flowTypes';

function stopDefaultEvent(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
}

function isImmutableOptions(selectedOptions: SelectedOptions): selectedOptions is List<Option> {
    return typeof (selectedOptions as List<Option>).get === 'function';
}

function optionsToArray(selectedOptions: SelectedOptions): Array<Option> {
    return isImmutableOptions(selectedOptions) ? selectedOptions.toArray() : selectedOptions;
}

export interface PillSelectorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInput'> {
    /** If true, pills that fail validation are still rendered */
    allowInvalidPills?: boolean;
    /** CSS class for the textarea */
    className?: string;
    /** If true, the selector and pills are disabled */
    disabled?: boolean;
    /** Error message shown in the error tooltip */
    error?: React.ReactNode;
    /** Position of error message tooltip */
    errorTooltipPosition?: TooltipProps['position'];
    /** Called on pill render to get a specific class name to use for a particular option. Note: Only has effect when showRoundedPills is true. */
    getPillClassName?: (option: Option) => string;
    /** Function to retrieve the image URL associated with a pill */
    getPillImageUrl?: GetPillImageUrl;
    /** Ref forwarded to the wrapper span */
    innerRef?: React.Ref<HTMLSpanElement>;
    /** Additional props spread onto the textarea */
    inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    /** Allows disabling the textarea element without disabling the whole PillSelector */
    isInputDisabled?: boolean;
    /** Whether to show textarea in next line when focused */
    isInputFocusedNextLine?: boolean;
    /** Called when the textarea input event fires */
    onInput: (event: React.FormEvent<HTMLTextAreaElement> | { target: { value: string } }) => void;
    /** Called with the option and index when a pill is removed */
    onRemove: (option: Option, index: number) => void;
    /** Called when a suggested pill is added */
    onSuggestedPillAdd?: (suggestedPill: SuggestedPill) => void;
    /** Placeholder shown in the textarea when there are no pills */
    placeholder?: string;
    /** Selected options shown as pills */
    selectedOptions?: SelectedOptions;
    /** Whether to show avatars in pills (if rounded style is enabled) */
    showAvatars?: boolean;
    /** Whether to use rounded style for pills */
    showRoundedPills?: boolean;
    /** Suggested pills shown below the input */
    suggestedPillsData?: SuggestedPills;
    /** Suggested-pill field used to hide already selected values */
    suggestedPillsFilter?: SuggestedPillsFilter;
    /** Label shown before the suggested pills */
    suggestedPillsTitle?: string;
    /** Called to check if pill item data is valid */
    validator?: (option: Option | OptionValue) => boolean;
}

interface PillSelectorState {
    isFocused: boolean;
    selectedIndex: number;
}

class PillSelectorBase extends React.Component<PillSelectorProps, PillSelectorState> {
    static defaultProps = {
        allowInvalidPills: false,
        disabled: false,
        error: '',
        errorTooltipPosition: TooltipPosition.BOTTOM_LEFT,
        inputProps: {},
        placeholder: '',
        selectedOptions: [] as SelectedOptions,
        validator: () => true,
    };

    state: PillSelectorState = {
        isFocused: false,
        selectedIndex: -1,
    };

    getNumSelected = (): number => {
        const { selectedOptions } = this.props;

        return isImmutableOptions(selectedOptions) ? selectedOptions.size : selectedOptions.length;
    };

    getPillsByKey = (key: string): Array<Option[keyof Option]> => {
        const { selectedOptions } = this.props;

        return optionsToArray(selectedOptions).map(option => option[key as keyof Option]);
    };

    inputEl!: HTMLTextAreaElement;

    handleClick = () => {
        this.inputEl.focus();
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
    };

    handleBlur = () => {
        this.setState({ isFocused: false });
    };

    hiddenEl!: HTMLSpanElement;

    handleKeyDown = (event: React.KeyboardEvent) => {
        const inputValue = this.inputEl.value;
        const numPills = this.getNumSelected();
        const { selectedIndex } = this.state;

        switch (event.key) {
            case KEYS.backspace: {
                let index = -1;
                if (selectedIndex >= 0) {
                    // remove selected pill
                    index = selectedIndex;
                    this.resetSelectedIndex();
                    this.inputEl.focus();
                } else if (inputValue === '') {
                    // remove last pill
                    index = numPills - 1;
                }
                if (index >= 0) {
                    const { onRemove, selectedOptions } = this.props;
                    const selectedOption = isImmutableOptions(selectedOptions)
                        ? selectedOptions.get(index)
                        : selectedOptions[index];
                    onRemove(selectedOption, index);
                    stopDefaultEvent(event);
                }
                break;
            }
            case KEYS.arrowLeft:
                if (selectedIndex >= 0) {
                    // select previous pill
                    this.setState({
                        selectedIndex: Math.max(selectedIndex - 1, 0),
                    });
                    stopDefaultEvent(event);
                } else if (inputValue === '' && numPills > 0) {
                    // select last pill
                    this.hiddenEl.focus();
                    this.setState({ selectedIndex: numPills - 1 });
                    stopDefaultEvent(event);
                }
                break;
            case KEYS.arrowRight: {
                if (selectedIndex >= 0) {
                    const index = selectedIndex + 1;
                    if (index >= numPills) {
                        // deselect last pill
                        this.resetSelectedIndex();
                        this.inputEl.focus();
                    } else {
                        // select next pill
                        this.setState({ selectedIndex: index });
                    }
                    stopDefaultEvent(event);
                }
                break;
            }
            // no default
        }
    };

    errorMessageID = uniqueId('errorMessage');

    hiddenRef = (hiddenEl: HTMLSpanElement | null) => {
        if (hiddenEl) {
            this.hiddenEl = hiddenEl;
        }
    };

    resetSelectedIndex = () => {
        if (this.state.selectedIndex !== -1) {
            this.setState({ selectedIndex: -1 });
        }
    };

    render() {
        const { isFocused, selectedIndex } = this.state;
        const {
            allowInvalidPills,
            className,
            disabled,
            error,
            errorTooltipPosition,
            getPillClassName,
            getPillImageUrl,
            inputProps,
            isInputDisabled,
            isInputFocusedNextLine,
            onInput,
            onRemove,
            onSuggestedPillAdd,
            placeholder,
            innerRef,
            selectedOptions,
            showAvatars,
            showRoundedPills,
            suggestedPillsData,
            suggestedPillsFilter,
            suggestedPillsTitle,
            validator,
            ...rest
        } = this.props;
        const suggestedPillsEnabled = suggestedPillsData && suggestedPillsData.length > 0;
        const hasError = !!error;
        const classes = classNames('bdl-PillSelector', 'pill-selector-input-wrapper', {
            'is-disabled': disabled,
            'bdl-is-disabled': disabled,
            'is-focused': isFocused,
            'show-error': hasError,
            'pill-selector-suggestions-enabled': suggestedPillsEnabled,
            'bdl-PillSelector--suggestionsEnabled': suggestedPillsEnabled,
        });
        const ariaAttrs = {
            'aria-invalid': hasError,
            'aria-errormessage': this.errorMessageID,
            'aria-describedby': this.errorMessageID,
        };
        const options = optionsToArray(selectedOptions);

        return (
            <Tooltip isShown={hasError} text={error || ''} position={errorTooltipPosition} theme={TooltipTheme.ERROR}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <span
                    className={classes}
                    onBlur={this.handleBlur}
                    onClick={this.handleClick}
                    onFocus={this.handleFocus}
                    onKeyDown={this.handleKeyDown}
                    ref={innerRef}
                >
                    {showRoundedPills
                        ? options.map((option: RoundOption, index: number) => {
                              return (
                                  <RoundPill
                                      className={getPillClassName ? getPillClassName(option) : undefined}
                                      getPillImageUrl={getPillImageUrl}
                                      isValid={allowInvalidPills ? validator(option) : true}
                                      isDisabled={disabled}
                                      isSelected={index === selectedIndex}
                                      key={option.value}
                                      onRemove={onRemove.bind(this, option, index)}
                                      text={option.displayText || option.text}
                                      showAvatar={showAvatars}
                                      id={option.id}
                                      hasWarning={option.hasWarning}
                                      isExternal={option.isExternalUser}
                                      type={option.type}
                                  />
                              );
                          })
                        : options.map((option: Option, index: number) => {
                              // TODO: This and associated types will be removed once all views are updates with round pills.
                              return (
                                  <Pill
                                      isValid={allowInvalidPills ? validator(option) : true}
                                      isDisabled={disabled}
                                      isSelected={index === selectedIndex}
                                      key={option.value}
                                      onRemove={onRemove.bind(this, option, index)}
                                      text={option.displayText || option.text}
                                  />
                              );
                          })}

                    {/* hidden element for focus/key events during pill selection */}
                    <span
                        aria-hidden="true"
                        className="accessibility-hidden"
                        onBlur={this.resetSelectedIndex}
                        ref={this.hiddenRef}
                        tabIndex={-1}
                        data-testid="pill-selection-helper"
                    />
                    <textarea
                        {...ariaAttrs}
                        {...rest}
                        {...inputProps}
                        autoComplete="off"
                        className={classNames('bdl-PillSelector-input', 'pill-selector-input', className, {
                            'bdl-PillSelector-input--nextLine': isInputFocusedNextLine,
                        })}
                        disabled={disabled || isInputDisabled}
                        onInput={onInput}
                        placeholder={this.getNumSelected() === 0 ? placeholder : ''}
                        ref={input => {
                            if (input) {
                                this.inputEl = input;
                            }
                        }}
                    />
                    <SuggestedPillsRow
                        onSuggestedPillAdd={onSuggestedPillAdd}
                        selectedPillsValues={this.getPillsByKey('value') as Array<string | number>}
                        suggestedPillsFilter={suggestedPillsFilter}
                        suggestedPillsData={suggestedPillsData}
                        title={suggestedPillsTitle}
                    />
                    <span id={this.errorMessageID} className="accessibility-hidden" role="alert">
                        {error}
                    </span>
                </span>
            </Tooltip>
        );
    }
}

export { PillSelectorBase };

const PillSelector = React.forwardRef<HTMLSpanElement, PillSelectorProps>((props, ref) => (
    <PillSelectorBase {...props} innerRef={ref} />
));
PillSelector.displayName = 'PillSelector';

export default PillSelector;
