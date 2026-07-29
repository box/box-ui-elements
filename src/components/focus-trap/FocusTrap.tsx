import * as React from 'react';
import tabbable from 'tabbable';
import classNames from 'classnames';

export interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Contents whose focus should be trapped */
    children: React.ReactNode;
    /** Custom class name for the focus trap wrapper */
    className?: string;
    /** Function to get the ref to the focus trap wrapper element */
    getRef?: Function;
    /** Function to handle keyboard input passed in from parent component. e.g. close overlay on Escape */
    handleOverlayKeyDown?: Function;
    /** Whether to focus the first tabbable child when mounted */
    shouldDefaultFocus?: boolean;
    /** Whether to display the focus outline on the wrapper */
    shouldOutlineFocus?: boolean;
}

class FocusTrap extends React.Component<FocusTrapProps> {
    componentDidMount() {
        if (this.props.shouldDefaultFocus) {
            setTimeout(() => {
                this.previousFocusEl = document.activeElement as HTMLElement | null;
                this.focusFirstElement();
            }, 0);
        } else {
            setTimeout(() => {
                if (this.el) {
                    this.el.focus();
                }
            }, 0);
        }
    }

    componentWillUnmount() {
        setTimeout(() => {
            if (this.previousFocusEl) {
                this.previousFocusEl.focus();
            }
        }, 0);
    }

    el: HTMLDivElement | null | undefined;

    previousFocusEl: HTMLElement | null | undefined;

    trapEl: HTMLElement | null | undefined;

    /**
     * Focus the first tabbable element
     */
    focusFirstElement = () => {
        if (!this.el) {
            return;
        }

        const tabbableEls = tabbable(this.el);

        // There are three trap-related elements, including first element.
        // If there are 3 or fewer tabbable elements, that means there are no
        // tabbable children, so focus on the trap element instead.
        if (tabbableEls.length > 3) {
            tabbableEls[1].focus();
        } else if (this.trapEl) {
            this.trapEl.focus();
        }
    };

    /**
     * Focus the last tabbable element
     */
    focusLastElement = () => {
        if (!this.el) {
            return;
        }

        const tabbableEls = tabbable(this.el);

        // There are three trap-related elements, including the last two elements.
        // If there are 3 or fewer tabbable elements, that means there are no
        // tabbable children, so focus on the trap element instead.
        if (tabbableEls.length > 3) {
            tabbableEls[tabbableEls.length - 3].focus();
        } else if (this.trapEl) {
            this.trapEl.focus();
        }
    };

    handleElKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const { handleOverlayKeyDown } = this.props;
        if (this.el === document.activeElement && event.key === 'Tab') {
            this.focusFirstElement();
            event.stopPropagation();
            event.preventDefault();
        }

        if (handleOverlayKeyDown) {
            handleOverlayKeyDown(event);
        }
    };

    handleTrapElKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Tab') {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
    };

    render() {
        const {
            children,
            className,
            getRef,
            handleOverlayKeyDown: _handleOverlayKeyDown, // eslint-disable-line @typescript-eslint/no-unused-vars
            shouldDefaultFocus: _shouldDefaultFocus, // eslint-disable-line @typescript-eslint/no-unused-vars
            shouldOutlineFocus,
            ...rest
        } = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                ref={ref => {
                    this.el = ref;
                    if (getRef) {
                        getRef(ref);
                    }
                }}
                className={classNames(className, {
                    'should-outline-focus': shouldOutlineFocus,
                })}
                onKeyDown={this.handleElKeyDown}
                {...rest}
            >
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <i aria-hidden onFocus={this.focusLastElement} tabIndex={0} />
                {children}
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <i aria-hidden onFocus={this.focusFirstElement} tabIndex={0} />
                {/* in case children doesn't contain any focusable elements, focus on trap */}
                <i
                    ref={ref => {
                        this.trapEl = ref;
                    }}
                    aria-hidden
                    onKeyDown={this.handleTrapElKeyDown}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex={0}
                />
            </div>
        );
    }
}

export default FocusTrap;
