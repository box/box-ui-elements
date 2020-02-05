import * as React from 'react';
import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import Link from '../Link';
import notes from './Link.stories.md';

export const basic = () => <Link href="https://www.box.com/platform">A link</Link>;

export const withCustomComponent = () => {
    // You can pass a custom component to be used instead of the default "a" tag, like a React Router link:
    // import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

    const CustomRouterLink = ({ href, children, ...rest }: RouterLinkProps) => (
        <RouterLink to={href} {...rest}>
            {children}
        </RouterLink>
    );

    return (
        <Router>
            <Link component={CustomRouterLink} href="/">
                A link
            </Link>
        </Router>
    );
};

export default {
    title: 'Components|Links/Link',
    component: Link,
    parameters: {
        notes,
    },
};
