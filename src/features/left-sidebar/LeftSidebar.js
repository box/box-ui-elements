// @flow
import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import { NavSidebar, NavList, NavListCollapseHeader } from '../../components/nav-sidebar';
import FooterIndicator from '../../components/footer-indicator/FooterIndicator';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import { bdlBoxBlue } from '../../styles/variables';

import CopyrightFooter from './CopyrightFooter';
import InstantLogin from './InstantLogin';
import LeftSidebarDropWrapper from './LeftSidebarDropWrapper';
import LeftSidebarIconWrapper from './LeftSidebarIconWrapper';
import NewItemsIndicator from './NewItemsIndicator';
import defaultNavLinkRenderer from './defaultNavLinkRenderer';

import type { Props as LeftSidebarLinkProps } from './LeftSidebarLink';
import type { Callout } from './Callout';

import './styles/LeftSidebar.scss';

type SubMenuItem = {
    /** Sidebar Link Callout */
    callout?: Callout,
    /** flag to mark whether a menu item can be dropped on */
    canReceiveDrop?: boolean,
    /** class to add to sub menu element */
    className?: string,
    /** Ref for parent to access drop target */
    dropTargetRef?: { current: null | HTMLDivElement },
    /** Optional HTML attributes to append to menu item */
    htmlAttributes?: Object,
    /** React element representing an svg icon */
    iconComponent?: ?React.ComponentType<any>,
    /** React component representing an svg icon */
    iconElement?: ?React.Element<any>,
    /** Unique identifier for menu item */
    id: string,
    /** Localized text string to use for individual menu items */
    message: string,
    /** Optional left side bar link renderer. Defaults to defaultNavLinkRenderer */
    navLinkRenderer?: (props: LeftSidebarLinkProps) => React.Node,
    /** Whether we should show a badge marking new item content */
    newItemBadge?: boolean,
    /** Optional remove link click handler */
    onClickRemove?: Function,
    /** Optional remove button htmlAttributes */
    removeButtonHtmlAttributes?: Object,
    routerLink?: React.ComponentType<any>,
    routerProps?: Object,
    /** Whether the menu icon should be scaled to compensate for extra white space in SVG */
    scaleIcon?: boolean,
    /** Whether the current page is associated with the current link */
    selected?: boolean,
    /** Whether to show drop zone only when hovered over */
    showDropZoneOnHover?: boolean,
    /** Whether the tooltip should be shown */
    showTooltip?: boolean,
};

type MenuItem = {
    /** Sidebar Link Callout */
    callout?: Callout,
    /** flag to mark whether a menu item can be dropped on */
    canReceiveDrop?: boolean,
    /** class to add to menu element */
    className?: string,
    /** Whether the menu should render as collapsed or expanded */
    collapsed?: boolean,
    /** Ref for parent to access drop target */
    dropTargetRef?: { current: null | HTMLDivElement },
    /** Optional HTML attributes to append to menu item */
    htmlAttributes?: Object,
    /** React element or component representing an svg icon */
    iconComponent?: ?React.ComponentType<any>,
    /** React component representing an svg icon */
    iconElement?: ?React.Element<any>,
    /** Unique identifier for menu item */
    id: string,
    /** Sub menu items for the top-level menu */
    menuItems?: Array<SubMenuItem>,
    /** Localized text string to use for individual menu items */
    message: string,
    /** Optional left side bar link renderer. Defaults to defaultNavLinkRenderer */
    navLinkRenderer?: (props: LeftSidebarLinkProps) => React.Node,
    /** Whether we should show a badge marking new item content */
    newItemBadge?: boolean,
    /** Optional remove link click handler */
    onClickRemove?: Function,
    /** handler for when a user clicks on the toggleable menu item UI element */
    onToggleCollapse?: Function,
    placeholder?: string,
    /** Optional remove button htmlAttributes */
    removeButtonHtmlAttributes?: Object,
    routerLink?: React.ComponentType<any>,
    routerProps?: Object,
    /** Whether the menu icon should be scaled to compensate for extra white space in SVG */
    scaleIcon?: boolean,
    /** Whether the current page is associated with the current link */
    selected?: boolean,
    /** Whether child icons of this menu item should be shown */
    showChildIcons?: boolean,
    /** Whether to show drop zone only when hovered over */
    showDropZoneOnHover?: boolean,
    /** Whether to show a loading indicator on the list */
    showLoadingIndicator?: boolean,
    /** Whether the tooltip should be shown */
    showTooltip?: boolean,
};

type LeftSidebarProps = {
    /** Custom classname(s) */
    className?: string,
    /** HTML attributes for use with the copyright footer */
    copyrightFooterProps?: Object,
    /** Theme object specifying primary/secondary colors, and highlighting */
    customTheme?: Object,
    /** HTML attributes associated with this container */
    htmlAttributes?: Object,
    /** Text for the footer indicator */
    indicatorText?: string,
    /** Properties associated with InstantLogin component */
    instantLoginProps?: Object,
    /** Set the drag mode of the sidebar? */
    isDragging?: boolean,
    /** Determine if session is an instant login session or not */
    isInstantLoggedIn?: boolean,
};

type Props = {
    /** Optional properties defining selected items, customThemes, HTML attributes, and copyright text */
    leftSidebarProps: LeftSidebarProps,
    /** Contents for the menu. Allows for two levels of nesting */
    menuItems: Array<MenuItem>,
};

type State = {
    isScrollableAbove: boolean,
    isScrollableBelow: boolean,
    isScrolling: boolean,
};

class LeftSidebar extends React.Component<Props, State> {
    static defaultProps = {
        leftSidebarProps: {},
        menuItems: [],
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            isScrollableAbove: false,
            isScrollableBelow: false,
            isScrolling: false,
        };
    }

    componentDidUpdate() {
        if (!this.elScrollableList) {
            return;
        }

        const overflow = this.calculateOverflow(this.elScrollableList);

        /**
         * recalculate overflow when dropdown is visible and new collabs are added
         * This will not go into an infinite loop because we check for changes in local component state
         */
        if (
            overflow.isScrollableAbove !== this.state.isScrollableAbove ||
            overflow.isScrollableBelow !== this.state.isScrollableBelow
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(overflow);
        }
    }

    onListScroll = () => {
        this.changeIsScrollingState();
        this.throttledCheckAndChangeScrollShadows();
    };

    getIcon(
        iconElement?: ?React.Element<any>,
        IconComponent?: ?React.ComponentType<any>, // eslint-disable-line
        customTheme?: Object = {},
        selected?: boolean,
        scaleIcon?: boolean,
    ) {
        const wrapperClass = scaleIcon ? 'scaled-icon' : '';

        if (iconElement) {
            return <LeftSidebarIconWrapper className={wrapperClass}>{iconElement}</LeftSidebarIconWrapper>;
        }
        if (IconComponent) {
            return (
                <LeftSidebarIconWrapper className={wrapperClass}>
                    <IconComponent
                        color={selected && customTheme.secondaryColor ? customTheme.secondaryColor : bdlBoxBlue}
                        selected={selected}
                    />
                </LeftSidebarIconWrapper>
            );
        }

        return null;
    }

    getNewItemBadge(newItemBadge?: boolean, customTheme?: Object = {}) {
        const { secondaryColor } = customTheme;

        return newItemBadge ? <NewItemsIndicator customColor={secondaryColor} /> : null;
    }

    getNavList(
        headerLinkProps: MenuItem,
        leftSidebarProps: LeftSidebarProps,
        showLoadingIndicator?: boolean,
        onToggleCollapse?: ?Function,
    ) {
        const {
            canReceiveDrop = false,
            className = '',
            collapsed,
            dropTargetRef,
            id,
            menuItems,
            placeholder,
            showDropZoneOnHover,
        } = headerLinkProps;

        const heading = onToggleCollapse ? (
            <NavListCollapseHeader onToggleCollapse={onToggleCollapse}>
                {this.getNavLink(headerLinkProps, leftSidebarProps)}
            </NavListCollapseHeader>
        ) : (
            this.getNavLink(headerLinkProps, leftSidebarProps)
        );

        const placeholderEl =
            (menuItems && menuItems.length) || showLoadingIndicator ? null : (
                <div className="placeholder">{placeholder}</div>
            );

        const classes = classNames('left-sidebar-list', className, {
            'is-loading-empty': showLoadingIndicator && menuItems && menuItems.length === 0,
            'is-loading': showLoadingIndicator && menuItems && menuItems.length > 0,
            'lsb-scrollable-shadow-top': this.state.isScrollableAbove,
            'lsb-scrollable-shadow-bottom': this.state.isScrollableBelow,
        });

        const ulProps = onToggleCollapse
            ? {
                  onScroll: this.onListScroll,
                  ref: elScrollableList => {
                      this.elScrollableList = elScrollableList;
                  },
              }
            : {};

        const builtNavList = (
            <NavList
                className={classes}
                collapsed={collapsed}
                heading={heading}
                placeholder={placeholderEl}
                key={`list-${id}`}
                ulProps={ulProps}
            >
                {(menuItems && menuItems.map(props => this.getNavLink(props, leftSidebarProps))) || null}
            </NavList>
        );

        return canReceiveDrop ? (
            <LeftSidebarDropWrapper
                isDragging={leftSidebarProps.isDragging}
                dropTargetRef={dropTargetRef}
                showDropZoneOnHover={showDropZoneOnHover}
            >
                {builtNavList}
            </LeftSidebarDropWrapper>
        ) : (
            builtNavList
        );
    }

    getNavLink(props: MenuItem | SubMenuItem, leftSidebarProps: LeftSidebarProps) {
        const {
            callout,
            canReceiveDrop = false,
            className = '',
            dropTargetRef,
            htmlAttributes,
            iconComponent,
            iconElement,
            id,
            message,
            navLinkRenderer,
            newItemBadge,
            onClickRemove,
            removeButtonHtmlAttributes,
            routerLink,
            routerProps,
            scaleIcon,
            selected = false,
            showTooltip,
            showDropZoneOnHover,
        } = props;

        const linkClassNames = classNames('left-sidebar-link', className, {
            'is-selected': selected,
        });

        const linkProps = {
            callout,
            className: linkClassNames,
            customTheme: leftSidebarProps.customTheme,
            onClickRemove,
            htmlAttributes,
            icon: this.getIcon(iconElement, iconComponent, leftSidebarProps.customTheme, selected, scaleIcon),
            isScrolling: this.state.isScrolling,
            message,
            newItemBadge: this.getNewItemBadge(newItemBadge, leftSidebarProps.customTheme),
            removeButtonHtmlAttributes,
            routerLink,
            routerProps,
            selected,
            showTooltip,
        };

        const builtLink = navLinkRenderer ? navLinkRenderer(linkProps) : defaultNavLinkRenderer(linkProps);

        // Check for menu items on links so we don't double-highlight groups
        return canReceiveDrop && !props.menuItems ? (
            <LeftSidebarDropWrapper
                isDragging={leftSidebarProps.isDragging}
                dropTargetRef={dropTargetRef}
                key={`link-${id}`}
                showDropZoneOnHover={showDropZoneOnHover}
            >
                {builtLink}
            </LeftSidebarDropWrapper>
        ) : (
            <React.Fragment key={`link-${id}`}>{builtLink}</React.Fragment>
        );
    }

    calculateOverflow(elem: HTMLElement) {
        const isScrollableAbove = elem.scrollTop > 0;
        const isScrollableBelow = elem.scrollTop < elem.scrollHeight - elem.clientHeight;
        return {
            isScrollableAbove,
            isScrollableBelow,
        };
    }

    checkAndChangeScrollShadows = () => {
        if (this.elScrollableList) {
            this.setState(this.calculateOverflow(this.elScrollableList));
        }
    };

    changeIsScrollingState = () => {
        if (!this.state.isScrolling) {
            this.setState({
                isScrolling: true,
            });
        }

        this.debouncedTurnOffScrollingState();
    };

    turnOffScrollingState = () => {
        this.setState({
            isScrolling: false,
        });
    };

    debouncedTurnOffScrollingState = debounce(this.turnOffScrollingState, 100);

    elScrollableList: ?HTMLElement;

    throttledCheckAndChangeScrollShadows = throttle(this.checkAndChangeScrollShadows, 50);

    render() {
        const { leftSidebarProps, menuItems } = this.props;
        const className = leftSidebarProps.className || '';
        const navSidebarProps = leftSidebarProps.htmlAttributes || {};
        const instantLoginProps = leftSidebarProps.instantLoginProps || {};

        const preparedMenu = menuItems.map((props, key) => {
            if (props.menuItems) {
                if (props.onToggleCollapse) {
                    const { collapsed, showLoadingIndicator } = props;

                    return (
                        <LoadingIndicatorWrapper
                            className="favorites-loading-wrapper"
                            crawlerPosition="top"
                            isLoading={showLoadingIndicator && !collapsed}
                            key={`loading-indicator-${key}`}
                        >
                            {this.getNavList(props, leftSidebarProps, showLoadingIndicator, props.onToggleCollapse)}
                        </LoadingIndicatorWrapper>
                    );
                }

                return this.getNavList(props, leftSidebarProps);
            }

            return this.getNavLink(props, leftSidebarProps);
        });

        return (
            <NavSidebar className={`left-sidebar ${className}`} {...navSidebarProps}>
                {leftSidebarProps.isInstantLoggedIn ? <InstantLogin {...instantLoginProps} /> : null}
                <div className="left-sidebar-container">{preparedMenu}</div>
                <CopyrightFooter linkProps={leftSidebarProps.copyrightFooterProps} />
                {leftSidebarProps.indicatorText ? (
                    <FooterIndicator indicatorText={leftSidebarProps.indicatorText} />
                ) : null}
            </NavSidebar>
        );
    }
}

export default LeftSidebar;
