import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';

import './ScrollWrapper.scss';

export interface ScrollWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Contents for this element */
    children: React.ReactNode;
    /** Optional class name(s) for the outer container */
    className?: string;
    /** Function called with the scroll container element; defaults to a no-op */
    scrollRefFn: (element: HTMLElement | null) => void;
    /** Background size used for the scroll shadows; defaults to 'cover' */
    shadowSize: 'cover' | 'contain';
}

interface ScrollWrapperState {
    /** Whether to display the bottom scroll shadow */
    shouldShowBottomScrollShadow: boolean;
    /** Whether to display the top scroll shadow */
    shouldShowTopScrollShadow: boolean;
}

class ScrollWrapper extends React.Component<ScrollWrapperProps, ScrollWrapperState> {
    static readonly defaultProps = {
        scrollRefFn: noop,
        shadowSize: 'cover',
    };

    state = {
        shouldShowTopScrollShadow: false,
        shouldShowBottomScrollShadow: false,
    };

    constructor(props: ScrollWrapperProps) {
        super(props);

        this.observer = new MutationObserver(this.throttledOnContentScroll);
    }

    componentDidMount = () => {
        const newState = this.getScrollShadowState();
        this.setState(newState as ScrollWrapperState);

        const { scrollRef } = this;
        if (scrollRef) {
            scrollRef.addEventListener('transitionend', this.throttledOnContentScroll);
            this.observer.observe(scrollRef, {
                attributes: true,
                childlist: true,
                subtree: true,
            } as MutationObserverInit);
        }
    };

    componentWillUnmount() {
        this.observer.disconnect();

        if (this.scrollRef) {
            this.scrollRef.removeEventListener('transitionend', this.throttledOnContentScroll);
        }
    }

    onContentScroll = (): void => {
        const newState = this.getScrollShadowState();
        this.setState(newState as ScrollWrapperState);
    };

    getScrollShadowState = (): Partial<ScrollWrapperState> => {
        const { scrollTop, scrollHeight, clientHeight } = this.scrollRef || {};
        const newState: Partial<ScrollWrapperState> = {};

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

    observer: MutationObserver;

    scrollRef: HTMLDivElement | null = null;

    // Throttle to 10 fps
    throttledOnContentScroll = throttle(this.onContentScroll, 100);

    render() {
        const { children, className = '', scrollRefFn, shadowSize, ...rest } = this.props;
        const { shouldShowTopScrollShadow, shouldShowBottomScrollShadow } = this.state;

        const classes = classNames(`scroll-container`, className, {
            'is-showing-top-shadow': shouldShowTopScrollShadow,
            'is-showing-bottom-shadow': shouldShowBottomScrollShadow,
        });

        return (
            <div className={classes} {...rest}>
                <div
                    className={classNames('scroll-wrap-container', `style--${shadowSize}`)}
                    onScroll={this.throttledOnContentScroll}
                    ref={el => {
                        this.scrollRef = el;
                        scrollRefFn(el);
                    }}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export default ScrollWrapper;
