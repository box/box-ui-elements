// @flow
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import findIndex from 'lodash/findIndex';
import { FormattedMessage, injectIntl } from 'react-intl';

import { scrollIntoView } from '../../utils/dom';
import IconCheck from '../../icons/general/IconCheck';
import SelectButton from '../select-button';
import DatalistItem from '../datalist-item';
import PopperComponent from '../popper';
import SelectFieldDropdown from './SelectFieldDropdown';
import type { Position } from '../tooltip';
import type { SelectOptionValueProp, SelectOptionProp } from './props';
import { PLACEMENT_BOTTOM_END, PLACEMENT_BOTTOM_START } from '../popper/constants';
import SearchForm from '../search-form/SearchForm';
import CLEAR from './constants';
import { ARROW_DOWN, ARROW_UP, ENTER, ESCAPE, SPACE, TAB } from '../../common/keyboard-events';

import messages from './messages';

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
    /** List of classnames of the relatedTarget that should prevent handleBlur from firing */
    blurExceptionClassNames?: Array<string>,
    /** Props to add to the button element */
    buttonProps?: Object,
    /** CSS class for the select container */
    className?: string,
    /** The fallback option value when other options are all unselected. Default option cannot be selected at the same time as other options. `selectedValues` must not be empty when this option is used. */
    defaultValue?: SelectOptionValueProp,
    /** An optional error to show within a tooltip. */
    error?: React.Node,
    /** Position of error message tooltip */
    errorTooltipPosition?: Position,
    /* Intl object */
    intl: Object,
    /** The select button is disabled if true */
    isDisabled?: boolean,
    /** Whether to allow the dropdown to overflow its boundaries and remain attached to its reference */
    isEscapedWithReference?: boolean,
    /** Whether to align the dropdown to the right */
    isRightAligned: boolean,
    /** The select field overlay (dropdown) will have a scrollbar and max-height if true * */
    isScrollable?: boolean,
    multiple: boolean,
    /** Function will be called with an array of all selected options after user selects a new option */
    onChange: Function,
    /** Function will be called with the user selected option (even on deselect or when the option was previously selected) */
    onOptionSelect?: Function,
    /** Function that allows custom rendering of select field options. When not provided the component will only render the option's displayText by default */
    optionRenderer: (option: SelectOptionProp) => React.Node,
    /** List of options (displayText, value) */
    options: Array<SelectOptionProp>,
    /** The select button text shown when no options are selected. */
    placeholder?: string | React.Element<any>,
    /** The currently selected option values (can be empty) */
    selectedValues: Array<SelectOptionValueProp>,
    /** Array of ordered indices indicating where to insert separators (ex. index 2 means insert a separator after option 2) */
    separatorIndices: Array<number>,
    /** Boolean to determine whether or not to show the clear option */
    shouldShowClearOption?: boolean,
    /** Boolean to determine whether or not to show the search field */
    shouldShowSearchInput?: boolean,
    /** The select button text (by default, component will use comma separated list of all selected option displayText) */
    title?: string | React.Element<any>,
    /** A CSS class for the tooltip's tether element component */
    tooltipTetherClassName?: string,
};

type State = {
    activeItemID: ?string,
    activeItemIndex: number,
    isOpen: boolean,
    searchText: string,
    shouldScrollIntoView: boolean,
};

function defaultOptionRenderer({ displayText }: SelectOptionProp) {
    return (
        <span className="bdl-SelectField-optionText" title={displayText}>
            {displayText}
        </span>
    );
}

class BaseSelectField extends React.Component<Props, State> {
    static defaultProps = {
        buttonProps: {},
        isDisabled: false,
        isRightAligned: false,
        isScrollable: false,
        multiple: false,
        optionRenderer: defaultOptionRenderer,
        options: [],
        selectedValues: [],
        separatorIndices: [],
        shouldShowClearOption: false,
        shouldShowSearchInput: false,
    };

    constructor(props: Props) {
        super(props);

        this.selectFieldID = uniqueId('selectfield');

        this.selectFieldContainerRef = React.createRef();

        this.state = {
            activeItemID: null,
            activeItemIndex: -1,
            isOpen: false,
            searchText: '',
            shouldScrollIntoView: false,
        };
    }

    componentWillUnmount() {
        if (this.state.isOpen) {
            // Clean-up global click handlers
            document.removeEventListener('click', this.handleDocumentClick);
        }
    }

    updateSearchText = (text: string) => {
        const { options } = this.props;
        const optionIndex = findIndex(options, element =>
            element.displayText.toLowerCase().includes(text.toLowerCase()),
        );

        if (optionIndex >= 0) {
            this.setActiveItem(optionIndex);
        }

        this.setState({
            searchText: text,
        });
    };

    handleDocumentClick = (event: MouseEvent) => {
        const container = this.selectFieldContainerRef.current;
        const isInside =
            (container && event.target instanceof Node && container.contains(event.target)) ||
            container === event.target;

        if (!isInside) {
            this.closeDropdown();
        }
    };

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

    selectFieldContainerRef: { current: null | HTMLDivElement };

    searchInputRef: HTMLInputElement;

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

    handleClearClick = () => {
        this.handleChange([]);
    };

    handleButtonKeyDown = (event: SyntheticKeyboardEvent<>) => {
        const { activeItemIndex } = this.state;

        // If user is interacting with the select dropdown, don't close on space/enter (i.e. prevent click event)
        if ((event.key === SPACE || event.key === ENTER) && activeItemIndex !== -1) {
            event.preventDefault();
        }
    };

    handleBlur = (event?: SyntheticFocusEvent<>) => {
        const { isOpen } = this.state;
        const { blurExceptionClassNames = [] } = this.props;

        const exceptionClasses = ['search-input', 'select-button', ...blurExceptionClassNames];

        if (
            isOpen &&
            event &&
            event.relatedTarget &&
            exceptionClasses.every(
                className => event && !(event.relatedTarget: window.HTMLInputElement).classList.contains(className),
            )
        ) {
            this.closeDropdown();
        }
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLDivElement>) => {
        const { key } = event;
        const { options, shouldShowClearOption, shouldShowSearchInput } = this.props;
        const { activeItemIndex, isOpen } = this.state;
        const itemCount = options.length;
        switch (key) {
            case ARROW_DOWN:
                stopDefaultEvent(event);
                if (isOpen) {
                    const nextIndex = activeItemIndex === itemCount - 1 ? -1 : activeItemIndex + 1;
                    this.setActiveItem(nextIndex);
                } else {
                    this.openDropdown();
                }
                break;
            case ARROW_UP:
                stopDefaultEvent(event);
                if (isOpen) {
                    const prevIndex = activeItemIndex === -1 ? itemCount - 1 : activeItemIndex - 1;
                    this.setActiveItem(prevIndex);
                } else {
                    this.openDropdown();
                }
                break;
            case ENTER:
            case SPACE:
                if (shouldShowSearchInput) {
                    // Allow space key presses in the search string when search field is active
                    if (key === SPACE) {
                        break;
                    }

                    // Enter presses should be ignored when no item is active
                    if (key === ENTER && activeItemIndex === -1) {
                        stopDefaultEvent(event);
                        break;
                    }
                }

                if (activeItemIndex !== -1 && isOpen) {
                    stopDefaultEvent(event);
                    const isClearOption = shouldShowClearOption && activeItemIndex === 0;
                    if (isClearOption) {
                        this.handleClearClick();
                    } else {
                        this.selectOption(activeItemIndex);
                    }
                    // Enter always closes dropdown (even for multiselect)
                    if (key === ENTER) {
                        this.closeDropdown();
                    }
                }
                break;
            case ESCAPE:
                if (isOpen) {
                    stopDefaultEvent(event);
                    this.closeDropdown();
                }
                break;
            case TAB:
                if (isOpen) {
                    this.closeDropdown();
                }
                break;
            default: {
                if (!shouldShowSearchInput) {
                    stopDefaultEvent(event);
                    const lowerCaseKey = key.toLowerCase();
                    const optionIndex = findIndex(
                        options,
                        option => option.displayText.toLowerCase().indexOf(lowerCaseKey) === 0,
                    );

                    if (optionIndex >= 0) {
                        this.setActiveItem(optionIndex);
                    }
                }
            }
        }
    };

    openDropdown = () => {
        const { shouldShowSearchInput } = this.props;
        if (!this.state.isOpen) {
            this.setState(
                { isOpen: true },
                () => shouldShowSearchInput && this.searchInputRef && this.searchInputRef.focus(),
            );
            document.addEventListener('click', this.handleDocumentClick);
        }
    };

    closeDropdown = () => {
        if (this.state.isOpen) {
            this.setState({
                activeItemID: null,
                activeItemIndex: -1,
                isOpen: false,
                searchText: '',
            });
            document.removeEventListener('click', this.handleDocumentClick);
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

    getFilteredOptions = (): Array<SelectOptionProp> => {
        const { options } = this.props;
        const { searchText } = this.state;

        return options.filter(option => {
            const isSubstring = option.displayText.toLowerCase().includes(searchText.toLowerCase());
            const isClearOption = option.value === CLEAR;

            return searchText ? isSubstring && !isClearOption : true;
        });
    };

    selectSingleOption(index: number) {
        const { selectedValues } = this.props;
        const item = this.getFilteredOptions()[index];
        // If item not previously selected, fire change handler
        if (!selectedValues.includes(item.value)) {
            this.handleChange([item]);
        }
        this.handleOptionSelect(item);
    }

    selectMultiOption = (index: number) => {
        const { defaultValue, options, selectedValues } = this.props;
        const hasDefaultValue = defaultValue != null; // Checks if not undefined or null
        const item = this.getFilteredOptions()[index];

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
            const defaultOptionIndex = findIndex(options, option => option.value === defaultValue);

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

    renderSearchInput = () => {
        const { intl } = this.props;
        const { searchText } = this.state;
        const getSearchInput = element => {
            this.searchInputRef = element;
        };

        return (
            <SearchForm
                className="select-field-search-container"
                getSearchInput={getSearchInput}
                onChange={this.updateSearchText}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                value={searchText}
            />
        );
    };

    renderSelectButton = () => {
        const { activeItemID, isOpen } = this.state;
        const {
            buttonProps: buttonElProps,
            isDisabled,
            className,
            error,
            errorTooltipPosition,
            tooltipTetherClassName,
        } = this.props;
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
            role: 'listbox',
            title: buttonText,
        };

        return (
            // Need to store the select button reference so we can calculate the button width
            // in order to set it as the min width of the dropdown list
            <SelectButton
                {...buttonProps}
                error={error}
                errorTooltipPosition={errorTooltipPosition}
                tooltipTetherClassName={tooltipTetherClassName}
            >
                {buttonText}
            </SelectButton>
        );
    };

    renderSelectOptions = () => {
        const { optionRenderer, selectedValues, separatorIndices, shouldShowClearOption } = this.props;
        const { activeItemIndex } = this.state;

        const filteredOptions = this.getFilteredOptions();

        if (filteredOptions.length === 0) {
            return (
                <DatalistItem className="select-option is-disabled">
                    <FormattedMessage {...messages.noResults} />
                </DatalistItem>
            );
        }

        const selectOptions = filteredOptions.map<React.Element<typeof DatalistItem | 'li'>>((item, index) => {
            const { value } = item;

            const isSelected = selectedValues.includes(value);

            const isClearOption = shouldShowClearOption && value === CLEAR;

            const itemProps: Object = {
                className: classNames('select-option', { 'is-clear-option': isClearOption }),
                key: index,
                /* preventDefault on click to prevent wrapping label from re-triggering the select button */
                onClick: event => {
                    event.preventDefault();
                    if (isClearOption) {
                        this.handleClearClick();
                    } else {
                        this.selectOption(index);
                    }
                },
                onMouseEnter: () => {
                    this.setActiveItem(index, false);
                },
                setActiveItemID: this.setActiveItemID,
            };

            if (index === activeItemIndex) {
                itemProps.isActive = true;
            }

            itemProps.isSelected = isSelected;

            // The below actually does have a key, but eslint can't catch that
            /* eslint-disable react/jsx-key */
            return (
                <DatalistItem {...itemProps}>
                    <div className="select-option-check-icon">
                        {isSelected ? <IconCheck height={16} width={16} /> : null}
                    </div>
                    {optionRenderer(item)}
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
        const {
            className,
            multiple,
            isEscapedWithReference,
            isRightAligned,
            isScrollable,
            selectedValues,
            shouldShowSearchInput,
        } = this.props;
        const { isOpen } = this.state;

        // @TODO: Need invariants on specific conditions.
        // 1) # of options should be non-zero
        // 2) selectedValues, if defined, should all exist in options
        // 3) defaultValue, if defined, should exist in options
        // 4) defaultValue, if defined, should mean selectedValues is never empty
        // 5) defaultValue, if defined, cannot be selected in addition to other options (must be exclusive)

        const dropdownPlacement = isRightAligned ? PLACEMENT_BOTTOM_END : PLACEMENT_BOTTOM_START;
        // popper.js modifier to allow dropdown to overflow its boundaries and remain attached to its reference
        const dropdownModifiers = isEscapedWithReference ? { preventOverflow: { escapeWithReference: true } } : {};

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                className={classNames(className, 'bdl-SelectField', 'select-container')}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
                ref={this.selectFieldContainerRef}
            >
                <PopperComponent placement={dropdownPlacement} isOpen={isOpen} modifiers={dropdownModifiers}>
                    {this.renderSelectButton()}
                    <SelectFieldDropdown
                        isScrollable={isScrollable}
                        multiple={multiple}
                        selectedValues={selectedValues}
                        selectFieldID={this.selectFieldID}
                    >
                        {shouldShowSearchInput && this.renderSearchInput()}
                        {this.renderSelectOptions()}
                    </SelectFieldDropdown>
                </PopperComponent>
            </div>
        );
    }
}

export { BaseSelectField as BaseSelectFieldBase };
export default injectIntl(BaseSelectField);
