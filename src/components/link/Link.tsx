import * as React from 'react';

import LinkBase, { LinkBaseProps } from './LinkBase';

export interface LinkProps extends LinkBaseProps {
    children: React.ReactNode;
    className: string;
}

// TODO: convert to stateless function
// eslint-disable-next-line react/prefer-stateless-function
class Link extends React.Component<LinkProps> {
    static defaultProps = {
        className: '',
    };

    render() {
        const { className, ...rest } = this.props;

        return <LinkBase className={`link ${className}`} {...rest} />;
    }
}

export default Link;
