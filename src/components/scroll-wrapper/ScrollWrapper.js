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
    /** Optional prop to set the shadow size, like background-size ('cover' or 'contain') */
    shadowSize: 'cover' | 'contain',
};

type State = {
    shouldShowBottomScrollShadow: boolean,
    shouldShowTopScrollShadow: boolean,
};

class ScrollWrapper extends React.Component<Props, State> {
    static defaultProps = {
        scrollRefFn: noop,
        shadowSize: 'cover',
    };

    state = {
        shouldShowTopScrollShadow: false,
        shouldShowBottomScrollShadow: false,
    };

    constructor(props: Props) {
        super(props);

        this.observer = new MutationObserver(this.throttledOnContentScroll);
    }

    componentDidMount = () => {
        const newState = this.getScrollShadowState();
        this.setState(newState);

        if (this.scrollRef) {
            this.scrollRef.addEventListener('transitionend', this.throttledOnContentScroll);

            // Apparently, flow only allows for one truthy check per command, so I have to either:
            // 1) duplicate this check per call, or
            // 2) nest if checks (_slightly more performant_)
            if (this.scrollRef) {
                this.observer.observe(this.scrollRef, {
                    attributes: true,
                    childlist: true,
                    subtree: true,
                });
            }
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
        this.setState(newState);
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

    observer: MutationObserver;

    scrollRef: ?HTMLDivElement = null;

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
