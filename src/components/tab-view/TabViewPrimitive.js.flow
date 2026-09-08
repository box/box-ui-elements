// @flow
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';

import IconPageBack from '../../icons/general/IconPageBack';
import IconPageForward from '../../icons/general/IconPageForward';
import LinkButton from '../link/LinkButton';

import './Tabs.scss';

export const TAB_KEY = 'Tab';
export const TAB_PANEL_ROLE = 'tabpanel';

type Props = {
    children: React.Node,
    className?: string,
    focusedIndex: number,
    isDynamic?: boolean,
    onKeyUp?: Function,
    onTabFocus: Function,
    onTabSelect?: Function,
    resetActiveTab: Function,
    resetFocusedTab: Function,
    selectedIndex: number,
};

type State = {
    tabsContainerOffsetLeft: number,
};

class TabViewPrimitive extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.tabviewID = uniqueId('tabview');

        this.state = {
            tabsContainerOffsetLeft: 0,
        };
    }

    componentDidMount() {
        const { isDynamic, focusedIndex } = this.props;
        if (isDynamic) {
            // set initial tabsContainerOffsetLeft state after first mounting
            this.scrollToTab(focusedIndex);
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { focusedIndex: prevFocusedIndex, selectedIndex: prevSelectedIndex } = prevProps;
        const { focusedIndex, selectedIndex } = this.props;

        if (this.props.isDynamic) {
            if (prevFocusedIndex !== focusedIndex) {
                this.scrollToTab(focusedIndex);
            }

            // update tabsContainerOffsetLeft state when receiving a new prop
            if (prevSelectedIndex !== selectedIndex) {
                this.scrollToTab(selectedIndex);
            }
        }

        if (prevFocusedIndex !== focusedIndex) {
            // have to focus after render otherwise, the focus will be lost
            this.focusOnTabElement(focusedIndex);
        }
    }

    onClickTab = (tabIndex: number) => {
        const { onTabFocus, onTabSelect } = this.props;
        if (onTabSelect) {
            onTabSelect(tabIndex);
        }
        onTabFocus(tabIndex);
    };

    getLastElementsAnchorPoint = () => {
        if (this.tabsElements.length === 0) {
            return 0;
        }

        const lastTabElement = this.tabsElements[this.tabsElements.length - 1];
        return lastTabElement.offsetLeft + lastTabElement.offsetWidth;
    };

    getTabsContainerOffsetLeft = () => {
        if (!this.tabsContainer) {
            return 0;
        }

        const { tabsContainerOffsetLeft } = this.state;
        let viewportOffset = parseInt(tabsContainerOffsetLeft, 10) * -1;
        viewportOffset = viewportOffset || 0;
        return viewportOffset;
    };

    getTabsContainerWidth = () => (this.tabsContainer ? parseInt(this.tabsContainer.offsetWidth, 10) : 0);

    tabviewID: string;

    scrollToTab = (tabIndex: number) => {
        if (
            !this.props.isDynamic ||
            this.tabsContainer === null ||
            this.tabsElements.length === 0 ||
            tabIndex < 0 ||
            tabIndex > this.tabsElements.length - 1
        ) {
            return;
        }

        const tabElementOfInterest = this.tabsElements[tabIndex];
        const lastElementsAnchorPoint = this.getLastElementsAnchorPoint();

        // if tabs don't overflow at all, no need to scroll
        const tabsContainerWidth = this.getTabsContainerWidth();
        if (lastElementsAnchorPoint <= tabsContainerWidth) {
            this.setState({ tabsContainerOffsetLeft: 0 });
            return;
        }

        // do not scroll any more if we will go past the rightmost anchor
        const newOffset = Math.min(lastElementsAnchorPoint - tabsContainerWidth, tabElementOfInterest.offsetLeft);

        // move the viewport
        const newViewportOffset = -1 * newOffset;
        this.setState({ tabsContainerOffsetLeft: newViewportOffset });
    };

    isRightArrowVisible = () => {
        if (!this.tabsContainer) {
            return false;
        }

        const tabsContainerOffsetLeft = this.getTabsContainerOffsetLeft();
        const lastElementsAnchorPoint = this.getLastElementsAnchorPoint();
        const tabsContainerWidth = this.getTabsContainerWidth();

        return tabsContainerOffsetLeft + tabsContainerWidth < lastElementsAnchorPoint;
    };

    isLeftArrowVisible = () => {
        const { focusedIndex, selectedIndex } = this.props;
        const tabsContainerOffsetLeft = this.getTabsContainerOffsetLeft();

        return tabsContainerOffsetLeft !== 0 && (selectedIndex !== 0 || focusedIndex !== 0);
    };

    focusOnTabElement = (focusedIndex: number) => {
        if (focusedIndex + 1 > this.tabsElements.length || focusedIndex < 0) {
            return;
        }

        this.tabsElements[focusedIndex].focus();
    };

    tabsElements = [];

    tabsContainer = null;

    handleKeyDown = (event: SyntheticKeyboardEvent<>) => {
        const { children, focusedIndex, onTabFocus, resetFocusedTab, resetActiveTab } = this.props;
        const childrenCount = React.Children.count(children);

        switch (event.key) {
            case 'ArrowRight':
                onTabFocus(this.calculateNextIndex(focusedIndex, childrenCount));
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'ArrowLeft':
                onTabFocus(this.calculatePrevIndex(focusedIndex, childrenCount));
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Escape':
                resetActiveTab();
                break;

            case TAB_KEY:
                resetFocusedTab();
                break;

            default:
                break;
        }
    };

    calculateNextIndex = (currentIndex: number, childrenCount: number) => (currentIndex + 1) % childrenCount;

    calculatePrevIndex = (currentIndex: number, childrenCount: number) =>
        (currentIndex - 1 + childrenCount) % childrenCount;

    /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
    renderTabs() {
        const { children, selectedIndex, isDynamic } = this.props;
        const { tabsContainerOffsetLeft } = this.state;

        const style = isDynamic ? { left: `${tabsContainerOffsetLeft}px` } : {};

        return (
            <div
                className="tabs"
                role="tablist"
                tabIndex="0"
                ref={ref => {
                    this.tabsContainer = ref;
                }}
                style={style}
                onKeyDown={!isDynamic ? this.handleKeyDown : null}
            >
                {React.Children.map(children, (tab, i) => {
                    const buttonProps = omit(tab.props, ['className', 'children', 'title']);

                    const classes = classNames('btn-plain', 'tab', i === selectedIndex ? 'is-selected' : '');

                    const ariaControls = `${this.tabviewID}-panel-${i + 1}`;
                    const ariaSelected = i === selectedIndex;
                    const id = `${this.tabviewID}-tab-${i + 1}`;
                    const { href, component, refProp } = tab.props;

                    const tabIndex = i === selectedIndex ? '0' : '-1';

                    if (href) {
                        return (
                            <LinkButton
                                className={classes}
                                aria-controls={ariaControls}
                                aria-selected={ariaSelected}
                                id={id}
                                role="tab"
                                href={href}
                                linkRef={ref => {
                                    this.tabsElements[i] = ref;
                                }}
                                refProp={refProp}
                                tabIndex={tabIndex}
                                to={href}
                                component={component}
                            >
                                <div className="tab-title">{tab.props.title}</div>
                                <div className="tab-underline" />
                            </LinkButton>
                        );
                    }
                    return (
                        <button
                            className={classes}
                            aria-controls={ariaControls}
                            aria-selected={ariaSelected}
                            onClick={() => this.onClickTab(i)}
                            role="tab"
                            type="button"
                            id={id}
                            ref={ref => {
                                this.tabsElements[i] = ref;
                            }}
                            tabIndex={tabIndex}
                            {...buttonProps}
                        >
                            <div className="tab-title">{tab.props.title}</div>
                            <div className="tab-underline" />
                        </button>
                    );
                })}
            </div>
        );
    }

    /* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */
    renderDynamicTabs() {
        const { onTabFocus, focusedIndex } = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div className="dynamic-tabs-bar" onKeyDown={this.handleKeyDown}>
                <button
                    className={classNames('btn-plain svg-container left-arrow', {
                        hidden: !this.isLeftArrowVisible(),
                    })}
                    onClick={() => onTabFocus(focusedIndex - 1)}
                    type="button"
                    tabIndex="-1"
                >
                    <IconPageBack />
                </button>
                <div className="dynamic-tabs-wrapper">{this.renderTabs()}</div>
                <button
                    className={classNames('btn-plain svg-container right-arrow', {
                        hidden: !this.isRightArrowVisible(),
                    })}
                    onClick={() => onTabFocus(focusedIndex + 1)}
                    type="button"
                    tabIndex="-1"
                >
                    <IconPageForward />
                </button>
            </div>
        );
    }

    render() {
        const { children, className = '', isDynamic = false, onKeyUp, selectedIndex } = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                className={`tab-view ${classNames(className, {
                    'dynamic-tabs': isDynamic,
                })}`}
                onKeyUp={onKeyUp}
            >
                {!isDynamic ? this.renderTabs() : this.renderDynamicTabs()}
                <div className="tab-panels">
                    {React.Children.toArray(children).map((child, i) => (
                        <div
                            key={i}
                            id={`${this.tabviewID}-panel-${i}`}
                            aria-labelledby={`${this.tabviewID}-tab-${i + 1}`}
                            aria-hidden={selectedIndex !== i}
                            className={`tab-panel ${i === selectedIndex ? 'is-selected' : ''}`}
                            role={TAB_PANEL_ROLE}
                        >
                            {child.props.children}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default TabViewPrimitive;
