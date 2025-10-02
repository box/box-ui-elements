import * as React from 'react';
import './CountBadge.scss';
type Props = {
    /** Additional class names to attach to the badge */
    className?: string;
    /** Should hide or show the count badge */
    isVisible?: boolean;
    /** Whether the icon should animate in or not */
    shouldAnimate?: boolean;
    /** string value to show within the badge (number or string) */
    value?: number | string;
};
declare class CountBadge extends React.Component<Props> {
    static defaultProps: {
        isVisible: boolean;
        shouldAnimate: boolean;
        value: string;
    };
    render(): React.JSX.Element;
}
export default CountBadge;
