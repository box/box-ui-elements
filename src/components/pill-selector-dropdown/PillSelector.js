// @flow
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { List } from 'immutable';

import Tooltip from '../tooltip';
import { KEYS } from '../../constants';

import RoundPill from './RoundPill';
import Pill from './Pill';
import SuggestedPillsRow from './SuggestedPillsRow';
import type { RoundOption, Option, OptionValue, SuggestedPillsFilter } from './flowTypes';
import type { Position } from '../tooltip';

function stopDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

type Props = {
    allowInvalidPills: boolean,
    className?: string,
    disabled?: boolean,
    error?: React.Node,
    /** Position of error message tooltip */
    errorTooltipPosition?: Position,
    /** Called on pill render to get a specific class name to use for a particular option. Note: Only has effect when showRoundedPills is true. */
    getPillClassName?: (option: Option) => string,
    /** Function to retrieve the image URL associated with a pill */
    getPillImageUrl?: (data: { id: string | number, [key: string]: any }) => string,
    innerRef?: React.Ref<any>,
    inputProps: Object,
    /** Allows disabling the textarea element without disabling the whole PillSelector */
    isInputDisabled?: boolean,
    /** Whether to show textarea in next line when focused */
    isInputFocusedNextLine?: boolean,
    onInput: Function,
    onRemove: Function,
    onSuggestedPillAdd?: Function,
    placeholder: string,
    selectedOptions: List<Object>,
    /** Whether to show avatars in pills (if rounded style is enabled) */
    showAvatars?: boolean,
    /** Whether to use rounded style for pills */
    showRoundedPills?: boolean,
    suggestedPillsData?: Array<Object>,
    suggestedPillsFilter?: SuggestedPillsFilter,
    suggestedPillsTitle?: string,
    validator: (option: Option | OptionValue) => boolean,
};

type State = {
    isFocused: boolean,
    selectedIndex: number,
};

type DefaultProps = {
    allowInvalidPills: boolean,
    disabled: boolean,
    error: string,
    errorTooltipPosition: Position,
    inputProps: Object,
    placeholder: string,
    selectedOptions: List<Object>,
    validator: () => boolean,
};

type Config = React.Config<Props, DefaultProps>;

class PillSelectorBase extends React.Component<Props, State> {
    static defaultProps: DefaultProps = {
        allowInvalidPills: false,
        disabled: false,
        error: '',
        errorTooltipPosition: 'bottom-left',
        inputProps: {},
        placeholder: '',
        selectedOptions: [],
        validator: () => true,
    };

    state = {
        isFocused: false,
        selectedIndex: -1,
    };

    getNumSelected = (): number => {
        const { selectedOptions } = this.props;

        return typeof selectedOptions.size === 'number' ? selectedOptions.size : selectedOptions.length;
    };

    getPillsByKey = (key: string): Array<any> => {
        const { selectedOptions } = this.props;

        return selectedOptions.map(option => option[key]);
    };

    inputEl: HTMLInputElement;

    handleClick = () => {
        this.inputEl.focus();
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
    };

    handleBlur = () => {
        this.setState({ isFocused: false });
    };

    hiddenEl: HTMLSpanElement;

    handleKeyDown = (event: SyntheticKeyboardEvent<>) => {
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
                    const selectedOption =
                        // $FlowFixMe
                        typeof selectedOptions.get === 'function' ? selectedOptions.get(index) : selectedOptions[index];
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

    hiddenRef = (hiddenEl: ?HTMLSpanElement) => {
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

        return (
            <Tooltip
                isShown={hasError}
                position={errorTooltipPosition}
                targetWrapperClassName={tooltipWrapperClassName}
                text={error || ''}
                theme="error"
            >
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
                        ? selectedOptions.map((option: RoundOption, index: number) => {
                              return (
                                  <RoundPill
                                      className={getPillClassName ? getPillClassName(option) : undefined}
                                      getPillImageUrl={getPillImageUrl}
                                      isValid={allowInvalidPills ? validator(option) : true}
                                      isDisabled={disabled}
                                      isSelected={index === selectedIndex}
                                      key={option.value}
                                      onRemove={onRemove.bind(this, option, index)}
                                      // $FlowFixMe option.text is for backwards compatibility
                                      text={option.displayText || option.text}
                                      showAvatar={showAvatars}
                                      id={option.id}
                                      hasWarning={option.hasWarning}
                                      isExternal={option.isExternalUser}
                                      type={option.type}
                                  />
                              );
                          })
                        : selectedOptions.map((option: Option, index: number) => {
                              // TODO: This and associated types will be removed once all views are updates with round pills.
                              return (
                                  <Pill
                                      isValid={allowInvalidPills ? validator(option) : true}
                                      isDisabled={disabled}
                                      isSelected={index === selectedIndex}
                                      key={option.value}
                                      onRemove={onRemove.bind(this, option, index)}
                                      // $FlowFixMe option.text is for backwards compatibility
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
                            this.inputEl = input;
                        }}
                    />
                    <SuggestedPillsRow
                        onSuggestedPillAdd={onSuggestedPillAdd}
                        selectedPillsValues={this.getPillsByKey('value')}
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

const PillSelector = React.forwardRef<Config, HTMLSpanElement>((props: Config, ref: React.Ref<any>) => (
    <PillSelectorBase {...props} innerRef={ref} />
));
PillSelector.displayName = 'PillSelector';

export default PillSelector;
