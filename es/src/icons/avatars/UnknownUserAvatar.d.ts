import * as React from 'react';
import { TwoTonedIcon } from '../iconTypes';
declare class UnknownUserAvatar extends React.PureComponent<TwoTonedIcon> {
    static defaultProps: {
        className: string;
        height: number;
        width: number;
    };
    render(): React.JSX.Element;
}
export default UnknownUserAvatar;
