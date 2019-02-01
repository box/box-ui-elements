// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';

import './ScrollWrapper.scss';

type Props = {
    /** Contents for this element */
    children: React.Node,
    /** Optional class name(s) to pass thru to the component */
    className?: string,
    /** Optional function to get the scrollRef in parent components */
    scrollRefFn: (?HTMLElement) => void,
};

type State = {
    isScrollHeightEqualClientHeight: boolean,
    shouldShowBottomScrollShadow: boolean,
    shouldShowTopScrollShadow: boolean,
};

class ScrollWrapper extends React.Component<Props, State> {
    static defaultProps = {
        scrollRefFn: noop,
    };

    state = {
        shouldShowTopScrollShadow: false,
        shouldShowBottomScrollShadow: false,
        isScrollHeightEqualClientHeight: false,
    };

    componentDidMount = () => {
        const newState = this.getScrollShadowState();
        this.setState(newState);
    };

    onContentScroll = (): void => {
        const newState = this.getScrollShadowState();
        this.setState(newState);
    };

    onContentClick = (): void => {
        const newState = this.getClickShadowState();
        this.setState(newState);
    };

    /** Note: This will only get triggered if the child elements of ScrollWrapper do not have a stopPropagation method attached to their click events.
     * Also, asynchronous updates triggered by clicks will not fire this method.
     */
    getClickShadowState = () => {
        const { scrollTop, scrollHeight, clientHeight } = this.scrollRef || {};
        const newState = {};

        /**
         * This case handles when the scrollview does not have enough elements to scroll and a collapsible card was opened.
         */
        if (scrollTop === 0 && scrollHeight === clientHeight) {
            newState.shouldShowBottomScrollShadow = true;
            newState.isScrollHeightEqualClientHeight = true;
        }

        /**
         * This case handles when the scrollview has enough elements to scroll and a collapsible card was opened.
         */
        if (scrollTop === 0 && scrollHeight > clientHeight) {
            if (this.state.isScrollHeightEqualClientHeight) {
                newState.shouldShowBottomScrollShadow = false;
            }
            newState.isScrollHeightEqualClientHeight = false;
        }

        /**
         * This case handles when we have already partially scrolled and a collapsible card was opened.
         */
        if (scrollTop > 0) {
            if (scrollTop + clientHeight === scrollHeight) {
                newState.shouldShowBottomScrollShadow = true;
            } else if (scrollHeight > clientHeight) {
                newState.shouldShowBottomScrollShadow = false;
            }
        }

        return newState;
    };

    getScrollShadowState = () => {
        const { scrollTop, scrollHeight, clientHeight } = this.scrollRef || {};
        const newState = {};

        if (scrollTop > 0 && scrollTop < scrollHeight - clientHeight) {
            newState.shouldShowTopScrollShadow = true;
            newState.shouldShowBottomScrollShadow = true;
        }

        if (scrollTop === 0) {
            newState.shouldShowTopScrollShadow = false;
        }

        if (scrollTop < scrollHeight - clientHeight) {
            newState.shouldShowBottomScrollShadow = true;
        }

        if (scrollTop === scrollHeight - clientHeight) {
            newState.shouldShowBottomScrollShadow = false;
        }

        return newState;
    };

    scrollRef: ?HTMLDivElement = null;

    // Throttle to 10 fps
    throttledOnContentScroll = throttle(this.onContentScroll, 100);

    render() {
        const { children, className = '', scrollRefFn, ...rest } = this.props;
        const { shouldShowTopScrollShadow, shouldShowBottomScrollShadow } = this.state;

        const classes = classNames(`scroll-container`, className, {
            'is-showing-top-shadow': shouldShowTopScrollShadow,
            'is-showing-bottom-shadow': shouldShowBottomScrollShadow,
        });

        return (
            <div className={classes} {...rest}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
                <div
                    ref={el => {
                        this.scrollRef = el;
                        scrollRefFn(el);
                    }}
                    className="scroll-wrap-container"
                    onClick={this.onContentClick}
                    onScroll={this.throttledOnContentScroll}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export default ScrollWrapper;
