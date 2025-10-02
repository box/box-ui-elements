import * as React from 'react';
import './Collapsible.scss';
export interface CollapsibleProps {
    /** animationDuration - duration of animation in milliseconds */
    animationDuration?: number;
    /** buttonProps - other props (e.g. resin target names) to be included in the button */
    buttonProps?: Record<string, React.ReactNode>;
    /** children - content to be displayed in the card when it is expanded */
    children: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class for the wrapper div */
    className?: string;
    /** hasStickyHeader - determines look of component */
    hasStickyHeader?: boolean;
    /** headerActionItems - determines stickiness of the header */
    headerActionItems?: React.ReactChild;
    /** headerButton - button in the title of the collapsible card */
    headerButton?: React.ReactElement;
    /** isBordered - determines optional header action items */
    isBordered?: boolean;
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
    /** onClose - callback called when collapsible is opened */
    onClose?: Function;
    /** onOpen - callback called when collapsible is collapsed */
    onOpen?: Function;
    /** title - string or component in the title of the collapsible card */
    title: string | React.ReactElement;
}
interface CollapsibleState {
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
}
declare class Collapsible extends React.PureComponent<CollapsibleProps, CollapsibleState> {
    static defaultProps: {
        buttonProps: {};
        className: string;
        isOpen: boolean;
        animationDuration: number;
    };
    constructor(props: CollapsibleProps);
    toggleVisibility: () => void;
    render(): React.JSX.Element;
}
export default Collapsible;
