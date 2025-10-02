import * as React from 'react';
import { LinkBaseProps } from './LinkBase';
export interface LinkProps extends LinkBaseProps {
    children: React.ReactChild;
    className: string;
}
declare class Link extends React.Component<LinkProps> {
    static defaultProps: {
        className: string;
    };
    render(): React.JSX.Element;
}
export default Link;
