// @flow
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { scrollItemIntoView } from 'utils/dom';

import ScrollWrapper from '../scroll-wrapper';

import './SelectorDropdown.scss';

const overlayWrapperClass = 'overlay-wrapper';

function stopDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

type Props = {
    /** Options to keep the results always open */
    children?: React.Node,
    /** Options to render in the dropdown filtered based on the input text */
    className?: string,
    /** CSS class for the wrapper div */
    isAlwaysOpen?: boolean,
    /** Optional title text that will be rendered above the list */
    onEnter?: (event: SyntheticKeyboardEvent<HTMLDivElement>) => void,
    /** Function called on keyboard "Enter" event only if enter does not trigger selection */
    onSelect?: Function,
    /** Function called with the index of the selected option and the event (selected by keyboard or click) */
    selector: React.Element<any>,
    /** Component containing an input text field and takes `inputProps` to spread onto the input element */
    shouldScroll?: boolean,
    /** Boolean to indicate whether the dropdown should scroll */
    title?: React.Node,
};

type State = {
    activeItemID: string | null,
    activeItemIndex: number,
    shouldOpen: boolean,
};

class SelectorDropdown extends React.Component<Props, State> {
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

    componentWillReceiveProps(nextProps: Props) {
        if (this.haveChildrenChanged(nextProps.children)) {
            this.resetActiveItem();
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
        this.setState({ activeItemID: id });
        scrollItemIntoView(id, overlayWrapperClass);
    };

    listboxID: string;

    selectorDropdownRef: { current: null | HTMLDivElement };

    haveChildrenChanged = (nextChildren?: React.Node) => {
        const { children } = this.props;
        const childrenCount = React.Children.count(children);
        const nextChildrenCount = React.Children.count(nextChildren);

        if (childrenCount !== nextChildrenCount) {
            return true;
        }

        if (childrenCount === 0) {
            return false;
        }

        const childrenKeys = React.Children.map(children, child => child.key);
        const nextChildrenKeys = React.Children.map(nextChildren, child => child.key);
        return childrenKeys.some((childKey, index) => childKey !== nextChildrenKeys[index]);
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
            // no default
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
        const { children, className, title, selector, shouldScroll } = this.props;
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
            <ul className="overlay" id={listboxID} role="listbox">
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
                    return React.cloneElement(item, itemProps);
                })}
            </ul>
        );

        // change onKeyPress/onPaste back to onInput when React fixes this IE11 bug: https://github.com/facebook/react/issues/7280

        // We're simulating the blur event with the tab key listener and the
        // click listener as a proxy because IE will trigger a blur when
        // using the scrollbar in the dropdown which indavertently closes the dropdown.
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                className={classNames('selector-dropdown-wrapper', className)}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}
                onKeyPress={this.handleInput}
                onPaste={this.handleInput}
                ref={this.selectorDropdownRef}
            >
                {React.cloneElement(selector, { inputProps })}
                {isOpen && (
                    <div className={`${overlayWrapperClass} is-visible`}>
                        {title}
                        {shouldScroll ? <ScrollWrapper>{list}</ScrollWrapper> : list}
                    </div>
                )}
            </div>
        );
    }
}

export default SelectorDropdown;
