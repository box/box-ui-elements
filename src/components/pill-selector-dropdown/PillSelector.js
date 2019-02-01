import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import { OptionsPropType } from 'common/box-proptypes';
import Tooltip from '../tooltip';

import Pill from './Pill';

function stopDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

class PillSelector extends Component {
    static propTypes = {
        className: PropTypes.string,
        disabled: PropTypes.bool,
        error: PropTypes.node,
        inputProps: PropTypes.object.isRequired,
        onInput: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        placeholder: PropTypes.string.isRequired,
        selectedOptions: OptionsPropType,
    };

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

    getNumSelected = () => {
        const { selectedOptions } = this.props;
        return typeof selectedOptions.length === 'number' ? selectedOptions.length : selectedOptions.size;
    };

    handleClick = () => {
        this.inputEl.focus();
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
    };

    handleBlur = () => {
        this.setState({ isFocused: false });
    };

    handleKeyDown = event => {
        const inputValue = this.inputEl.value;
        const numPills = this.getNumSelected();
        const { selectedIndex } = this.state;

        switch (event.key) {
            case 'Backspace': {
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
                        typeof selectedOptions.get === 'function' ? selectedOptions.get(index) : selectedOptions[index];
                    onRemove(selectedOption, index);
                    stopDefaultEvent(event);
                }
                break;
            }
            case 'ArrowLeft':
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
            case 'ArrowRight': {
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

    hiddenRef = hiddenEl => {
        this.hiddenEl = hiddenEl;
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
            placeholder,
            selectedOptions,
            ...rest
        } = this.props;
        const classes = classNames('pill-selector-input-wrapper', {
            'is-disabled': disabled,
            'is-focused': isFocused,
            'show-error': !!error,
        });

        return (
            <Tooltip isShown={!!error} position="middle-right" text={error} theme="error">
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <span
                    className={classes}
                    onBlur={this.handleBlur}
                    onClick={this.handleClick}
                    onFocus={this.handleFocus}
                    onKeyDown={this.handleKeyDown}
                >
                    {selectedOptions.map((option, index) => (
                        <Pill
                            key={option.value}
                            isSelected={index === selectedIndex}
                            onRemove={onRemove.bind(this, option, index)}
                            text={option.text}
                        />
                    ))}
                    {/* hidden element for focus/key events during pill selection */}
                    <span
                        ref={this.hiddenRef}
                        aria-hidden="true"
                        className="accessibility-hidden"
                        onBlur={this.resetSelectedIndex}
                        tabIndex={-1}
                    />
                    <input
                        {...rest}
                        {...inputProps}
                        ref={input => {
                            this.inputEl = input;
                        }}
                        autoComplete="off"
                        className={classNames('pill-selector-input', className)}
                        disabled={disabled}
                        onInput={onInput}
                        placeholder={this.getNumSelected() === 0 ? placeholder : ''}
                        type="text"
                    />
                </span>
            </Tooltip>
        );
    }
}

export default PillSelector;
