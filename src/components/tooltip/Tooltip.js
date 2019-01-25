// @flow
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import TetherComponent from 'react-tether';

import IconClose from '../../icons/general/IconClose';
import PlainButton from '../plain-button';

import './Tooltip.scss';

const BOTTOM_CENTER = 'bottom-center';
const BOTTOM_LEFT = 'bottom-left';
const BOTTOM_RIGHT = 'bottom-right';
const MIDDLE_LEFT = 'middle-left';
const MIDDLE_RIGHT = 'middle-right';
const TOP_CENTER = 'top-center';
const TOP_LEFT = 'top-left';
const TOP_RIGHT = 'top-right';

const CALLOUT_THEME = 'callout';
const DEFAULT_THEME = 'default';
const ERROR_THEME = 'error';

const positions = {
    [BOTTOM_CENTER]: {
        attachment: 'top center',
        targetAttachment: 'bottom center',
    },
    [BOTTOM_LEFT]: {
        attachment: 'top right',
        targetAttachment: 'bottom right',
    },
    [BOTTOM_RIGHT]: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
    },
    [MIDDLE_LEFT]: {
        attachment: 'middle right',
        targetAttachment: 'middle left',
    },
    [MIDDLE_RIGHT]: {
        attachment: 'middle left',
        targetAttachment: 'middle right',
    },
    [TOP_CENTER]: {
        attachment: 'bottom center',
        targetAttachment: 'top center',
    },
    [TOP_LEFT]: {
        attachment: 'bottom right',
        targetAttachment: 'top right',
    },
    [TOP_RIGHT]: {
        attachment: 'bottom left',
        targetAttachment: 'top left',
    },
};

export type Position =
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'middle-left'
    | 'middle-right'
    | 'top-center'
    | 'top-left'
    | 'top-right';

type Props = {
    bodyElement?: HTMLElement,
    /** A React element to put the tooltip on */
    children: React.Node,
    /** A CSS class for the tooltip */
    className?: string,
    /** Whether to constrain the tooltip to the element's scroll parent. Defaults to `false` */
    constrainToScrollParent: boolean,
    /** Whether to constrain the tooltip to window. Defaults to `true` */
    constrainToWindow: boolean,
    /** Forces the tooltip to be shown or hidden (useful for errors) */
    isShown?: boolean,
    /** Where to position the tooltip relative to the wrapped component */
    position: Position,
    /** Shows an X button to close the tooltip. Useful when tooltips are force shown with the isShown prop. */
    showCloseButton?: boolean,
    text: React.Node,
    /** Text to show in the tooltip */
    theme: 'callout' | 'default' | 'error',
};

type State = {
    isShown: boolean,
    wasClosedByUser: boolean,
};

class Tooltip extends React.Component<Props, State> {
    static defaultProps = {
        constrainToScrollParent: false,
        constrainToWindow: true,
        position: TOP_CENTER,
        theme: DEFAULT_THEME,
    };

    constructor(props: Props) {
        super(props);

        this.state = { isShown: !!props.isShown, wasClosedByUser: false };
    }

    tooltipID = uniqueId('tooltip');

    closeTooltip = () => {
        this.setState({ wasClosedByUser: true });
    };

    fireChildEvent = (type: string, event: SyntheticEvent<>) => {
        // $FlowFixMe
        const handler = this.props.children.props[type];
        if (handler) {
            handler(event);
        }
    };

    handleMouseEnter = (event: SyntheticEvent<>) => {
        this.setState({ isShown: true });
        this.fireChildEvent('onMouseEnter', event);
    };

    handleMouseLeave = (event: SyntheticEvent<>) => {
        this.setState({ isShown: false });
        this.fireChildEvent('onMouseLeave', event);
    };

    handleFocus = (event: SyntheticEvent<>) => {
        this.setState({ isShown: true });
        this.fireChildEvent('onFocus', event);
    };

    handleBlur = (event: SyntheticEvent<>) => {
        this.setState({ isShown: false });
        this.fireChildEvent('onBlur', event);
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<>) => {
        if (event.key === 'Escape') {
            this.setState({ isShown: false });
        }
        this.fireChildEvent('onKeyDown', event);
    };

    render() {
        const {
            bodyElement,
            children,
            className,
            constrainToScrollParent,
            constrainToWindow,
            isShown: isShownProp,
            position,
            showCloseButton,
            text,
            theme,
        } = this.props;
        const isControlled = typeof isShownProp !== 'undefined';
        const isShown = isControlled ? isShownProp : this.state.isShown;
        const showTooltip = isShown && !this.state.wasClosedByUser;
        const withCloseButton = showCloseButton && isControlled;
        const tetherPosition = positions[position];
        const constraints = [];
        const componentProps = {};

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
            componentProps.tabIndex = '0';
        }

        const bodyEl = bodyElement instanceof HTMLElement ? bodyElement : document.body;

        const classes = classNames('tooltip', className, {
            'is-callout': theme === CALLOUT_THEME,
            'is-error': theme === ERROR_THEME,
            'with-close-button': withCloseButton,
        });
        return (
            <TetherComponent
                attachment={tetherPosition.attachment}
                bodyElement={bodyEl}
                classPrefix="tooltip"
                constraints={constraints}
                enabled={showTooltip}
                targetAttachment={tetherPosition.targetAttachment}
            >
                {React.cloneElement(React.Children.only(children), componentProps)}
                {showTooltip && (
                    <div className={classes} id={this.tooltipID} role="tooltip">
                        {text}
                        {withCloseButton && (
                            <PlainButton className="tooltip-close-button" onClick={this.closeTooltip}>
                                <IconClose />
                            </PlainButton>
                        )}
                    </div>
                )}
            </TetherComponent>
        );
    }
}

export default Tooltip;
