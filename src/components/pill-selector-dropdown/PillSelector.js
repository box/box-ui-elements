// @flow
import * as React from 'react';
import classNames from 'classnames';

import Tooltip from '../tooltip';
import { KEYS } from '../../constants';

import Pill from './Pill';
import SuggestedPillsRow from './SuggestedPillsRow';
import type { SelectedOptions } from './flowTypes';

function stopDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

type Props = {
    className?: string,
    disabled?: boolean,
    error?: React.Node,
    inputProps: Object,
    onInput: Function,
    onRemove: Function,
    onSuggestedPillAdd?: Function,
    placeholder: string,
    selectedOptions: SelectedOptions,
    suggestedPillsData?: Array<Object>,
    suggestedPillsTitle?: string,
};

type State = {
    isFocused: boolean,
    selectedIndex: number,
};

class PillSelector extends React.Component<Props, State> {
    static defaultProps = {
        disabled: false,
        error: '',
        inputProps: {},
        placeholder: '',
        selectedOptions: [],
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
            className,
            disabled,
            error,
            inputProps,
            onInput,
            onRemove,
            onSuggestedPillAdd,
            placeholder,
            selectedOptions,
            suggestedPillsData,
            suggestedPillsTitle,
            ...rest
        } = this.props;
        const suggestedPillsEnabled = suggestedPillsData && suggestedPillsData.length > 0;
        const classes = classNames('pill-selector-input-wrapper', {
            'is-disabled': disabled,
            'is-focused': isFocused,
            'show-error': !!error,
            'pill-selector-suggestions-enabled': suggestedPillsEnabled,
        });

        return (
            <Tooltip isShown={!!error} text={error || ''} position="middle-right" theme="error">
                <span
                    className={classes}
                    onBlur={this.handleBlur}
                    onClick={this.handleClick}
                    onFocus={this.handleFocus}
                    onKeyDown={this.handleKeyDown}
                    role="button"
                    tabIndex={0}
                >
                    {selectedOptions.map((option, index) => (
                        <Pill
                            isSelected={index === selectedIndex}
                            key={option.value}
                            onRemove={onRemove.bind(this, option, index)}
                            text={option.text}
                        />
                    ))}
                    {/* hidden element for focus/key events during pill selection */}
                    <span
                        aria-hidden="true"
                        className="accessibility-hidden"
                        onBlur={this.resetSelectedIndex}
                        ref={this.hiddenRef}
                        tabIndex={-1}
                    />
                    <input
                        {...rest}
                        {...inputProps}
                        autoComplete="off"
                        className={classNames('pill-selector-input', className)}
                        disabled={disabled}
                        onInput={onInput}
                        placeholder={this.getNumSelected() === 0 ? placeholder : ''}
                        ref={input => {
                            this.inputEl = input;
                        }}
                        type="text"
                    />
                    <SuggestedPillsRow
                        onSuggestedPillAdd={onSuggestedPillAdd}
                        selectedPillsIDs={this.getPillsByKey('id')}
                        suggestedPillsData={suggestedPillsData}
                        title={suggestedPillsTitle}
                    />
                </span>
            </Tooltip>
        );
    }
}

export default PillSelector;
