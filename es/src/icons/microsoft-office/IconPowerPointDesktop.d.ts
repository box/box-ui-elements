import * as React from 'react';
import { TwoTonedIcon } from '../iconTypes';
declare class IconPowerPointDesktop extends React.Component<TwoTonedIcon> {
    static defaultProps: {
        className: string;
        height: number;
        width: number;
    };
    idPrefix: string;
    render(): React.JSX.Element;
}
export default IconPowerPointDesktop;
