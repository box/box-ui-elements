import * as React from 'react';
import classNames from 'classnames';

import TabViewPrimitive, { TAB_KEY, TAB_PANEL_ROLE } from './TabViewPrimitive';

export interface TabViewProps {
    /** Tabs and their associated panel content */
    children: React.ReactNode;
    /** Custom class name applied to the tab view */
    className?: string;
    /** Index of the tab selected initially and when the tab view resets */
    defaultSelectedIndex: number;
    /** Whether tabs use the scrollable dynamic layout */
    isDynamic?: boolean;
    /** Callback invoked when the selected tab changes */
    onTabSelect?: (selectedIndex: number) => void;
}

interface TabViewState {
    focusedIndex: number;
    selectedIndex: number;
    showOutline: boolean;
}

class TabView extends React.Component<TabViewProps, TabViewState> {
    static defaultProps = {
        defaultSelectedIndex: 0,
        isDynamic: false,
    };

    constructor(props: TabViewProps) {
        super(props);

        this.state = {
            focusedIndex: props.defaultSelectedIndex,
            showOutline: false,
            selectedIndex: props.defaultSelectedIndex,
        };
    }

    componentDidUpdate(prevProps: TabViewProps) {
        const { defaultSelectedIndex } = this.props;
        if (prevProps.defaultSelectedIndex !== defaultSelectedIndex) {
            this.resetActiveTab();
        }
    }

    getActiveDocElement = () => document.activeElement;

    resetActiveTab = () => {
        this.setState({
            focusedIndex: this.props.defaultSelectedIndex,
            selectedIndex: this.props.defaultSelectedIndex,
        });
    };

    resetFocusedTab = () => {
        this.setState({ focusedIndex: this.state.selectedIndex });
    };

    handleOnTabSelect = (selectedIndex: number): void =>
        this.setState({ selectedIndex }, () => {
            const { onTabSelect } = this.props;

            if (onTabSelect) {
                onTabSelect(this.state.selectedIndex);
            }
        });

    handleOnTabFocus = (index: number) => this.setState({ focusedIndex: index });

    // By default the outline is set to none when tabpanel is focused. This is so that
    // when clicking into it, it doesn't outline it.
    // However, for accessibility, when tabbing into and out of the tabpanel, the focus
    // is pretty important to show the user what is being focused. By adding this class,
    // we can specify an outline for the focus pseudo state.
    handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const activeElement = this.getActiveDocElement();
        const isTabPanelFocused = activeElement && activeElement.getAttribute('role') === TAB_PANEL_ROLE;
        const isTabPanelFocusedWithTabKey = isTabPanelFocused && event.key === TAB_KEY;

        if (isTabPanelFocusedWithTabKey) {
            this.setState({ showOutline: true });
        } else if (!isTabPanelFocused && this.state.showOutline) {
            this.setState({ showOutline: false });
        }
    };

    render() {
        const { children, className, isDynamic } = this.props;
        const { focusedIndex, selectedIndex, showOutline } = this.state;

        return (
            <TabViewPrimitive
                className={classNames(className, {
                    'show-outline': showOutline,
                })}
                focusedIndex={focusedIndex}
                isDynamic={isDynamic}
                onKeyUp={this.handleKeyUp}
                onTabFocus={this.handleOnTabFocus}
                onTabSelect={this.handleOnTabSelect}
                resetActiveTab={this.resetActiveTab}
                resetFocusedTab={this.resetFocusedTab}
                selectedIndex={selectedIndex}
            >
                {children}
            </TabViewPrimitive>
        );
    }
}

export default TabView;
