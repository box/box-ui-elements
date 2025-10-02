import * as React from 'react';
import Link from './Link';
export interface LinkGroupProps {
    children: Array<React.ReactElement<Link>>;
    className: string;
    title?: React.ReactNode;
}
declare class LinkGroup extends React.Component<LinkGroupProps> {
    static defaultProps: {
        title: string;
        className: string;
    };
    render(): React.JSX.Element;
}
export default LinkGroup;
