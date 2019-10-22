// @flow
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import { scrollIntoView } from '../../utils/dom';
import IconCheck from '../../icons/general/IconCheck';
import SelectButton from '../select-button';
import DatalistItem from '../datalist-item';
import type { SelectOptionValueProp, SelectOptionProp } from './props';
import { OVERLAY_WRAPPER_CLASS } from '../../constants';

import './SelectField.scss';

function stopDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

function toggleOption(options, value) {
    const index = options.indexOf(value);

    if (index === -1) {
        options.push(value);
    } else {
        options.splice(index, 1);
    }
}

type Props = {
    /** Props to add to the button element */
    buttonProps?: Object,
    /** CSS class for the select container */
    className?: string,
    /** The fallback option value when other options are all unselected. Default option cannot be selected at the same time as other options. `selectedValues` must not be empty when this option is used. */
    defaultValue?: SelectOptionValueProp,
    /** An optional error to show within a tooltip. */
    error?: React.Node,
    /** The select button is disabled if true */
    isDisabled?: boolean,
    /** The select field overlay (dropdown) will have a scrollbar and max-height if true * */
    isScrollable?: boolean,
    multiple: boolean,
    /** Function will be called with an array of all selected options after user selects a new option */
    onChange: Function,
    /** Function will be called with the user selected option (even on deselect or when the option was previously selected) */
    onOptionSelect?: Function,
    /** Function that allows custom rendering of select field options. When not provided the component will only render the option's displayText by default */
    optionRenderer?: (option: SelectOptionProp) => React.Node,
    /** List of options (displayText, value) */
    options: Array<SelectOptionProp>,
    /** The select button text shown when no options are selected. */
    placeholder?: string | React.Element<any>,
    /** The currently selected option values (can be empty) */
    selectedValues: Array<SelectOptionValueProp>,
    /** Array of ordered indices indicating where to insert separators (ex. index 2 means insert a separator after option 2) */
    separatorIndices: Array<number>,
    /** The select button text (by default, component will use comma separated list of all selected option displayText) */
    title?: string | React.Element<any>,
};

type State = {
    activeItemID: ?string,
    activeItemIndex: number,
    isOpen: boolean,
    shouldScrollIntoView: boolean,
};

export const OVERLAY_SCROLLABLE_CLASS = 'bdl-SelectField-overlay--scrollable';

class BaseSelectField extends React.Component<Props, State> {
    static defaultProps = {
        buttonProps: {},
        isDisabled: false,
        isScrollable: false,
        multiple: false,
        options: [],
        selectedValues: [],
        separatorIndices: [],
    };

    constructor(props: Props) {
        super(props);

        this.selectFieldID = uniqueId('selectfield');

        this.state = {
            activeItemID: null,
            activeItemIndex: -1,
            isOpen: false,
            shouldScrollIntoView: false,
        };
    }

    setActiveItem = (index: number, shouldScrollIntoView?: boolean = true) => {
        this.setState({ activeItemIndex: index, shouldScrollIntoView });
        if (index === -1) {
            this.setActiveItemID(null);
        }
    };

    setActiveItemID = (id: ?string) => {
        const { shouldScrollIntoView } = this.state;
        const itemEl = id ? document.getElementById(id) : null;

        this.setState({ activeItemID: id, shouldScrollIntoView: false }, () => {
            if (shouldScrollIntoView) {
                scrollIntoView(itemEl, { block: 'nearest' });
            }
        });
    };

    selectFieldID: string;

    handleChange = (selectedItems: Array<SelectOptionProp>) => {
        const { onChange } = this.props;

        if (onChange) {
            onChange(selectedItems);
        }
    };

    handleOptionSelect = (selectedItem: SelectOptionProp) => {
        const { onOptionSelect } = this.props;

        if (onOptionSelect) {
            onOptionSelect(selectedItem);
        }
    };

    handleButtonClick = () => {
        if (this.state.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    };

    handleButtonKeyDown = (event: SyntheticKeyboardEvent<>) => {
        const { activeItemIndex } = this.state;

        // If user is interacting with the select dropdown, don't close on space/enter (i.e. prevent click event)
        if ((event.key === ' ' || event.key === 'Enter') && activeItemIndex !== -1) {
            event.preventDefault();
        }
    };

    handleBlur = () => {
        const { isOpen } = this.state;
        if (isOpen) {
            this.closeDropdown();
        }
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLDivElement>) => {
        const { options } = this.props;
        const { activeItemIndex, isOpen } = this.state;
        const itemCount = options.length;

        switch (event.key) {
            case 'ArrowDown':
                stopDefaultEvent(event);
                if (isOpen) {
                    const nextIndex = activeItemIndex === itemCount - 1 ? -1 : activeItemIndex + 1;
                    this.setActiveItem(nextIndex);
                } else {
                    this.openDropdown();
                }
                break;
            case 'ArrowUp':
                stopDefaultEvent(event);
                if (isOpen) {
                    const prevIndex = activeItemIndex === -1 ? itemCount - 1 : activeItemIndex - 1;
                    this.setActiveItem(prevIndex);
                } else {
                    this.openDropdown();
                }
                break;
            case 'Enter':
            case ' ':
                if (activeItemIndex !== -1 && isOpen) {
                    stopDefaultEvent(event);
                    this.selectOption(activeItemIndex);
                    // Enter always closes dropdown (even for multiselect)
                    if (event.key === 'Enter') {
                        this.closeDropdown();
                    }
                }
                break;
            case 'Escape':
                if (isOpen) {
                    stopDefaultEvent(event);
                    this.closeDropdown();
                }
                break;
            // no default
        }
    };

    openDropdown = () => {
        if (!this.state.isOpen) {
            this.setState({ isOpen: true });
        }
    };

    closeDropdown = () => {
        if (this.state.isOpen) {
            this.setState({
                activeItemID: null,
                activeItemIndex: -1,
                isOpen: false,
            });
        }
    };

    selectOption = (index: number) => {
        const { multiple } = this.props;

        if (multiple) {
            this.selectMultiOption(index);
        } else {
            this.selectSingleOption(index);
            this.closeDropdown(); // Close dropdown for single select fields
        }
    };

    selectSingleOption(index: number) {
        const { options, selectedValues } = this.props;
        const item = options[index];
        // If item not previously selected, fire change handler
        if (!selectedValues.includes(item.value)) {
            this.handleChange([item]);
        }
        this.handleOptionSelect(item);
    }

    selectMultiOption = (index: number) => {
        const { defaultValue, options, selectedValues } = this.props;
        const hasDefaultValue = defaultValue != null; // Checks if not undefined or null
        const item = options[index];

        // If we are already using the default option, just return without firing onChange
        if (hasDefaultValue && defaultValue === item.value) {
            this.selectSingleOption(index);
            return;
        }

        // Copy the array so we can freely modify it
        const newSelectedValues = selectedValues.slice(0);
        toggleOption(newSelectedValues, item.value);

        // Apply constraints if a defaultValue is specified
        if (hasDefaultValue) {
            const defaultOptionIndex = options.findIndex(option => option.value === defaultValue);

            if (defaultOptionIndex !== -1) {
                if (newSelectedValues.length === 0) {
                    // If nothing is selected, we should select the default option
                    this.selectSingleOption(defaultOptionIndex);
                    return;
                }
                if (newSelectedValues.length > 1 && newSelectedValues.includes(defaultValue)) {
                    // Remove the default option from the selected values when more than one thing is selected
                    newSelectedValues.splice(defaultOptionIndex, 1);
                }
            }
        }

        // Fire onchange event with selected items
        this.handleChange(options.filter(option => newSelectedValues.includes(option.value)));

        this.handleOptionSelect(item);
    };

    renderButtonText = () => {
        const { options, placeholder, selectedValues, title } = this.props;
        const selectedItemCount = selectedValues.length;

        // When there are no options selected, render placeholder
        if (selectedItemCount === 0 && placeholder) {
            return placeholder;
        }

        // User-specified title when options are selected
        if (title) {
            return title;
        }

        // Auto-generate button title based on selected options
        const selectedOptions = options.filter(option => selectedValues.includes(option.value));
        return selectedOptions.map(option => option.displayText).join(', ');
    };

    renderSelectButton = () => {
        const { activeItemID, isOpen } = this.state;
        const { buttonProps: buttonElProps, isDisabled, className, error } = this.props;
        const buttonText = this.renderButtonText();
        const buttonProps = {
            ...buttonElProps,
            'aria-activedescendant': activeItemID,
            'aria-autocomplete': 'list',
            'aria-expanded': isOpen,
            'aria-owns': this.selectFieldID,
            className,
            isDisabled,
            onClick: this.handleButtonClick,
            onKeyDown: this.handleButtonKeyDown,
            // @NOTE: Technically, only text inputs should be combo-boxes but ARIA specs do not cover custom select dropdowns
            role: 'combobox',
            title: buttonText,
        };

        return (
            <SelectButton {...buttonProps} error={error}>
                {buttonText}
            </SelectButton>
        );
    };

    renderSelectOptions = () => {
        const { optionRenderer, options, selectedValues, separatorIndices } = this.props;
        const { activeItemIndex } = this.state;

        const selectOptions = options.map<React.Element<typeof DatalistItem | 'li'>>((item, index) => {
            const { displayText, value } = item;

            const isSelected = selectedValues.includes(value);

            const itemProps: Object = {
                className: 'select-option',
                key: index,
                /* preventDefault on click to prevent wrapping label from re-triggering the select button */
                onClick: event => {
                    event.preventDefault();

                    this.selectOption(index);
                },
                onMouseEnter: () => {
                    this.setActiveItem(index, false);
                },
                setActiveItemID: this.setActiveItemID,
            };

            if (index === activeItemIndex) {
                itemProps.isActive = true;
            }

            // The below actually does have a key, but eslint can't catch that
            /* eslint-disable react/jsx-key */
            return (
                <DatalistItem {...itemProps}>
                    <div className="select-option-check-icon">
                        {isSelected ? <IconCheck height={16} width={16} /> : null}
                    </div>
                    {optionRenderer ? optionRenderer(item) : displayText}
                </DatalistItem>
            );
            /* eslint-enable react/jsx-key */
        });

        separatorIndices.forEach((separatorIndex, index) => {
            selectOptions.splice(separatorIndex + index, 0, <li key={`separator${separatorIndex}`} role="separator" />);
        });

        return selectOptions;
    };

    render() {
        const { className, multiple, isScrollable } = this.props;
        const { isOpen } = this.state;

        // @TODO: Need invariants on specific conditions.
        // 1) # of options should be non-zero
        // 2) selectedValues, if defined, should all exist in options
        // 3) defaultValue, if defined, should exist in options
        // 4) defaultValue, if defined, should mean selectedValues is never empty
        // 5) defaultValue, if defined, cannot be selected in addition to other options (must be exclusive)

        const listboxProps = {};
        if (multiple) {
            listboxProps['aria-multiselectable'] = true;
        }

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                className={classNames(className, 'select-container')}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
            >
                <div className="select-field">
                    {this.renderSelectButton()}
                    <div
                        className={classNames(OVERLAY_WRAPPER_CLASS, {
                            'is-visible': isOpen,
                        })}
                    >
                        <ul
                            className={classNames('overlay', {
                                [OVERLAY_SCROLLABLE_CLASS]: isScrollable,
                            })}
                            id={this.selectFieldID}
                            role="listbox"
                            // preventDefault on mousedown so blur doesn't happen before click
                            onMouseDown={event => event.preventDefault()}
                            {...listboxProps}
                        >
                            {this.renderSelectOptions()}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default BaseSelectField;
