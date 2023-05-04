// @flow
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import { scrollIntoView } from '../../utils/dom';
import PopperComponent from '../popper';
import { PLACEMENT_BOTTOM_START } from '../popper/constants';
import ScrollWrapper from '../scroll-wrapper';
import { OVERLAY_WRAPPER_CLASS } from '../../constants';

import './SelectorDropdown.scss';

function stopDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

type Props = {
    /** Options to render in the dropdown filtered based on the input text */
    children?: React.Node,
    /** CSS class for the wrapper div */
    className?: string,
    /** Index at which to insert the divider */
    dividerIndex?: number,
    /** Options to keep the results always open */
    isAlwaysOpen?: boolean,
    /** Option to enable dynamic positioning with popper */
    isPositionDynamic?: boolean,
    /** Function called on keyboard "Enter" event only if enter does not trigger selection */
    onEnter?: (event: SyntheticKeyboardEvent<HTMLDivElement>) => void,
    /** Function called with the index of the selected option and the event (selected by keyboard or click) */
    onSelect?: Function,
    /** Optional title of the overlay */
    overlayTitle?: string,
    /** A CSS selector matching the element to use as a boundary when auto-scrolling dropdown elements into view. When not provided, boundary will be determined by scrollIntoView utility function */
    scrollBoundarySelector?: string,
    /** Component containing an input text field and takes `inputProps` to spread onto the input element */
    selector: React.Element<any>,
    /** Boolean to indicate whether the dropdown should scroll */
    shouldScroll?: boolean,
    /** Determines whether or not the first item is highlighted automatically when the dropdown opens */
    shouldSetActiveItemOnOpen?: boolean,
    /** Optional title text that will be rendered above the list */
    title?: React.Node,
};

type State = {
    activeItemID: string | null,
    activeItemIndex: number,
    shouldOpen: boolean,
};

class SelectorDropdown extends React.Component<Props, State> {
    static defaultProps = {
        isPositionDynamic: false,
    };

    constructor(props: Props) {
        super(props);

        this.listboxID = uniqueId('listbox');

        this.state = {
            activeItemID: null,
            activeItemIndex: -1,
            shouldOpen: false,
        };

        this.selectorDropdownRef = React.createRef();
    }

    componentDidUpdate({ shouldSetActiveItemOnOpen, children }: Props) {
        if (this.haveChildrenChanged(children)) {
            // For UX purposes filtering the items is equivalent
            // to re-opening the dropdown. In such cases we highlight
            // the first item when configured to do so
            if (shouldSetActiveItemOnOpen) {
                this.setActiveItem(0);
            } else {
                this.resetActiveItem();
            }
        }
    }

    componentWillUnmount() {
        // just in case event listener was added during openDropdown() but the component
        // gets unmounted without closeDropdown()
        document.removeEventListener('click', this.handleDocumentClick, true);
    }

    setActiveItem = (index: number) => {
        this.setState({ activeItemIndex: index });
        if (index === -1) {
            this.setActiveItemID(null);
        }
    };

    setActiveItemID = (id: string | null) => {
        const { scrollBoundarySelector } = this.props;
        const itemEl = id ? document.getElementById(id) : null;

        const scrollOptions: Object = {
            block: 'nearest',
        };

        // Allow null in case we want to clear the default
        // boundary from scrollIntoView
        if (typeof scrollBoundarySelector !== 'undefined') {
            scrollOptions.boundary = document.querySelector(scrollBoundarySelector);
        }

        this.setState({ activeItemID: id }, () => {
            scrollIntoView(itemEl, scrollOptions);
        });
    };

    listboxID: string;

    selectorDropdownRef: { current: null | HTMLDivElement };

    haveChildrenChanged = (prevChildren?: React.Node) => {
        const { children } = this.props;
        const childrenCount = React.Children.count(children);
        const prevChildrenCount = React.Children.count(prevChildren);

        if (childrenCount !== prevChildrenCount) {
            return true;
        }

        if (childrenCount === 0) {
            return false;
        }

        const childrenKeys = React.Children.map(children, child => child.key);
        const prevChildrenKeys = React.Children.map(prevChildren, child => child.key);
        return childrenKeys.some((childKey, index) => childKey !== prevChildrenKeys[index]);
    };

    resetActiveItem = () => {
        this.setState({
            activeItemID: null,
            activeItemIndex: -1,
        });
    };

    handleFocus = () => {
        this.openDropdown();
    };

    handleDocumentClick = (event: MouseEvent) => {
        const container = this.selectorDropdownRef.current;
        const isInside =
            (container && event.target instanceof Node && container.contains(event.target)) ||
            container === event.target;

        if (!isInside) {
            this.closeDropdown();
        }
    };

    handleInput = () => {
        this.openDropdown();
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLDivElement>) => {
        const { children, isAlwaysOpen, onEnter } = this.props;
        const { activeItemIndex } = this.state;
        const childrenCount = React.Children.count(children);

        switch (event.key) {
            case 'ArrowDown':
                if (this.isDropdownOpen()) {
                    if (childrenCount) {
                        stopDefaultEvent(event);
                    }
                    const nextIndex = activeItemIndex === childrenCount - 1 ? -1 : activeItemIndex + 1;
                    this.setActiveItem(nextIndex);
                } else {
                    this.openDropdown();
                }
                break;
            case 'ArrowUp':
                if (this.isDropdownOpen()) {
                    if (childrenCount) {
                        stopDefaultEvent(event);
                    }
                    const prevIndex = activeItemIndex === -1 ? childrenCount - 1 : activeItemIndex - 1;
                    this.setActiveItem(prevIndex);
                } else {
                    this.openDropdown();
                }
                break;
            case 'Enter':
                if (activeItemIndex !== -1 && this.isDropdownOpen()) {
                    stopDefaultEvent(event);
                    this.selectItem(activeItemIndex, event);
                } else if (onEnter) {
                    onEnter(event);
                }
                break;
            case 'Tab':
                if (this.isDropdownOpen()) {
                    this.closeDropdown();
                    this.resetActiveItem();
                }
                break;
            case 'Escape':
                if (!isAlwaysOpen && this.isDropdownOpen()) {
                    stopDefaultEvent(event);
                    this.closeDropdown();
                    this.resetActiveItem();
                }
                break;
            default:
                this.handleInput();
        }
    };

    isDropdownOpen = () => {
        const { children, isAlwaysOpen } = this.props;
        const { shouldOpen } = this.state;
        const childrenCount = React.Children.count(children);
        return childrenCount > 0 && (!!isAlwaysOpen || shouldOpen);
    };

    openDropdown = () => {
        if (!this.state.shouldOpen) {
            const { shouldSetActiveItemOnOpen } = this.props;

            if (shouldSetActiveItemOnOpen) {
                this.setActiveItem(0);
            }
            this.setState({ shouldOpen: true });
            document.addEventListener('click', this.handleDocumentClick, true);
        }
    };

    closeDropdown = () => {
        this.setState({ shouldOpen: false });
        document.removeEventListener('click', this.handleDocumentClick, true);
    };

    selectItem = (index: number, event: SyntheticEvent<>) => {
        const { onSelect } = this.props;
        if (onSelect) {
            onSelect(index, event);
        }
        this.closeDropdown();
    };

    render() {
        const { listboxID, selectItem, setActiveItem, setActiveItemID, closeDropdown } = this;
        const {
            dividerIndex,
            overlayTitle,
            children,
            className,
            isPositionDynamic,
            title,
            selector,
            shouldScroll,
        } = this.props;
        const { activeItemID, activeItemIndex } = this.state;
        const isOpen = this.isDropdownOpen();
        const inputProps: Object = {
            'aria-activedescendant': activeItemID,
            'aria-autocomplete': 'list',
            'aria-expanded': isOpen,
            role: 'combobox',
        };
        if (isOpen) {
            inputProps['aria-owns'] = listboxID;
        }

        const list = (
            <ul
                className={classNames('overlay', overlayTitle ? overlayTitle.toLowerCase() : '')}
                id={listboxID}
                role="listbox"
            >
                {overlayTitle && <h5 className="SelectorDropdown-title">{overlayTitle}</h5>}
                {React.Children.map(children, (item, index) => {
                    const itemProps: Object = {
                        onClick: event => {
                            selectItem(index, event);
                        },
                        /* preventDefault on mousedown so blur doesn't happen before click */
                        onMouseDown: event => {
                            event.preventDefault();
                        },
                        onMouseEnter: () => {
                            setActiveItem(index);
                        },
                        closeDropdown: () => {
                            closeDropdown();
                        },
                        setActiveItemID,
                    };

                    if (index === activeItemIndex) {
                        itemProps.isActive = true;
                    }

                    const hasDivider = index === dividerIndex;

                    return (
                        <>
                            {hasDivider && <hr className="SelectorDropdown-divider" />}
                            {React.cloneElement(item, itemProps)}
                        </>
                    );
                })}
            </ul>
        );

        // change onPaste back to onInput when React fixes this IE11 bug: https://github.com/facebook/react/issues/7280

        // We're simulating the blur event with the tab key listener and the
        // click listener as a proxy because IE will trigger a blur when
        // using the scrollbar in the dropdown which indavertently closes the dropdown.
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                className={classNames('SelectorDropdown', className)}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}
                onPaste={this.handleInput}
                ref={this.selectorDropdownRef}
            >
                <PopperComponent
                    isPositionDynamic={isPositionDynamic}
                    isOpen={isOpen}
                    placement={PLACEMENT_BOTTOM_START}
                >
                    {React.cloneElement(selector, { inputProps })}
                    <div className={`SelectorDropdown-overlay ${OVERLAY_WRAPPER_CLASS} is-visible`}>
                        {title}
                        {shouldScroll ? <ScrollWrapper>{list}</ScrollWrapper> : list}
                    </div>
                </PopperComponent>
            </div>
        );
    }
}

export default SelectorDropdown;
