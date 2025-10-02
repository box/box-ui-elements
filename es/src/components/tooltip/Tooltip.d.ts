import * as React from 'react';
import TetherPosition from '../../common/tether-positions';
import './Tooltip.scss';
export declare enum TooltipTheme {
    CALLOUT = "callout",
    DEFAULT = "default",
    ERROR = "error"
}
export declare enum TooltipPosition {
    BOTTOM_CENTER = "bottom-center",
    BOTTOM_LEFT = "bottom-left",
    BOTTOM_RIGHT = "bottom-right",
    MIDDLE_LEFT = "middle-left",
    MIDDLE_RIGHT = "middle-right",
    TOP_CENTER = "top-center",
    TOP_LEFT = "top-left",
    TOP_RIGHT = "top-right"
}
export type TooltipCustomPosition = {
    attachment: TetherPosition;
    targetAttachment: TetherPosition;
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
    /** Sets aria-hidden attribute on tooltip */
    ariaHidden?: boolean;
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
    /** A CSS class for the tether element component */
    tetherElementClassName?: string;
    /** A CSS class for the target wrapper element */
    targetWrapperClassName?: string;
    /** Text to show in the tooltip */
    text?: React.ReactNode;
} & Partial<DefaultTooltipProps>;
type State = {
    isShown: boolean;
    hasRendered: boolean;
    wasClosedByUser: boolean;
};
declare class Tooltip extends React.Component<TooltipProps, State> {
    static defaultProps: DefaultTooltipProps;
    constructor(props: TooltipProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: TooltipProps, prevState: State): void;
    componentWillUnmount(): void;
    tooltipID: string;
    tetherRef: React.RefObject<TetherComponent>;
    position: () => void;
    closeTooltip: () => void;
    fireChildEvent: (type: string, event: React.SyntheticEvent<HTMLElement> | Event) => void;
    handleTooltipEvent: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    handleMouseEnter: (event: React.SyntheticEvent<HTMLElement>) => void;
    handleMouseLeave: (event: React.SyntheticEvent<HTMLElement>) => void;
    handleFocus: (event: React.SyntheticEvent<HTMLElement>) => void;
    handleBlur: (event: React.SyntheticEvent<HTMLElement>) => void;
    isControlled: () => boolean;
    handleKeyDown: (event: KeyboardEvent) => void;
    isShown: () => boolean;
    render(): string | number | React.JSX.Element;
}
export default Tooltip;
