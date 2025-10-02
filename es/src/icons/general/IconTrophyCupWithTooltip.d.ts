import * as React from 'react';
import { Icon } from '../iconTypes';
interface IconTrophyCupWithTooltipProps extends Icon {
    /** A string describing the color of the icon's tooltip */
    tooltipColor?: string;
    /** A string describing the text in the icon's tooltip */
    tooltipText?: string;
}
declare class IconTrophyCupWithTooltip extends React.PureComponent<IconTrophyCupWithTooltipProps> {
    static defaultProps: {
        className: string;
        height: number;
        tooltipColor: string;
        tooltipText: string;
        width: number;
    };
    idPrefix: string;
    render(): React.JSX.Element;
}
export default IconTrophyCupWithTooltip;
