import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';

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

const positions = {
    [TooltipPosition.BOTTOM_CENTER]: {
        attachment: 'top center',
        targetAttachment: 'bottom center',
    },
    [TooltipPosition.BOTTOM_LEFT]: {
        attachment: 'top right',
        targetAttachment: 'bottom right',
    },
    [TooltipPosition.BOTTOM_RIGHT]: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
    },
    [TooltipPosition.MIDDLE_LEFT]: {
        attachment: 'middle right',
        targetAttachment: 'middle left',
    },
    [TooltipPosition.MIDDLE_RIGHT]: {
        attachment: 'middle left',
        targetAttachment: 'middle right',
    },
    [TooltipPosition.TOP_CENTER]: {
        attachment: 'bottom center',
        targetAttachment: 'top center',
    },
    [TooltipPosition.TOP_LEFT]: {
        attachment: 'bottom right',
        targetAttachment: 'top right',
    },
    [TooltipPosition.TOP_RIGHT]: {
        attachment: 'bottom left',
        targetAttachment: 'top left',
    },
};

export interface TooltipProps {
    bodyElement?: HTMLElement;
    /** A React element to put the tooltip on */
    children: React.ReactNode;
    /** A CSS class for the tooltip */
    className?: string;
    /** Whether to constrain the tooltip to the element's scroll parent. Defaults to `false` */
    constrainToScrollParent: boolean;
    /** Whether to constrain the tooltip to window. Defaults to `true` */
    constrainToWindow: boolean;
    /** Forces the tooltip to be disabled irrespecitve of it's shown state. Defaults to `false` */
    isDisabled: boolean;
    /** Forces the tooltip to be shown or hidden (useful for errors) */
    isShown?: boolean;
    /** Whether to add tabindex=0.  Defaults to `true` */
    isTabbable?: boolean;
    /** Function called if the user manually dismisses the tooltip - only applies if showCloseButton is true */
    onDismiss?: () => void;
    /** Where to position the tooltip relative to the wrapped component */
    position: TooltipPosition;
    /** Shows an X button to close the tooltip. Useful when tooltips are force shown with the isShown prop. */
    showCloseButton?: boolean;
    /** Text to show in the tooltip */
    text?: React.ReactNode;
    /** Tooltip theme */
    theme: TooltipTheme;
}

type State = {
    isShown: boolean;
    wasClosedByUser: boolean;
};

class Tooltip extends React.Component<TooltipProps, State> {
    static defaultProps = {
        constrainToScrollParent: false,
        constrainToWindow: true,
        isDisabled: false,
        position: TooltipPosition.TOP_CENTER,
        theme: TooltipTheme.DEFAULT,
    };

    constructor(props: TooltipProps) {
        super(props);

        this.state = { isShown: !!props.isShown, wasClosedByUser: false };
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

        const showTooltip = isShown && !this.state.wasClosedByUser;

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
            position,
            showCloseButton,
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
        const tetherPosition = positions[position];
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

        const classes = classNames('tooltip', className, {
            'is-callout': theme === TooltipTheme.CALLOUT,
            'is-error': theme === TooltipTheme.ERROR,
            'with-close-button': withCloseButton,
        });

        // Typescript defs seem busted for older versions of react-tether
        const tetherProps = {
            attachment: tetherPosition.attachment,
            bodyElement: bodyEl,
            classPrefix: 'tooltip',
            constraints,
            enabled: showTooltip,
            targetAttachment: tetherPosition.targetAttachment,
        };

        return (
            <TetherComponent ref={this.tetherRef} {...tetherProps}>
                {React.cloneElement(React.Children.only(children) as React.ReactElement, componentProps)}
                {showTooltip && (
                    <div className={classes} id={this.tooltipID} role="tooltip">
                        {text}
                        {withCloseButton && (
                            <PlainButton className="tooltip-close-button" onClick={this.closeTooltip}>
                                <IconClose className="bdl-Tooltip-iconClose" width={14} height={14} />
                            </PlainButton>
                        )}
                    </div>
                )}
            </TetherComponent>
        );
    }
}

export default Tooltip;
