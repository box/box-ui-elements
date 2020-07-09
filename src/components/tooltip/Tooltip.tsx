import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';

import TetherPosition from '../../common/tether-positions';
import IconClose from '../../icon/fill/X16';
import PlainButton from '../plain-button';

import './Tooltip.scss';

export enum TooltipTheme {
    CALLOUT = 'callout',
    DEFAULT = 'default',
    ERROR = 'error',
}

export enum TooltipPosition {
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    MIDDLE_LEFT = 'middle-left',
    MIDDLE_RIGHT = 'middle-right',
    TOP_CENTER = 'top-center',
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
}

export type TooltipCustomPosition = {
    attachment: TetherPosition;
    targetAttachment: TetherPosition;
};

const positions = {
    [TooltipPosition.BOTTOM_CENTER]: {
        attachment: TetherPosition.TOP_CENTER,
        targetAttachment: TetherPosition.BOTTOM_CENTER,
    },
    [TooltipPosition.BOTTOM_LEFT]: {
        attachment: TetherPosition.TOP_RIGHT,
        targetAttachment: TetherPosition.BOTTOM_RIGHT,
    },
    [TooltipPosition.BOTTOM_RIGHT]: {
        attachment: TetherPosition.TOP_LEFT,
        targetAttachment: TetherPosition.BOTTOM_LEFT,
    },
    [TooltipPosition.MIDDLE_LEFT]: {
        attachment: TetherPosition.MIDDLE_RIGHT,
        targetAttachment: TetherPosition.MIDDLE_LEFT,
    },
    [TooltipPosition.MIDDLE_RIGHT]: {
        attachment: TetherPosition.MIDDLE_LEFT,
        targetAttachment: TetherPosition.MIDDLE_RIGHT,
    },
    [TooltipPosition.TOP_CENTER]: {
        attachment: TetherPosition.BOTTOM_CENTER,
        targetAttachment: TetherPosition.TOP_CENTER,
    },
    [TooltipPosition.TOP_LEFT]: {
        attachment: TetherPosition.BOTTOM_RIGHT,
        targetAttachment: TetherPosition.TOP_RIGHT,
    },
    [TooltipPosition.TOP_RIGHT]: {
        attachment: TetherPosition.BOTTOM_LEFT,
        targetAttachment: TetherPosition.TOP_LEFT,
    },
};

export type DefaultTooltipProps = {
    /** Whether to constrain the tooltip to the element's scroll parent. Defaults to `false` */
    constrainToScrollParent: boolean;
    /** Whether to constrain the tooltip to window. Defaults to `true` */
    constrainToWindow: boolean;
    /** Forces the tooltip to be disabled irrespecitve of it's shown state. Defaults to `false` */
    isDisabled: boolean;
    /** Where to position the tooltip relative to the wrapped component */
    position: TooltipPosition | TooltipCustomPosition;
    /** Tooltip theme */
    theme: TooltipTheme;
};

export type TooltipProps = {
    /** An HTML element to append the tooltip container into (otherwise appends to body) */
    bodyElement?: HTMLElement;
    /** A React element to put the tooltip on */
    children: React.ReactChild;
    /** A CSS class for the tooltip */
    className?: string;
    /** Forces the tooltip to be shown or hidden (useful for errors) */
    isShown?: boolean;
    /** Whether to add tabindex=0.  Defaults to `true` */
    isTabbable?: boolean;
    /** A string of the form 'vert-offset horiz-offset' which controls positioning */
    offset?: string;
    /** Function called if the user manually dismisses the tooltip - only applies if showCloseButton is true */
    onDismiss?: () => void;
    /** Shows an X button to close the tooltip. Useful when tooltips are force shown with the isShown prop. */
    showCloseButton?: boolean;
    /** stop click|keypress event bubbling */
    stopBubble?: boolean;
    /** Text to show in the tooltip */
    text?: React.ReactNode;
} & Partial<DefaultTooltipProps>;

type State = {
    isShown: boolean;
    hasRendered: boolean;
    wasClosedByUser: boolean;
};

class Tooltip extends React.Component<TooltipProps, State> {
    static defaultProps: DefaultTooltipProps = {
        constrainToScrollParent: false,
        constrainToWindow: true,
        isDisabled: false,
        position: TooltipPosition.TOP_CENTER,
        theme: TooltipTheme.DEFAULT,
    };

    constructor(props: TooltipProps) {
        super(props);

        this.state = { isShown: !!props.isShown, hasRendered: false, wasClosedByUser: false };
    }

    componentDidMount() {
        this.setState({ hasRendered: true });
    }

    tooltipID = uniqueId('tooltip');

    tetherRef = React.createRef<TetherComponent>();

    // Instance API: Forces the radar to be repositioned
    position = () => {
        if (this.tetherRef.current && this.isShown()) {
            this.tetherRef.current.position();
        }
    };

    closeTooltip = () => {
        const { onDismiss } = this.props;
        this.setState({ wasClosedByUser: true });
        if (onDismiss) {
            onDismiss();
        }
    };

    fireChildEvent = (type: string, event: React.SyntheticEvent<HTMLElement>) => {
        const { children } = this.props;
        const handler = (children as React.ReactElement).props[type];
        if (handler) {
            handler(event);
        }
    };

    handleTooltipEvent = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    };

    handleMouseEnter = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isShown: true });
        this.fireChildEvent('onMouseEnter', event);
    };

    handleMouseLeave = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isShown: false });
        this.fireChildEvent('onMouseLeave', event);
    };

    handleFocus = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isShown: true });
        this.fireChildEvent('onFocus', event);
    };

    handleBlur = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isShown: false });
        this.fireChildEvent('onBlur', event);
    };

    handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape') {
            this.setState({ isShown: false });
        }
        this.fireChildEvent('onKeyDown', event);
    };

    isControlled = () => {
        const { isShown: isShownProp } = this.props;
        return typeof isShownProp !== 'undefined';
    };

    isShown = () => {
        const { isShown: isShownProp } = this.props;
        const isControlled = this.isControlled();

        const isShown = isControlled ? isShownProp : this.state.isShown;

        const showTooltip = isShown && !this.state.wasClosedByUser && this.state.hasRendered;

        return showTooltip;
    };

    render() {
        const {
            bodyElement,
            children,
            className,
            constrainToScrollParent,
            constrainToWindow,
            isDisabled,
            isTabbable = true,
            offset,
            position = TooltipPosition.TOP_CENTER,
            showCloseButton,
            stopBubble,
            text,
            theme,
        } = this.props;

        // If the tooltip is disabled just render the children
        if (isDisabled) {
            return React.Children.only(children);
        }

        const isControlled = this.isControlled();
        const showTooltip = this.isShown();

        const withCloseButton = showCloseButton && isControlled;
        const tetherPosition = typeof position === 'string' ? positions[position] : position;
        const constraints = [];
        const componentProps: {
            [key: string]:
                | string
                | ((event: React.SyntheticEvent<HTMLElement>) => void)
                | ((event: React.KeyboardEvent<HTMLElement>) => void);
        } = {};

        if (constrainToScrollParent) {
            constraints.push({
                to: 'scrollParent',
                attachment: 'together',
            });
        }
        if (constrainToWindow) {
            constraints.push({
                to: 'window',
                attachment: 'together',
            });
        }

        if (showTooltip) {
            componentProps['aria-describedby'] = this.tooltipID;
            if (theme === TooltipTheme.ERROR) {
                componentProps['aria-errormessage'] = this.tooltipID;
            }
        }
        if (!isControlled) {
            componentProps.onBlur = this.handleBlur;
            componentProps.onFocus = this.handleFocus;
            componentProps.onKeyDown = this.handleKeyDown;
            componentProps.onMouseEnter = this.handleMouseEnter;
            componentProps.onMouseLeave = this.handleMouseLeave;

            if (isTabbable) {
                componentProps.tabIndex = '0';
            }
        }

        const bodyEl = bodyElement instanceof HTMLElement ? bodyElement : document.body;

        const classes = classNames('tooltip', 'bdl-Tooltip', className, {
            'is-callout': theme === TooltipTheme.CALLOUT,
            'is-error': theme === TooltipTheme.ERROR,
            'with-close-button': withCloseButton,
        });

        const tetherProps: {
            attachment: TetherPosition;
            bodyElement: HTMLElement;
            classPrefix: string;
            constraints: {};
            enabled: boolean | undefined;
            targetAttachment: TetherPosition;
            offset?: string;
        } = {
            attachment: tetherPosition.attachment,
            bodyElement: bodyEl,
            classPrefix: 'tooltip',
            constraints,
            enabled: showTooltip,
            targetAttachment: tetherPosition.targetAttachment,
        };

        if (offset) {
            tetherProps.offset = offset;
        }

        const tooltipInner = (
            <>
                {text}
                {withCloseButton && (
                    <PlainButton className="tooltip-close-button" onClick={this.closeTooltip}>
                        <IconClose className="bdl-Tooltip-iconClose" width={14} height={14} />
                    </PlainButton>
                )}
            </>
        );

        const tooltip = stopBubble ? (
            <div
                className={classes}
                id={this.tooltipID}
                role="presentation"
                onClick={this.handleTooltipEvent}
                onContextMenu={this.handleTooltipEvent}
                onKeyPress={this.handleTooltipEvent}
            >
                <div role="tooltip" aria-live="polite">
                    {tooltipInner}
                </div>
            </div>
        ) : (
            <div className={classes} id={this.tooltipID} role="tooltip" aria-live="polite">
                {tooltipInner}
            </div>
        );

        return (
            <TetherComponent ref={this.tetherRef} {...tetherProps}>
                {React.cloneElement(React.Children.only(children) as React.ReactElement, componentProps)}
                {showTooltip && tooltip}
            </TetherComponent>
        );
    }
}

export default Tooltip;
