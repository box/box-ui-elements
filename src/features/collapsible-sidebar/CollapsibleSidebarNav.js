/**
 * @flow
 * @file Scroll container for lists to be used within CollapsibleSidebar component.
 * @author Box
 *
 * A Scroll container for lists to be used within CollapsibleSidebar component.
 * Applies scroll shadow in the container based on scroll position.
 */

import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Scrollbar from 'react-scrollbars-custom';
import styled from 'styled-components';

import type { ScrollState } from 'react-scrollbars-custom';
import CollapsibleSidebarContext from './CollapsibleSidebarContext';
import { getScrollShadowClassName } from './utils/scrollShadow';

const StyledScrollThumb = styled.div`
    background: ${props => props.theme.primary.foreground};
    opacity: 0;
    transition: opacity 0.15s;

    .scroll-shadow-container:hover &,
    &.dragging {
        opacity: 0.5;
    }
`;

// The following values match the derived values from scrollShadow.scss
const StyledScrollContainer = styled.div`
    &::before {
        box-shadow: 0 6px 6px -2px ${props => props.theme.primary.scrollShadowRgba};
    }

    &::after {
        box-shadow: 0 -6px 6px -2px ${props => props.theme.primary.scrollShadowRgba};
    }
`;

type Props = {
    /** Primary content */
    children?: React.Node,

    /** Additional classes */
    className?: string,
    /** Props for react-scrollbars-custom Scrollbar component */
    customScrollBarProps?: {},
};

type State = {
    isScrolling: boolean,
    scrollShadowClassName?: string,
};

class CollapsibleSidebarNav extends React.Component<Props, State> {
    scrollRef: {
        current: null | { clientHeight: number, scrollHeight: number, scrollTop: number },
    } = React.createRef();

    constructor(props: Props) {
        super(props);

        this.state = {
            isScrolling: false,
        };
    }

    componentDidMount() {
        this.setScrollShadowState();
    }

    turnOffScrollingState = () => {
        this.setState({
            isScrolling: false,
        });
    };

    // If there hasn't been an update to isScrolling in 100ms, it'll be set to false.
    // eslint-disable-next-line react/sort-comp
    debouncedTurnOffScrollingState = debounce(this.turnOffScrollingState, 100);

    onScrollHandler = () => {
        if (!this.scrollRef.current) {
            return;
        }

        const { scrollHeight, clientHeight, scrollTop } = this.scrollRef.current;
        const scrollShadowClassName = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);

        this.setState({
            isScrolling: true,
            scrollShadowClassName,
        });

        this.debouncedTurnOffScrollingState();
    };

    onUpdateHandler = (scrollValues: ScrollState, prevScrollValues: ScrollState) => {
        const { clientHeight, contentScrollHeight } = scrollValues;
        const { clientHeight: prevClientHeight, contentScrollHeight: prevContentScrollHeight } = prevScrollValues;
        if (clientHeight !== prevClientHeight || contentScrollHeight !== prevContentScrollHeight) {
            this.setScrollShadowState();
        }
    };

    setScrollShadowState = () => {
        if (!this.scrollRef.current) {
            return;
        }

        const { scrollShadowClassName } = this.state;

        const { scrollHeight, clientHeight, scrollTop } = this.scrollRef.current;

        const newScrollShadowClassName = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);

        if (scrollShadowClassName !== newScrollShadowClassName) {
            this.setState({ scrollShadowClassName: newScrollShadowClassName });
        }
    };

    // sets onScrollHandler to true for a maximum of once every 50ms.
    throtteldOnScrollHandler = throttle(this.onScrollHandler, 50);

    throttleOnUpdateHandler = throttle(this.onUpdateHandler, 50);

    render() {
        const { className, children, customScrollBarProps = {} } = this.props;
        const { isScrolling, scrollShadowClassName } = this.state;

        const classes = classNames('bdl-CollapsibleSidebar-nav', className, {
            'is-scrolling': isScrolling,
        });

        return (
            <CollapsibleSidebarContext.Provider value={{ isScrolling }}>
                <Scrollbar
                    ref={this.scrollRef}
                    className={scrollShadowClassName}
                    noScrollX
                    onScroll={this.throtteldOnScrollHandler}
                    onUpdate={this.throttleOnUpdateHandler}
                    renderer={props => {
                        const { elementRef, ...restProps } = props;
                        return <StyledScrollContainer {...restProps} ref={elementRef} />;
                    }}
                    style={{ height: 'auto', width: '100%', flexGrow: 1 }}
                    thumbYProps={{
                        renderer: renderProps => {
                            const { elementRef, style, ...restProps } = renderProps;
                            if (style && style.background) {
                                delete style.background; // remove the hardcoded valued so that the theme value can be assigned
                            }
                            return <StyledScrollThumb style={style} {...restProps} ref={elementRef} />;
                        },
                    }}
                    trackYProps={{
                        style: { background: 'none', top: '0', height: '100%', width: '8px', marginRight: '1px' },
                    }}
                    {...customScrollBarProps}
                >
                    <div className={classes}>{children}</div>
                </Scrollbar>
            </CollapsibleSidebarContext.Provider>
        );
    }
}

export default CollapsibleSidebarNav;
